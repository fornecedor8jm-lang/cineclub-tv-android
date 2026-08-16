import { randomBytes } from "node:crypto";

export type PairingSession = {
  token: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
  m3uUrl?: string;
  server?: string;
  username?: string;
  password?: string;
  format?: string;
};

const sessions = new Map<string, PairingSession>();
const TTL_MS = 10 * 60 * 1000;

function purge() {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expiresAt <= now || session.used) sessions.delete(token);
  }
}

export function createPairing() {
  purge();
  const token = randomBytes(6).toString("base64url").toUpperCase();
  const now = Date.now();
  const session = { token, createdAt: now, expiresAt: now + TTL_MS, used: false } satisfies PairingSession;
  sessions.set(token, session);
  return { token, expiresAt: session.expiresAt };
}

export function getPairing(token: string) {
  purge();
  return sessions.get(token.toUpperCase());
}

export function submitPairing(input: { token: string; m3uUrl?: string; server?: string; username?: string; password?: string; format?: string }) {
  const session = getPairing(input.token);
  if (!session || session.used || session.expiresAt <= Date.now()) throw new Error("PAIRING_EXPIRED");
  if (!input.m3uUrl && !input.server) throw new Error("M3U_SOURCE_REQUIRED");
  Object.assign(session, input, { token: session.token, used: false });
  return { success: true as const };
}

export function consumePairing(token: string) {
  const session = getPairing(token);
  if (!session || session.used || session.expiresAt <= Date.now() || !session.m3uUrl) throw new Error("PAIRING_NOT_READY");
  session.used = true;
  return { m3uUrl: session.m3uUrl };
}
