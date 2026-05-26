const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_TIMEOUT_MS = 8_000;
const MAX_PROMPT_CHARACTERS = 4_000;
const MAX_FALLBACK_SUMMARY_CHARACTERS = 280;

export interface MessageInsight {
  text: string;
  usedFallback: boolean;
}

function sanitizeForPrompt(value: string): string {
  return value.replace(/\u0000/g, "").trim().slice(0, MAX_PROMPT_CHARACTERS);
}

function buildPrompt(message: string): string {
  return [
    "Você é um assistente pessoal da CPX Labs.",
    "Analise a mensagem recebida no WhatsApp.",
    "Crie um resumo curto e sugira duas respostas rápidas em português do Brasil.",
    'Formate a saída exatamente assim:',
    "*Resumo:* [resumo objetivo]",
    "*Opção 1:* [resposta positiva ou de continuidade]",
    "*Opção 2:* [resposta educada de recusa ou adiamento]",
    "",
    "Mensagem:",
    `"${message}"`,
  ].join("\n");
}

function buildFallbackInsight(message: string): MessageInsight {
  const excerpt =
    sanitizeForPrompt(message).slice(0, MAX_FALLBACK_SUMMARY_CHARACTERS) ||
    "Mensagem longa recebida, mas sem conteúdo utilizável.";

  return {
    usedFallback: true,
    text: [
      `*Resumo:* ${excerpt}`,
      "*Opção 1:* Recebi sua mensagem e vou analisar com calma antes de te responder.",
      "*Opção 2:* Obrigado pelo envio. Preciso revisar os detalhes antes de confirmar qualquer encaminhamento.",
    ].join("\n"),
  };
}

function getAiTimeoutMs(): number {
  const parsed = Number.parseInt(
    process.env.WHATSAPP_AI_TIMEOUT_MS ?? `${DEFAULT_TIMEOUT_MS}`,
    10
  );

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

function extractGeminiText(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const candidates = Reflect.get(payload, "candidates");

  if (!Array.isArray(candidates)) {
    return "";
  }

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }

    const content = Reflect.get(candidate, "content");

    if (!content || typeof content !== "object") {
      continue;
    }

    const parts = Reflect.get(content, "parts");

    if (!Array.isArray(parts)) {
      continue;
    }

    const text = parts
      .map((part) =>
        part && typeof part === "object" && typeof Reflect.get(part, "text") === "string"
          ? String(Reflect.get(part, "text"))
          : ""
      )
      .join("\n")
      .trim();

    if (text) {
      return text;
    }
  }

  return "";
}

export async function generateMessageInsight(
  message: string
): Promise<MessageInsight> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return buildFallbackInsight(message);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getAiTimeoutMs());

  try {
    const model =
      process.env.WHATSAPP_AI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: buildPrompt(sanitizeForPrompt(message)),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return buildFallbackInsight(message);
    }

    const payload = (await response.json()) as unknown;
    const text = extractGeminiText(payload);

    if (!text) {
      return buildFallbackInsight(message);
    }

    return {
      text,
      usedFallback: false,
    };
  } catch {
    return buildFallbackInsight(message);
  } finally {
    clearTimeout(timeout);
  }
}
