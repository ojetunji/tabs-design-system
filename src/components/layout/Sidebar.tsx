'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { homeItem, sections, latestAddition, formatRegistryDate } from '@/lib/registry';

function NavLink({
  name,
  href,
  icon: ItemIcon,
  isActive,
  isCollapsed,
}: {
  name: string;
  href: string;
  icon: Icon;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
        isActive
          ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-semibold'
          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
      }`}
      title={isCollapsed ? name : undefined}
    >
      <ItemIcon size={18} className="shrink-0" />
      {!isCollapsed && <span className="truncate">{name}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

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
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links (Scrollable) */}
      <nav aria-label="Design system" className="flex-1 overflow-y-auto scroll-fade p-3 flex flex-col gap-6">
        <NavLink {...homeItem} isActive={pathname === homeItem.href} isCollapsed={isCollapsed} />

        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                {section.title}
              </span>
            )}
            <div className="flex flex-col gap-0.5 mt-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                  isActive={pathname === item.href}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer: author + date of the most recent addition to the system */}
      {!isCollapsed && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
          <div>
            ©{' '}
            <a
              href="https://damiojetunji.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-900 dark:hover:text-white transition text-xs font-medium"
            >
              Dami Ojetunji
            </a>
          </div>
          <Link
            href={latestAddition.href}
            className="text-right leading-tight hover:text-zinc-900 dark:hover:text-white transition"
            title={`Latest addition: ${latestAddition.name}`}
          >
            <span className="block text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Last added</span>
            <time dateTime={latestAddition.addedOn} className="text-xs font-medium">
              {formatRegistryDate(latestAddition.addedOn)}
            </time>
          </Link>
        </div>
      )}
    </aside>
  );
}
