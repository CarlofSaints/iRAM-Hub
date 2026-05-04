'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, authFetch } from '@/lib/useAuth';
import type { Module } from '@/lib/moduleData';
import Image from 'next/image';

interface UserRow {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: 'super-admin' | 'user';
  modules: string[];
  createdAt: string;
  forcePasswordChange?: boolean;
}

export default function AdminPage() {
  const { session, loading: authLoading, logout } = useAuth('super-admin');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editModules, setEditModules] = useState<string[]>([]);
  const [editRole, setEditRole] = useState<'super-admin' | 'user'>('user');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sendingCreds, setSendingCreds] = useState<string | null>(null);
  const [togglingPw, setTogglingPw] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [resetPwId, setResetPwId] = useState<string | null>(null);
  const [resetPwValue, setResetPwValue] = useState('');
  const [resettingPw, setResettingPw] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await authFetch('/api/users', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/modules', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setAllModules(data))
      .catch(err => console.error('Failed to load modules:', err));
  }, []);

  useEffect(() => {
    if (session) fetchUsers();
  }, [session, fetchUsers]);

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  function startEdit(user: UserRow) {
    setEditingId(user.id);
    setEditModules([...user.modules]);
    setEditRole(user.role);
  }

  function toggleModule(slug: string) {
    setEditModules(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await authFetch(`/api/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modules: editModules, role: editRole }),
      });
      if (res.ok) {
        setEditingId(null);
        await fetchUsers();
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(id: string) {
    try {
      const res = await authFetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm(null);
        await fetchUsers();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  async function toggleForcePassword(user: UserRow) {
    setTogglingPw(user.id);
    setActionMsg(null);
    try {
      const newVal = !user.forcePasswordChange;
      const res = await authFetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forcePasswordChange: newVal }),
      });
      if (res.ok) {
        setActionMsg({ id: user.id, text: newVal ? 'Will force PW change' : 'PW change removed', ok: true });
        await fetchUsers();
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setTogglingPw(null);
    }
  }

  async function sendCredentials(user: UserRow) {
    setSendingCreds(user.id);
    setActionMsg(null);
    try {
      const res = await authFetch(`/api/users/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg({ id: user.id, text: 'Credentials emailed!', ok: true });
        await fetchUsers();
      } else {
        setActionMsg({ id: user.id, text: data.error || 'Failed', ok: false });
      }
    } catch (err) {
      console.error('Send credentials failed:', err);
      setActionMsg({ id: user.id, text: 'Network error', ok: false });
    } finally {
      setSendingCreds(null);
    }
  }

  async function resetPassword(userId: string) {
    if (!resetPwValue.trim() || resetPwValue.trim().length < 4) {
      setActionMsg({ id: userId, text: 'Min 4 characters', ok: false });
      return;
    }
    setResettingPw(true);
    setActionMsg(null);
    try {
      const res = await authFetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPwValue.trim() }),
      });
      if (res.ok) {
        setActionMsg({ id: userId, text: 'Password reset!', ok: true });
        setResetPwId(null);
        setResetPwValue('');
        await fetchUsers();
      } else {
        const data = await res.json();
        setActionMsg({ id: userId, text: data.error || 'Failed', ok: false });
      }
    } catch {
      setActionMsg({ id: userId, text: 'Network error', ok: false });
    } finally {
      setResettingPw(false);
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
            <a
              href="/admin/modules"
              className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              Modules
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

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage users and module access</p>
          </div>
          <a
            href="/admin/new"
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-2 px-5 rounded-lg transition-colors text-sm"
          >
            + Add User
          </a>
        </div>

        {loadingUsers ? (
          <div className="text-gray-400 text-sm py-8 text-center">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-gray-400 text-sm py-8 text-center">No users found. Run the seed API first.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Modules</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.name} {user.surname}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      {editingId === user.id ? (
                        <select
                          value={editRole}
                          onChange={e => setEditRole(e.target.value as 'super-admin' | 'user')}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          <option value="super-admin">Super Admin</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'super-admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role === 'super-admin' ? 'Super Admin' : 'User'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === user.id ? (
                        <div className="flex flex-wrap gap-1.5">
                          {allModules.map(m => (
                            <button
                              key={m.slug}
                              onClick={() => toggleModule(m.slug)}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                                editModules.includes(m.slug)
                                  ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-green-800'
                                  : 'bg-gray-50 border-gray-200 text-gray-400'
                              }`}
                            >
                              {m.name}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.modules.map(slug => {
                            const mod = allModules.find(m => m.slug === slug);
                            return (
                              <span
                                key={slug}
                                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary-light)] text-green-800"
                              >
                                {mod?.name ?? slug}
                              </span>
                            );
                          })}
                          {user.modules.length === 0 && (
                            <span className="text-gray-400 text-xs">None</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingId === user.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEdit}
                            disabled={saving}
                            className="text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(user)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            {user.id !== session.id && (
                              <>
                                {deleteConfirm === user.id ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => deleteUser(user.id)}
                                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm(null)}
                                      className="text-xs text-gray-400 hover:text-gray-600"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirm(user.id)}
                                    className="text-xs text-red-500 hover:text-red-700"
                                  >
                                    Delete
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                          {user.id !== session.id && (
                            <>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleForcePassword(user)}
                                  disabled={togglingPw === user.id}
                                  className={`text-xs px-2 py-0.5 rounded-full border transition-colors disabled:opacity-50 ${
                                    user.forcePasswordChange
                                      ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                  }`}
                                  title={user.forcePasswordChange ? 'Click to remove forced PW change' : 'Click to force PW change on next login'}
                                >
                                  {togglingPw === user.id ? '...' : user.forcePasswordChange ? 'Force PW: ON' : 'Force PW'}
                                </button>
                                <button
                                  onClick={() => sendCredentials(user)}
                                  disabled={sendingCreds === user.id}
                                  className="text-xs px-2 py-0.5 rounded-full border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
                                  title="Generate new temp password and email it to the user"
                                >
                                  {sendingCreds === user.id ? 'Sending...' : 'Email Creds'}
                                </button>
                                <button
                                  onClick={() => { setResetPwId(resetPwId === user.id ? null : user.id); setResetPwValue(''); setActionMsg(null); }}
                                  className="text-xs px-2 py-0.5 rounded-full border bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors"
                                  title="Set a custom password for this user"
                                >
                                  Reset PW
                                </button>
                              </div>
                              {resetPwId === user.id && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <input
                                    type="text"
                                    value={resetPwValue}
                                    onChange={e => setResetPwValue(e.target.value)}
                                    placeholder="New password"
                                    className="border border-gray-300 rounded px-2 py-0.5 text-xs w-28"
                                    autoFocus
                                    onKeyDown={e => { if (e.key === 'Enter') resetPassword(user.id); }}
                                  />
                                  <button
                                    onClick={() => resetPassword(user.id)}
                                    disabled={resettingPw}
                                    className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded hover:bg-orange-600 disabled:opacity-50"
                                  >
                                    {resettingPw ? '...' : 'Set'}
                                  </button>
                                  <button
                                    onClick={() => { setResetPwId(null); setResetPwValue(''); }}
                                    className="text-xs text-gray-400 hover:text-gray-600"
                                  >
                                    X
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                          {actionMsg && actionMsg.id === user.id && (
                            <span className={`text-xs ${actionMsg.ok ? 'text-green-600' : 'text-red-600'}`}>
                              {actionMsg.text}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
