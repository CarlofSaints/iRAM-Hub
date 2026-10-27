import { NextRequest, NextResponse, after } from 'next/server';
import { loadUsers } from '@/lib/userData';
import { createResetToken } from '@/lib/resetTokens';
import { sendPasswordResetLinkEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// The link's base is fixed, never the request's Host header (which a caller controls).
const HUB_URL = (process.env.HUB_URL || 'https://iram-hub.vercel.app').replace(/\/+$/, '');

/**
 * Emails a one-time reset link. Changes nothing about the account: the password only
 * changes when the link is used (/api/auth/reset-password). Answers at once, the same
 * way for every email, and does the lookup and email afterwards, so neither the reply
 * nor its timing tells a caller whether the email has an account.
 */
export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  after(async () => {
    try {
      const user = (await loadUsers()).find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) return;
      const token = await createResetToken(user.id);
      await sendPasswordResetLinkEmail(user.email, `${user.name} ${user.surname}`.trim(), `${HUB_URL}/reset-password?token=${token}`);
    } catch (err) {
      console.error('[forgot-password] Error:', err);
    }
  });

  return NextResponse.json({ ok: true });
}
