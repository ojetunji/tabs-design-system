'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretDown, Copy } from '@phosphor-icons/react';
import { Button } from '@/app/components/buttons/Button';
import { SectionLabel } from '@/components/shared/PageHeader';
import { copyToClipboard } from '@/lib/copy';
import { sounds } from '@/lib/sounds';
import { colorBySlug, toHsl, toRgb } from '../data';

function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => {
                setOpen(isOpen ? null : i);
                sounds.playToggle();
              }}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-fg cursor-pointer"
            >
              {item.question}
              <CaretDown
                size={16}
                className={`shrink-0 text-fg-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 text-[15px] leading-[23px] text-fg-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/** One row of steps, starting from the base. Select a step to copy its hex. */
function ScaleCard({ title, description, colors }: { title: string; description: string; colors: string[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-line p-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl tracking-[-0.02em] text-fg">{title}</h3>
        <p className="text-sm leading-5 text-fg-muted">{description}</p>
      </div>
      <div className="flex h-16 overflow-hidden rounded-[14px] ring-1 ring-inset ring-line">
        {colors.map((hex) => (
          <button
            key={hex}
            type="button"
            onClick={() => copyToClipboard(hex, `Copied ${hex}`)}
            title={hex}
            aria-label={`Copy ${hex}`}
            className="group relative flex-1 cursor-pointer"
            style={{ backgroundColor: hex }}
          >
            <span className="absolute inset-x-0 bottom-1.5 text-center font-mono text-[10px] text-white opacity-0 mix-blend-difference transition-opacity group-hover:opacity-100">
              {hex}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ColorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const color = colorBySlug(slug);

  if (!color) {
    return (
      <div className="flex flex-col gap-3 text-[15px] text-fg-muted">
        <p>There is no colour called &ldquo;{slug}&rdquo; in the system.</p>
        <Link href="/foundations/colors" className="font-medium text-fg underline underline-offset-2">
          Back to Colour
        </Link>
      </div>
    );
  }

  const hex = color.hex.toUpperCase();
  const [r, g, b] = toRgb(color.hex);
  const [h, s, l] = toHsl(color.hex);
  const codes = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: 'CSS variable', value: `var(${color.cssVar})` },
  ];

  return (
    <article className="flex flex-col gap-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-start">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <h1 className="font-display text-[56px] leading-[58px] tracking-[-0.035em] text-fg sm:text-[68px] sm:leading-[68px]">
              {color.name}
            </h1>
            <p className="text-[15px] leading-[23px] text-fg-muted">{color.summary}</p>
          </div>

          <Accordion
            items={[
              { question: `What colour is ${color.name}?`, answer: color.what },
              { question: `What does ${color.name} mean in Tabs?`, answer: color.meaning },
              { question: `Where is ${color.name} used?`, answer: color.usage },
            ]}
          />
        </div>

        <aside className="flex flex-col gap-5 rounded-[28px] border border-line p-6 lg:sticky lg:top-6">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-5">
            <span className="font-display text-xl tracking-[-0.02em] text-fg">{color.name}</span>
            <span className="rounded-full bg-surface-raised px-3 py-1.5 font-mono text-[13px] text-fg">{hex}</span>
          </div>
          <div className="h-[150px] rounded-[18px] ring-1 ring-inset ring-line" style={{ backgroundColor: color.hex }} />
          <Button
            variant="secondary"
            size="sm"
            className="w-full max-w-none"
            onClick={() => copyToClipboard(`var(${color.cssVar})`, `Copied var(${color.cssVar})`)}
          >
            <Copy size={16} />
            Copy variable
          </Button>
        </aside>
      </div>

      {color.tints.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionLabel>{color.name} variations</SectionLabel>
          <ScaleCard
            title="Tints"
            description={`Tints of ${color.name} add white, for lighter, softer backgrounds and fills.`}
            colors={[color.hex, ...color.tints]}
          />
          <ScaleCard
            title="Shades"
            description={`Shades of ${color.name} add black, for hover states, text and depth.`}
            colors={[color.hex, ...color.shades]}
          />
        </section>
      )}

      {color.steps.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionLabel>{color.name} steps</SectionLabel>
          <div className="flex flex-col gap-4 rounded-[28px] border border-line p-6">
            <p className="text-sm leading-5 text-fg-muted">
              Each step has a job. Reach for the step by what it is for, not by how light it looks.
            </p>
            <div className="flex h-16 overflow-hidden rounded-[14px] ring-1 ring-inset ring-line">
              {color.steps.map(({ step, hex }) => (
                <span key={step} className="flex-1" style={{ backgroundColor: hex }} />
              ))}
            </div>
            <ul className="flex flex-col">
              {color.steps.map(({ step, hex, role }) => {
                const isBase = color.cssVar.endsWith(`-${step}`);
                return (
                  <li key={step} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0">
                    <span className="h-7 w-7 shrink-0 rounded-[8px] ring-1 ring-inset ring-line" style={{ backgroundColor: hex }} />
                    <span className="w-28 shrink-0 text-sm font-medium text-fg">
                      {color.name} {step}
                    </span>
                    <span className="flex min-w-0 flex-1 items-center gap-2 text-sm text-fg-secondary">
                      <span className="truncate">{role}</span>
                      {isBase && (
                        <span className="shrink-0 rounded-full bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-fg">Base</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(hex, `Copied ${hex}`)}
                      aria-label={`Copy ${color.name} ${step}, ${hex}`}
                      className="flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[13px] text-fg-muted transition-colors hover:bg-fill hover:text-fg cursor-pointer"
                    >
                      {hex.toUpperCase()}
                      <Copy size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-1">
        <SectionLabel>Using {color.name} in code</SectionLabel>
        <dl className="flex flex-col">
          {codes.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4 border-b border-line py-3.5">
              <dt className="w-32 shrink-0 text-sm text-fg-muted">{label}</dt>
              <dd className="min-w-0 flex-1 truncate font-mono text-[13px] text-fg">{value}</dd>
              <button
                type="button"
                onClick={() => copyToClipboard(value, `Copied ${value}`)}
                aria-label={`Copy ${label}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fill hover:text-fg cursor-pointer"
              >
                <Copy size={15} />
              </button>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
