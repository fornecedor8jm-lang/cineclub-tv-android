import { describe, expect, it } from "vitest";
import { DEMO_M3U, parseM3U } from "../lib/m3u";

describe("M3U channel logos and categories", () => {
  it("accepts the common logo attribute variants", () => {
    const items = parseM3U(`#EXTM3U
#EXTINF:-1 tvg-name="A" tvg-logo="https://a/logo.png" group-title="Canais",A
https://a/live.m3u8
#EXTINF:-1 tvg-name="B" logo="https://b/logo.png" group-title="Canais",B
https://b/live.m3u8
#EXTINF:-1 tvg-name="C" channel-logo="https://c/logo.png" group-title="Canais",C
https://c/live.m3u8
#EXTINF:-1 tvg-name="D" group-logo="https://d/logo.png" group-title="Canais",D
https://d/live.m3u8`);

    expect(items.map((item) => item.logo)).toEqual([
      "https://a/logo.png",
      "https://b/logo.png",
      "https://c/logo.png",
      "https://d/logo.png",
    ]);
  });

  it("includes channels, movies and series in the demo playlist", () => {
    const items = parseM3U(DEMO_M3U);
    expect(new Set(items.map((item) => item.category))).toEqual(new Set(["Canais", "Filmes", "Séries"]));
    expect(items.find((item) => item.category === "Canais")?.logo).toContain("dummyimage");
  });
});
