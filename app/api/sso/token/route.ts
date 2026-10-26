import { NextRequest, NextResponse } from 'next/server';
import { requireLogin } from '@/lib/requireLogin';
import { createSSOToken } from '@/lib/sso';
import { loadModules } from '@/lib/moduleData';

/**
 * Signs a 5-minute SSO token for one module and returns the URL to open with it.
 * The URL is built here, never taken as-is from the browser: an optional `redirect`
 * (a module bouncing an unsigned visitor to the Hub) must be on that module's own
 * origin, so a crafted link cannot send someone's token to another site.
 */
/**
 * Other domains a module is legitimately served from, as JSON in SSO_EXTRA_ORIGINS,
 * e.g. {"iram-live":["https://aria-live-phi.vercel.app"]}. Bad JSON = none.
 */
function extraOrigins(slug: string): string[] {
  try {
    const map = JSON.parse(process.env.SSO_EXTRA_ORIGINS || '{}') as Record<string, string[]>;
    return (map[slug] ?? []).map(u => new URL(u).origin);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const userOrRes = await requireLogin(req);
  if (userOrRes instanceof NextResponse) return userOrRes;
  const user = userOrRes;

  const { module, redirect } = (await req.json()) as { module?: string; redirect?: string };
  if (!module) {
    return NextResponse.json({ error: 'Missing module' }, { status: 400 });
  }

  // Super-admins have access to all modules; regular users must have the module assigned
  if (user.role !== 'super-admin' && !user.modules.includes(module)) {
    return NextResponse.json(
      { error: 'You do not have access to this module' },
      { status: 403 },
    );
  }

  const allModules = await loadModules();
  const mod = allModules.find(m => m.slug === module);
  if (!mod) {
    return NextResponse.json({ error: 'Unknown module' }, { status: 404 });
  }

  let target: URL;
  try {
    target = redirect ? new URL(redirect) : new URL(`${mod.url.replace(/\/+$/, '')}/sso/callback`);
    if (target.origin !== new URL(mod.url).origin && !extraOrigins(mod.slug).includes(target.origin)) throw new Error('origin');
  } catch {
    return NextResponse.json({ error: 'That sign-in link does not belong to this module' }, { status: 400 });
  }

  const secret = process.env.IRAM_SSO_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'SSO not configured' },
      { status: 500 },
    );
  }

  // Super-admins get all registered module slugs in the token
  const tokenModules = user.role === 'super-admin' ? allModules.map(m => m.slug) : user.modules;

  const token = createSSOToken(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      hubRole: user.role,
      modules: tokenModules,
    },
    secret,
  );

  target.searchParams.set('token', token);
  return NextResponse.json({ token, url: target.toString() });
}
