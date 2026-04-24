import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { loadUsers, saveUsers, HubUser } from '@/lib/userData';
import { requireLogin } from '@/lib/requireLogin';
import { sendNewUserEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const check = await requireLogin(req, 'super-admin');
  if (check instanceof NextResponse) return check;

  const users = await loadUsers();

  // Return users without passwordHash
  const safe = users.map(({ passwordHash: _, ...rest }) => rest);
  return NextResponse.json(safe, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pw = '';
  for (let i = 0; i < 10; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

export async function POST(req: NextRequest) {
  const check = await requireLogin(req, 'super-admin');
  if (check instanceof NextResponse) return check;

  const { name, surname, email, role, modules } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const users = await loadUsers();

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return NextResponse.json({ error: 'A user with that email already exists' }, { status: 409 });
  }

  const tempPassword = generateTempPassword();
  const now = new Date().toISOString();

  const newUser: HubUser = {
    id: randomUUID(),
    name: name.trim(),
    surname: (surname ?? '').trim(),
    email: email.toLowerCase().trim(),
    passwordHash: await bcrypt.hash(tempPassword, 10),
    role: role === 'super-admin' ? 'super-admin' : 'user',
    modules: modules ?? [],
    createdAt: now,
    updatedAt: now,
    forcePasswordChange: true,
  };

  users.push(newUser);
  await saveUsers(users);

  // Send welcome email with temp password
  try {
    await sendNewUserEmail(
      newUser.email,
      `${newUser.name} ${newUser.surname}`.trim(),
      tempPassword,
    );
  } catch (err) {
    console.error('[users/POST] Failed to send welcome email:', err);
  }

  const { passwordHash: _, ...safe } = newUser;
  return NextResponse.json(safe, { status: 201 });
}
