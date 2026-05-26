/**
 * @jest-environment node
 */
import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/whatsapp/webhook/route";
import { resetProcessedMessagesForTests } from "@/lib/whatsapp";

const originalEnv = process.env;

function sign(body: string) {
  return `sha256=${createHmac("sha256", "meta-app-secret").update(body).digest("hex")}`;
}

function makePayload(overrides: Record<string, unknown> = {}) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              metadata: {
                display_phone_number: "5521975542783",
              },
              contacts: [
                {
                  wa_id: "5521999999999",
                  profile: {
                    name: "Cliente Teste",
                  },
                },
              ],
              messages: [
                {
                  id: "wamid.HBgN1",
                  from: "5521999999999",
                  type: "text",
                  text: {
                    body: "A".repeat(180),
                  },
                },
              ],
            },
          },
        ],
      },
    ],
    ...overrides,
  };
}

function makeRequest(payload: unknown, signature = true) {
  const body = JSON.stringify(payload);

  return new NextRequest("http://localhost:3000/api/whatsapp/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(signature ? { "x-hub-signature-256": sign(body) } : {}),
    },
    body,
  });
}

describe("GET /api/whatsapp/webhook", () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      WHATSAPP_VERIFY_TOKEN: "verify-token",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns the challenge for a valid verification request", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=verify-token&hub.challenge=abc123"
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("abc123");
  });

  it("rejects an invalid verification token", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=abc123"
    );

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.error).toMatch(/inválido/i);
  });
});

describe("POST /api/whatsapp/webhook", () => {
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      GEMINI_API_KEY: "gemini-key",
      WHATSAPP_ADMIN_NUMBER: "5521888888888",
      WHATSAPP_APP_SECRET: "meta-app-secret",
      WHATSAPP_BUSINESS_PHONE_NUMBER: "5521975542783",
      WHATSAPP_PHONE_NUMBER_ID: "123456789",
      WHATSAPP_TOKEN: "whatsapp-token",
      WHATSAPP_VERIFY_TOKEN: "verify-token",
    };

    fetchMock.mockReset();
    global.fetch = fetchMock as typeof fetch;
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    resetProcessedMessagesForTests();
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("summarizes a long text message and forwards it to the admin number", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: "*Resumo:* Resumo gerado\n*Opção 1:* Resposta 1\n*Opção 2:* Resposta 2",
                  },
                ],
              },
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ messages: [{ id: "wamid.sent" }] }),
      });

    const response = await POST(makeRequest(makePayload()));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.processed).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain("graph.facebook.com");
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      method: "POST",
    });
    expect(String(fetchMock.mock.calls[1][1]?.body)).toContain("5521888888888");
    expect(String(fetchMock.mock.calls[1][1]?.body)).toContain("Resumo gerado");
  });

  it("ignores invalid signatures", async () => {
    const response = await POST(makeRequest(makePayload(), false));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toMatch(/assinatura/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignores non-text, short, and duplicate messages", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "*Resumo:* ok\n*Opção 1:* 1\n*Opção 2:* 2" }],
              },
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ messages: [{ id: "wamid.sent" }] }),
      });

    const payload = makePayload({
      entry: [
        {
          changes: [
            {
              value: {
                metadata: { display_phone_number: "5521975542783" },
                contacts: [{ wa_id: "5521999999999", profile: { name: "Cliente" } }],
                messages: [
                  {
                    id: "wamid.duplicate",
                    from: "5521999999999",
                    type: "text",
                    text: { body: "B".repeat(180) },
                  },
                  {
                    id: "wamid.duplicate",
                    from: "5521999999999",
                    type: "text",
                    text: { body: "B".repeat(180) },
                  },
                  {
                    id: "wamid.short",
                    from: "5521999999999",
                    type: "text",
                    text: { body: "curta" },
                  },
                  {
                    id: "wamid.image",
                    from: "5521999999999",
                    type: "image",
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    const first = await POST(makeRequest(payload));
    const second = await POST(makeRequest(payload));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("uses the fallback summary when the AI provider fails", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ messages: [{ id: "wamid.sent" }] }),
      });

    const response = await POST(makeRequest(makePayload()));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.processed).toBe(1);
    expect(String(fetchMock.mock.calls[1][1]?.body)).toContain("*Resumo:*");
    expect(String(fetchMock.mock.calls[1][1]?.body)).toContain(
      "Recebi sua mensagem"
    );
  });

  it("ignores payloads without incoming messages", async () => {
    const response = await POST(
      makeRequest({
        object: "whatsapp_business_account",
        entry: [{ changes: [{ value: { statuses: [{ id: "status-1" }] } }] }],
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.processed).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
