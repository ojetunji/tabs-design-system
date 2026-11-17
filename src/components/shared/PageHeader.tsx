import type { ReactNode } from 'react';

/** Title and one-line description at the top of every docs page. */
export default function PageHeader({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <header className="flex flex-col gap-3">
      <h1 className="font-display text-[44px] leading-[48px] tracking-[-0.03em] text-fg">{title}</h1>
      {description && <p className="max-w-[560px] text-[15px] leading-[22px] text-fg-muted">{description}</p>}
    </header>
  );
}

/** Bold label above a section, as on the stage and the props table. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-sm font-semibold text-fg">{children}</h2>;
}
