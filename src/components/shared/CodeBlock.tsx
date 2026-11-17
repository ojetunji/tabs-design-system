'use client';

import { useMemo, useState } from 'react';
import { Check, Copy } from '@phosphor-icons/react';
import { Button } from '@/app/components/buttons/Button';
import { copyToClipboard } from '@/lib/copy';
import { highlight, type TokenType } from '@/lib/highlight';

// Syntax colours come from the Tabs palette, darkened steps so they read on the grey well.
const TOKEN_CLASS: Record<TokenType, string> = {
  plain: 'text-fg',
  punct: 'text-fg-muted',
  comment: 'text-fg-subtle italic',
  keyword: 'text-tabs-pink-600',
  string: 'text-tabs-green-600',
  tag: 'text-tabs-blue-500',
  attr: 'text-tabs-orange-600',
  number: 'text-tabs-orange-600',
};

/** Code with line numbers and syntax colours, set in JetBrains Mono. */
export default function CodeBlock({ code, className = '' }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => highlight(code), [code]);

  const copy = async () => {
    if (await copyToClipboard(code, 'Code copied to clipboard')) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute right-3 top-3 z-10">
        <Button variant="secondary" size="xs" onClick={copy}>
          {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="h-full overflow-x-auto py-5 pr-24 font-mono text-[13px] leading-6">
        <code className="grid">
          {lines.map((line, i) => (
            <span key={i} className="flex">
              <span aria-hidden="true" className="w-12 shrink-0 select-none pr-4 text-right text-fg-subtle">
                {i + 1}
              </span>
              <span className="whitespace-pre">
                {line.length === 0
                  ? '\n'
                  : line.map((token, j) => (
                      <span key={j} className={TOKEN_CLASS[token.type]}>
                        {token.text}
                      </span>
                    ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
