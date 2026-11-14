'use client';

import { useLayoutEffect, useState, useSyncExternalStore } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import CustomizerPanel from '@/components/layout/CustomizerPanel';
import CodeDrawer from '@/components/layout/CodeDrawer';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { applyTheme, getIsDark, getIsDarkOnServer, resolveTheme, subscribeToTheme } from '@/lib/theme';

const getSoundEnabled = () => !sounds.isMuted();
const getSoundEnabledOnServer = () => true;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showGrid, setShowGrid] = useState(true);

  const {
    inspectorContent,
    customControls,
    codeSnippet,
    componentTitle,
    componentCategory,
    isCodeDrawerOpen,
    setIsCodeDrawerOpen,
  } = useDesignSystem();

  const isDarkMode = useSyncExternalStore(subscribeToTheme, getIsDark, getIsDarkOnServer);
  const soundEnabled = useSyncExternalStore(sounds.subscribe, getSoundEnabled, getSoundEnabledOnServer);

  // The inline <head> script sets the theme before paint. In development, React's
  // Strict Mode remount resets <html> attributes, so re-apply it here (no-op in prod).
  useLayoutEffect(() => {
    applyTheme(resolveTheme());
  }, []);

  const toggleTheme = () => {
    applyTheme(isDarkMode ? 'light' : 'dark', true);
    sounds.playToggle();
  };

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
    <div className="flex h-screen w-full overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-[#f7f7f7] dark:bg-zinc-950">
        <Header
          onToggleCodeSheet={() => setIsCodeDrawerOpen(!isCodeDrawerOpen)}
          isCodeSheetOpen={isCodeDrawerOpen}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        <main
          className={`flex-1 overflow-y-auto relative p-8 md:p-12 transition-all ${
            showGrid
              ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]'
              : ''
          }`}
        >
          <div className="w-full max-w-3xl">{children}</div>
        </main>

        <CodeDrawer
          isOpen={isCodeDrawerOpen}
          onClose={() => setIsCodeDrawerOpen(false)}
          code={typeof codeSnippet === 'string' ? codeSnippet : codeSnippet?.tsx || ''}
          componentTitle={componentTitle}
          componentCategory={componentCategory}
        />
      </div>

      <CustomizerPanel content={inspectorContent}>{customControls}</CustomizerPanel>
    </div>
  );
}
