import fs from 'fs';
import path from 'path';
import { put, get } from '@vercel/blob';

export interface Module {
  slug: string;
  name: string;
  description: string;
  url: string;
  color: string;
  icon: string;
  order: number;
  comingSoon: boolean;
}

const BLOB_KEY = 'modules.json';

/**
 * Load modules from Vercel Blob (production) or local file (dev).
 * NO module-level cache — multi-container serverless safety.
 */
export async function loadModules(): Promise<Module[]> {
  if (!process.env.VERCEL) {
    const localFile = path.join(process.cwd(), 'data', 'modules.json');
    try {
      if (fs.existsSync(localFile)) {
        return JSON.parse(fs.readFileSync(localFile, 'utf-8')) as Module[];
      }
    } catch { /* empty */ }
    return [];
  }

  try {
    const result = await get(BLOB_KEY, { access: 'private', useCache: false });
    if (result && result.statusCode === 200) {
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as Module[];
    }
  } catch (err) {
    console.error('[moduleData] Blob read failed:', err instanceof Error ? err.message : err);
  }
  return [];
}

export async function saveModules(modules: Module[]): Promise<void> {
  const json = JSON.stringify(modules, null, 2);

  try {
    await put(BLOB_KEY, json, {
      access: 'private',
      contentType: 'application/json',
      allowOverwrite: true,
      addRandomSuffix: false,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to persist modules to Vercel Blob: ${msg}`);
  }

  // Local dev: also write to local file
  try {
    const localFile = path.join(process.cwd(), 'data', 'modules.json');
    const dir = path.dirname(localFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(localFile, json);
  } catch {
    // Vercel read-only FS — expected
  }
}

/**
 * Default modules — seeded on first run.
 */
export const DEFAULT_MODULES: Module[] = [
  {
    slug: 'callcycle',
    name: 'Call Cycle Builder',
    description: 'Build and manage rep call cycles and schedules',
    url: 'https://iram.callcycle.fieldgoose.outerjoin.co.za',
    color: '#7CC042',
    icon: 'callcycle',
    order: 1,
    comingSoon: false,
  },
  {
    slug: 'rvl',
    name: 'iRam Flow',
    description: 'Reverse logistics, aged stock and pick slip management',
    url: 'https://iram-rvl-crm.vercel.app',
    color: '#7CC042',
    icon: 'rvl',
    order: 2,
    comingSoon: false,
  },
  {
    slug: 'phantom',
    name: 'Phantom Consolidator',
    description: 'Consolidate phantom stock reports across vendors',
    url: 'https://phantom-consolidator.vercel.app',
    color: '#7CC042',
    icon: 'phantom',
    order: 3,
    comingSoon: false,
  },
  {
    slug: 'dispo',
    name: 'DISPO Cleaner',
    description: 'Clean and format DISPO export files',
    url: 'https://dispo-cleaner.vercel.app',
    color: '#7CC042',
    icon: 'dispo',
    order: 4,
    comingSoon: false,
  },
  {
    slug: 'pnp-oos',
    name: 'PnP OOS Reporter',
    description: 'Pick n Pay out-of-stock reporting',
    url: '',
    color: '#7CC042',
    icon: 'pnp-oos',
    order: 5,
    comingSoon: true,
  },
];
