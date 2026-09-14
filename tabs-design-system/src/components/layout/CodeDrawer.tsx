'use client';

import { useState } from 'react';
import { X, Copy, Check, TextT } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { sounds } from '@/lib/sounds';

interface CodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  componentTitle?: string;
  componentCategory?: string;
}

export default function CodeDrawer({ 
  isOpen, 
  onClose, 
  code,
  componentTitle = 'Component',
  componentCategory = 'Default'
}: CodeDrawerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code || '');
    setCopied(true);
    sounds.playClick();
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-300 flex flex-col max-h-[45vh]">
      
      {/* Compact Drawer Header Toolbar */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40 select-none">
        
        {/* Left Side: Dynamic Component Badge + Category Type Text */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[11px] font-semibold">
            <TextT size={13} className="text-zinc-500 dark:text-zinc-400" />
            <span>{componentTitle}</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium tracking-tight">
            {componentCategory}
          </span>
        </div>

        {/* Right Side: Standalone Copy & Close Icons with Tooltips */}
        <div className="flex items-center gap-2">
          
          {/* Standalone Copy Icon with Tooltip */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <div className="absolute bottom-full mb-1.5 hidden group-hover:flex px-2 py-1 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-50 border border-zinc-700/20">
              {copied ? 'Copied!' : 'Copy code'}
            </div>
          </div>

          {/* Standalone Close Icon with Tooltip */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => {
                onClose();
                sounds.playToggle();
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-full mb-1.5 hidden group-hover:flex px-2 py-1 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-50 border border-zinc-700/20">
              Close drawer
            </div>
          </div>

        </div>

      </div>

      {/* Code Display Area */}
      <div className="p-6 overflow-y-auto font-mono text-xs text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 selection:bg-zinc-200 dark:selection:bg-zinc-800">
        <pre className="whitespace-pre-wrap leading-relaxed">
          <code>{code || '// No code snippet available'}</code>
        </pre>
      </div>

    </div>
  );
}