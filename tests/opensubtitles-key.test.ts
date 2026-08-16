import { describe, expect, it } from "vitest";

describe("OpenSubtitles credentials", () => {
  it("accepts the configured application key", async () => {
    const apiKey = process.env.OPENSUBTITLES_API_KEY;
    expect(apiKey, "OPENSUBTITLES_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.opensubtitles.com/api/v1/infos/formats", {
      headers: {
        "Api-Key": apiKey as string,
        "Content-Type": "application/json",
        "User-Agent": "Cineclub TV v1.0.0",
      },
    });

    expect(response.status).toBe(200);
  }, 15000);
});
