/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "@/app/api/youtube-downloads/[jobId]/route";
import { POST } from "@/app/api/youtube-downloads/route";
import { resetYouTubeDownloadRateLimitForTests } from "@/lib/youtube-downloads";

function makePostRequest(body: unknown, ip = "203.0.113.10"): NextRequest {
  return new NextRequest("http://localhost:3000/api/youtube-downloads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/youtube-downloads", () => {
  beforeEach(() => {
    process.env.YOUTUBE_DOWNLOADS_ENABLED = "true";
    process.env.MEDIA_WORKER_BASE_URL = "https://worker.example.com";
    process.env.MEDIA_WORKER_API_KEY = "worker-secret";
    delete process.env.MEDIA_STORAGE_PUBLIC_URL;
    process.env.YOUTUBE_DOWNLOAD_RATE_LIMIT_MAX = "5";
    process.env.YOUTUBE_DOWNLOAD_RATE_LIMIT_WINDOW_MS = "600000";
    resetYouTubeDownloadRateLimitForTests();
    jest.restoreAllMocks();
  });

  it("validates YouTube URLs", async () => {
    const response = await POST(
      makePostRequest({
        url: "https://example.com/file.mp4",
        format: "mp3",
        ownershipConfirmed: true,
      })
    );

    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toMatch(/youtube/i);
  });

  it("requires content ownership confirmation", async () => {
    const response = await POST(
      makePostRequest({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        format: "mp3",
        ownershipConfirmed: false,
      })
    );

    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toMatch(/direitos|autoriza/i);
  });

  it("requires track timestamps when split mode is timestamps", async () => {
    const response = await POST(
      makePostRequest({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        format: "wav",
        splitMode: "timestamps",
        ownershipConfirmed: true,
      })
    );

    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toMatch(/timestamps/i);
  });

  it("applies rate limiting before forwarding jobs", async () => {
    process.env.YOUTUBE_DOWNLOAD_RATE_LIMIT_MAX = "1";

    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          jobId: "job_123",
          status: "queued",
        }),
        {
          status: 202,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const payload = {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      format: "mp3",
      ownershipConfirmed: true,
    };

    const firstResponse = await POST(makePostRequest(payload, "203.0.113.44"));
    const secondResponse = await POST(makePostRequest(payload, "203.0.113.44"));

    expect(firstResponse.status).toBe(202);
    expect(secondResponse.status).toBe(429);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("forwards valid jobs to the worker service", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "job_abc123",
          status: "processing",
        }),
        {
          status: 202,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const response = await POST(
      makePostRequest({
        url: "https://youtu.be/dQw4w9WgXcQ",
        format: "mp3",
        splitMode: "timestamps",
        tracks: [
          { title: "Intro", startTime: 0, endTime: 30 },
          { title: "Main", startTime: 30, endTime: 60 },
        ],
        ownershipConfirmed: true,
      })
    );

    expect(response.status).toBe(202);
    const json = await response.json();
    expect(json.jobId).toBe("job_abc123");
    expect(json.status).toBe("processing");
    expect(json.statusUrl).toBe(
      "http://localhost:3000/api/youtube-downloads/job_abc123"
    );

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://worker.example.com/jobs",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer worker-secret",
          "Content-Type": "application/json",
        }),
      })
    );

    const [, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse(String(init?.body));
    expect(body).toMatchObject({
      source: "youtube",
      url: "https://youtu.be/dQw4w9WgXcQ",
      format: "mp3",
      splitMode: "timestamps",
      ownershipConfirmed: true,
    });
    expect(body.tracks).toHaveLength(2);
  });
});

describe("GET /api/youtube-downloads/[jobId]", () => {
  beforeEach(() => {
    process.env.YOUTUBE_DOWNLOADS_ENABLED = "true";
    process.env.MEDIA_WORKER_BASE_URL = "https://worker.example.com";
    process.env.MEDIA_WORKER_API_KEY = "worker-secret";
    process.env.MEDIA_STORAGE_PUBLIC_URL = "https://storage.example.com/downloads";
    resetYouTubeDownloadRateLimitForTests();
    jest.restoreAllMocks();
  });

  it("validates the job id", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/youtube-downloads/invalid id"
    );

    const response = await GET(request, {
      params: Promise.resolve({ jobId: "invalid id" }),
    });

    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toMatch(/job/i);
  });

  it("returns normalized worker status and download URLs", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          jobId: "job_done",
          status: "completed",
          downloads: [
            {
              path: "/job_done/output.mp3",
              format: "mp3",
              filename: "output.mp3",
            },
          ],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const request = new NextRequest(
      "http://localhost:3000/api/youtube-downloads/job_done"
    );

    const response = await GET(request, {
      params: Promise.resolve({ jobId: "job_done" }),
    });

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toMatchObject({
      jobId: "job_done",
      status: "completed",
      statusUrl: "http://localhost:3000/api/youtube-downloads/job_done",
    });
    expect(json.downloads).toEqual([
      {
        url: "https://storage.example.com/downloads/job_done/output.mp3",
        format: "mp3",
        name: "output.mp3",
      },
    ]);
  });
});
