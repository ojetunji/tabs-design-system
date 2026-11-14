import type { Icon } from '@phosphor-icons/react';
import {
  CheckCircle,
  CursorClick,
  HouseLine,
  List,
  Notification,
  Palette,
  Tabs,
  Textbox,
  TextT,
} from '@phosphor-icons/react';

export type RegistrySection = 'Foundations' | 'Components';

export interface RegistryItem {
  name: string;
  href: string;
  icon: Icon;
  section: RegistrySection;
  /** Date the page was first published, as YYYY-MM-DD. Set this when you add a new entry. */
  addedOn: string;
}

/**
 * Every foundation and component in the system. Sidebar, search and the
 * "last added" footer all read from here, so a new page only needs one entry.
 */
export const registry: RegistryItem[] = [
  { name: 'Typography', href: '/foundations/typography', icon: TextT, section: 'Foundations', addedOn: '2026-09-14' },
  { name: 'Color & Tokens', href: '/foundations/colors', icon: Palette, section: 'Foundations', addedOn: '2026-09-23' },
  { name: 'Buttons', href: '/components/buttons', icon: CursorClick, section: 'Components', addedOn: '2026-09-14' },
  { name: 'Input Fields', href: '/components/input', icon: Textbox, section: 'Components', addedOn: '2026-09-14' },
  { name: 'Multi-Select', href: '/components/multi-select', icon: CheckCircle, section: 'Components', addedOn: '2026-09-15' },
  { name: 'Tabs', href: '/components/tabs', icon: Tabs, section: 'Components', addedOn: '2026-09-16' },
  { name: 'Toast', href: '/components/toast', icon: Notification, section: 'Components', addedOn: '2026-09-16' },
  { name: 'Dropdown', href: '/components/dropdown', icon: List, section: 'Components', addedOn: '2026-09-16' },
];

export const homeItem = { name: 'Home', href: '/', icon: HouseLine };

export const sections: { title: RegistrySection; items: RegistryItem[] }[] = (
  ['Foundations', 'Components'] as const
).map((title) => ({ title, items: registry.filter((item) => item.section === title) }));

/** Most recently added entry (ties resolve to the later entry in the list). */
export const latestAddition: RegistryItem = registry.reduce((latest, item) =>
  item.addedOn >= latest.addedOn ? item : latest,
);

/** Formats a YYYY-MM-DD date identically on server and client (no hydration mismatch). */
export function formatRegistryDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
