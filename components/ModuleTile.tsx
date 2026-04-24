'use client';

import type { Module } from '@/lib/modules';
import ModuleIcon from './ModuleIcon';

interface Props {
  module: Module;
  hasAccess: boolean;
}

export default function ModuleTile({ module, hasAccess }: Props) {
  const comingSoon = !module.url;
  const locked = !hasAccess;

  return (
    <div
      className={`rounded-xl shadow-sm border flex flex-col transition-shadow ${
        locked
          ? 'bg-gray-50 border-gray-200 opacity-70'
          : 'bg-white border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <ModuleIcon slug={module.slug} locked={locked} />
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-lg leading-tight ${locked ? 'text-gray-400' : 'text-gray-900'}`}>
              {module.name}
            </h3>
          </div>
        </div>
        <p className={`text-sm flex-1 ${locked ? 'text-gray-400' : 'text-gray-500'}`}>
          {module.description}
        </p>

        {locked && (
          <div className="mt-3 flex items-start gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs text-gray-500 leading-snug">
              You do not have access to this tool. If you want access, speak to your manager.
            </p>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        {comingSoon ? (
          <button
            disabled
            className="w-full py-2.5 rounded-lg text-sm font-bold bg-gray-200 text-gray-400 cursor-not-allowed"
          >
            Coming Soon
          </button>
        ) : locked ? (
          <button
            disabled
            className="w-full py-2.5 rounded-lg text-sm font-bold bg-gray-200 text-gray-400 cursor-not-allowed"
          >
            Locked
          </button>
        ) : (
          <button
            onClick={() => window.open(module.url, '_blank')}
            className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors hover:brightness-110"
            style={{ backgroundColor: module.color }}
          >
            Open
          </button>
        )}
      </div>
    </div>
  );
}
