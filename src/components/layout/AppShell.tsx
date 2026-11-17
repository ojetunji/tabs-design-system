'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { sounds } from '@/lib/sounds';

const getSoundEnabled = () => !sounds.isMuted();
const getSoundEnabledOnServer = () => true;

/**
 * The page sits on Tabs' soft grey. The sidebar rests directly on it and the
 * content lives in one white rounded panel, the same well-and-card relationship
 * the product uses for its screens.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  // Desktop: the sidebar collapses to an icon rail. Below `lg`: it slides over the page.
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // The page scrolls inside <main>, so the router cannot reset it. Start every page at the top.
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  const soundEnabled = useSyncExternalStore(sounds.subscribe, getSoundEnabled, getSoundEnabledOnServer);

  const toggleSound = () => {
    if (soundEnabled) {
      sounds.playClick(); // last click before muting
      sounds.setMuted(true);
    } else {
      sounds.setMuted(false);
      sounds.playClick();
    }
  };

  return (
    <div className="flex h-screen w-full gap-2 overflow-hidden p-2 lg:gap-3 lg:p-3">
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => {
            setIsCollapsed((v) => !v);
            sounds.playToggle();
          }}
        />
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative h-full w-[264px] bg-surface-subtle px-3 shadow-xl">
            <Sidebar onNavigate={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-line bg-surface lg:rounded-[28px]">
        <Header
          onOpenMenu={() => {
            setIsMobileOpen(true);
            sounds.playToggle();
          }}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[960px] px-5 pb-24 pt-8 sm:px-10 sm:pt-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
