export interface ChangelogEntry {
  /** YYYY-MM-DD */
  date: string;
  title: string;
  /** What changed: Added, Improved or Fixed. */
  kind: 'Added' | 'Improved' | 'Fixed';
  /** Screenshot in /public/changelog, optional. */
  image?: string;
  /** Short note, one paragraph per string. */
  note: string[];
  otherFixes?: string[];
  /** Page to see the change on. */
  href?: string;
}

/** Newest first. Add an entry at the top when you ship something. */
export const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-11-17',
    title: 'Colour, accessible by default',
    kind: 'Improved',
    image: '/changelog/2026-11-17-colour.jpg',
    note: [
      'The design system now uses four simple colours: Paper and Night for our surfaces and text, Success and Error for status. Each step has a job, listed on its page.',
      'We’ve made sure that each one meets WCAG AA standards.',
    ],
    otherFixes: [
      'Disabled buttons share one style across every type.',
    ],
    href: '/foundations/colors',
  },
  {
    date: '2026-11-17',
    title: 'Filter menu Fixed',
    kind: 'Fixed',
    image: '/changelog/2026-11-17-filter.jpg',
    note: [
      'Selecting an option used to move its row out from under the pointer. Now rows stay put while the menu is open, selected rows move to the top the next time it opens, and the menu stays centred as the button’s width changes.',
    ],
    otherFixes: ['The Filter page drops its Customise card: the menu is the playground.'],
    href: '/components/dropdown/filter',
  },
  {
    date: '2026-11-17',
    title: 'A new home for the design system',
    kind: 'Improved',
    image: '/changelog/2026-11-17-docs.jpg',
    note: [
      'We’ve gone through so many iterations of the documentation site but now, this looks and feels like Tabs. Every component has a live preview, copyable code, and a separate customise section to test variants.',
    ],
    otherFixes: ['Added the Tabs welcome video on the introduction page.', 'Dropdown components (Icon menu, Role select, Avatar menu and Filter) are now grouped and easily accessible.'],
    href: '/components/buttons',
  },
  {
    date: '2026-09-16',
    title: 'Tabs, Toast and Dropdown',
    kind: 'Added',
    note: ['Three components from the product join Button and Input, each with a live preview and code.'],
    href: '/components/tabs',
  },
];
