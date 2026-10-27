'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-gray-400 text-sm">Loading...</div></div>}>
      <ResetForm />
    </Suspense>
  );
}

/** Opened from the emailed reset link: choose a new password, then sign in with it. */
function ResetForm() {
  const token = useSearchParams().get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || 'Could not reset the password'); return; }
      setDone(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-[var(--color-charcoal)] rounded-t-xl px-8 py-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <Image src="/images/iram-hub-logo-dark.png" alt="iRam Hub" width={200} height={60} priority />
          </div>
          <p className="text-sm font-medium mt-1">Choose a New Password</p>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg px-8 py-8 flex flex-col gap-5">
          {!token ? (
            <p className="text-sm text-gray-600">This page needs the link from your reset email. Ask for a new one from the login page.</p>
          ) : done ? (
            <>
              <p className="text-sm text-gray-600">Your password has been changed. Sign in with your new password.</p>
              <a href="/login" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-2.5 rounded-lg transition-colors text-sm text-center">Go to Login</a>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">New Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    required autoFocus minLength={8} className={`${input} pr-14`} placeholder="At least 8 characters" />
                  <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confirm Password</label>
                <input type={showPw ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  required minLength={8} className={input} placeholder="Type it again" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}
              <button type="submit" disabled={loading}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors text-sm tracking-wide">
                {loading ? 'Saving...' : 'Set New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
