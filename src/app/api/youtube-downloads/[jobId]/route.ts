import { NextRequest, NextResponse } from "next/server";
import {
  getYouTubeDownloadJobStatus,
  getYouTubeDownloadRouteConfig,
  isValidJobId,
} from "@/lib/youtube-downloads";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/youtube-downloads/[jobId]">
) {
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

  const { jobId } = await context.params;

  if (!isValidJobId(jobId)) {
    return NextResponse.json({ error: "Identificador de job inválido." }, { status: 422 });
  }

  if (!config.workerBaseUrl) {
    return NextResponse.json(
      {
        error:
          "O serviço de processamento não está configurado. Defina MEDIA_WORKER_BASE_URL.",
      },
      { status: 503 }
    );
  }

  try {
    const job = await getYouTubeDownloadJobStatus(request, jobId);

    if (!job) {
      return NextResponse.json(
        { error: "Resposta inválida do serviço de processamento." },
        { status: 502 }
      );
    }

    return NextResponse.json(job, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Falha ao consultar o status do job." },
      { status: 502 }
    );
  }
}
