import { NextRequest, NextResponse } from 'next/server';
import { loadUsers, saveUsers } from '@/lib/userData';
import { requireLogin } from '@/lib/requireLogin';

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

  user.updatedAt = new Date().toISOString();
  users[idx] = user;
  await saveUsers(users);

  const { passwordHash: _, ...safe } = user;
  return NextResponse.json(safe);
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
