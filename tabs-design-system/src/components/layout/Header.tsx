'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlass, 
  Sun, 
  Moon, 
  SpeakerHigh, 
  SpeakerSlash, 
  ArrowUpRight,
  Code,
  X,
  TextT,
  Palette,
  CursorClick,
  Textbox,
  CaretDown,
  UploadSimple,
  CheckCircle,
  DotsNine
} from '@phosphor-icons/react';
import { sounds } from '@/lib/sounds';

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

const searchableItems = [
  { name: 'Typography', category: 'Foundations', href: '/foundations/typography', icon: TextT },
  { name: 'Color & Tokens', category: 'Foundations', href: '/foundations/colors', icon: Palette },
  { name: 'Buttons', category: 'Components', href: '/components/buttons', icon: CursorClick },
  { name: 'Input Fields', category: 'Components', href: '/components/inputs', icon: Textbox },
  { name: 'Multi-Select', category: 'Components', href: '/components/dropdowns', icon: CheckCircle },
  // { name: 'File Upload', category: 'Components', href: '/components/file-upload', icon: UploadSimple },
];

export default function Header({ 
  onToggleCodeSheet, 
  isCodeSheetOpen,
  showGrid = true,
  onToggleGrid,
  soundEnabled = true,
  onToggleSound,
  isDarkMode = true,
  onToggleTheme
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const filteredItems = searchQuery.trim() === '' 
    ? searchableItems 
    : searchableItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelectRoute = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(href);
  };

  return (
    <>
      <header className="flex items-center justify-between px-8 py-3.5 bg-transparent z-20 min-h-[60px] select-none">
        
        {/* Left Side: Star on GitHub link */}
        <div className="flex items-center">
          <a
            href="https://github.com/ojetunji/tabs-design-system"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer group"
          >
            <span>Star on GitHub</span>
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Right Side: Command Toolbar Icons */}
        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
          
          {/* Code Sheet Toggle */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => {
                onToggleCodeSheet?.();
                sounds.playToggle();
              }}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isCodeSheetOpen 
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                  : 'hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Code size={18} />
            </button>
            <div className="absolute top-full mt-1.5 hidden group-hover:flex px-2 py-1 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-50 border border-zinc-700/20">
              {isCodeSheetOpen ? 'Hide code' : 'View code'}
            </div>
          </div>

          {/* Search Trigger */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => {
                setIsSearchOpen(true);
                sounds.playClick();
              }}
              className="p-2 rounded-xl hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer"
            >
              <MagnifyingGlass size={18} />
            </button>
            <div className="absolute top-full mt-1.5 hidden group-hover:flex px-2 py-1 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-50 border border-zinc-700/20">
              Quick search
            </div>
          </div>

          {/* Grid Toggle */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => {
                onToggleGrid?.();
                sounds.playToggle();
              }}
              className="p-2 rounded-xl hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer"
            >
              <DotsNine size={18} />
            </button>
            <div className="absolute top-full mt-1.5 hidden group-hover:flex px-2 py-1 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-50 border border-zinc-700/20">
              {showGrid ? 'Grid off' : 'Grid on'}
            </div>
          </div>

          {/* Sound / Haptics Toggle */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => {
                onToggleSound?.();
                sounds.playClick();
              }}
              className="p-2 rounded-xl hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer"
            >
              {soundEnabled ? <SpeakerHigh size={18} /> : <SpeakerSlash size={18} />}
            </button>
            <div className="absolute top-full mt-1.5 hidden group-hover:flex px-2 py-1 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-50 border border-zinc-700/20">
              {soundEnabled ? 'Mute sound' : 'Sound on'}
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => {
                onToggleTheme?.();
                sounds.playToggle();
              }}
              className="p-2 rounded-xl hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="absolute top-full mt-1.5 hidden group-hover:flex px-2 py-1 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-50 border border-zinc-700/20">
              {isDarkMode ? 'Light mode' : 'Dark mode'}
            </div>
          </div>

        </div>

      </header>

      {/* Dynamic Search Modal Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-fadeIn"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 gap-3">
              <MagnifyingGlass size={18} className="text-zinc-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components, foundations..."
                className="w-full bg-transparent border-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No matching components found.
                </div>
              ) : (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleSelectRoute(item.href)}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-white dark:group-hover:bg-zinc-700 transition">
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition">
                        Jump to
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Use arrow keys or click to navigate</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}