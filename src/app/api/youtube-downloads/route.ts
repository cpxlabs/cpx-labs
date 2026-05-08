import { NextRequest, NextResponse } from "next/server";
import {
  applyYouTubeDownloadRateLimit,
  getYouTubeDownloadRouteConfig,
  submitYouTubeDownloadJob,
  validateYouTubeDownloadPayload,
} from "@/lib/youtube-downloads";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const config = getYouTubeDownloadRouteConfig();

  if (!config.enabled) {
    return NextResponse.json(
      {
        error:
          "A rota de processamento de áudio do YouTube está desabilitada neste ambiente.",
      },
      { status: 503 }
    );
  }

  const rateLimit = applyYouTubeDownloadRateLimit(request);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Limite de requisições excedido. Tente novamente mais tarde." },
      {
        status: 429,
        headers: rateLimit.headers,
      }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400, headers: rateLimit.headers }
    );
  }

  const validation = validateYouTubeDownloadPayload(body);

  if (!validation.data) {
    return NextResponse.json(
      { error: validation.error ?? "Requisição inválida." },
      { status: 422, headers: rateLimit.headers }
    );
  }

  if (!config.workerBaseUrl) {
    return NextResponse.json(
      {
        error:
          "O serviço de processamento não está configurado. Defina MEDIA_WORKER_BASE_URL.",
      },
      { status: 503, headers: rateLimit.headers }
    );
  }

  try {
    const job = await submitYouTubeDownloadJob(validation.data, request);

    if (!job) {
      return NextResponse.json(
        { error: "Resposta inválida do serviço de processamento." },
        { status: 502, headers: rateLimit.headers }
      );
    }

    return NextResponse.json(
      {
        jobId: job.jobId,
        status: job.status,
        statusUrl: job.statusUrl,
        downloads: job.downloads,
        format: validation.data.format,
        splitMode: validation.data.splitMode,
      },
      { status: 202, headers: rateLimit.headers }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Falha ao encaminhar o job para o serviço de processamento.",
      },
      { status: 502, headers: rateLimit.headers }
    );
  }
}
