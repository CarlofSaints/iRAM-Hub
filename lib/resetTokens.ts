import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { put, get, del } from '@vercel/blob';

/**
 * Password-reset links. "Forgot password" used to replace the password straight away,
 * so anyone who knew an email could keep that person locked out. Now it only creates
 * a one-time token; the password changes when the emailed link is used.
 *
 * Each token is its own small blob, keyed by the token's SHA-256 (the raw token is
 * never stored), so the public endpoint never rewrites users.json.
 */
const TTL_MS = 60 * 60 * 1000; // 1 hour
const PREFIX = 'reset-tokens/';

const keyOf = (token: string) => PREFIX + crypto.createHash('sha256').update(token).digest('hex') + '.json';
const localFile = (key: string) => path.join(process.cwd(), 'data', key);

interface Stored { uid: string; exp: number }

export async function createResetToken(uid: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('base64url');
  const body = JSON.stringify({ uid, exp: Date.now() + TTL_MS } satisfies Stored);
  const key = keyOf(token);
  if (!process.env.VERCEL) {
    fs.mkdirSync(path.dirname(localFile(key)), { recursive: true });
    fs.writeFileSync(localFile(key), body);
  } else {
    await put(key, body, { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
  }
  return token;
}

/** The user id the token was issued for, or null (unknown, used or expired). Single use. */
export async function consumeResetToken(token: unknown): Promise<string | null> {
  if (typeof token !== 'string' || token.length < 20 || token.length > 100) return null;
  const key = keyOf(token);
  let raw: string | null = null;
  try {
    if (!process.env.VERCEL) {
      if (fs.existsSync(localFile(key))) {
        raw = fs.readFileSync(localFile(key), 'utf-8');
        fs.unlinkSync(localFile(key));
      }
    } else {
      const r = await get(key, { access: 'private', useCache: false });
      if (r && r.statusCode === 200) {
        raw = await new Response(r.stream).text();
        await del(r.blob.url);
      }
    }
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Stored;
    return s.exp > Date.now() ? s.uid : null;
  } catch {
    return null;
  }
}
