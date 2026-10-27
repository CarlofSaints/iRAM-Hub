import crypto from 'crypto';

/**
 * Signed, httpOnly session cookie. This Hub used to trust an
 * `x-user-id` header, and that id travels inside every SSO token, so anyone who
 * saw one token could act as that user on the Hub. Here the browser holds only
 * this cookie, which it cannot read or forge.
 */
export const SESSION_COOKIE = 'iram_hub_session';
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function secret(): string {
  const s = process.env.IRAM_HUB_SESSION_SECRET;
  if (s) return s;
  // No separate setting needed: derive the key from the SSO secret that is already set.
  const sso = process.env.IRAM_SSO_SECRET;
  if (sso) return `hub-session:${sso}`;
  if (process.env.VERCEL) throw new Error('IRAM_HUB_SESSION_SECRET is not set');
  return 'local-dev-only-secret';
}

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const sign = (body: string) => crypto.createHmac('sha256', secret()).update(body).digest('base64url');

/** `pv` = the user's password version: changing the password signs out every other session. */
export function createSession(uid: string, pv: number): string {
  const body = b64(JSON.stringify({ uid, pv, exp: Math.floor(Date.now() / 1000) + MAX_AGE }));
  return `${body}.${sign(body)}`;
}

export function readSession(value: string | undefined): { uid: string; pv: number } | null {
  if (!value) return null;
  const [body, sig] = value.split('.');
  if (!body || !sig) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(sig);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString()) as { uid: string; pv?: number; exp: number };
    return p.exp > Date.now() / 1000 ? { uid: p.uid, pv: p.pv ?? 0 } : null;
  } catch {
    return null;
  }
}

export const sessionCookie = (value: string) => ({
  name: SESSION_COOKIE,
  value,
  httpOnly: true,
  secure: !!process.env.VERCEL,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE,
});

/** Temporary passwords: crypto-random, no look-alike characters. */
export function makeTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 12 }, () => chars[crypto.randomInt(chars.length)]).join('');
}
