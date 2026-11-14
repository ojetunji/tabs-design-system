# Tabs Design System

The design system behind [Tabs](https://github.com/use-tabs/tabs), a library of UI patterns from African digital products.

It documents the tokens, typography and components the product ships today, with live controls and copyable code. From here on, every new iteration is designed and built in the system first, then shipped to the product.

The docs site will be published at `design.jointabs.com`.

## How it relates to Tabs

| Repo | Role |
| --- | --- |
| [use-tabs/tabs](https://github.com/use-tabs/tabs) | The product: landing page, browse, search, auth, account, pricing |
| This repo | The system: tokens, components and their documentation |

The system starts from what is live. Values are taken from the product's code (its `theme.ts` recipes and component classes), not invented here. Anything marked **In product** on the colour page comes straight from the platform.

The product currently styles its components with Chakra UI. The plan is for it to consume this system instead:

1. The product reads the tokens generated here, replacing its hard-coded colours.
2. Simple components (Button, Badge, Input, Textarea) move over.
3. Components with complex behaviour (Dialog, Select, Popover, Dropdown menu) follow.
4. Chakra UI is removed once nothing imports it.

## Getting started

Requires Node 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `npm run dev` | Builds tokens, then starts the docs site |
| `npm run build` | Builds tokens, then builds the site for production |
| `npm run lint` | Runs ESLint |
| `npm run tokens` | Regenerates `src/styles/tokens.css` from `src/tokens/tokens.json` |
| `npm run tokens:figma` | Imports a Figma export into `tokens.json`, then regenerates the CSS |

## Tokens

`src/tokens/tokens.json` is the single source of truth. Do not edit `src/styles/tokens.css` by hand; it is generated.

- **Palette**: raw colour scales such as `gray-700` and `error-600`.
- **Semantic tokens**: named by purpose, such as `fg`, `surface`, `line` and `brand`, each with a light and dark value. Components only use these.
- **Typography**: text styles imported from Figma, available as `type-*` utilities.
- **Shadows**: effect styles imported from Figma, available as `shadow-*` utilities.

To update from Figma, replace `src/tokens/figma/figma-export.json` and run `npm run tokens:figma`.

The product is light-only today. Dark values exist in the system but are not yet shipped.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Phosphor Icons.

## Project layout

| Path | Contents |
| --- | --- |
| `src/tokens/` | Token source (`tokens.json`) and the Figma export |
| `src/styles/tokens.css` | Generated CSS variables and Tailwind theme |
| `scripts/` | Token build and Figma import scripts |
| `src/app/foundations/` | Colour and typography pages |
| `src/app/components/` | Each component and its docs page |
| `src/components/` | The docs site itself: shell, sidebar, code drawer, inspector |
| `src/lib/registry.ts` | The list of pages; sidebar and search read from it |

## Status

**Aligned** means the component matches what the product ships and its docs page renders the real component. **Exists** means there is a version here that has not yet been checked against the product. **Missing** means the product uses it and the system does not have it yet.

### Foundations

| Foundation | Status |
| --- | --- |
| Colour | Neutral, error and Tabs Blue aligned; other palettes provisional |
| Typography | Exists |
| Spacing | Missing |
| Radius | Missing |
| Elevation | Tokens exist, no page |
| Motion | Missing |
| Icons | Missing; the product uses several icon libraries and needs one |

### Components

| Component | Status |
| --- | --- |
| Button | Aligned |
| Input | Exists |
| Filter dropdown (currently "Multi-Select") | Exists |
| Dropdown menu | Exists |
| Tabs | Exists |
| Toast | Exists |
| Field (label, help text, error) | Missing |
| Textarea | Missing |
| Select | Missing |
| Dialog | Missing |
| Popover | Missing |
| Tooltip | Missing |
| Filter chip | Missing |
| Badge | Missing |
| Avatar | Missing |
| Spinner | Missing |
| Skeleton | Missing |
| Empty state | Missing |
| Accordion | Missing |
| Banner | Missing |
| Card | Missing |

### Patterns

Larger pieces of the product to document once the components above are in place: search, header and navigation, masonry grid, carousel, Pro gating, auth layout, onboarding and pricing.

## Roadmap

- Align the remaining components to the product, starting with Input.
- Rename and regroup pages to match the product's own names.
- Split the repo into a published package (tokens and components) and the docs site, so the product can install the system from npm.
- Choose one icon library and define motion tokens.
- Restyle the docs site to match the product.

## Licence

[MIT](LICENSE). The licence covers the code in this repo. The font files in `public/fonts` remain under their own licences.

## Author

Built by [Dami Ojetunji](https://damiojetunji.com).
