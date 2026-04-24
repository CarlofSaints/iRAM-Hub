'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, authFetch } from '@/lib/useAuth';
import { MODULES } from '@/lib/modules';
import Image from 'next/image';

export default function NewUserPage() {
  const router = useRouter();
  const { session, loading: authLoading, logout } = useAuth('super-admin');

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'super-admin' | 'user'>('user');
  const [modules, setModules] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  function toggleModule(slug: string) {
    setModules(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }

  function selectAll() {
    setModules(MODULES.map(m => m.slug));
  }

  function selectNone() {
    setModules([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await authFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, role, modules }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create user');
        return;
      }

      router.push('/admin');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/iram-hub-logo.png"
              alt="iRam Hub"
              width={140}
              height={40}
              priority
            />
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              Dashboard
            </a>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8">
        <div className="mb-6">
          <a href="/admin" className="text-sm text-gray-500 hover:text-[var(--color-primary)]">&larr; Back to Users</a>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add User</h1>
          <p className="text-sm text-gray-500 mt-1">
            A temporary password will be emailed to the user.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">First Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Surname</label>
              <input
                type="text"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as 'super-admin' | 'user')}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Modules</label>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="text-xs text-[var(--color-primary)] hover:underline">All</button>
                <button type="button" onClick={selectNone} className="text-xs text-gray-400 hover:underline">None</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {MODULES.map(m => (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => toggleModule(m.slug)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    modules.includes(m.slug)
                      ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <a
              href="/admin"
              className="flex-1 text-center px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
            >
              {saving ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
