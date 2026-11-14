'use client';

import { useState, useEffect } from 'react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { ArrowCounterClockwise } from '@phosphor-icons/react';

import tokens from '@/tokens/tokens.json';

type TypeCategory = 'display' | 'heading' | 'subheading' | 'body' | 'label';

interface TypeCardData {
  name: string;
  /** Figma text style name, e.g. "Display/Display 1". */
  figma: string;
  category: TypeCategory;
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: string;
  fontFamily: 'display' | 'sans';
  /** Generated utility, e.g. "type-display-1" (see src/styles/tokens.css). */
  tailwindClass: string;
  defaultSample: string;
}

const SAMPLES: Record<TypeCategory, string> = {
  display: 'Display',
  heading: 'Heading',
  subheading: 'Subheading text',
  body: 'Body copy for reading in the interface.',
  label: 'Button label',
};

// Text styles come from Figma via `npm run tokens:figma` -> src/tokens/tokens.json.
const allTokens: TypeCardData[] = Object.entries(
  tokens.typography as Record<
    string,
    { figma: string; family: string; size: string; lineHeight: string; letterSpacing: string; weight: number }
  >,
).map(([key, t]) => {
  const category = key.split('-')[0] as TypeCategory;
  const name = t.figma.split('/').pop()!.trim();
  return {
    name: category === 'label' ? `Label ${name}` : name,
    figma: t.figma,
    category,
    size: t.size,
    lineHeight: t.lineHeight,
    letterSpacing: t.letterSpacing,
    weight: String(t.weight),
    fontFamily: t.family === 'display' ? 'display' : 'sans',
    tailwindClass: `type-${key}`,
    defaultSample: category === 'label' || category === 'display' || category === 'heading' ? name : SAMPLES[category],
  };
});

// Show Displays first, in the same order the Figma file groups them.
const CATEGORY_ORDER: TypeCategory[] = ['display', 'heading', 'subheading', 'body', 'label'];
allTokens.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));

const filters = [
  { label: 'All Categories', value: 'all' },
  { label: 'Displays', value: 'display' },
  { label: 'Headings', value: 'heading' },
  { label: 'Subheadings', value: 'subheading' },
  { label: 'Body', value: 'body' },
  { label: 'Labels', value: 'label' },
];

export default function TypographyPage() {
  const [selectedToken, setSelectedToken] = useState<TypeCardData>(allTokens[0]);
  const [customText, setCustomText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { 
    setInspectorContent, 
    setCustomControls, 
    setCodeSnippet, 
    setComponentTitle, 
    setComponentCategory 
  } = useDesignSystem();

  const wittyPlaceholder = "Design systems are just fancy rules we break with style.";
  const displayText = customText.trim() !== '' ? customText : selectedToken.defaultSample;

  const filteredTokens = activeFilter === 'all' 
    ? allTokens 
    : allTokens.filter(t => t.category === activeFilter);

  useEffect(() => {
    // Dynamically update the CodeDrawer header badge and category
    setComponentTitle('Typography');
    setComponentCategory(selectedToken.name);

    // 1. Inspector Metadata Header
    setInspectorContent({
      title: 'Typography Tokens',
      description: 'Creato Display handles headers, while Mona Sans controls body, paragraphs, and labels. Names and values match the Figma text styles.',
      propsList: [
        { prop: 'Token', type: 'string', defaultVal: selectedToken.tailwindClass },
        { prop: 'Figma', type: 'style', defaultVal: selectedToken.figma },
        { prop: 'Size', type: 'string', defaultVal: selectedToken.size },
        { prop: 'Height', type: 'string', defaultVal: selectedToken.lineHeight },
        { prop: 'Spacing', type: 'string', defaultVal: selectedToken.letterSpacing },
        { prop: 'Weight', type: 'string', defaultVal: selectedToken.weight },
      ],
      compositionNotes: [
        `Font Family: ${selectedToken.fontFamily === 'display' ? 'Creato Display' : 'Mona Sans'}`,
        'Scaling and responsive metrics applied.'
      ],
    });

    // 2. Custom Controls rendered inside the Right Panel Control Room
    setCustomControls(
      <div className="flex flex-col gap-4">
        {/* Live Text Tester with Undo Reset Button */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-zinc-400 capitalize">Preview Text</label>
            {customText !== '' && (
              <button
                onClick={() => {
                  setCustomText('');
                  sounds.playToggle();
                }}
                className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
                title="Reset"
              >
                <ArrowCounterClockwise size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
          <input 
            type="text" 
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={wittyPlaceholder}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-zinc-400 capitalize">Filter Category</label>
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              sounds.playToggle();
            }}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* Token Selection Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-zinc-400 capitalize">Select Token</label>
          <select
            value={selectedToken.name}
            onChange={(e) => {
              const found = allTokens.find(t => t.name === e.target.value);
              if (found) {
                setSelectedToken(found);
                sounds.playClick();
              }
            }}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {filteredTokens.map((token) => (
              <option key={token.name} value={token.name}>
                {token.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );

    // 3. Dynamic Code Drawer Snippet tied directly to current state
    setCodeSnippet(`export function TypographySample() {
  return (
    <p className="${selectedToken.tailwindClass}">
      {/* Font Family: ${selectedToken.fontFamily === 'display' ? 'Creato Display' : 'Mona Sans'} */}
      {/* Line Height: ${selectedToken.lineHeight} | Spacing: ${selectedToken.letterSpacing} */}
      ${displayText}
    </p>
  );
}`);
  }, [selectedToken, customText, activeFilter]);

  return (
    <PreviewCanvas>
      <div className="flex flex-col items-center justify-center text-center w-full h-full my-auto px-4">
        <div 
          className={`text-zinc-900 dark:text-zinc-100 transition-all duration-200 break-words ${selectedToken.tailwindClass}`}
        >
          {displayText}
        </div>
      </div>
    </PreviewCanvas>
  );

  // return (
  //   <PreviewCanvas>
  //     {/* <div className="flex flex-col items-center text-center max-w-4xl px-4 py-8"> */}
  //     <div className="flex flex-col items-center justify-center text-center w-full h-full my-auto px-4">
  //       <div 
  //         className={`text-zinc-900 dark:text-zinc-100 transition-all duration-200 break-words ${selectedToken.tailwindClass}`}
  //         style={{ fontFamily: selectedToken.fontFamily === 'display' ? 'var(--font-display)' : 'inherit' }}
  //       >
  //         {displayText}
  //       </div>
  //     </div>
  //   </PreviewCanvas>
  // );
}