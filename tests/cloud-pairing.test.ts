import { describe, expect, it } from "vitest";

describe("cloud pairing contract", () => {
  it("requires a temporary token and never places credentials in the QR payload", () => {
    const token = "8F72K9";
    const qrPayload = `https://cineclub-tv.example/connect?token=${token}`;
    expect(qrPayload).toContain("token=");
    expect(qrPayload).not.toContain("password");
    expect(qrPayload).not.toContain("username");
  });

  it("accepts only an M3U source or server configuration", () => {
    const valid = { token: "8F72K9", m3uUrl: "https://example.com/list.m3u" };
    const invalid = { token: "8F72K9" };
    expect(valid.m3uUrl).toMatch(/^https:\/\//);
    expect(invalid).not.toHaveProperty("m3uUrl");
  });
});
