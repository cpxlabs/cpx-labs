import type { NextRequest } from "next/server";

export type DownloadFormat = "mp3" | "wav";
export type SplitMode = "none" | "chapters" | "timestamps";
export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface SplitTrackInput {
  title?: string;
  startTime: number;
  endTime?: number;
}

export interface YouTubeDownloadPayload {
  url: string;
  format: DownloadFormat;
  splitMode?: SplitMode;
  tracks?: SplitTrackInput[];
  ownershipConfirmed: boolean;
}

export interface NormalizedSplitTrack {
  title: string | null;
  startTime: number;
  endTime: number | null;
}

export interface NormalizedYouTubeDownloadPayload {
  url: string;
  format: DownloadFormat;
  splitMode: SplitMode;
  tracks: NormalizedSplitTrack[];
  ownershipConfirmed: true;
}

export interface DownloadAsset {
  url: string;
  format: string | null;
  name: string | null;
}

export interface DownloadJobResponse {
  jobId: string;
  status: JobStatus;
  statusUrl: string;
  downloads: DownloadAsset[];
  error: string | null;
}

export interface ValidationResult {
  data?: NormalizedYouTubeDownloadPayload;
  error?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  headers: Record<string, string>;
  retryAfterSeconds?: number;
}

const ALLOWED_FORMATS = new Set<DownloadFormat>(["mp3", "wav"]);
const ALLOWED_SPLIT_MODES = new Set<SplitMode>([
  "none",
  "chapters",
  "timestamps",
]);
const ALLOWED_JOB_ID = /^[A-Za-z0-9_-]{1,128}$/;
const ALLOWED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);
const RATE_LIMIT_BUCKETS = new Map<string, { count: number; resetAt: number }>();
const DEFAULT_TRACK_TITLE_PREFIX = "Faixa";

function sanitizeString(value: unknown, maxLength = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function withTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function withoutLeadingSlash(value: string): string {
  return value.replace(/^\//, "");
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isSupportedYouTubeUrl(rawUrl: string): boolean {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:") {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();

  if (!ALLOWED_HOSTS.has(hostname)) {
    return false;
  }

  if (hostname === "youtu.be") {
    return parsed.pathname.length > 1;
  }

  const path = parsed.pathname.toLowerCase();
  return Boolean(
    parsed.searchParams.get("v") ||
      path.startsWith("/shorts/") ||
      path.startsWith("/embed/") ||
      path.startsWith("/live/")
  );
}

function normalizeTracks(value: unknown): NormalizedSplitTrack[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.map((track, index) => {
    const candidate = track as SplitTrackInput;
    const title = sanitizeString(candidate?.title, 120);
    const startTime = Number(candidate?.startTime);
    const endTime =
      candidate?.endTime === undefined || candidate?.endTime === null
        ? null
        : Number(candidate.endTime);

    return {
      title: title || `${DEFAULT_TRACK_TITLE_PREFIX} ${index + 1}`,
      startTime,
      endTime,
    };
  });
}

export function validateYouTubeDownloadPayload(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { error: "Corpo da requisição inválido." };
  }

  const payload = body as Partial<YouTubeDownloadPayload>;
  const url = sanitizeString(payload.url);
  const format = sanitizeString(payload.format, 10) as DownloadFormat;
  const splitMode = (sanitizeString(payload.splitMode, 20) || "none") as SplitMode;

  if (!url || !isSupportedYouTubeUrl(url)) {
    return { error: "Informe uma URL válida do YouTube em HTTPS." };
  }

  if (!ALLOWED_FORMATS.has(format)) {
    return { error: "Formato inválido. Use mp3 ou wav." };
  }

  if (!ALLOWED_SPLIT_MODES.has(splitMode)) {
    return { error: "Modo de divisão inválido." };
  }

  if (payload.ownershipConfirmed !== true) {
    return {
      error:
        "Confirme que você possui os direitos ou autorização para processar este conteúdo.",
    };
  }

  const tracks = normalizeTracks(payload.tracks) ?? [];

  if (splitMode === "timestamps") {
    if (tracks.length === 0) {
      return {
        error: "Forneça timestamps quando o modo de divisão for timestamps.",
      };
    }

    if (tracks.length > 50) {
      return { error: "Envie no máximo 50 faixas por requisição." };
    }

    let previousStart = -1;

    for (const track of tracks) {
      if (!Number.isFinite(track.startTime) || track.startTime < 0) {
        return { error: "Cada faixa deve ter startTime maior ou igual a zero." };
      }

      if (track.endTime !== null) {
        if (!Number.isFinite(track.endTime) || track.endTime <= track.startTime) {
          return {
            error: "Cada faixa deve ter endTime maior que startTime.",
          };
        }
      }

      if (track.startTime <= previousStart) {
        return {
          error: "As faixas devem ser enviadas em ordem crescente de startTime.",
        };
      }

      previousStart = track.startTime;
    }
  } else if (tracks.length > 0) {
    return {
      error:
        "Envie a lista de faixas apenas quando o modo de divisão for timestamps.",
    };
  }

  return {
    data: {
      url,
      format,
      splitMode,
      tracks,
      ownershipConfirmed: true,
    },
  };
}

export function getYouTubeDownloadRouteConfig() {
  return {
    enabled: process.env.YOUTUBE_DOWNLOADS_ENABLED === "true",
    workerBaseUrl: sanitizeString(process.env.MEDIA_WORKER_BASE_URL, 300),
    workerApiKey: sanitizeString(process.env.MEDIA_WORKER_API_KEY, 300),
    storagePublicUrl: sanitizeString(process.env.MEDIA_STORAGE_PUBLIC_URL, 300),
    rateLimitMax: parsePositiveInteger(
      process.env.YOUTUBE_DOWNLOAD_RATE_LIMIT_MAX,
      5
    ),
    rateLimitWindowMs: parsePositiveInteger(
      process.env.YOUTUBE_DOWNLOAD_RATE_LIMIT_WINDOW_MS,
      10 * 60 * 1000
    ),
  };
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function applyYouTubeDownloadRateLimit(
  request: NextRequest
): RateLimitResult {
  const config = getYouTubeDownloadRouteConfig();
  const now = Date.now();
  const key = getClientIp(request);
  const bucket = RATE_LIMIT_BUCKETS.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const freshBucket = {
      count: 1,
      resetAt: now + config.rateLimitWindowMs,
    };

    RATE_LIMIT_BUCKETS.set(key, freshBucket);

    return {
      allowed: true,
      headers: {
        "X-RateLimit-Limit": String(config.rateLimitMax),
        "X-RateLimit-Remaining": String(Math.max(config.rateLimitMax - 1, 0)),
        "X-RateLimit-Reset": String(Math.floor(freshBucket.resetAt / 1000)),
      },
    };
  }

  if (bucket.count >= config.rateLimitMax) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1),
      headers: {
        "Retry-After": String(Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1)),
        "X-RateLimit-Limit": String(config.rateLimitMax),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(bucket.resetAt / 1000)),
      },
    };
  }

  bucket.count += 1;
  RATE_LIMIT_BUCKETS.set(key, bucket);

  return {
    allowed: true,
    headers: {
      "X-RateLimit-Limit": String(config.rateLimitMax),
      "X-RateLimit-Remaining": String(Math.max(config.rateLimitMax - bucket.count, 0)),
      "X-RateLimit-Reset": String(Math.floor(bucket.resetAt / 1000)),
    },
  };
}

function buildWorkerUrl(baseUrl: string, path: string): string {
  return new URL(withoutLeadingSlash(path), withTrailingSlash(baseUrl)).toString();
}

function getStatusUrl(request: NextRequest, jobId: string): string {
  return new URL(`/api/youtube-downloads/${jobId}`, request.nextUrl.origin).toString();
}

function normalizeJobStatus(status: unknown): JobStatus {
  switch (typeof status === "string" ? status.toLowerCase() : "") {
    case "queued":
    case "pending":
      return "queued";
    case "running":
    case "processing":
      return "processing";
    case "completed":
    case "succeeded":
    case "success":
      return "completed";
    case "failed":
    case "error":
      return "failed";
    default:
      return "queued";
  }
}

function normalizeAssetUrl(value: unknown, storagePublicUrl: string): string | null {
  const candidate = sanitizeString(value, 2000);
  if (!candidate) {
    return null;
  }

  try {
    return new URL(candidate).toString();
  } catch {
    if (!storagePublicUrl) {
      return null;
    }

    return new URL(
      withoutLeadingSlash(candidate),
      withTrailingSlash(storagePublicUrl)
    ).toString();
  }
}

function normalizeDownloads(raw: unknown, storagePublicUrl: string): DownloadAsset[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((asset) => {
      if (typeof asset === "string") {
        const url = normalizeAssetUrl(asset, storagePublicUrl);
        return url ? { url, format: null, name: null } : null;
      }

      if (!asset || typeof asset !== "object") {
        return null;
      }

      const candidate = asset as Record<string, unknown>;
      const url = normalizeAssetUrl(
        candidate.url ?? candidate.path ?? candidate.downloadUrl,
        storagePublicUrl
      );

      if (!url) {
        return null;
      }

      return {
        url,
        format: sanitizeString(candidate.format, 20) || null,
        name:
          sanitizeString(candidate.name ?? candidate.filename ?? candidate.fileName, 200) ||
          null,
      };
    })
    .filter((asset): asset is DownloadAsset => asset !== null);
}

function normalizeWorkerJobResponse(
  raw: unknown,
  request: NextRequest,
  fallbackJobId?: string
): DownloadJobResponse | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const config = getYouTubeDownloadRouteConfig();
  const candidate = raw as Record<string, unknown>;
  const jobId = sanitizeString(candidate.jobId ?? candidate.id ?? fallbackJobId, 128);

  if (!jobId || !ALLOWED_JOB_ID.test(jobId)) {
    return null;
  }

  const downloadItems = normalizeDownloads(candidate.downloads, config.storagePublicUrl);
  const singleDownloadUrl = normalizeAssetUrl(
    candidate.downloadUrl,
    config.storagePublicUrl
  );

  if (singleDownloadUrl) {
    downloadItems.push({
      url: singleDownloadUrl,
      format: sanitizeString(candidate.format, 20) || null,
      name: sanitizeString(candidate.filename ?? candidate.fileName, 200) || null,
    });
  }

  return {
    jobId,
    status: normalizeJobStatus(candidate.status),
    statusUrl: getStatusUrl(request, jobId),
    downloads: downloadItems,
    error: sanitizeString(candidate.error ?? candidate.message, 500) || null,
  };
}

export async function submitYouTubeDownloadJob(
  payload: NormalizedYouTubeDownloadPayload,
  request: NextRequest
): Promise<DownloadJobResponse | null> {
  const config = getYouTubeDownloadRouteConfig();

  if (!config.workerBaseUrl) {
    return null;
  }

  const response = await fetch(buildWorkerUrl(config.workerBaseUrl, "/jobs"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.workerApiKey
        ? { Authorization: `Bearer ${config.workerApiKey}` }
        : {}),
    },
    body: JSON.stringify({
      source: "youtube",
      ...payload,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("WORKER_REQUEST_FAILED");
  }

  const json = (await response.json().catch(() => null)) as unknown;
  return normalizeWorkerJobResponse(json, request);
}

export async function getYouTubeDownloadJobStatus(
  request: NextRequest,
  jobId: string
): Promise<DownloadJobResponse | null> {
  const config = getYouTubeDownloadRouteConfig();

  if (!config.workerBaseUrl) {
    return null;
  }

  const response = await fetch(
    buildWorkerUrl(config.workerBaseUrl, `/jobs/${jobId}`),
    {
      method: "GET",
      headers: config.workerApiKey
        ? { Authorization: `Bearer ${config.workerApiKey}` }
        : undefined,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("WORKER_REQUEST_FAILED");
  }

  const json = (await response.json().catch(() => null)) as unknown;
  return normalizeWorkerJobResponse(json, request, jobId);
}

export function isValidJobId(jobId: string): boolean {
  return ALLOWED_JOB_ID.test(jobId);
}

export function resetYouTubeDownloadRateLimitForTests() {
  RATE_LIMIT_BUCKETS.clear();
}
