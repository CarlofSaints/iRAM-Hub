import { NextRequest, NextResponse } from 'next/server';
import { loadModules, saveModules } from '@/lib/moduleData';
import { loadUsers, saveUsers } from '@/lib/userData';
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

  // Handle slug change
  const newSlug = body.slug !== undefined ? String(body.slug).trim().toLowerCase() : undefined;
  if (newSlug && newSlug !== slug) {
    if (modules.some(m => m.slug === newSlug)) {
      return NextResponse.json({ error: `Slug "${newSlug}" already exists` }, { status: 409 });
    }
    mod.slug = newSlug;

    // Propagate slug change to all users' modules arrays
    const users = await loadUsers();
    let usersChanged = false;
    for (const u of users) {
      const idx2 = u.modules.indexOf(slug);
      if (idx2 !== -1) {
        u.modules[idx2] = newSlug;
        usersChanged = true;
      }
    }
    if (usersChanged) await saveUsers(users);
  }

  if (body.name !== undefined) mod.name = String(body.name);
  if (body.description !== undefined) mod.description = String(body.description);
  if (body.url !== undefined) mod.url = String(body.url);
  if (body.color !== undefined) mod.color = String(body.color);
  if (body.icon !== undefined) mod.icon = String(body.icon);
  if (body.order !== undefined) mod.order = Number(body.order);
  if (body.comingSoon !== undefined) mod.comingSoon = Boolean(body.comingSoon);
  if (body.ssoEnabled !== undefined) mod.ssoEnabled = Boolean(body.ssoEnabled);

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

  // Remove slug from all users' modules arrays
  const users = await loadUsers();
  let usersChanged = false;
  for (const u of users) {
    const idx2 = u.modules.indexOf(slug);
    if (idx2 !== -1) {
      u.modules.splice(idx2, 1);
      usersChanged = true;
    }
  }
  if (usersChanged) await saveUsers(users);

  return NextResponse.json({ ok: true });
}
