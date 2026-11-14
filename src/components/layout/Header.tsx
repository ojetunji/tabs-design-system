'use client';

import { useEffect, useState } from 'react';
import {
  MagnifyingGlass,
  Sun,
  Moon,
  SpeakerHigh,
  SpeakerSlash,
  ArrowUpRight,
  Code,
  GithubLogo,
  DotsNine,
} from '@phosphor-icons/react';
import { sounds } from '@/lib/sounds';
import SearchDialog from '@/components/layout/SearchDialog';

interface HeaderProps {
  onToggleCodeSheet?: () => void;
  isCodeSheetOpen?: boolean;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

function ToolbarButton({
  label,
  onClick,
  isActive = false,
  children,
}: {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`p-2 rounded-xl transition cursor-pointer ${
          isActive
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
            : 'hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
        }`}
      >
        {children}
      </button>
      <div
        aria-hidden="true"
        className="absolute top-full mt-1.5 hidden group-hover:flex px-2 py-1 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-50 border border-zinc-700/20"
      >
        {label}
      </div>
    </div>
  );
}

export default function Header({
  onToggleCodeSheet,
  isCodeSheetOpen,
  showGrid = true,
  onToggleGrid,
  soundEnabled = true,
  onToggleSound,
  isDarkMode = true,
  onToggleTheme,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ⌘K / Ctrl+K toggles search from anywhere.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-8 py-3.5 bg-transparent z-20 min-h-[60px] select-none">
        <div className="flex items-center">
          <a
            href="https://github.com/ojetunji/tabs-design-system"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-md text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer group shadow-xs"
          >
            <GithubLogo size={14} weight="regular" className="text-zinc-700 dark:text-zinc-300" />
            <span>Star on GitHub</span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-zinc-500 dark:text-zinc-400"
            />
          </a>
        </div>

        {/* Command toolbar. Theme and sound handlers play their own feedback sound. */}
        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
          <ToolbarButton
            label={isCodeSheetOpen ? 'Hide code' : 'View code'}
            isActive={isCodeSheetOpen}
            onClick={() => {
              onToggleCodeSheet?.();
              sounds.playToggle();
            }}
          >
            <Code size={18} />
          </ToolbarButton>

          <ToolbarButton
            label="Quick search (⌘K)"
            onClick={() => {
              setIsSearchOpen(true);
              sounds.playClick();
            }}
          >
            <MagnifyingGlass size={18} />
          </ToolbarButton>

          <ToolbarButton
            label={showGrid ? 'Grid off' : 'Grid on'}
            onClick={() => {
              onToggleGrid?.();
              sounds.playToggle();
            }}
          >
            <DotsNine size={18} />
          </ToolbarButton>

          <ToolbarButton label={soundEnabled ? 'Mute sound' : 'Sound on'} onClick={() => onToggleSound?.()}>
            {soundEnabled ? <SpeakerHigh size={18} /> : <SpeakerSlash size={18} />}
          </ToolbarButton>

          <ToolbarButton label={isDarkMode ? 'Light mode' : 'Dark mode'} onClick={() => onToggleTheme?.()}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </ToolbarButton>
        </div>
      </header>

      {isSearchOpen && <SearchDialog onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
