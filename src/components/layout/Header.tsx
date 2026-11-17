'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GithubLogo, GlobeSimple, List, MagnifyingGlass, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { registry } from '@/lib/registry';
import { sounds } from '@/lib/sounds';
import SearchDialog from '@/components/layout/SearchDialog';
import { colorBySlug } from '@/app/foundations/colors/data';

interface HeaderProps {
  onOpenMenu: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const iconButton =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-fill hover:text-fg cursor-pointer';

/** Breadcrumb trail for the current page: [{ label, href? }]. The last item is the page itself. */
function useCrumbs() {
  const pathname = usePathname();
  if (pathname === '/') return [{ label: 'Start' }, { label: 'Introduction' }];
  if (pathname === '/changelog') return [{ label: 'Start' }, { label: 'Changelog' }];

  const page = registry.find((item) => item.href === pathname);
  if (page) {
    const parentPage = page.parent ? registry.find((item) => item.href === page.parent) : undefined;
    return [{ label: page.section }, ...(parentPage ? [{ label: parentPage.name }] : []), { label: page.name }];
  }

  // A colour's own page: Foundations / Colour / <name>
  const parent = registry.find((item) => pathname.startsWith(`${item.href}/`));
  if (parent) {
    const slug = pathname.slice(parent.href.length + 1);
    return [{ label: parent.section }, { label: parent.name, href: parent.href }, { label: colorBySlug(slug)?.name ?? slug }];
  }
  return [{ label: 'Tabs Design System' }];
}

export default function Header({ onOpenMenu, soundEnabled, onToggleSound }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const crumbs = useCrumbs();

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
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 sm:px-5">
        <button type="button" onClick={onOpenMenu} aria-label="Open menu" className={`${iconButton} lg:hidden`}>
          <List size={18} />
        </button>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={crumb.label} className={`items-center gap-2 ${isLast ? 'flex min-w-0' : 'hidden sm:flex'}`}>
                {crumb.href ? (
                  <Link href={crumb.href} className="text-fg-muted transition-colors hover:text-fg">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'truncate font-medium text-fg' : 'text-fg-muted'}>{crumb.label}</span>
                )}
                {!isLast && <span className="text-fg-subtle">/</span>}
              </span>
            );
          })}
        </nav>

        {/* Search field, styled like the one in the Tabs header. */}
        <button
          type="button"
          onClick={() => {
            setIsSearchOpen(true);
            sounds.playClick();
          }}
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-surface-raised text-sm text-fg-muted transition-colors hover:bg-surface-hover cursor-pointer sm:w-[260px] sm:justify-start sm:px-3.5"
          aria-label="Search the design system"
        >
          <MagnifyingGlass size={16} className="shrink-0 text-fg-secondary" />
          <span className="hidden sm:inline">Try searching &ldquo;Button&rdquo;&hellip;</span>
          <kbd className="ml-auto hidden font-sans text-xs text-fg-subtle sm:inline">⌘K</kbd>
        </button>

        {/* Kept as one tight group so the three read as a set beside the search field. */}
        <div className="flex items-center">
        <a
          href="https://jointabs.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit Tabs"
          title="Visit Tabs"
          className={iconButton}
        >
          <GlobeSimple size={18} />
        </a>

        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute interface sounds' : 'Turn on interface sounds'}
          aria-pressed={soundEnabled}
          title={soundEnabled ? 'Mute sounds' : 'Turn on sounds'}
          className={iconButton}
        >
          {soundEnabled ? <SpeakerHigh size={18} /> : <SpeakerSlash size={18} />}
        </button>

        <a
          href="https://github.com/ojetunji/tabs-design-system"
          target="_blank"
          rel="noreferrer"
          aria-label="View the source on GitHub"
          title="Source on GitHub"
          className={iconButton}
        >
          <GithubLogo size={18} />
        </a>
        </div>
      </header>

      {isSearchOpen && <SearchDialog onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
