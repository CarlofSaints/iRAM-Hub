import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadUsers, saveUsers } from '@/lib/userData';
import { consumeResetToken } from '@/lib/resetTokens';

export const dynamic = 'force-dynamic';

/** Set a new password from an emailed reset link. The token is single use and expires after an hour. */
export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json().catch(() => ({}));
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const uid = await consumeResetToken(token);
  if (!uid) {
    return NextResponse.json({ error: 'This reset link has expired or was already used. Ask for a new one.' }, { status: 400 });
  }

  const users = await loadUsers();
  const user = users.find(u => u.id === uid);
  if (!user) {
    return NextResponse.json({ error: 'This reset link has expired or was already used. Ask for a new one.' }, { status: 400 });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.forcePasswordChange = false;
  user.passwordVersion = (user.passwordVersion ?? 0) + 1; // signs out every older session
  user.updatedAt = new Date().toISOString();
  await saveUsers(users);

  return NextResponse.json({ ok: true });
}
