import { paletteHex, paletteVar, resolveSemantic, semanticVar } from './tokens';

export interface ColorEntry {
  slug: string;
  name: string;
  group: 'Brand' | 'Interface';
  hex: string;
  /** CSS custom property that carries the colour. */
  cssVar: string;
  /** One paragraph under the title. */
  summary: string;
  /** What the colour looks like. */
  what: string;
  /** What it stands for in Tabs. */
  meaning: string;
  /** Where it appears in the product. */
  usage: string;
  /** Brand colours only: lighter steps, nearest the base first. */
  tints: string[];
  /** Brand colours only: darker steps, nearest the base first. */
  shades: string[];
  /** Interface colours only: every step with what it is for, lightest first. */
  steps: { step: string; hex: string; role: string }[];
}

const TINT_STEPS = ['300', '200', '100', '50', '25'];
// 450 exists only for Tabs Blue: the UI blue for buttons and links, so white text on it passes WCAG AA.
const SHADE_STEPS = ['450', '500', '600', '700', '800', '900'];
const steps = (family: string, names: string[]) =>
  names.map((step) => paletteHex(family, step)).filter((hex): hex is string => Boolean(hex));

type Draft = Omit<ColorEntry, 'hex' | 'cssVar' | 'tints' | 'shades' | 'steps'> & {
  source: { palette: [string, string] } | { semantic: string };
  /** Interface colours: step -> what it is for. */
  roles?: Record<string, string>;
};

// Draft copy. The values come from the tokens; the words are a first pass to edit.
const DRAFTS: Draft[] = [
  {
    slug: 'tabs-blue',
    name: 'Tabs Blue',
    group: 'Brand',
    source: { palette: ['tabs-blue', 'base'] },
    summary:
      'Tabs Blue is the colour of the folder tab in the logo and of every main action in the product. It is bright, direct and used sparingly, so it always means "this is the thing to do".',
    what: 'A clear, saturated blue that sits between classic and electric. It holds its strength on white and on the soft grey wells.',
    meaning:
      'Blue is the tab you reach for. It stands for finding what you came for: the one reference, the one save, the one next step.',
    usage:
      'The logo and brand moments use the base. Buttons, links and selection use Tabs Blue 450 (#006DED), a touch darker so white text on it meets WCAG AA. It is never used for decoration or large backgrounds.',
  },
  {
    slug: 'tabs-cool-blue',
    name: 'Tabs Cool Blue',
    group: 'Brand',
    source: { palette: ['tabs-cool-blue', 'base'] },
    summary: 'Tabs Cool Blue is the lighter companion to Tabs Blue. It keeps the brand cool and open where the full blue would be too loud.',
    what: 'A soft, airy blue with a little green in it. Calm next to Tabs Blue, lively next to grey.',
    meaning: 'Tabs Cool Blue stands for browsing: the open, unhurried part of research before you settle on something.',
    usage: 'Illustrations, patterns and marketing surfaces. In the product it appears only in brand moments, not in controls.',
  },
  {
    slug: 'tabs-orange',
    name: 'Tabs Orange',
    group: 'Brand',
    source: { palette: ['tabs-orange', 'base'] },
    summary: 'Tabs Orange brings warmth and energy to the brand. It is the colour that makes a pattern or a social post feel like Tabs.',
    what: 'A warm, earthy orange, closer to clay than to neon.',
    meaning: 'Tabs Orange stands for the makers: the teams across Africa whose products fill the library.',
    usage: 'Brand patterns, avatars and highlights in marketing. Its lightest tint backs the artwork on the sign-up screen.',
  },
  {
    slug: 'tabs-pink',
    name: 'Tabs Pink',
    group: 'Brand',
    source: { palette: ['tabs-pink', 'base'] },
    summary: 'Tabs Pink is the playful note in the palette. It softens the blue and keeps the brand from feeling corporate.',
    what: 'A gentle, slightly cool pink that stays friendly at any size.',
    meaning: 'Tabs Pink stands for delight: the small moments, like a like or a saved tab, that make research feel good.',
    usage: 'Brand patterns, avatar backgrounds and celebratory moments. Not used for errors, which have their own red.',
  },
  {
    slug: 'tabs-mint',
    name: 'Tabs Mint',
    group: 'Brand',
    source: { palette: ['tabs-mint', 'base'] },
    summary: 'Tabs Mint is the quietest brand colour. It gives patterns and backgrounds a fresh tone without competing for attention.',
    what: 'A pale, fresh green that reads almost as a tinted neutral.',
    meaning: 'Tabs Mint stands for clarity: a clean slate to compare, sort and decide.',
    usage: 'Background tints in patterns and illustrations, paired with Tabs Green or Tabs Blue.',
  },
  {
    slug: 'tabs-green',
    name: 'Tabs Green',
    group: 'Brand',
    source: { palette: ['tabs-green', 'base'] },
    summary: 'Tabs Green is the deep, grounded colour in the brand set. It anchors the lighter tones around it.',
    what: 'A rich green with a touch of teal, strong enough to carry white text.',
    meaning: 'Tabs Green stands for growth: products and designers getting better by learning from each other.',
    usage: 'Brand patterns and illustration. The interface uses a separate, brighter green for success states.',
  },
  {
    slug: 'paper',
    name: 'Paper',
    group: 'Interface',
    source: { palette: ['paper', '0'] },
    summary:
      'Paper is the light end of the interface: the page, the soft grey wells that screenshots sit on, raised fields and hover fills. Each surface is one step of Paper, so the layers stay calm and even.',
    what: 'White, then four very light, neutral greys with no colour cast.',
    meaning: 'A plain page and a quiet shelf, so nothing in the interface tints the screens being studied.',
    usage:
      'Paper 0 is the page and controls; Paper 50 is the well behind app cards and screens; Paper 100 raises the search field and chips; Paper 200 is hover; Paper 300 marks hover borders and placeholder text.',
    roles: {
      '0': 'Page, cards, inputs',
      '50': 'Well behind screens',
      '100': 'Raised fields and chips',
      '200': 'Hover',
      '300': 'Hover borders, placeholder text',
    },
  },
  {
    slug: 'night',
    name: 'Night',
    group: 'Interface',
    source: { palette: ['night', '800'] },
    summary:
      'Night is the dark end of the interface: text from muted to ink, and the dark surface of menus. Ink and Muted are steps of Night, not colours of their own.',
    what: 'Neutral greys that deepen into a soft near-black, easier on the eye than pure black.',
    meaning:
      'Night keeps the interface out of the way. As text it lets the products in the library do the talking; as a menu it is focus, the one thing asking for a decision.',
    usage:
      'Night 900 (Ink) for headings and body text, Night 700 for secondary text, Night 500 (Muted) for descriptions, placeholders and disabled text, and Night 800 for filter menus and tooltips. Borders are Night 900 at 10%.',
    roles: {
      '400': 'Text and icons on menus',
      '500': 'Muted, placeholder and disabled text',
      '600': 'Controls on menus',
      '700': 'Secondary text',
      '800': 'Menus and tooltips',
      '900': 'Ink: headings and body text',
    },
  },
  {
    slug: 'success',
    name: 'Success',
    group: 'Interface',
    source: { palette: ['success', '700'] },
    summary: 'Success confirms that something worked: a copy, a save, a payment. Its steps cover the few jobs it has.',
    what: 'A bright, clean green, clearly apart from the brand Tabs Green.',
    meaning: 'A quick yes, then out of the way.',
    usage: 'The check icon in toasts and the ticks in the pricing table.',
    roles: {
      '50': 'Success background',
      '100': 'Hover on that background',
      '400': 'On dark surfaces',
      '600': 'Base hue, not for text or icons',
      '700': 'Icons and text',
      '950': 'Dark mode background',
    },
  },
  {
    slug: 'error',
    name: 'Error',
    group: 'Interface',
    source: { palette: ['error', '600'] },
    summary: 'Error marks destructive actions and things that went wrong. Its steps cover the few jobs it has.',
    what: 'A vivid red with a hint of pink, clearly apart from Tabs Orange and Tabs Pink.',
    meaning: 'A clear stop. It appears rarely, so it is never ignored.',
    usage: 'The Delete account button, error toasts and failed states.',
    roles: {
      '50': 'Error toast, light destructive button',
      '100': 'Hover on that background',
      '200': 'Dark mode text',
      '400': 'On dark surfaces',
      '500': 'Base hue, not for text',
      '600': 'Destructive buttons, error text and icons',
      '700': 'Hover, text on light red',
      '950': 'Dark mode background',
    },
  },
];

export const COLORS: ColorEntry[] = DRAFTS.map(({ source, roles, ...rest }) => {
  if (!('palette' in source)) {
    return { ...rest, hex: resolveSemantic(source.semantic, 'light'), cssVar: semanticVar(source.semantic), tints: [], shades: [], steps: [] };
  }
  const [family, step] = source.palette;
  return {
    ...rest,
    hex: paletteHex(family, step) ?? '#000000',
    cssVar: paletteVar(family, step),
    tints: roles ? [] : steps(family, TINT_STEPS),
    shades: roles ? [] : steps(family, SHADE_STEPS),
    steps: Object.entries(roles ?? {})
      .map(([name, role]) => ({ step: name, hex: paletteHex(family, name) ?? '', role }))
      .filter((s) => s.hex)
      .sort((a, b) => Number(a.step) - Number(b.step)),
  };
});

// Ink, Muted and Well became steps of Night and Paper; keep their old addresses working.
const MOVED: Record<string, string> = { ink: 'night', muted: 'night', well: 'paper' };
export const colorBySlug = (slug: string) => COLORS.find((c) => c.slug === (MOVED[slug] ?? slug));

/** "#0074FC" -> [0, 116, 252] */
export function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** "#0074FC" -> [212, 100, 49] (degrees, percent, percent) */
export function toHsl(hex: string): [number, number, number] {
  const [r, g, b] = toRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, Math.round(l * 100)];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [Math.round((h * 60 + 360) % 360), Math.round(s * 100), Math.round(l * 100)];
}
