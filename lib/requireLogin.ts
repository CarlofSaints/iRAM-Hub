import { NextRequest, NextResponse } from 'next/server';
import { loadUsers, HubUser } from './userData';
import { readSession, SESSION_COOKIE } from './session';

/**
 * Server-side auth check. Reads the signed session cookie and re-loads the user,
 * so a deleted user, a role change or a password change applies at once.
 * Returns the user, or a 401/403 NextResponse.
 */
export async function requireLogin(
  req: NextRequest,
  requiredRole?: 'super-admin',
): Promise<HubUser | NextResponse> {
  const session = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const users = await loadUsers();
  const user = users.find(u => u.id === session.uid);
  if (!user || (user.passwordVersion ?? 0) !== session.pv) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (requiredRole && user.role !== requiredRole) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  return user;
}
