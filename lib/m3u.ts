export type M3UCategory = "Canais" | "Filmes" | "Séries" | "Infantil" | "Outros";

export type M3UItem = {
  id: string;
  name: string;
  title: string;
  group: string;
  category: M3UCategory;
  url: string;
  logo?: string;
  tvgId?: string;
  tvgName?: string;
  kind: "live" | "movie" | "series" | "unknown";
  season?: number;
  episode?: number;
};

function attribute(line: string, key: string) {
  const match = line.match(new RegExp(`${key}="([^"]*)"`, "i"));
  return match?.[1]?.trim() || undefined;
}

function detectEpisode(name: string) {
  const match = name.match(/(?:S(\d{1,2})\s*E(\d{1,3}))|(?:T(\d{1,2})\s*E(?:P)?\s*(\d{1,3}))/i);
  if (!match) return {};
  return { season: Number(match[1] || match[3]), episode: Number(match[2] || match[4]) };
}

function cleanSeriesTitle(name: string) {
  return name.replace(/[._-]?S\d{1,2}\s*E\d{1,3}.*/i, "").replace(/[._-]?T\d{1,2}\s*E(?:P)?\s*\d{1,3}.*/i, "").replace(/\s+/g, " ").trim() || name;
}

function classify(name: string, group: string, url: string): { kind: M3UItem["kind"]; category: M3UCategory } {
  const value = `${name} ${group} ${url}`.toLowerCase();
  if (/infantil|kids|child|disney|cartoon|juvenil/.test(value)) return { kind: "unknown", category: "Infantil" };
  if (/filme|movie|cinema|vod|longa/.test(value)) return { kind: "movie", category: "Filmes" };
  if (/s[eé]rie|series|temporada|season|s\d{1,2}e\d{1,3}|t\d{1,2}e/.test(value)) return { kind: "series", category: "Séries" };
  if (/canais?|live|tv|ao vivo|\.(ts|m3u8)(\?|$)/.test(value)) return { kind: "live", category: "Canais" };
  return { kind: "unknown", category: "Outros" };
}

export function parseM3U(input: string): M3UItem[] {
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const items: M3UItem[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith("#EXTINF")) continue;
    const comma = line.indexOf(",");
    const name = comma >= 0 ? line.slice(comma + 1).trim() : attribute(line, "tvg-name") || "Sem título";
    const url = lines.slice(index + 1).find((candidate) => !candidate.startsWith("#"));
    if (!url) continue;
    const group = attribute(line, "group-title") || "Sem grupo";
    const tvgId = attribute(line, "tvg-id");
    const tvgName = attribute(line, "tvg-name");
    const logo = attribute(line, "tvg-logo");
    const episode = detectEpisode(name);
    const classification = classify(name, group, url);
    const title = classification.kind === "series" || episode.season ? cleanSeriesTitle(name) : name;
    items.push({
      id: `${tvgId || name}-${url}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 120),
      name,
      title,
      group,
      category: classification.category,
      url,
      logo,
      tvgId,
      tvgName,
      kind: classification.kind,
      ...episode,
    });
  }
  return items;
}

export function groupM3U(items: M3UItem[]) {
  return Array.from(new Set(items.map((item) => item.group))).map((group) => ({
    group,
    items: items.filter((item) => item.group === group),
  }));
}

export function groupSeries(items: M3UItem[]) {
  const series = items.filter((item) => item.category === "Séries");
  return Array.from(new Set(series.map((item) => item.title))).map((title) => ({
    title,
    seasons: Array.from(new Set(series.filter((item) => item.title === title).map((item) => item.season || 1))).sort((a, b) => a - b).map((season) => ({
      season,
      episodes: series.filter((item) => item.title === title && (item.season || 1) === season).sort((a, b) => (a.episode || 0) - (b.episode || 0)),
    })),
  }));
}

export const DEMO_M3U = `#EXTM3U\n#EXTINF:-1 tvg-name="Filme Demo" group-title="Filmes",Filme Demo\nhttps://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4\n#EXTINF:-1 tvg-name="Série Demo S01E01" group-title="Séries",Série Demo S01E01\nhttps://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4`;
