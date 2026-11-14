'use client';

import React, { useState } from 'react';
import { DotsNine, SpeakerHigh, SpeakerSlash, Sun, Moon, Code, Check, Copy } from '@phosphor-icons/react';
import { sounds } from '@/lib/sounds';
import { toast } from 'sonner';

interface ComponentPlaygroundProps {
  title: string;
  description: string;
  previewNode: React.ReactNode;
  inspectorControls: React.ReactNode;
  codeString: string;
}

export default function ComponentPlayground({
  title,
  description,
  previewNode,
  inspectorControls,
  codeString,
}: ComponentPlaygroundProps) {
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    sounds.playSuccess();
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full w-full ${isDark ? 'dark' : ''}`}>
      
      {/* Top Action Header (Integrated into your page header) */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
        </div>

        {/* Header Controls: Code, Grid, Sound, Theme */}
        <div className="flex items-center gap-2">
          {/* Code Drawer Toggle */}
          <button
            onClick={() => {
              setShowCodeDrawer(!showCodeDrawer);
              sounds.playToggle();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              showCodeDrawer
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
            }`}
          >
            <Code size={15} />
            <span>Code</span>
          </button>

          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

          {/* Grid Toggle */}
          <button
            onClick={() => {
              setShowGrid(!showGrid);
              sounds.playToggle();
            }}
            className={`p-2 rounded-lg border text-xs transition cursor-pointer flex items-center gap-1 ${
              showGrid
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
            title="Toggle canvas grid"
          >
            <DotsNine size={16} />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              sounds.setMuted(nextMuted);
              if (!nextMuted) sounds.playClick();
            }}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            title={isMuted ? 'Unmute UI sounds' : 'Mute UI sounds'}
          >
            {isMuted ? <SpeakerSlash size={16} /> : <SpeakerHigh size={16} />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              setIsDark(!isDark);
              sounds.playToggle();
            }}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Center Canvas Stage (Pure Preview with off-white depth and optional dot grid) */}
      <div 
        className={`relative flex-1 min-h-[420px] rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-12 transition-all bg-[#f7f7f7] dark:bg-zinc-900 ${
          showGrid 
            ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]' 
            : ''
        }`}
      >
        <div className="w-full flex items-center justify-center">
          {previewNode}
        </div>
      </div>

      {/* Bottom Code Drawer (Slides up when Code is toggled in header) */}
      {showCodeDrawer && (
        <div className="mt-6 flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg bg-zinc-950 text-zinc-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <span className="font-mono text-xs text-zinc-400">Generated Component Code</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium transition cursor-pointer text-zinc-200"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-6 font-mono text-xs overflow-x-auto text-zinc-300 leading-relaxed">
            <code>{codeString}</code>
          </pre>
        </div>
      )}

    </div>
  );
}