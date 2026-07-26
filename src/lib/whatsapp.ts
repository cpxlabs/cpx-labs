import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_MINIMUM_SUMMARY_CHARACTERS = 150;
const DEFAULT_GRAPH_API_VERSION = "v21.0";
const PROCESSED_MESSAGE_TTL_MS = 10 * 60 * 1000;

const processedMessageIds = new Map<string, number>();

export interface WhatsAppConfig {
  verifyToken: string;
  appSecret: string;
  accessToken: string;
  phoneNumberId: string;
  adminNumber: string;
  businessPhoneNumber: string;
  minimumSummaryCharacters: number;
  graphApiVersion: string;
}

export interface IncomingTextMessage {
  id: string;
  from: string;
  text: string;
  profileName?: string;
}

interface WhatsAppTextMessage {
  id?: string;
  from?: string;
  type?: string;
  text?: {
    body?: string;
  };
}

interface WhatsAppContact {
  wa_id?: string;
  profile?: {
    name?: string;
  };
}

interface WhatsAppValue {
  contacts?: WhatsAppContact[];
  messages?: WhatsAppTextMessage[];
  metadata?: {
    display_phone_number?: string;
  };
}

export interface WhatsAppWebhookPayload {
  object?: string;
  entry?: Array<{
    changes?: Array<{
      value?: WhatsAppValue;
    }>;
  }>;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function cleanupProcessedMessageIds() {
  const now = Date.now();

  for (const [messageId, expiresAt] of processedMessageIds.entries()) {
    if (expiresAt <= now) {
      processedMessageIds.delete(messageId);
    }
  }
}

function normalizePhoneNumber(value: string | undefined): string {
  return (value ?? "").replace(/\D+/g, "");
}

export function sanitizeMessageText(value: unknown, maxLength = 4_000): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\u0000/g, "").trim().slice(0, maxLength);
}

export function getWebhookVerifyToken(): string {
  return requireEnv("WHATSAPP_VERIFY_TOKEN");
}

export function getWhatsAppConfig(): WhatsAppConfig {
  const minimumSummaryCharacters = Number.parseInt(
    process.env.WHATSAPP_MIN_SUMMARY_CHARACTERS ??
      `${DEFAULT_MINIMUM_SUMMARY_CHARACTERS}`,
    10
  );

  return {
    verifyToken: requireEnv("WHATSAPP_VERIFY_TOKEN"),
    appSecret: requireEnv("WHATSAPP_APP_SECRET"),
    accessToken: requireEnv("WHATSAPP_TOKEN"),
    phoneNumberId: requireEnv("WHATSAPP_PHONE_NUMBER_ID"),
    adminNumber: normalizePhoneNumber(requireEnv("WHATSAPP_ADMIN_NUMBER")),
    businessPhoneNumber: normalizePhoneNumber(
      process.env.WHATSAPP_BUSINESS_PHONE_NUMBER
    ),
    minimumSummaryCharacters:
      Number.isFinite(minimumSummaryCharacters) && minimumSummaryCharacters > 0
        ? minimumSummaryCharacters
        : DEFAULT_MINIMUM_SUMMARY_CHARACTERS,
    graphApiVersion:
      process.env.WHATSAPP_GRAPH_API_VERSION?.trim() ||
      DEFAULT_GRAPH_API_VERSION,
  };
}

export function verifyWhatsAppSignature({
  rawBody,
  signature,
  appSecret,
}: {
  rawBody: string;
  signature: string | null;
  appSecret: string;
}): boolean {
  if (!signature?.startsWith("sha256=")) {
    return false;
  }

  const expected = createHmac("sha256", appSecret).update(rawBody).digest("hex");
  const provided = signature.slice("sha256=".length);

  if (expected.length !== provided.length) {
    return false;
  }

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  } catch {
    return false;
  }
}

export function hasProcessedMessage(messageId: string): boolean {
  cleanupProcessedMessageIds();
  return processedMessageIds.has(messageId);
}

export function markMessageProcessed(messageId: string) {
  cleanupProcessedMessageIds();
  processedMessageIds.set(messageId, Date.now() + PROCESSED_MESSAGE_TTL_MS);
}

export function resetProcessedMessagesForTests() {
  processedMessageIds.clear();
}

export function extractIncomingTextMessages(
  payload: WhatsAppWebhookPayload,
  businessPhoneNumber?: string
): IncomingTextMessage[] {
  const messages: IncomingTextMessage[] = [];
  const seenIds = new Set<string>();

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      const payloadBusinessNumber =
        businessPhoneNumber || value?.metadata?.display_phone_number;
      const normalizedBusinessNumber = normalizePhoneNumber(payloadBusinessNumber);

      for (const message of value?.messages ?? []) {
        const senderNumber = normalizePhoneNumber(message.from);
        const text = sanitizeMessageText(message.text?.body);

        if (
          message.type !== "text" ||
          !message.id ||
          !senderNumber ||
          !text ||
          seenIds.has(message.id)
        ) {
          continue;
        }

        if (
          normalizedBusinessNumber &&
          senderNumber === normalizedBusinessNumber
        ) {
          continue;
        }

        seenIds.add(message.id);

        const matchingContact = value?.contacts?.find(
          (contact) => normalizePhoneNumber(contact.wa_id) === senderNumber
        );

        messages.push({
          id: message.id,
          from: senderNumber,
          text,
          profileName: matchingContact?.profile?.name?.trim(),
        });
      }
    }
  }

  return messages;
}

export async function sendWhatsAppTextMessage({
  accessToken,
  body,
  graphApiVersion,
  phoneNumberId,
  to,
}: {
  accessToken: string;
  body: string;
  graphApiVersion: string;
  phoneNumberId: string;
  to: string;
}) {
  const response = await fetch(
    `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: ["Bearer", accessToken].join(" "),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `WhatsApp API request failed with status ${response.status}: ${errorBody}`
    );
  }

  return response.json();
}
