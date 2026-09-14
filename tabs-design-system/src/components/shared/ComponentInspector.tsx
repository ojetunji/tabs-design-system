'use client';
import { useState, ReactNode } from 'react';
import { Copy, Check } from '@phosphor-icons/react';

interface ComponentInspectorProps {
  title: string;
  description: string;
  preview: ReactNode;
  controls: ReactNode;
  codeSnippet: string;
}

export default function ComponentInspector({
  title,
  description,
  preview,
  controls,
  codeSnippet,
}: ComponentInspectorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white mb-10">
      
      {/* Header Info */}
      <div className="p-6 border-b border-zinc-200 bg-zinc-50/30">
        <h3 className="text-lg font-semibold text-zinc-900" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
        <p className="text-xs text-zinc-500 mt-1">{description}</p>
      </div>

      {/* Side-by-Side Split: Preview Box + Live Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-zinc-200">
        
        {/* Left/Main: Live Rendered Preview */}
        <div className="lg:col-span-2 p-10 flex items-center justify-center bg-white min-h-[240px] border-b lg:border-b-0 lg:border-r border-zinc-200">
          {preview}
        </div>

        {/* Right: Interactive Controls Side Panel */}
        <div className="p-6 bg-zinc-50/50 flex flex-col gap-4 justify-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Interactive Controls</div>
          {controls}
        </div>

      </div>

      {/* Code Snippet Toolbar */}
      <div className="p-4 bg-zinc-900 text-zinc-200 flex items-center justify-between text-xs">
        <code className="font-mono text-[11px] overflow-x-auto">{codeSnippet}</code>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition font-medium text-[11px] shrink-0"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

    </div>
  );
}