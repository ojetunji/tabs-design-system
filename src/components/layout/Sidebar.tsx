'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretDown, SidebarSimple } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { childrenOf, homeItem, sections, type RegistryItem } from '@/lib/registry';

/** The Tabs mark: the blue folder tab from the product's header. */
export function TabsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 94.08 64.35" className={className} aria-hidden="true">
      <path
        fill="var(--tabs-brand)"
        d="M92.35,12.2h-15.42c-1.37,0-2.49-1.11-2.49-2.49V1.73c0-.95-.77-1.73-1.73-1.73H1.73C.77,0,0,.77,0,1.73V62.62c0,.95,.77,1.73,1.73,1.73H92.35c.95,0,1.73-.77,1.73-1.73V13.93c0-.95-.77-1.73-1.73-1.73Z"
      />
    </svg>
  );
}

const rowBase =
  'flex h-9 items-center gap-2.5 overflow-hidden rounded-full px-[9.5px] text-sm whitespace-nowrap transition-[color,background-color,width] duration-200 ease-out';
// The active item is the white pill from the Tabs segmented control.
const rowActive = 'bg-surface font-medium text-fg shadow-sm';
const rowIdle = 'text-fg-secondary hover:bg-fill hover:text-fg';

interface NavItemProps {
  item: { name: string; href: string; icon: Icon };
  pathname: string;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

function NavItem({ item, pathname, isCollapsed, onNavigate }: NavItemProps) {
  const children = childrenOf(item.href);
  const hasChildren = children.length > 0;
  // A sub-page (a colour, a dropdown variant) keeps its parent marked as the current section.
  const isWithin = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const [isToggledOpen, setIsToggledOpen] = useState(false);
  const isOpen = hasChildren && !isCollapsed && (isWithin || isToggledOpen);
  // With children, the parent row is a heading for them: the child carries the white pill.
  const isActive = hasChildren ? isWithin && isCollapsed : isWithin;
  const ItemIcon = item.icon;

  return (
    <div className="flex flex-col">
      <div className="relative flex items-center">
        <Link
          // A parent opens its first child, so there is always a page to land on.
          href={hasChildren ? children[0].href : item.href}
          onClick={onNavigate}
          aria-current={isActive ? 'page' : undefined}
          title={isCollapsed ? item.name : undefined}
          className={`${rowBase} ${isCollapsed ? 'w-9' : 'w-full'} ${
            isActive ? rowActive : hasChildren && isWithin ? 'font-medium text-fg hover:bg-fill' : rowIdle
          }`}
        >
          <ItemIcon size={17} weight={isWithin ? 'fill' : 'regular'} className="shrink-0" />
          <span className={`truncate transition-opacity duration-150 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            {item.name}
          </span>
        </Link>
        {hasChildren && !isCollapsed && (
          <button
            type="button"
            onClick={() => setIsToggledOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Hide' : 'Show'} ${item.name} pages`}
            // While you are on one of its pages the group stays open, so the caret has nothing to close.
            disabled={isWithin}
            className="absolute right-1 flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors not-disabled:hover:bg-fill not-disabled:hover:text-fg not-disabled:cursor-pointer"
          >
            <CaretDown size={13} weight="bold" className={`transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {hasChildren && (
        // Grid rows animate from 0fr to 1fr, so the list opens to its real height without measuring.
        <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden" inert={!isOpen}>
            <div className="ml-[17px] mt-0.5 flex flex-col gap-0.5 border-l border-line pl-2.5">
              {children.map((child: RegistryItem) => {
                const isChildActive = pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    aria-current={isChildActive ? 'page' : undefined}
                    className={`flex h-8 items-center rounded-full px-3 text-sm whitespace-nowrap transition-colors ${
                      isChildActive ? rowActive : rowIdle
                    }`}
                  >
                    {child.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const groups = [
  { title: 'Start', items: [{ name: 'Introduction', href: homeItem.href, icon: homeItem.icon }] },
  ...sections,
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggle, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full shrink-0 flex-col gap-6 overflow-x-hidden overflow-y-auto py-3 transition-[width,padding] duration-200 ease-out ${
        isCollapsed ? 'w-[52px] px-2' : 'w-[240px] px-4'
      }`}
    >
      {/* The logo stays put in both states; only the wordmark and the toggle's place change. */}
      <div className={`flex ${isCollapsed ? 'flex-col items-center gap-2' : 'h-9 items-center justify-between'}`}>
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="Tabs Design System home"
          className={`flex h-9 items-center gap-2.5 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-9 justify-center' : 'pl-2'}`}
        >
          <TabsLogo className="h-[18px] w-auto shrink-0" />
          {!isCollapsed && (
            <span className="font-display text-[19px] leading-none tracking-[-0.02em] text-fg">Design System</span>
          )}
        </Link>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fill hover:text-fg cursor-pointer"
          >
            <SidebarSimple size={17} />
          </button>
        )}
      </div>

      <nav aria-label="Design system" className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-0.5">
            <span
              className={`h-6 overflow-hidden whitespace-nowrap px-2.5 text-xs text-fg-muted transition-opacity duration-150 ${
                isCollapsed ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {group.title}
            </span>
            {group.items.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} isCollapsed={isCollapsed} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="mt-auto whitespace-nowrap px-2.5 pb-1 text-xs text-fg-muted">
          Built by{' '}
          <a
            href="https://damiojetunji.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-fg-secondary underline underline-offset-2 hover:text-fg"
          >
            Dami Ojetunji
          </a>
        </div>
      )}
    </aside>
  );
}
