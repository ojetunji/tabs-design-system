'use client';

import React, { useEffect, useState } from 'react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { copyToClipboard } from '@/lib/copy';
import { bestTextOn, formatRgb, rateContrast, type ContrastRating } from '@/lib/color';
import {
  FAMILIES,
  PALETTE_GROUPS,
  SEMANTIC,
  SEMANTIC_GROUPS,
  STEP_COLUMNS,
  parseRef,
  paletteVar,
  resolveSemantic,
  semanticClass,
  semanticContrast,
  semanticVar,
  usedBy,
  type Mode,
} from './tokens';
import { Palette } from '@phosphor-icons/react';

type CopyFormat = 'hex' | 'rgb' | 'var' | 'class';
type Section = 'all' | 'palette' | 'semantic';

const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const RATING_STYLES: Record<ContrastRating, string> = {
  AAA: 'bg-success-50 text-success-950 dark:bg-success-950/50 dark:text-success-400',
  AA: 'bg-success-50 text-success-950 dark:bg-success-950/50 dark:text-success-400',
  'AA Large': 'bg-warning-50 text-warning-950 dark:bg-warning-950/50 dark:text-warning-400',
  Fail: 'bg-error-50 text-error-950 dark:bg-error-950/50 dark:text-error-400',
};

function ContrastBadge({ ratio }: { ratio: number }) {
  const rating = rateContrast(ratio);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap ${RATING_STYLES[rating]}`}
      title={`${ratio.toFixed(2)}:1 (WCAG ${rating})`}
    >
      {ratio.toFixed(1)} <span className="font-sans font-semibold">{rating}</span>
    </span>
  );
}

const STATUS_TAG: Record<string, { label: string; title: string } | undefined> = {
  product: { label: 'In product', title: 'Value taken from what the Tabs platform ships today' },
  provisional: { label: 'Provisional', title: 'Value not yet confirmed by a Figma export' },
  'awaiting-figma': { label: 'Awaiting Figma', title: 'Name exists in Figma; re-export with values to fill it' },
};

export default function ColorsPage() {
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('hex');
  const [section, setSection] = useState<Section>('all');

  const { setInspectorContent, setCustomControls, setCodeSnippet, setComponentTitle, setComponentCategory, setComponentIcon } =
    useDesignSystem();

  const copy = (hex: string, cssVar: string, utility: string) => {
    const value = { hex, rgb: formatRgb(hex), var: `var(${cssVar})`, class: utility }[copyFormat];
    copyToClipboard(value, `Copied ${value}`);
  };

  useEffect(() => {
    setComponentTitle('Color Tokens & Palette');
    setComponentIcon(<Palette size={14} strokeWidth={1.5} />);
    setComponentCategory('Design System / Foundation');

    setInspectorContent({
      title: 'Colour',
      description:
        'Palette steps mirror the Figma colour styles. Components only use semantic tokens, which map palette steps for light and dark mode.',
      propsList: [
        { prop: 'Copy format', type: 'enum', defaultVal: copyFormat },
        { prop: 'Section', type: 'enum', defaultVal: section },
      ],
      compositionNotes: [
        'Source: src/tokens/tokens.json. Re-import Figma styles with npm run tokens:figma.',
        'Dark mode follows the Figma notes: 400 for text and icons, 600 for fills behind white text.',
        'Hover a swatch for contrast and usage; click to copy.',
      ],
    });

    const selectClass =
      'w-full h-[36px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer';

    setCustomControls(
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-700 dark:text-zinc-300">Copy format</span>
          <select
            value={copyFormat}
            onChange={(e) => {
              setCopyFormat(e.target.value as CopyFormat);
              sounds.playClick();
            }}
            className={selectClass}
          >
            <option value="hex">Hex</option>
            <option value="rgb">RGB</option>
            <option value="var">CSS variable</option>
            <option value="class">Tailwind class</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-700 dark:text-zinc-300">Section</span>
          <select
            value={section}
            onChange={(e) => {
              setSection(e.target.value as Section);
              sounds.playClick();
            }}
            className={selectClass}
          >
            <option value="all">All</option>
            <option value="palette">Palette</option>
            <option value="semantic">Semantic tokens</option>
          </select>
        </div>
      </div>,
    );

    setCodeSnippet(`/* Components: semantic utilities follow light/dark automatically */
<button className="bg-brand text-on-brand hover:bg-brand-hover">Save</button>
<p className="text-fg-muted">Supporting copy</p>

/* Plain CSS */
.card { background: var(--tabs-surface); border: 1px solid var(--tabs-line); }

/* Palette steps (named as in Figma, group dropped) */
--color-tabs-blue-base   --color-gray-500   --color-error-600`);
  }, [copyFormat, section, setCodeSnippet, setComponentCategory, setComponentIcon, setComponentTitle, setCustomControls, setInspectorContent]);

  return (
    <PreviewCanvas align="top">
      <div className="w-full max-w-4xl pb-24 space-y-12 text-zinc-900 dark:text-zinc-100">
        <header className="space-y-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Colour</h1>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Components</strong> use semantic tokens such as{' '}
              <code className="font-mono">bg-surface</code>.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Palette</strong> steps only define them.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Base</strong> is each family&apos;s reference colour.
            </li>
          </ul>
        </header>

        {(section === 'all' || section === 'palette') && (
          <section aria-labelledby="palette" className="space-y-3">
            <h2 id="palette" className="font-display text-lg font-semibold tracking-tight">
              Palette
            </h2>

            <div className="overflow-x-auto">
              <div className="min-w-[680px] space-y-1.5">
                <div className="grid grid-cols-[120px_repeat(13,minmax(0,1fr))] gap-1.5">
                  <span />
                  {STEP_COLUMNS.map((col) => (
                    <span key={col} className="text-center font-mono text-[10px] text-zinc-400">
                      {col}
                    </span>
                  ))}
                </div>

                {PALETTE_GROUPS.map((group) => (
                  <div key={group.id} className="space-y-1.5">
                    <div className="pt-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{group.title}</div>
                    {FAMILIES.filter((f) => f.group === group.id).map((family) => {
                      const tag = STATUS_TAG[family.status];
                      return (
                        <div key={family.name} className="grid grid-cols-[120px_repeat(13,minmax(0,1fr))] items-center gap-1.5">
                          <div className="min-w-0 pr-2">
                            <div className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              {titleCase(family.name)}
                            </div>
                            {tag && (
                              <div className="text-[9px] uppercase tracking-wider text-zinc-400" title={tag.title}>
                                {tag.label}
                              </div>
                            )}
                          </div>
                          {STEP_COLUMNS.map((col) => {
                            const cell = family.cells[col];
                            if (!cell?.hex) {
                              return (
                                <span
                                  key={col}
                                  aria-hidden="true"
                                  className={`h-10 rounded-lg border border-dashed ${
                                    cell ? 'border-zinc-300 dark:border-zinc-600' : 'border-zinc-200/70 dark:border-zinc-800'
                                  }`}
                                  title={cell ? `${family.name}-${cell.step}: awaiting value from Figma` : undefined}
                                />
                              );
                            }
                            const { step, hex } = cell;
                            const text = bestTextOn(hex);
                            const roles = usedBy(family.name, step);
                            const isBase = step === 'base';
                            return (
                              <button
                                key={col}
                                onClick={() => copy(hex, paletteVar(family.name, step), `bg-${family.name}-${step}`)}
                                className="group relative h-10 rounded-lg ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-transform hover:scale-[1.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                                style={{ backgroundColor: hex }}
                                title={[
                                  `${family.name}-${step} · ${hex}`,
                                  `${text.ratio.toFixed(1)}:1 with ${text.color === '#FFFFFF' ? 'white' : 'black'} text`,
                                  roles.length ? `Used by: ${roles.join(', ')}` : null,
                                ]
                                  .filter(Boolean)
                                  .join('\n')}
                                aria-label={`Copy ${family.name} ${step}, ${hex}`}
                              >
                                {isBase && (
                                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold" style={{ color: text.color }}>
                                    Base
                                  </span>
                                )}
                                {roles.length > 0 && !isBase && (
                                  <span
                                    aria-hidden="true"
                                    className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: text.color, opacity: 0.7 }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              A dot marks steps used by a semantic token. Dashed cells exist in Figma but have no value yet.
            </p>
          </section>
        )}

        {(section === 'all' || section === 'semantic') && (
          <section aria-labelledby="semantic" className="space-y-3">
            <h2 id="semantic" className="font-display text-lg font-semibold tracking-tight">
              Semantic tokens
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wider text-zinc-400">
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 py-2 font-semibold">Token</th>
                    <th className="px-4 py-2 font-semibold">Light</th>
                    <th className="px-4 py-2 font-semibold">Dark</th>
                  </tr>
                </thead>
                {SEMANTIC_GROUPS.map((group) => (
                  <tbody key={group.id} className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    <tr className="bg-zinc-50 dark:bg-zinc-950/40">
                      <th colSpan={3} className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        {group.title}
                      </th>
                    </tr>
                    {Object.entries(SEMANTIC)
                      .filter(([, token]) => token.group === group.id)
                      .map(([name, token]) => (
                        <tr
                          key={name}
                          tabIndex={0}
                          onClick={() => copy(resolveSemantic(name, 'light'), semanticVar(name), semanticClass(name))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              copy(resolveSemantic(name, 'light'), semanticVar(name), semanticClass(name));
                            }
                          }}
                          className="cursor-pointer transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                          title="Copy"
                        >
                          <td className="px-4 py-2.5">
                            <div className="font-mono font-semibold">{name}</div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{token.use}</div>
                          </td>
                          {(['light', 'dark'] as Mode[]).map((mode) => {
                            const ref = parseRef(token[mode]);
                            const contrast = semanticContrast(name, mode);
                            return (
                              <td key={mode} className="px-4 py-2.5">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className="h-6 w-6 shrink-0 rounded-md ring-1 ring-inset ring-black/10 dark:ring-white/10"
                                    style={{ backgroundColor: resolveSemantic(name, mode) }}
                                  />
                                  <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                                    {ref.family}-{ref.step}
                                    {ref.alpha !== undefined && ` · ${ref.alpha}%`}
                                  </span>
                                  {contrast && (
                                    <span title={`Against ${token.on}`}>
                                      <ContrastBadge ratio={contrast.ratio} />
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </tbody>
                ))}
              </table>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Contrast is WCAG 2.2: 4.5 for body text, 3 for large text and icons.
            </p>
          </section>
        )}
      </div>
    </PreviewCanvas>
  );
}
