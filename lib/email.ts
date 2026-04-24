import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  tempPassword: string,
): Promise<void> {
  await getResend().emails.send({
    from: 'iRam Hub <noreply@outerjoin.co.za>',
    to,
    subject: 'iRam Hub — Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #7CC042; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">iRam Hub</h1>
        </div>
        <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${userName},</p>
          <p>Your temporary password is:</p>
          <p style="font-size: 20px; font-weight: bold; background: #f3fae9; padding: 12px; border-radius: 6px; text-align: center; letter-spacing: 2px;">
            ${tempPassword}
          </p>
          <p>Use this to log in. You&rsquo;ll be asked to set a new password immediately.</p>
          <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
            If you didn&rsquo;t request this reset, you can ignore this email.
          </p>
        </div>
      </div>
    `,
  });
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
