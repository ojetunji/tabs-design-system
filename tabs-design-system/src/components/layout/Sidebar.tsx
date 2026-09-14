'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  List, 
  Cube, 
  Compass, 
  BookOpen, 
  Palette, 
  TextT, 
  SquaresFour, 
  CaretLeft, 
  CaretRight,
  CursorClick,
  Textbox,
  CaretDown,
  HouseLine,
  CheckCircle,
  UploadSimple
} from '@phosphor-icons/react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navSections = [

    // Standalone top-level item without a section title header
  {
    title: null, // or omit the title property if your sidebar maps it conditionally
    items: [
      { name: 'Home', href: '/', icon: HouseLine },
    ],
  },
    {
      title: 'Foundations',
      items: [
        { name: 'Typography', href: '/foundations/typography', icon: TextT },
        // { name: 'Color & Tokens', href: '/foundations/colors', icon: Palette },
      ],
    },
    {
      title: 'Components',
      items: [
      { name: 'Buttons', href: '/components/buttons', icon: CursorClick },
      { name: 'Input Fields', href: '/components/input', icon: Textbox },
      { name: 'Multi-Select', href: '/components/dropdowns', icon: CheckCircle },
      // { name: 'File Upload', href: '/components/file-upload', icon: UploadSimple },
      ],
    },
  ];

  return (
    <aside 
      className={`relative flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } h-screen select-none`}
    >
      {/* Sidebar Header / Brand */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 min-h-[65px]">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white truncate">
              Tabs / Design System
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition cursor-pointer ml-auto"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto scroll-fade p-3 flex flex-col gap-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                {section.title}
              </span>
            )}
            <div className="flex flex-col gap-0.5 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      isActive 
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-semibold' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer
      {!isCollapsed && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center justify-between">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Editorial Edition</span>
            <span className="font-mono text-[10px]">v1.2.0</span>
          </div>
          <div className="text-[11px] pt-1">
            © 2026{' '}
            <a 
              href="https://damiojetunji.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-zinc-900 dark:hover:text-white transition"
            >
              dami ojetunji
            </a>
          </div> */}
          {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div>
            © {' '}
            <a 
              href="https://damiojetunji.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-zinc-900 dark:hover:text-white transition text-xs font-medium"
            >
              Dami Ojetunji
            </a>
          </div>
          <span className="text-xs font-medium">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      )}
    </aside>
  );
}