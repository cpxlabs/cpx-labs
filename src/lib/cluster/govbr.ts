import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.GOVBR_JWT_SECRET || "dev-secret-change-in-production"
);

export interface GovbrTokenPayload {
  sub: string;
  name: string;
  cpf: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function getGovbrAuthUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const clientId = process.env.GOVBR_CLIENT_ID || "mock-client-id";
  const redirectUri = `${baseUrl}/api/cluster/gov-callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid email cpf",
    state: crypto.randomUUID(),
  });

  const authUrl = process.env.GOVBR_AUTHORIZE_URL || "https://sso.acesso.gov.br/authorize";
  return `${authUrl}?${params.toString()}`;
}

export async function exchangeGovbrCode(code: string): Promise<GovbrTokenPayload> {
  // In development, return mock data if no real credentials
  if (!process.env.GOVBR_CLIENT_ID || process.env.GOVBR_CLIENT_ID === "mock-client-id") {
    const base64 = Buffer.from(code, "base64").toString("utf-8");
    try {
      return JSON.parse(base64) as GovbrTokenPayload;
    } catch {
      return {
        sub: "mock-sub",
        name: "Cliente Teste",
        cpf: "00000000000",
        email: "cliente@teste.com",
      };
    }
  }

  const tokenUrl = process.env.GOVBR_TOKEN_URL || "https://sso.acesso.gov.br/token";
  const clientId = process.env.GOVBR_CLIENT_ID!;
  const clientSecret = process.env.GOVBR_CLIENT_SECRET!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${baseUrl}/api/cluster/gov-callback`,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`GOV.br token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();
  const payload = jwtVerify(data.id_token, secret);
  return (await payload).payload as unknown as GovbrTokenPayload;
}

export async function createSignToken(payload: GovbrTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

export async function verifySignToken(token: string): Promise<GovbrTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as GovbrTokenPayload;
  } catch {
    return null;
  }
}
