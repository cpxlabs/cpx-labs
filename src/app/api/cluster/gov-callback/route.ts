import { NextRequest, NextResponse } from "next/server";
import { exchangeGovbrCode, createSignToken } from "@/lib/cluster/govbr";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/cluster-produtora/contrato?erro=govbr-negado", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/cluster-produtora/contrato?erro=govbr-sem-codigo", request.url)
    );
  }

  try {
    const userInfo = await exchangeGovbrCode(code);
    const token = await createSignToken(userInfo);

    const redirectUrl = new URL("/cluster-produtora/contrato/assinado", request.url);
    redirectUrl.searchParams.set("token", token);
    return NextResponse.redirect(redirectUrl);
  } catch {
    return NextResponse.redirect(
      new URL("/cluster-produtora/contrato?erro=govbr-falha", request.url)
    );
  }
}
