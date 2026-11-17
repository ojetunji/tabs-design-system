import type { Icon } from '@phosphor-icons/react';
import {
  CheckCircle,
  CursorClick,
  DotsThreeCircle,
  HouseLine,
  List,
  ListChecks,
  Notification,
  Palette,
  Tabs,
  Textbox,
  TextT,
  UserCircle,
} from '@phosphor-icons/react';

export type RegistrySection = 'Foundations' | 'Components';

export interface RegistryItem {
  name: string;
  href: string;
  icon: Icon;
  section: RegistrySection;
  /** Date the page was first published, as YYYY-MM-DD. Set this when you add a new entry. */
  addedOn: string;
  /** href of the entry this one sits under in the sidebar, e.g. the Dropdown variants. */
  parent?: string;
}

/**
 * Every foundation and component in the system. Sidebar, search and the
 * "last added" footer all read from here, so a new page only needs one entry.
 */
export const registry: RegistryItem[] = [
  { name: 'Typography', href: '/foundations/typography', icon: TextT, section: 'Foundations', addedOn: '2026-09-14' },
  { name: 'Colour', href: '/foundations/colors', icon: Palette, section: 'Foundations', addedOn: '2026-09-23' },
  { name: 'Button', href: '/components/buttons', icon: CursorClick, section: 'Components', addedOn: '2026-09-14' },
  { name: 'Input', href: '/components/input', icon: Textbox, section: 'Components', addedOn: '2026-09-14' },
  { name: 'Tabs', href: '/components/tabs', icon: Tabs, section: 'Components', addedOn: '2026-09-16' },
  { name: 'Toast', href: '/components/toast', icon: Notification, section: 'Components', addedOn: '2026-09-16' },
  { name: 'Dropdown', href: '/components/dropdown', icon: List, section: 'Components', addedOn: '2026-09-16' },
  { name: 'Icon menu', href: '/components/dropdown/icon', icon: DotsThreeCircle, section: 'Components', addedOn: '2026-09-16', parent: '/components/dropdown' },
  { name: 'Role select', href: '/components/dropdown/role', icon: ListChecks, section: 'Components', addedOn: '2026-09-16', parent: '/components/dropdown' },
  { name: 'Avatar menu', href: '/components/dropdown/avatar', icon: UserCircle, section: 'Components', addedOn: '2026-09-16', parent: '/components/dropdown' },
  { name: 'Filter', href: '/components/dropdown/filter', icon: CheckCircle, section: 'Components', addedOn: '2026-09-15', parent: '/components/dropdown' },
];

/** Entries that sit under another one in the sidebar. */
export const childrenOf = (href: string) => registry.filter((item) => item.parent === href);

export const homeItem = { name: 'Home', href: '/', icon: HouseLine };

export const sections: { title: RegistrySection; items: RegistryItem[] }[] = (
  ['Foundations', 'Components'] as const
).map((title) => ({ title, items: registry.filter((item) => item.section === title && !item.parent) }));

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
