import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadUsers, saveUsers } from '@/lib/userData';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { userId, newPassword } = await req.json();
  if (!userId || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const users = await loadUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  users[idx].passwordHash = await bcrypt.hash(newPassword, 10);
  users[idx].forcePasswordChange = false;
  users[idx].updatedAt = new Date().toISOString();
  await saveUsers(users);

  return NextResponse.json({
    id: users[idx].id,
    name: users[idx].name,
    surname: users[idx].surname,
    email: users[idx].email,
    role: users[idx].role,
    modules: users[idx].modules,
    forcePasswordChange: false,
  });
}
