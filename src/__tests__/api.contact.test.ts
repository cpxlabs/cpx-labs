/**
 * @jest-environment node
 *
 * API route tests run in the Node.js environment so that the native
 * Request / Response globals (used by NextRequest internally) are available.
 */
import { POST, GET } from "@/app/api/contact/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown, method = "POST"): NextRequest {
  return new NextRequest("http://localhost:3000/api/contact", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("returns 200 for valid payload", async () => {
    const req = makeRequest({
      name: "João Silva",
      email: "joao@email.com",
      message: "Olá, gostaria de saber mais.",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("returns 422 when name is missing", async () => {
    const req = makeRequest({ email: "joao@email.com", message: "Olá" });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/nome/i);
  });

  it("returns 422 when email is missing", async () => {
    const req = makeRequest({ name: "João", message: "Olá" });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/e-mail/i);
  });

  it("returns 422 when message is missing", async () => {
    const req = makeRequest({ name: "João", email: "joao@email.com" });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/mensagem/i);
  });

  it("returns 422 for invalid email format", async () => {
    const req = makeRequest({
      name: "João",
      email: "not-an-email",
      message: "Olá",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/e-mail/i);
  });

  it("returns 400 for non-JSON body", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json{{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("accepts optional company and service fields", async () => {
    const req = makeRequest({
      name: "Maria",
      email: "maria@empresa.com",
      company: "Tech LTDA",
      service: "cloud",
      message: "Preciso de migração para cloud.",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("sanitizes and truncates oversized strings", async () => {
    const huge = "A".repeat(5000);
    const req = makeRequest({
      name: huge,
      email: "test@email.com",
      message: "ok",
    });
    const res = await POST(req);
    // Still processes — truncated to 2000 chars, valid
    expect(res.status).toBe(200);
  });
});

describe("GET /api/contact", () => {
  it("returns 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const json = await res.json();
    expect(json.error).toMatch(/método/i);
  });
});
