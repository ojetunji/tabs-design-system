'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, MagnifyingGlass, Palette, SquaresFour, ToggleRight } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { buttonClass } from '@/app/components/buttons/Button';
import { childrenOf, registry, type RegistrySection } from '@/lib/registry';
import { sounds } from '@/lib/sounds';

type Scope = 'All' | RegistrySection;

const SCOPES: { id: Scope; icon: Icon }[] = [
  { id: 'All', icon: SquaresFour },
  { id: 'Foundations', icon: Palette },
  { id: 'Components', icon: ToggleRight },
];

// A group such as Dropdown only redirects to its first page, so search lists its pages instead.
const PAGES = registry.filter((item) => childrenOf(item.href).length === 0);
const parentName = (href?: string) => registry.find((item) => item.href === href)?.name;

/**
 * Search, laid out like the search modal in Tabs: a soft field, a row of
 * scope chips, results with an icon tile, and a request row at the bottom.
 */
export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  const normalized = query.trim().toLowerCase();
  const results = PAGES.filter(
    (item) =>
      (scope === 'All' || item.section === scope) &&
      (!normalized ||
        item.name.toLowerCase().includes(normalized) ||
        item.section.toLowerCase().includes(normalized) ||
        parentName(item.parent)?.toLowerCase().includes(normalized)),
  );
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
        // Enter on a chip or the request link should act on that control, not open a result.
        if (document.activeElement !== inputRef.current) break;
        e.preventDefault();
        if (results[safeIndex]) select(results[safeIndex].href);
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab': {
        // Trap focus inside the dialog.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('input, button, a[href]');
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-white/40 px-4 pt-[12vh] backdrop-blur-md"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the design system"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[640px] flex-col gap-5 rounded-[24px] bg-surface p-4 shadow-xl"
      >
        <label className="flex items-center gap-3 rounded-[16px] border-[0.5px] border-surface-hover bg-surface-subtle px-5 py-3">
          <MagnifyingGlass size={20} className="shrink-0 text-fg" aria-hidden="true" />
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
            placeholder="Try searching “Button”"
            className="type-label-small w-full bg-transparent text-fg placeholder:text-fg-subtle focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-4">
          <div role="group" aria-label="Search in" className="flex flex-wrap items-center justify-center gap-3 border-b border-surface-hover pb-3">
            {SCOPES.map(({ id, icon: ScopeIcon }) => {
              const isSelected = scope === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setScope(id);
                    setActiveIndex(0);
                    sounds.playClick();
                  }}
                  className={`type-label-x-small flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-fg transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-tabs-blue-50 bg-tabs-blue-25'
                      : 'border-transparent bg-surface-subtle hover:bg-surface-raised'
                  }`}
                >
                  <ScopeIcon size={16} aria-hidden="true" />
                  {id}
                </button>
              );
            })}
          </div>

          <div id={listboxId} role="listbox" aria-label="Results" className="flex max-h-[320px] flex-col gap-2 overflow-y-auto">
            {results.length === 0 ? (
              <div className="py-8 text-center text-sm text-fg-muted">Nothing matches &ldquo;{query}&rdquo;.</div>
            ) : (
              results.map((item, index) => {
                const ItemIcon = item.icon;
                const isActive = index === safeIndex;
                const parent = parentName(item.parent);
                return (
                  <div
                    key={item.href}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => select(item.href)}
                    className={`flex items-center gap-3 rounded-[12px] border p-2.5 cursor-pointer ${
                      isActive ? 'border-surface-raised bg-surface-subtle' : 'border-transparent'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-fg-secondary ${
                        isActive ? 'bg-surface' : 'bg-surface-subtle'
                      }`}
                    >
                      <ItemIcon size={18} aria-hidden="true" />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="type-heading-4 text-fg-secondary">{item.name}</span>
                      <span className="type-body-5 text-night-600">{parent ? `${item.section} · ${parent}` : item.section}</span>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-surface-hover px-2.5 pt-3">
          <span className="type-label-small flex items-center gap-3 text-fg">
            <Lightbulb size={24} aria-hidden="true" />
            Can&rsquo;t find what you&rsquo;re looking for?
          </span>
          <a
            href="https://github.com/ojetunji/tabs-design-system/issues/new"
            target="_blank"
            rel="noreferrer"
            className={buttonClass('secondary', 'sm')}
          >
            Request it
          </a>
        </div>
      </div>
    </div>
  );
}
