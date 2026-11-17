'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { Tabs } from '@/app/components/tabs/Tabs';
import PageHeader, { SectionLabel } from '@/components/shared/PageHeader';
import CustomizerControls from '@/components/shared/Customizer';
import CodeBlock from '@/components/shared/CodeBlock';
import { sounds } from '@/lib/sounds';

interface PreviewCanvasProps {
  children: React.ReactNode;
  /** Kept for older pages. Every preview is centred now; menus are free to overlap what is below. */
  align?: 'center' | 'top';
}

const VIEWS = [
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
];

/**
 * The component page: title, then the stage. The preview (or its code) sits in
 * a grey well on the left and the controls in their own card on the right.
 * Changing a control updates both the preview and the code.
 */
export default function PreviewCanvas({ children }: PreviewCanvasProps) {
  const { inspectorContent, customControls, codeSnippet, contentPath } = useDesignSystem();
  const pathname = usePathname();
  const [view, setView] = useState('preview');

  // Pages publish their title, controls and code after they mount. Until the
  // published content belongs to this page, stay invisible so the previous
  // page's content never flashes; then fade in.
  const isReady = contentPath === pathname;

  const code = typeof codeSnippet === 'string' ? codeSnippet : (codeSnippet?.tsx ?? '');
  const { title, description, propsList = [], compositionNotes = [], guidance } = inspectorContent;
  const isCode = view === 'code';

  return (
    <article className={`flex flex-col gap-10 transition-opacity duration-200 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <PageHeader title={title} description={description} />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <SectionLabel>Playground</SectionLabel>
          <Tabs
            tabs={VIEWS}
            activeId={view}
            onChange={(id) => {
              setView(id);
              sounds.playToggle();
            }}
          />
        </div>

        <div className={`grid items-stretch gap-3 ${customControls ? 'lg:grid-cols-[minmax(0,1fr)_288px]' : ''}`}>
          {/* Preview and code share one cell and cross-fade, so the well keeps its size when switching. */}
          <div className="grid min-h-[300px] rounded-[28px] bg-surface-subtle lg:min-h-[440px]">
            <div
              inert={isCode}
              className={`col-start-1 row-start-1 flex items-center justify-center px-6 py-12 transition-opacity duration-200 ${
                isCode ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              {children}
            </div>
            <div
              inert={!isCode}
              className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-200 ${
                isCode ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <CodeBlock code={code || '// No code for this page yet'} className="h-full max-h-[560px] overflow-y-auto" />
            </div>
          </div>

          {customControls && (
            <aside aria-label="Customise" className="customizer flex flex-col gap-4 rounded-[28px] border border-line bg-surface p-5">
              <h3 className="font-display text-base tracking-[-0.02em] text-fg">Customise</h3>
              <CustomizerControls>{customControls}</CustomizerControls>
            </aside>
          )}
        </div>
      </section>

      {guidance && (
        <section className="flex flex-col gap-1">
          <SectionLabel>Notes</SectionLabel>
          <dl className="flex flex-col">
            {[
              { label: 'Purpose', text: guidance.purpose },
              { label: 'How it works', text: guidance.behaviour },
              { label: 'Where Tabs uses it', text: guidance.usage },
            ].map(({ label, text }) => (
              <div
                key={label}
                className="grid gap-x-8 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]"
              >
                <dt className="text-sm font-medium text-fg">{label}</dt>
                <dd className="text-[15px] leading-[23px] text-fg-secondary">{text}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {propsList.length > 0 && (
        <section className="flex flex-col gap-1">
          <SectionLabel>Props</SectionLabel>
          <dl className="flex flex-col">
            {propsList.map((item) => (
              <div
                key={item.prop}
                className="grid gap-x-8 gap-y-2 border-b border-line py-4 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]"
              >
                <dt className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[13px] font-medium text-fg">{item.prop}</span>
                  {item.defaultVal && item.defaultVal !== '-' && (
                    <span className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] leading-4 text-fg-muted">
                      {item.defaultVal}
                    </span>
                  )}
                </dt>
                <dd className="flex flex-col gap-1">
                  <span className="font-mono text-[12.5px] leading-5 text-tabs-blue-500">{item.type}</span>
                  {item.description && <span className="text-sm leading-[22px] text-fg-secondary">{item.description}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {!guidance && compositionNotes.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionLabel>Notes</SectionLabel>
          <ul className="flex max-w-[600px] flex-col gap-2 text-[15px] leading-[22px] text-fg-muted">
            {compositionNotes.map((note) => (
              <li key={note} className="flex gap-3">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
