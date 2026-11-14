import tokens from '@/tokens/tokens.json';
import { composite, contrastRatio, rateContrast, type ContrastRating } from '@/lib/color';

/**
 * Typed view over src/tokens/tokens.json — the single source of truth.
 * The palette mirrors the Figma colour styles; the same JSON generates src/styles/tokens.css.
 */
export type PaletteGroup = 'primary' | 'secondary' | 'states' | 'neutral';
export type SemanticGroup = 'text' | 'surface' | 'border' | 'brand' | 'status';
export type Mode = 'light' | 'dark';
/** product = value the Tabs platform ships today; provisional = not yet confirmed by a Figma export; awaiting-figma = no value yet. */
export type ScaleStatus = 'figma' | 'product' | 'provisional' | 'awaiting-figma';

type RawScale = Record<string, string | null>;

export interface SemanticToken {
  group: SemanticGroup;
  light: string;
  dark: string;
  use: string;
  /** Semantic token this one's contrast is measured against. */
  on?: string;
}

const RAW_PALETTE = tokens.palette as unknown as Record<PaletteGroup, Record<string, RawScale>>;
export const SEMANTIC = tokens.semantic as Record<string, SemanticToken>;

export const PALETTE_GROUPS: { id: PaletteGroup; title: string }[] = [
  { id: 'primary', title: 'Primary' },
  { id: 'secondary', title: 'Secondary' },
  { id: 'states', title: 'States' },
  { id: 'neutral', title: 'Neutral' },
];

/** Grid columns shared by every family, so steps line up across the palette. */
export const STEP_COLUMNS = ['0', '25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

/** Where Figma places "Base" in each group's scale. */
export const BASE_SLOT: Record<PaletteGroup, string> = { primary: '400', secondary: '500', states: '500', neutral: '500' };

export interface Family {
  group: PaletteGroup;
  name: string;
  status: ScaleStatus;
  /** column -> { step name as in Figma, hex or null } */
  cells: Record<string, { step: string; hex: string | null }>;
}

function toFamily(group: PaletteGroup, name: string, raw: RawScale): Family {
  const cells: Family['cells'] = {};
  for (const [step, hex] of Object.entries(raw)) {
    if (step.startsWith('$')) continue;
    const column =
      step === 'base' ? BASE_SLOT[group] : step === 'white' ? '0' : step === 'black' ? '950' : step;
    cells[column] = { step, hex };
  }
  return { group, name, status: (raw.$status as ScaleStatus) ?? 'figma', cells };
}

export const FAMILIES: Family[] = PALETTE_GROUPS.flatMap(({ id }) =>
  Object.entries(RAW_PALETTE[id] ?? {}).map(([name, raw]) => toFamily(id, name, raw)),
);

export function paletteHex(family: string, step: string): string | undefined {
  for (const group of Object.values(RAW_PALETTE)) {
    const value = group[family]?.[step];
    if (value) return value;
  }
  return undefined;
}

/** CSS custom property for a palette step, e.g. ('tabs-blue', 'base') -> --color-tabs-blue-base */
export const paletteVar = (family: string, step: string) => `--color-${family}-${step}`;

/** CSS custom property for a semantic token, e.g. 'fg' -> --tabs-fg */
export const semanticVar = (name: string) => `--tabs-${name}`;

/** Tailwind utility for a semantic token, chosen by what the token is for. */
export function semanticClass(name: string): string {
  const { group } = SEMANTIC[name];
  if (group === 'text' || name.startsWith('on-') || name === 'danger' || name === 'danger-strong' || name === 'success') {
    return `text-${name}`;
  }
  if (group === 'border') return `border-${name}`;
  return `bg-${name}`;
}

/** Parses "gray.900" or "gray.900/10". */
export function parseRef(ref: string) {
  const [path, alpha] = ref.split('/');
  const [family, step] = path.split('.');
  return { family, step, hex: paletteHex(family, step) ?? '#000000', alpha: alpha ? Number(alpha) : undefined };
}

/** Solid hex a semantic token renders as in a mode (translucent tokens are flattened onto `surface`). */
export function resolveSemantic(name: string, mode: Mode): string {
  const ref = parseRef(SEMANTIC[name][mode]);
  if (ref.alpha === undefined) return ref.hex;
  const backdrop = name === 'surface' ? '#FFFFFF' : resolveSemantic('surface', mode);
  return composite(ref.hex, ref.alpha, backdrop);
}

export interface ContrastResult {
  ratio: number;
  rating: ContrastRating;
}

/** Contrast of a semantic token against its `on` token, per mode. */
export function semanticContrast(name: string, mode: Mode): ContrastResult | null {
  const on = SEMANTIC[name].on;
  if (!on) return null;
  const ratio = contrastRatio(resolveSemantic(name, mode), resolveSemantic(on, mode));
  return { ratio, rating: rateContrast(ratio) };
}

/** Semantic tokens that point at a palette step — answers "what is this step for?". */
export function usedBy(family: string, step: string): string[] {
  return Object.entries(SEMANTIC)
    .filter(([, token]) =>
      (['light', 'dark'] as Mode[]).some((mode) => {
        const ref = parseRef(token[mode]);
        return ref.family === family && ref.step === step;
      }),
    )
    .map(([name]) => name);
}

export const SEMANTIC_GROUPS: { id: SemanticGroup; title: string }[] = [
  { id: 'text', title: 'Text & icons' },
  { id: 'surface', title: 'Surfaces' },
  { id: 'border', title: 'Borders' },
  { id: 'brand', title: 'Brand' },
  { id: 'status', title: 'Status' },
];
