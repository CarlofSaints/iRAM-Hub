import { NextRequest, NextResponse } from 'next/server';
import { requireLogin } from '@/lib/requireLogin';
import { createSSOToken } from '@/lib/sso';
import { loadModules } from '@/lib/moduleData';

export async function POST(req: NextRequest) {
  const userOrRes = await requireLogin(req);
  if (userOrRes instanceof NextResponse) return userOrRes;
  const user = userOrRes;

  const { module } = (await req.json()) as { module?: string };
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

  const secret = process.env.IRAM_SSO_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'SSO not configured' },
      { status: 500 },
    );
  }

  // Super-admins get all registered module slugs in the token
  let tokenModules = user.modules;
  if (user.role === 'super-admin') {
    const allModules = await loadModules();
    tokenModules = allModules.map(m => m.slug);
  }

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

  return NextResponse.json({ token });
}
