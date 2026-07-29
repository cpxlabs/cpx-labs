import { NextResponse } from "next/server";
import { getGovbrAuthUrl } from "@/lib/cluster/govbr";

export async function GET() {
  const authUrl = getGovbrAuthUrl();
  return NextResponse.redirect(authUrl);
}
