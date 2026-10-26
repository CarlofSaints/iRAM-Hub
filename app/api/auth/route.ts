import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadUsers, HubUser } from '@/lib/userData';
import { requireLogin } from '@/lib/requireLogin';
import { createSession, sessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

const profile = (u: HubUser) => ({
  id: u.id,
  name: u.name,
  surname: u.surname,
  email: u.email,
  role: u.role,
  modules: u.modules,
  forcePasswordChange: u.forcePasswordChange ?? false,
});

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const users = await loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const res = NextResponse.json(profile(user));
  res.cookies.set(sessionCookie(createSession(user.id, user.passwordVersion ?? 0)));
  return res;
}

/**
 * The signed-in user's current details. The dashboard keeps a display copy in
 * localStorage; this refreshes it so module changes apply without signing out.
 */
export async function GET(req: NextRequest) {
  const userOrRes = await requireLogin(req);
  if (userOrRes instanceof NextResponse) return userOrRes;
  return NextResponse.json(profile(userOrRes));
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...sessionCookie(''), maxAge: 0 });
  return res;
}
