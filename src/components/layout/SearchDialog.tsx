'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { registry } from '@/lib/registry';
import { sounds } from '@/lib/sounds';

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? registry.filter(
        (item) => item.name.toLowerCase().includes(normalized) || item.section.toLowerCase().includes(normalized),
      )
    : registry;
  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));

  // Focus the input on open; return focus to whatever opened the dialog on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);

  // Keep the active option visible while arrowing through a long list.
  useEffect(() => {
    document.getElementById(optionId(safeIndex))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex]);

  const select = (href: string) => {
    sounds.playClick();
    onClose();
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (results.length) setActiveIndex((safeIndex + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (results.length) setActiveIndex((safeIndex - 1 + results.length) % results.length);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(Math.max(results.length - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[safeIndex]) select(results[safeIndex].href);
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab': {
        // Trap focus inside the dialog.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('input, button');
        if (!focusable?.length) break;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        break;
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search components and foundations"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 gap-3">
          <MagnifyingGlass size={18} className="text-zinc-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={results.length ? optionId(safeIndex) : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search components, foundations..."
            className="w-full bg-transparent border-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div id={listboxId} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">No matching components found.</div>
          ) : (
            results.map((item, index) => {
              const ItemIcon = item.icon;
              const isActive = index === safeIndex;
              return (
                <div
                  key={item.href}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => select(item.href)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left transition cursor-pointer ${
                    isActive ? 'bg-zinc-100 dark:bg-zinc-800/80' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 transition ${
                        isActive ? 'bg-white dark:bg-zinc-700' : 'bg-zinc-100 dark:bg-zinc-800'
                      }`}
                    >
                      <ItemIcon size={16} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white">{item.name}</div>
                      <div className="text-[10px] text-zinc-400">{item.section}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono text-zinc-400 transition ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  >
                    Jump to ↵
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-4">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
