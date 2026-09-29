import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadUsers } from '@/lib/userData';
import { requireLogin } from '@/lib/requireLogin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const users = await loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    modules: user.modules,
    forcePasswordChange: user.forcePasswordChange ?? false,
  });
}

/**
 * The signed-in user's current details. The dashboard reads module access from
 * the copy in localStorage saved at sign-in; this lets it refresh that copy, so
 * modules granted (or removed) since sign-in show without signing out.
 */
export async function GET(req: NextRequest) {
  const userOrRes = await requireLogin(req);
  if (userOrRes instanceof NextResponse) return userOrRes;
  const user = userOrRes;

  return NextResponse.json({
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    modules: user.modules,
  });
}
