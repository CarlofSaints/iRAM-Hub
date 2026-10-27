import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendNewUserEmail(
  to: string,
  userName: string,
  tempPassword: string,
): Promise<void> {
  await getResend().emails.send({
    from: 'iRam Hub <noreply@outerjoin.co.za>',
    to,
    subject: 'Welcome to iRam Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #7CC042; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">iRam Hub</h1>
        </div>
        <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${userName},</p>
          <p>Your iRam Hub account has been created. Use the details below to log in:</p>
          <p><strong>Email:</strong> ${to}</p>
          <p style="font-size: 20px; font-weight: bold; background: #f3fae9; padding: 12px; border-radius: 6px; text-align: center; letter-spacing: 2px;">
            ${tempPassword}
          </p>
          <p>You&rsquo;ll be asked to set a new password on first login.</p>
        </div>
      </div>
    `,
  });
}

const escHtml = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

/** Forgot-password: a one-time link (valid 1 hour). The password is unchanged until it is used. */
export async function sendPasswordResetLinkEmail(to: string, userName: string, link: string): Promise<void> {
  await getResend().emails.send({
    from: 'iRam Hub <noreply@outerjoin.co.za>',
    to,
    subject: 'iRam Hub — Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #7CC042; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">iRam Hub</h1>
        </div>
        <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${escHtml(userName)},</p>
          <p>Someone asked to reset your iRam Hub password. Click below to choose a new one. The link works once, for one hour.</p>
          <p style="text-align: center; margin: 24px 0;">
            <a href="${escHtml(link)}" style="background: #7CC042; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Choose a new password</a>
          </p>
          <p style="color: #6b7280; font-size: 13px;">If you didn&rsquo;t ask for this, ignore this email. Your password has not changed.</p>
        </div>
      </div>
    `,
  });
}
