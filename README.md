# Tabs Design System

The design system behind [Tabs](https://jointabs.com), a library of UI patterns from African digital products: colour, typography and React components, documented with live controls and copyable code. New work on Tabs starts here, then ships to the product.

Docs: `design.jointabs.com` (coming soon).

## Getting started

Requires Node 20.9 or newer.

```bash
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Builds tokens, then starts the docs site |
| `npm run build` | Builds tokens, then builds the site |
| `npm run lint` | Runs ESLint |
| `npm run tokens` | Regenerates `src/styles/tokens.css` from `src/tokens/tokens.json` |

## Colour

`src/tokens/tokens.json` is the source of truth; `tokens.css` is generated from it.

- **Palette**: brand colours, Paper and Night for the interface, Success and Error.
- **Semantic tokens**: named by purpose (`fg`, `surface`, `brand`, `danger`). Components use only these.
- Every text pair meets WCAG AA (4.5:1), disabled and placeholder text included.

## Status

Shipped: Button, Input, Tabs, Toast, Dropdown (icon, role, avatar, filter).
Next: the remaining product components, one at a time, then publishing the system as a package the product installs.

## Licence

[MIT](LICENSE). Fonts in `public/fonts` keep their own licences.

Built by [Dami Ojetunji](https://damiojetunji.com).
