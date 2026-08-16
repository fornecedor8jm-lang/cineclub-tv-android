type SubtitleSearchInput = {
  title: string;
  year?: number;
  season?: number;
  episode?: number;
  language?: string;
};

type CachedResult = { expiresAt: number; value: Array<Record<string, unknown>> };
const cache = new Map<string, CachedResult>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function keyOf(input: SubtitleSearchInput) {
  return JSON.stringify({ ...input, language: input.language || "pt-br" });
}

export async function downloadSubtitle(fileId: string) {
  const apiKey = process.env.OPENSUBTITLES_API_KEY;
  if (!apiKey) throw new Error("OPENSUBTITLES_API_KEY_MISSING");
  if (!/^\d+$/.test(fileId)) throw new Error("OPENSUBTITLES_FILE_ID_INVALID");
  const response = await fetch("https://api.opensubtitles.com/api/v1/download", {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      "User-Agent": "Cineclub TV v1.0.0",
    },
    body: JSON.stringify({ file_id: Number(fileId) }),
  });
  if (!response.ok) throw new Error(`OPENSUBTITLES_DOWNLOAD_HTTP_${response.status}`);
  const payload = await response.json() as { link?: string; file_name?: string; requests?: number };
  if (!payload.link) throw new Error("OPENSUBTITLES_DOWNLOAD_LINK_MISSING");
  return { link: payload.link, fileName: payload.file_name || "subtitle.srt", requestsRemaining: payload.requests };
}

export async function searchSubtitles(input: SubtitleSearchInput) {
  const apiKey = process.env.OPENSUBTITLES_API_KEY;
  if (!apiKey) throw new Error("OPENSUBTITLES_API_KEY_MISSING");
  const cacheKey = keyOf(input);
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const params = new URLSearchParams({ query: input.title, languages: input.language || "pt-br" });
  if (input.year) params.set("year", String(input.year));
  if (input.season) params.set("season_number", String(input.season));
  if (input.episode) params.set("episode_number", String(input.episode));
  if (input.season || input.episode) params.set("type", "episode");
  else params.set("type", "movie");

  const response = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?${params.toString()}`, {
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
      "User-Agent": "Cineclub TV v1.0.0",
    },
  });
  if (!response.ok) throw new Error(`OPENSUBTITLES_HTTP_${response.status}`);
  const payload = await response.json() as { data?: Array<{ id?: string; attributes?: Record<string, unknown> }> };
  const value = (payload.data || []).slice(0, 20).map((item) => {
    const attributes = item.attributes || {};
    const files = Array.isArray(attributes.files) ? attributes.files : [];
    const file = files[0] as Record<string, unknown> | undefined;
    return {
      id: item.id,
      language: attributes.language,
      release: attributes.release,
      hearingImpaired: attributes.hearing_impaired,
      downloadCount: attributes.download_count,
      rating: attributes.ratings,
      fileId: file?.file_id,
    };
  });
  cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value });
  return value;
}
