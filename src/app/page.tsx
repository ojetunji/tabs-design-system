import Link from 'next/link';
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react/dist/ssr';
import { buttonClass } from '@/app/components/buttons/Button';

const CARDS = [
  { title: 'Foundations', body: 'Colour and type, as tokens taken from the Tabs designs.', href: '/foundations/colors' },
  { title: 'Components', body: 'What Tabs ships today, with live controls and the code beside them.', href: '/components/buttons' },
  // { title: 'Tabs', body: 'The product this system is built for: UI patterns from African digital products.', href: 'https://jointabs.com' },
];

export default function IntroductionPage() {
  return (
    <article className="flex flex-col gap-14">
      <header className="flex flex-col gap-6 pt-4 sm:pt-8">
        <h1 className="max-w-[640px] font-display text-[44px] leading-[46px] tracking-[-0.035em] text-fg sm:text-[60px] sm:leading-[60px]">
          Every pill, tab and toast in Tabs starts here.
        </h1>
        <div className="flex max-w-[460px] flex-col gap-3 text-[15px] leading-[23px] text-fg-muted">
          <p>The design system behind Tabs. Tokens, typography and components, documented straight from the live product. Tabs is a library of African digital products, and this system was built to serve it. It’s open source and free to use in your own projects, and contributions are welcome.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link href="/components/buttons" className={buttonClass('primary', 'sm')}>
            See the components
          </Link>
          <a
            href="https://github.com/ojetunji/tabs-design-system"
            target="_blank"
            rel="noreferrer"
            className={buttonClass('secondary', 'sm')}
          >
            <GithubLogo size={16} />
            GitHub
          </a>
        </div>
      </header>

      {/* The Tabs welcome video, compressed to 1280px (about 2 MB). Only the poster loads until someone presses play. */}
      <div className="overflow-hidden rounded-[28px] bg-surface-subtle">
        <video
          controls
          playsInline
          preload="none"
          poster="/video/intro-poster.jpg"
          aria-label="Welcome to Tabs"
          className="block aspect-video w-full bg-night-900"
        >
          <source src="/video/intro.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {CARDS.map((card) => {
          const external = card.href.startsWith('http');
          return (
            <Link
              key={card.title}
              href={card.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="group flex flex-col gap-1.5 rounded-[22px] border border-line p-5 transition-colors hover:bg-surface-subtle"
            >
              <span className="flex items-center justify-between text-sm font-semibold text-fg">
                {card.title}
                <ArrowUpRight size={14} className="text-fg-subtle transition-colors group-hover:text-fg" />
              </span>
              <span className="text-sm leading-5 text-fg-muted">{card.body}</span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
