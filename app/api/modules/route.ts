import { NextRequest, NextResponse } from 'next/server';
import { loadModules, saveModules, Module } from '@/lib/moduleData';
import { requireLogin } from '@/lib/requireLogin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/modules — public (dashboard needs it without auth gating).
 * Returns sorted module list.
 */
export async function GET() {
  const modules = await loadModules();
  modules.sort((a, b) => a.order - b.order);

  return NextResponse.json(modules, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

/**
 * POST /api/modules — super-admin only. Create a new module.
 */
export async function POST(req: NextRequest) {
  const auth = await requireLogin(req, 'super-admin');
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { slug, name, description, url, color, icon, order, comingSoon } = body;

  if (!slug || !name) {
    return NextResponse.json({ error: 'slug and name are required' }, { status: 400 });
  }

  const modules = await loadModules();

  if (modules.find(m => m.slug === slug)) {
    return NextResponse.json({ error: 'Module with this slug already exists' }, { status: 409 });
  }

  const newModule: Module = {
    slug: String(slug).toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    name: String(name),
    description: String(description || ''),
    url: String(url || ''),
    color: String(color || '#7CC042'),
    icon: String(icon || ''),
    order: typeof order === 'number' ? order : modules.length + 1,
    comingSoon: Boolean(comingSoon),
  };

  modules.push(newModule);
  await saveModules(modules);

  return NextResponse.json(newModule, { status: 201 });
}
