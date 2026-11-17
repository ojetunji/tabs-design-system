// Small colour helpers for documentation: formats and WCAG 2.x contrast.

export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as RGB;
}

export function rgbToHex([r, g, b]: RGB): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

/** Flattens a translucent colour onto a solid background, e.g. night-900 at 10% on white. */
export function composite(fg: string, alphaPercent: number, bg: string): string {
  const a = alphaPercent / 100;
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  return rgbToHex(f.map((c, i) => c * a + b[i] * (1 - a)) as RGB);
}

export function formatRgb(hex: string): string {
  return `rgb(${hexToRgb(hex).join(' ')})`;
}

export function formatHsl(hex: string): string {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  h = Math.round(h * 60 + 360) % 360;
  return `hsl(${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export type ContrastRating = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/** WCAG 2.x: 7 AAA, 4.5 AA (body text), 3 AA Large (large text and UI icons). */
export function rateContrast(ratio: number): ContrastRating {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

/** Which of white or near-black text reads better on a swatch. */
export function bestTextOn(bg: string, light = '#FFFFFF', dark = '#0A0A0A') {
  const onLight = contrastRatio(bg, light);
  const onDark = contrastRatio(bg, dark);
  return onLight >= onDark ? { color: light, ratio: onLight } : { color: dark, ratio: onDark };
}
