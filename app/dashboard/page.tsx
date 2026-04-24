'use client';

import { useAuth } from '@/lib/useAuth';
import { MODULES } from '@/lib/modules';
import ModuleTile from '@/components/ModuleTile';
import Image from 'next/image';

export default function DashboardPage() {
  const { session, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/images/iram-background.png')" }}
      />
      <div className="relative z-10">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-3">
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
            {session.role === 'super-admin' && (
              <a
                href="/admin"
                className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                Admin
              </a>
            )}
            <span className="text-sm text-gray-600">
              {session.name} {session.surname}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome, {session.name}</h1>
          <p className="text-sm text-gray-300 mt-1">Select a module to get started</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map(m => {
            const hasAccess = session.role === 'super-admin' || session.modules.includes(m.slug);
            return (
              <ModuleTile key={m.slug} module={m} hasAccess={hasAccess} />
            );
          })}
        </div>
      </main>
      </div>
    </div>
  );
}
