import { NextRequest, NextResponse } from "next/server";
import { generateMessageInsight } from "@/lib/ai-summary";
import {
  extractIncomingTextMessages,
  getWebhookVerifyToken,
  getWhatsAppConfig,
  hasProcessedMessage,
  markMessageProcessed,
  sendWhatsAppTextMessage,
  verifyWhatsAppSignature,
  type IncomingTextMessage,
  type WhatsAppWebhookPayload,
} from "@/lib/whatsapp";

export const runtime = "nodejs";

function formatAdminAlert(message: IncomingTextMessage, insight: string): string {
  const senderLabel = message.profileName
    ? `${message.profileName} (${message.from})`
    : message.from;

  return [`📩 *Novo textão de ${senderLabel}:*`, "", insight].join("\n");
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  try {
    const verifyToken = getWebhookVerifyToken();

    if (mode === "subscribe" && token === verifyToken && challenge) {
      return new Response(challenge, { status: 200 });
    }

    return NextResponse.json(
      { error: "Token de verificação inválido." },
      { status: 403 }
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook do WhatsApp não configurado." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let config;

  try {
    config = getWhatsAppConfig();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook do WhatsApp não configurado.",
      },
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  if (
    !verifyWhatsAppSignature({
      rawBody,
      signature: request.headers.get("x-hub-signature-256"),
      appSecret: config.appSecret,
    })
  ) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  let payload: WhatsAppWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  if (payload.object !== "whatsapp_business_account") {
    return NextResponse.json({ success: true, ignored: true }, { status: 200 });
  }

  const messages = extractIncomingTextMessages(
    payload,
    config.businessPhoneNumber
  );
  let processed = 0;

  for (const message of messages) {
    if (
      hasProcessedMessage(message.id) ||
      message.text.length < config.minimumSummaryCharacters
    ) {
      continue;
    }

    const insight = await generateMessageInsight(message.text);
    const alert = formatAdminAlert(message, insight.text);

    await sendWhatsAppTextMessage({
      accessToken: config.accessToken,
      body: alert,
      graphApiVersion: config.graphApiVersion,
      phoneNumberId: config.phoneNumberId,
      to: config.adminNumber,
    });

    markMessageProcessed(message.id);
    processed += 1;

    if (insight.usedFallback) {
      console.warn("[whatsapp-webhook] AI fallback used for message", {
        messageId: message.id,
      });
    }
  }

  return NextResponse.json({ success: true, processed }, { status: 200 });
}
