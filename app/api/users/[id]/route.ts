import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadUsers, saveUsers } from '@/lib/userData';
import { requireLogin } from '@/lib/requireLogin';
import { sendNewUserEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireLogin(req, 'super-admin');
  if (check instanceof NextResponse) return check;

  const { id } = await params;
  const body = await req.json();
  const users = await loadUsers();
  const idx = users.findIndex(u => u.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const user = users[idx];

  if (body.name !== undefined) user.name = body.name.trim();
  if (body.surname !== undefined) user.surname = body.surname.trim();
  if (body.email !== undefined) {
    const newEmail = body.email.toLowerCase().trim();
    const dup = users.find(u => u.id !== id && u.email.toLowerCase() === newEmail);
    if (dup) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    user.email = newEmail;
  }
  if (body.role !== undefined) {
    user.role = body.role === 'super-admin' ? 'super-admin' : 'user';
  }
  if (body.modules !== undefined) {
    user.modules = body.modules;
  }
  if (body.forcePasswordChange !== undefined) {
    user.forcePasswordChange = !!body.forcePasswordChange;
  }

  user.updatedAt = new Date().toISOString();
  users[idx] = user;
  await saveUsers(users);

  const { passwordHash: _, ...safe } = user;
  return NextResponse.json(safe);
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pw = '';
  for (let i = 0; i < 10; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

/** POST = send credentials (new temp password + email) */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireLogin(req, 'super-admin');
  if (check instanceof NextResponse) return check;

  const { id } = await params;
  const users = await loadUsers();
  const idx = users.findIndex(u => u.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const user = users[idx];
  const tempPassword = generateTempPassword();
  user.passwordHash = await bcrypt.hash(tempPassword, 10);
  user.forcePasswordChange = true;
  user.updatedAt = new Date().toISOString();
  users[idx] = user;
  await saveUsers(users);

  try {
    await sendNewUserEmail(
      user.email,
      `${user.name} ${user.surname}`.trim(),
      tempPassword,
    );
  } catch (err) {
    console.error('[users/POST] Failed to send credentials email:', err);
    return NextResponse.json({ error: 'User updated but email failed to send' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: 'Credentials emailed' });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const check = await requireLogin(req, 'super-admin');
  if (check instanceof NextResponse) return check;

  const { id } = await params;
  const users = await loadUsers();
  const idx = users.findIndex(u => u.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Prevent deleting yourself
  if (check.id === id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  users.splice(idx, 1);
  await saveUsers(users);

  return NextResponse.json({ ok: true });
}
