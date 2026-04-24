import { NextRequest, NextResponse } from 'next/server';
import { loadUsers, HubUser } from './userData';

/**
 * Server-side auth check. Reads x-user-id header, loads user from Blob.
 * Returns the user if found and valid, or a 401 NextResponse.
 */
export async function requireLogin(
  req: NextRequest,
  requiredRole?: 'super-admin',
): Promise<HubUser | NextResponse> {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const users = await loadUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }

  if (requiredRole && user.role !== requiredRole) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  return user;
}
