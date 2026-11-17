import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/components/shared/PageHeader';
import { buttonClass } from '@/app/components/buttons/Button';
import { ENTRIES } from './entries';

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const KIND_STYLES = {
  Added: 'bg-tabs-blue-25 text-tabs-blue-600',
  Improved: 'bg-surface-raised text-fg-secondary',
  Fixed: 'bg-success-subtle text-on-success-subtle',
} as const;

export default function ChangelogPage() {
  return (
    <article className="flex flex-col gap-10">
      <PageHeader title="Changelog" />

      <ol className="flex flex-col">
        {ENTRIES.map((entry) => (
          <li
            key={`${entry.date}-${entry.title}`}
            className="grid gap-x-10 gap-y-4 border-b border-line py-12 first:pt-2 last:border-b-0 md:grid-cols-[120px_minmax(0,1fr)]"
          >
            <time dateTime={entry.date} className="text-sm text-fg-muted md:sticky md:top-6 md:self-start">
              {formatDate(entry.date)}
            </time>

            <div className="flex flex-col gap-5">
              {entry.image && (
                <div className="rounded-[24px] bg-surface-subtle p-2 ring-1 ring-inset ring-line">
                  <Image
                    src={entry.image}
                    alt={`${entry.title}: screenshot`}
                    width={800}
                    height={500}
                    className="h-auto w-full rounded-[18px] ring-1 ring-line"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3">
                <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${KIND_STYLES[entry.kind]}`}>{entry.kind}</span>
                <h2 className="font-display text-[26px] leading-[30px] tracking-[-0.02em] text-fg">{entry.title}</h2>
                {entry.note.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-[23px] text-fg-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>

              {entry.otherFixes && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium text-fg">Other fixes</h3>
                  <ul className="flex flex-col gap-1.5 text-sm leading-[21px] text-fg-muted">
                    {entry.otherFixes.map((fix) => (
                      <li key={fix} className="flex gap-3">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {entry.href && (
                // The system's Link Grey button, flush left so it lines up with the text above.
                <Link href={entry.href} className={buttonClass('link', 'sm', 'group w-fit px-0!')}>
                  See it
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
