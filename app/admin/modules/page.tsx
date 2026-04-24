'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, authFetch } from '@/lib/useAuth';
import type { Module } from '@/lib/moduleData';
import Image from 'next/image';

const ICON_OPTIONS = [
  { value: '', label: 'Default (generic)' },
  { value: 'callcycle', label: 'Calendar' },
  { value: 'rvl', label: 'Box / Logistics' },
  { value: 'phantom', label: 'Ghost' },
  { value: 'dispo', label: 'Broom / Cleaner' },
  { value: 'pnp-oos', label: 'Shopping Cart' },
];

const emptyForm = (): Omit<Module, 'slug'> & { slug: string } => ({
  slug: '',
  name: '',
  description: '',
  url: '',
  color: '#7CC042',
  icon: '',
  order: 0,
  comingSoon: false,
});

export default function ModulesAdminPage() {
  const { session, loading: authLoading, logout } = useAuth('super-admin');
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Module | null>(null);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchModules = useCallback(async () => {
    try {
      const res = await fetch('/api/modules', { cache: 'no-store' });
      if (res.ok) setModules(await res.json());
    } catch (err) {
      console.error('Failed to load modules:', err);
    } finally {
      setLoadingModules(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  function startEdit(mod: Module) {
    setEditingSlug(mod.slug);
    setEditForm({ ...mod });
    setAdding(false);
    setError('');
  }

  function cancelEdit() {
    setEditingSlug(null);
    setEditForm(null);
  }

  async function saveEdit() {
    if (!editForm || !editingSlug) return;
    setSaving(true);
    setError('');
    try {
      const res = await authFetch(`/api/modules/${editingSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingSlug(null);
        setEditForm(null);
        await fetchModules();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function deleteModule(slug: string) {
    setSaving(true);
    setError('');
    try {
      const res = await authFetch(`/api/modules/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm(null);
        await fetchModules();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.slug || !addForm.name) {
      setError('Slug and name are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await authFetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addForm,
          order: addForm.order || modules.length + 1,
        }),
      });
      if (res.ok) {
        setAdding(false);
        setAddForm(emptyForm());
        await fetchModules();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create');
      }
    } catch {
      setError('Network error');
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
            <a
              href="/admin"
              className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              Users
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
            <h1 className="text-2xl font-bold text-gray-900">Module Management</h1>
            <p className="text-sm text-gray-500 mt-1">Add, edit and remove dashboard modules</p>
          </div>
          {!adding && (
            <button
              onClick={() => { setAdding(true); setEditingSlug(null); setError(''); setAddForm(emptyForm()); }}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-2 px-5 rounded-lg transition-colors text-sm"
            >
              + Add Module
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {/* Add form */}
        {adding && (
          <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">New Module</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Slug *</label>
                <input
                  type="text"
                  value={addForm.slug}
                  onChange={e => setAddForm({ ...addForm, slug: e.target.value })}
                  placeholder="my-module"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Name *</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Module Name"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 uppercase">Description</label>
                <input
                  type="text"
                  value={addForm.description}
                  onChange={e => setAddForm({ ...addForm, description: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">URL</label>
                <input
                  type="text"
                  value={addForm.url}
                  onChange={e => setAddForm({ ...addForm, url: e.target.value })}
                  placeholder="https://..."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={addForm.color}
                    onChange={e => setAddForm({ ...addForm, color: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={addForm.color}
                    onChange={e => setAddForm({ ...addForm, color: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Icon</label>
                <select
                  value={addForm.icon}
                  onChange={e => setAddForm({ ...addForm, icon: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {ICON_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Order</label>
                <input
                  type="number"
                  value={addForm.order || ''}
                  onChange={e => setAddForm({ ...addForm, order: parseInt(e.target.value) || 0 })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  id="add-coming-soon"
                  checked={addForm.comingSoon}
                  onChange={e => setAddForm({ ...addForm, comingSoon: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="add-coming-soon" className="text-sm text-gray-700">Coming Soon</label>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setAdding(false); setError(''); }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 text-white font-bold py-2 px-5 rounded-lg transition-colors text-sm"
              >
                {saving ? 'Creating...' : 'Create Module'}
              </button>
            </div>
          </form>
        )}

        {/* Modules table */}
        {loadingModules ? (
          <div className="text-gray-400 text-sm py-8 text-center">Loading modules...</div>
        ) : modules.length === 0 ? (
          <div className="text-gray-400 text-sm py-8 text-center">No modules found. Run the seed API first.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-10">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">URL</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">Icon</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">Color</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-20">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => (
                  <tr key={mod.slug} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    {editingSlug === mod.slug && editForm ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editForm.order}
                            onChange={e => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                            className="w-12 border border-gray-300 rounded px-1 py-1 text-xs text-center"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs mt-1"
                            placeholder="Description"
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{mod.slug}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.url}
                            onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.icon}
                            onChange={e => setEditForm({ ...editForm, icon: e.target.value })}
                            className="border border-gray-300 rounded px-1 py-1 text-xs"
                          >
                            {ICON_OPTIONS.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="color"
                            value={editForm.color}
                            onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                            className="w-8 h-6 rounded border border-gray-300 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={editForm.comingSoon}
                              onChange={e => setEditForm({ ...editForm, comingSoon: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            <span className="text-xs">Soon</span>
                          </label>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={cancelEdit} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                            <button
                              onClick={saveEdit}
                              disabled={saving}
                              className="text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                            >
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-gray-400">{mod.order}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{mod.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{mod.description}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{mod.slug}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[200px]">
                          {mod.url || <span className="text-gray-300 italic">none</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{mod.icon || 'default'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: mod.color }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {mod.comingSoon ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              Soon
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Live
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(mod)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            {deleteConfirm === mod.slug ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => deleteModule(mod.slug)}
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
                                onClick={() => setDeleteConfirm(mod.slug)}
                                className="text-xs text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    )}
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
