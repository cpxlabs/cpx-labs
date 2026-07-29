import { NextRequest, NextResponse } from "next/server";
import { verifySignToken } from "@/lib/cluster/govbr";
import { generateContractPdf } from "@/lib/cluster/contract-pdf";
import { generateProtocol } from "@/lib/cluster/constants";
import type { ContractFormData } from "@/lib/cluster/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, token } = body as { formData: ContractFormData; token: string };

    if (!token) {
      return NextResponse.json(
        { error: "Token de assinatura não informado" },
        { status: 401 }
      );
    }

    const signer = await verifySignToken(token);
    if (!signer) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const protocolo = generateProtocol();

    const pdfBuffer = generateContractPdf(formData, signer.name, signer.cpf, protocolo);

    // Send email via Resend
    const emailSent = await sendContractEmail({
      to: signer.email,
      name: signer.name,
      protocolo,
      pdfBuffer,
      pdfFilename: `contrato-cluster-${protocolo.toLowerCase()}.pdf`,
    });

    return NextResponse.json({
      success: true,
      protocolo,
      signerName: signer.name,
      signerEmail: signer.email,
      signedAt: new Date().toISOString(),
      emailSent,
    });
  } catch (error) {
    console.error("Contract generation error:", error);
    return NextResponse.json(
      { error: "Erro ao gerar contrato. Tente novamente." },
      { status: 500 }
    );
  }
}

async function sendContractEmail({
  to,
  name,
  protocolo,
  pdfBuffer,
  pdfFilename,
}: {
  to: string;
  name: string;
  protocolo: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log("[DEV] Resend not configured. Contract PDF would be sent to:", to);
    console.log(`[DEV] Protocolo: ${protocolo}, File: ${pdfFilename}`);
    return false;
  }

  const base64Pdf = pdfBuffer.toString("base64");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Cluster Produtora <noreply@cpxlabs.com.br>",
      to: [to],
      cc: ["contato@cpxlabs.com.br"],
      subject: `Contrato Cluster Produtora — Código ${protocolo}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1d;">
          <div style="border-bottom: 2px solid #8a2b0d; padding-bottom: 12px; margin-bottom: 24px;">
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin: 0 0 4px;">CPX Labs · Cluster Produtora</p>
            <h1 style="font-size: 22px; margin: 0; color: #1a1a1d;">Contrato assinado com sucesso!</h1>
          </div>
          <p style="font-size: 15px; line-height: 1.6;">Olá <strong>${name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">Seu contrato de prestação de serviços de produção musical foi assinado eletronicamente via GOV.br.</p>
          <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #555;">
              <strong>Código do contrato:</strong> ${protocolo}
            </p>
            <p style="margin: 0 0 8px; font-size: 13px; color: #555;">
              <strong>Data da assinatura:</strong> ${new Date().toLocaleDateString("pt-BR")}
            </p>
            <p style="margin: 0; font-size: 13px; color: #555;">
              <strong>Contratante:</strong> ${name}
            </p>
          </div>
          <p style="font-size: 15px; line-height: 1.6;">O PDF do contrato está anexo a este e-mail. Guarde-o para referência.</p>
          <p style="font-size: 15px; line-height: 1.6;">Em caso de dúvidas, responda a este e-mail ou entre em contato pelo WhatsApp.</p>
          <div style="border-top: 1px solid #ddd; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #999;">
            <p style="margin: 0;">Cluster Produtora · Um braço do CPX Labs</p>
            <p style="margin: 4px 0 0;">Rio de Janeiro, RJ · Brasil</p>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: pdfFilename,
          content: base64Pdf,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Resend error:", errorData);
    return false;
  }

  return true;
}
