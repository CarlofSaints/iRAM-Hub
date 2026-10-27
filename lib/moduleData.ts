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
  ssoEnabled?: boolean;
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

  // Local dev: the local file only (loading reads it too); no Blob token here.
  if (!process.env.VERCEL) {
    const localFile = path.join(process.cwd(), 'data', 'modules.json');
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
    throw new Error(`Failed to persist modules to Vercel Blob: ${msg}`);
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
    ssoEnabled: true,
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
    ssoEnabled: true,
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
    ssoEnabled: true,
  },
  {
    slug: 'ppt',
    name: 'PPT Builder',
    description: 'Generate PowerPoint reports from Perigee task exports',
    url: 'https://i-ram-ppt-builder.vercel.app',
    color: '#7CC042',
    icon: 'ppt',
    order: 5,
    comingSoon: false,
    ssoEnabled: true,
  },
  {
    slug: 'pnp-oos',
    name: 'PnP OOS Reporter',
    description: 'Pick n Pay out-of-stock reporting',
    url: '',
    color: '#7CC042',
    icon: 'pnp-oos',
    order: 6,
    comingSoon: true,
  },
  {
    slug: 'ghost-stock',
    name: 'Ghost Stock',
    description: 'OLAP cube processor for ghost stock analysis',
    url: 'https://exceler8xl.sharepoint.com/:u:/r/Tools%20%20Software/GHOST/GHOST.bat?csf=1&web=1&e=8yIamw',
    color: '#7CC042',
    icon: 'ghost',
    order: 7,
    comingSoon: false,
    ssoEnabled: false,
  },
];
