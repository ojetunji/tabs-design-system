'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const modDate = document.lastModified;
      const formatted = new Date(modDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      setLastUpdated(formatted);
    }
  }, []);

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-6 px-8 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-950">
      <span>
        © 2026 By{' '}
        <a 
          href="https://damiojetunji.com" 
          target="_blank" 
          rel="noreferrer" 
          className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline"
        >
          Dami Ojetunji
        </a>
      </span>
      <span>Last updated: {lastUpdated || 'Loading...'}</span>
    </footer>
  );
}