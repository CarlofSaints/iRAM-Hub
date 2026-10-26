import fs from 'fs';
import path from 'path';
import { put, get } from '@vercel/blob';

export interface HubUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  passwordHash: string;
  role: 'super-admin' | 'user';
  modules: string[];
  createdAt: string;
  updatedAt: string;
  forcePasswordChange?: boolean;
  passwordVersion?: number; // bumped on every password change; signs out older sessions
}

const BLOB_KEY = 'users.json';

/**
 * Load users from Vercel Blob (production) or local file (dev).
 * NO module-level cache — multi-container serverless safety.
 */
export async function loadUsers(): Promise<HubUser[]> {
  if (!process.env.VERCEL) {
    const localFile = path.join(process.cwd(), 'data', 'users.json');
    try {
      if (fs.existsSync(localFile)) {
        return JSON.parse(fs.readFileSync(localFile, 'utf-8')) as HubUser[];
      }
    } catch { /* empty */ }
    return [];
  }

  try {
    const result = await get(BLOB_KEY, { access: 'private', useCache: false });
    if (result && result.statusCode === 200) {
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as HubUser[];
    }
  } catch (err) {
    console.error('[userData] Blob read failed:', err instanceof Error ? err.message : err);
  }
  return [];
}

export async function saveUsers(users: HubUser[]): Promise<void> {
  const json = JSON.stringify(users, null, 2);

  // Local dev: the local file only (loading reads it too); no Blob token here.
  if (!process.env.VERCEL) {
    const localFile = path.join(process.cwd(), 'data', 'users.json');
    fs.mkdirSync(path.dirname(localFile), { recursive: true });
    fs.writeFileSync(localFile, json);
    return;
  }

  try {
    await put(BLOB_KEY, json, {
      access: 'private',
      contentType: 'application/json',
      allowOverwrite: true,
      addRandomSuffix: false,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to persist users to Vercel Blob: ${msg}`);
  }

}
