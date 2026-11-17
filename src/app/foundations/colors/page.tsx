import Link from 'next/link';
import PageHeader, { SectionLabel } from '@/components/shared/PageHeader';
import { COLORS, type ColorEntry } from './data';

function ColorCard({ color }: { color: ColorEntry }) {
  return (
    <Link href={`/foundations/colors/${color.slug}`} className="group flex flex-col gap-3">
      <span className="rounded-[24px] border border-line p-3.5 transition-colors group-hover:bg-surface-subtle">
        <span
          className="block aspect-[7/5] w-full rounded-[14px] ring-1 ring-inset ring-line"
          style={{ backgroundColor: color.hex }}
        />
      </span>
      <span className="flex flex-col px-1">
        <span className="text-[15px] font-medium text-fg">{color.name}</span>
        <span className="font-mono text-[13px] text-fg-muted">{color.hex.toUpperCase()}</span>
      </span>
    </Link>
  );
}

function ColorGrid({ group }: { group: ColorEntry['group'] }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>{group}</SectionLabel>
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3">
        {COLORS.filter((c) => c.group === group).map((color) => (
          <ColorCard key={color.slug} color={color} />
        ))}
      </div>
    </section>
  );
}

export default function ColorsPage() {
  return (
    <article className="flex flex-col gap-10">
      <PageHeader
        title="Colour"
        description="Six brand colours, then four for the interface: Paper and Night for surfaces and text, Success and Error for status. Select a colour to see what it means in Tabs and how to use it."
      />
      <ColorGrid group="Brand" />
      <ColorGrid group="Interface" />
    </article>
  );
}
