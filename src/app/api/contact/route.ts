import { NextRequest, NextResponse } from "next/server";

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 2000);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const name = sanitize(body.name);
  const email = sanitize(body.email);
  const company = sanitize(body.company);
  const service = sanitize(body.service);
  const message = sanitize(body.message);

  // ── Validation ─────────────────────────────────────────────────────────────
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Campos obrigatórios: nome, e-mail e mensagem." },
      { status: 422 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Endereço de e-mail inválido." },
      { status: 422 }
    );
  }

  // ── Send via SMTP (when configured) ────────────────────────────────────────
  // To enable actual e-mail delivery, set the SMTP_* and CONTACT_TO_EMAIL
  // environment variables in Vercel Dashboard → Project → Settings →
  // Environment Variables (or in .env.local for local development).
  //
  // Example integration using nodemailer:
  //
  //   import nodemailer from "nodemailer";
  //
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: Number(process.env.SMTP_PORT ?? 587),
  //     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  //   });
  //
  //   await transporter.sendMail({
  //     from: process.env.SMTP_USER,
  //     to: process.env.CONTACT_TO_EMAIL,
  //     subject: `[CPX Labs] Novo contato de ${name}`,
  //     text: `Nome: ${name}\nE-mail: ${email}\nEmpresa: ${company}\nServiço: ${service}\n\n${message}`,
  //   });

  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.CONTACT_TO_EMAIL;

  if (!smtpConfigured) {
    // Log to Vercel Function logs when SMTP is not yet configured.
    console.info("[contact-form] New submission (SMTP not configured):", {
      name,
      email,
      company,
      service,
      message,
      receivedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    { success: true, message: "Mensagem recebida com sucesso!" },
    { status: 200 }
  );
}

// Only POST is accepted on this route.
export async function GET() {
  return NextResponse.json({ error: "Método não permitido." }, { status: 405 });
}
