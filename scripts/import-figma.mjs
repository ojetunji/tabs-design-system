// Imports Figma styles (src/tokens/figma/figma-export.json) into src/tokens/tokens.json.
// Run with `npm run tokens:figma` after re-exporting from Figma.
//
// - Text styles   -> tokens.typography  (Figma wins: replaced on every import)
// - Effect styles -> tokens.shadow      (Figma wins: replaced on every import)
// - Colour styles -> coverage report only, until the export includes colour values.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const exportPath = resolve(root, process.argv[2] ?? 'src/tokens/figma/figma-export.json');
const tokensPath = resolve(root, 'src/tokens/tokens.json');

const figma = JSON.parse(readFileSync(exportPath, 'utf8')).styles;
const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));

const kebab = (s) => s.trim().toLowerCase().replace(/\s+/g, '-');
const round = (n, places = 2) => Number(Number(n).toFixed(places));

/** "-2%" -> "-0.02em", "-0.20000000298023224px" -> "-0.2px", "0%" -> "0" */
function letterSpacing(value) {
  if (value.endsWith('%')) {
    const em = round(parseFloat(value) / 100, 3);
    return em === 0 ? '0' : `${em}em`;
  }
  const px = round(parseFloat(value));
  return px === 0 ? '0' : `${px}px`;
}

/** "Display/Display 1" -> "display-1"; "Heading/Subheading 1" -> "subheading-1"; "Label/X Small" -> "label-x-small" */
function typeName(figmaName) {
  const [group, style] = figmaName.split('/').map((p) => p.trim());
  const g = kebab(group);
  const s = kebab(style);
  return s.startsWith(`${g}-`) || s.startsWith('subheading') ? s : `${g}-${s}`;
}

const FAMILIES = { 'Creato Display': 'display', 'Mona Sans': 'sans' };

const typography = {};
for (const style of figma.textStyles) {
  const name = typeName(style.name);
  const family = FAMILIES[style.fontFamily];
  if (!family) throw new Error(`Unknown font family "${style.fontFamily}" in ${style.name}`);
  typography[name] = {
    figma: style.name,
    family,
    size: style.fontSize,
    lineHeight: style.lineHeight,
    letterSpacing: letterSpacing(style.letterSpacing),
    weight: Number(style.fontWeight),
  };
}

const shadow = {};
for (const style of figma.effectStyles) {
  const name = kebab(style.name.split('/').pop()); // "Shadow / 2xl" -> "2xl"
  shadow[name] = {
    figma: style.name,
    value: style.effects
      .map((e) => `${e.type === 'inner-shadow' ? 'inset ' : ''}${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.color}`)
      .join(', '),
  };
}

// Colour styles: "Primary/Tabs Blue/Base" -> palette.primary["tabs-blue"].base (group dropped from token names).
// Only styles that carry a value overwrite the palette; a family is marked "figma" once every step has one.
const colours = figma.colors;
const colourValue = (c) => c.value ?? c.color ?? c.hex ?? null;
let imported = 0;
const missing = [];
for (const style of colours) {
  const [group, family, step] = style.name.split('/').map(kebab);
  const scale = ((tokens.palette[group] ??= {})[family] ??= { $status: 'awaiting-figma' });
  const value = colourValue(style);
  if (value) {
    scale[step] = typeof value === 'string' && value.startsWith('#') ? value.toUpperCase() : value;
    imported += 1;
  } else {
    if (!(step in scale)) scale[step] = null;
    missing.push(style.name);
  }
}
for (const group of Object.values(tokens.palette)) {
  for (const [family, scale] of Object.entries(group)) {
    const figmaSteps = colours.filter((c) => kebab(c.name.split('/')[1]) === family);
    if (figmaSteps.length && figmaSteps.every((c) => colourValue(c))) scale.$status = 'figma';
  }
}

tokens.typography = typography;
tokens.shadow = shadow;
writeFileSync(tokensPath, `${JSON.stringify(tokens, null, 2)}\n`);

console.log(`figma: ${Object.keys(typography).length} text styles -> tokens.typography`);
console.log(`figma: ${Object.keys(shadow).length} effect styles -> tokens.shadow`);
console.log(
  `figma: ${imported}/${colours.length} colour styles had values -> tokens.palette` +
    (missing.length ? ` (${missing.length} without values keep their current or provisional value)` : ''),
);
