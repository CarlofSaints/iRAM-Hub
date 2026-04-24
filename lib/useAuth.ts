'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface Session {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: 'super-admin' | 'user';
  modules: string[];
}

const SESSION_KEY = 'hub_session';

/**
 * Client-side auth guard.
 *
 * @param requiredRole  If 'super-admin', user is redirected to /dashboard
 *                      when they don't have that role.
 */
export function useAuth(requiredRole?: 'super-admin') {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      router.replace('/login');
      return;
    }
    try {
      const s: Session = JSON.parse(raw);
      if (requiredRole && s.role !== requiredRole) {
        router.replace('/dashboard');
        return;
      }
      setSession(s);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }, [router, requiredRole]);

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    router.push('/login');
  }

  return { session, loading, logout };
}

/**
 * Patch the current session in localStorage.
 */
export function updateSession(patch: Partial<Session>): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const current = JSON.parse(raw) as Session;
    const next = { ...current, ...patch };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

/**
 * Fetch wrapper that attaches x-user-id from the current session.
 */
export function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  let userId = '';
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<Session>;
        userId = s?.id ?? '';
      }
    } catch { /* ignore */ }
  }

  const headers = new Headers(init.headers);
  if (userId) headers.set('x-user-id', userId);

  return fetch(input, { ...init, headers });
}
