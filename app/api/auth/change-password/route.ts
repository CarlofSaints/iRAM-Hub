import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadUsers, saveUsers } from '@/lib/userData';
import { requireLogin } from '@/lib/requireLogin';
import { createSession, sessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

/** Change the SIGNED-IN user's password (it used to take any userId from the body, unauthenticated). */
export async function POST(req: NextRequest) {
  const me = await requireLogin(req);
  if (me instanceof NextResponse) return me;

  const { newPassword } = await req.json();
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const users = await loadUsers();
  const idx = users.findIndex(u => u.id === me.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const user = users[idx];
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.forcePasswordChange = false;
  user.passwordVersion = (user.passwordVersion ?? 0) + 1;
  user.updatedAt = new Date().toISOString();
  await saveUsers(users);

  const res = NextResponse.json({
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    modules: user.modules,
    forcePasswordChange: false,
  });
  // Other sessions are now invalid; keep this one signed in.
  res.cookies.set(sessionCookie(createSession(user.id, user.passwordVersion)));
  return res;
}
