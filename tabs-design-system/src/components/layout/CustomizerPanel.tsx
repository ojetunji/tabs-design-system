'use client';

import { ReactNode } from 'react';
import { Check } from '@phosphor-icons/react';

export interface PropDef {
  prop: string;
  type: string;
  defaultVal: string;
}

export interface InspectorContent {
  title: string;
  description: string;
  propsList?: PropDef[];
  compositionNotes?: string[];
}

interface CustomizerPanelProps {
  content?: InspectorContent;
  isVisible?: boolean;
  children?: ReactNode;
}

export default function CustomizerPanel({
  content = {
    title: 'Overview',
    description: 'Select a component or foundation from the sidebar to inspect its properties.',
    propsList: [],
    compositionNotes: ['Built for Tabs Design System.'],
  },
  isVisible = true,
  children,
}: CustomizerPanelProps) {
  if (!isVisible) return null;

  return (
    <aside className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col h-full overflow-y-auto select-none p-6 gap-6 text-xs">
      
      {/* Dynamic Component Overview Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="font-bold text-sm text-zinc-900 dark:text-white tracking-tight">
          {content.title}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {content.description}
        </p>
      </div>

      {/* Custom Interactive Controls (Typography tier dropdown, input testers, etc.) */}
      {children && (
        <div className="flex flex-col gap-4 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
          {children}
        </div>
      )}

      {/* Prop Types Table (Only rendered if props exist) */}
      {content.propsList && content.propsList.length > 0 && (
        <div className="flex flex-col gap-2.5 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-3 font-semibold text-zinc-400 uppercase text-[10px]">
            <span>Prop</span>
            <span>Type</span>
            <span>Default</span>
          </div>
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/60 border-y border-zinc-100 dark:border-zinc-800/60">
            {content.propsList.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 py-2.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-300 items-center">
                <span className="font-semibold text-zinc-900 dark:text-white truncate">{item.prop}</span>
                <span className="text-zinc-500 truncate">{item.type}</span>
                <span className="text-zinc-400 text-[10px] truncate">{item.defaultVal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Composition Notes */}
      {content.compositionNotes && content.compositionNotes.length > 0 && (
        <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
          <span className="font-medium text-zinc-400 capitalize text-[12px]">
            Composition
          </span>
          <ul className="flex flex-col gap-1.5">
            {content.compositionNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </aside>
  );
}