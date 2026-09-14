'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import CustomizerPanel from '@/components/layout/CustomizerPanel';
import CodeDrawer from '@/components/layout/CodeDrawer';
import { DesignSystemProvider, useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';

function AppShell({ children }: { children: React.ReactNode }) {
  const [isCodeSheetOpen, setIsCodeSheetOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { inspectorContent, customControls, codeSnippet, componentTitle, componentCategory } = useDesignSystem();

  // Sync state on mount with actual DOM / localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = stored ? stored === 'dark' : prefersDark;
    
    setIsDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentlyDark = root.classList.contains('dark');
    const nextDark = !currentlyDark;

    setIsDarkMode(nextDark);

    if (nextDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    sounds.playToggle();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setMuted(!next);
    if (next) sounds.playClick();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-[#f7f7f7] dark:bg-zinc-950">
        <Header 
          onToggleCodeSheet={() => setIsCodeSheetOpen(!isCodeSheetOpen)}
          isCodeSheetOpen={isCodeSheetOpen}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        {/* <main 
          className={`flex-1 overflow-y-auto relative flex items-center justify-center p-8 md:p-12 transition-all ${
            showGrid 
              ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]' 
              : ''
          }`}
        >
          <div className="w-full max-w-3xl flex items-center justify-center">
            {children}
          </div>
        </main> */}

        <main 
          className={`flex-1 overflow-y-auto relative p-8 md:p-12 transition-all ${
            showGrid 
              ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]' 
              : ''
          }`}
        >
          <div className="w-full max-w-3xl">
            {children}
          </div>
        </main>

        <CodeDrawer 
          isOpen={isCodeSheetOpen}
          onClose={() => setIsCodeSheetOpen(false)}
          code={typeof codeSnippet === 'string' ? codeSnippet : codeSnippet?.tsx || ''}
          componentTitle={componentTitle}       // <-- Dynamic title from context
          componentCategory={componentCategory} // <-- Dynamic variant/token from context
        />
      </div>

      <CustomizerPanel 
        isVisible={isInspectorOpen}
        content={inspectorContent}
      >
        {customControls}
      </CustomizerPanel>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-hidden">
        <DesignSystemProvider>
          <AppShell>{children}</AppShell>
        </DesignSystemProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}