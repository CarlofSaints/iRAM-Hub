import { NextRequest, NextResponse } from 'next/server';
import { loadModules, saveModules } from '@/lib/moduleData';
import { requireLogin } from '@/lib/requireLogin';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/modules/[slug] — super-admin only. Update module fields.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireLogin(req, 'super-admin');
  if (auth instanceof NextResponse) return auth;

  const { slug } = await params;
  const body = await req.json();

  const modules = await loadModules();
  const idx = modules.findIndex(m => m.slug === slug);
  if (idx === -1) {
    return NextResponse.json({ error: 'Module not found' }, { status: 404 });
  }

  const mod = modules[idx];

  if (body.name !== undefined) mod.name = String(body.name);
  if (body.description !== undefined) mod.description = String(body.description);
  if (body.url !== undefined) mod.url = String(body.url);
  if (body.color !== undefined) mod.color = String(body.color);
  if (body.icon !== undefined) mod.icon = String(body.icon);
  if (body.order !== undefined) mod.order = Number(body.order);
  if (body.comingSoon !== undefined) mod.comingSoon = Boolean(body.comingSoon);

  modules[idx] = mod;
  await saveModules(modules);

  return NextResponse.json(mod);
}

/**
 * DELETE /api/modules/[slug] — super-admin only.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireLogin(req, 'super-admin');
  if (auth instanceof NextResponse) return auth;

  const { slug } = await params;
  const modules = await loadModules();
  const idx = modules.findIndex(m => m.slug === slug);
  if (idx === -1) {
    return NextResponse.json({ error: 'Module not found' }, { status: 404 });
  }

  modules.splice(idx, 1);
  await saveModules(modules);

  return NextResponse.json({ ok: true });
}
