'use client';

import { useState, useEffect } from 'react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { ArrowCounterClockwise } from '@phosphor-icons/react';

interface TypeCardData {
  name: string;
  category: 'display' | 'heading' | 'subheading' | 'body' | 'action';
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: string;
  fontFamily: 'display' | 'mono';
  tailwindClass: string;
  defaultSample: string;
}

const allTokens: TypeCardData[] = [
  // Displays
  { name: 'Display 1', category: 'display', size: '72px', lineHeight: '84px', letterSpacing: '-4%', weight: '600', fontFamily: 'display', tailwindClass: 'text-[72px] leading-[84px] tracking-[-0.04em] font-semibold', defaultSample: 'Display 1' },
  { name: 'Display 2', category: 'display', size: '56px', lineHeight: '64px', letterSpacing: '-4%', weight: '600', fontFamily: 'display', tailwindClass: 'text-[56px] leading-[64px] tracking-[-0.04em] font-semibold', defaultSample: 'Display 2' },
  { name: 'Display 3', category: 'display', size: '40px', lineHeight: '48px', letterSpacing: '-1%', weight: '600', fontFamily: 'display', tailwindClass: 'text-[40px] leading-[48px] tracking-[-0.01em] font-semibold', defaultSample: 'Display 3' },
  { name: 'Display 4', category: 'display', size: '32px', lineHeight: '40px', letterSpacing: '-1%', weight: '600', fontFamily: 'display', tailwindClass: 'text-[32px] leading-[40px] tracking-[-0.01em] font-semibold', defaultSample: 'Display 4' },

  // Headings
  { name: 'Heading 1', category: 'heading', size: '24px', lineHeight: '32px', letterSpacing: '-2%', weight: '600', fontFamily: 'display', tailwindClass: 'text-2xl leading-8 tracking-[-0.02em] font-semibold', defaultSample: 'Heading 1' },
  { name: 'Heading 2', category: 'heading', size: '18px', lineHeight: '24px', letterSpacing: '-2%', weight: '600', fontFamily: 'display', tailwindClass: 'text-lg leading-6 tracking-[-0.02em] font-semibold', defaultSample: 'Heading 2' },
  { name: 'Heading 3', category: 'heading', size: '16px', lineHeight: '24px', letterSpacing: '-2%', weight: '600', fontFamily: 'display', tailwindClass: 'text-base leading-6 tracking-[-0.02em] font-semibold', defaultSample: 'Heading 3' },
  { name: 'Heading 4', category: 'heading', size: '14px', lineHeight: '20px', letterSpacing: '-2%', weight: '600', fontFamily: 'display', tailwindClass: 'text-sm leading-5 tracking-[-0.02em] font-semibold', defaultSample: 'Heading 4' },

  // Subheadings
  { name: 'Subheading 1', category: 'subheading', size: '16px', lineHeight: '24px', letterSpacing: '-2%', weight: '500', fontFamily: 'mono', tailwindClass: 'text-base leading-6 tracking-[-0.02em] font-medium', defaultSample: 'Subheading 1 Text' },
  { name: 'Subheading 2', category: 'subheading', size: '14px', lineHeight: '20px', letterSpacing: '-2%', weight: '500', fontFamily: 'mono', tailwindClass: 'text-sm leading-5 tracking-[-0.02em] font-medium', defaultSample: 'Subheading 2 Text' },

  // Body
  { name: 'Body 1', category: 'body', size: '20px', lineHeight: '28px', letterSpacing: '0%', weight: '400', fontFamily: 'mono', tailwindClass: 'text-xl leading-7 font-normal', defaultSample: 'Body 1 regular paragraph text for leading interfaces.' },
  { name: 'Body 2', category: 'body', size: '18px', lineHeight: '24px', letterSpacing: '0%', weight: '400', fontFamily: 'mono', tailwindClass: 'text-lg leading-6 font-normal', defaultSample: 'Body 2 standard descriptive text.' },
  { name: 'Body 3', category: 'body', size: '16px', lineHeight: '24px', letterSpacing: '-2%', weight: '400', fontFamily: 'mono', tailwindClass: 'text-base leading-6 tracking-[-0.02em] font-normal', defaultSample: 'Body 3 layout copy representation.' },
  { name: 'Body 4', category: 'body', size: '14px', lineHeight: '20px', letterSpacing: '-2%', weight: '400', fontFamily: 'mono', tailwindClass: 'text-sm leading-5 tracking-[-0.02em] font-normal', defaultSample: 'Body 4 secondary block copy.' },
  { name: 'Body 5', category: 'body', size: '12px', lineHeight: '16px', letterSpacing: '-2%', weight: '400', fontFamily: 'mono', tailwindClass: 'text-xs leading-4 tracking-[-0.02em] font-normal', defaultSample: 'Body 5 micro caption copy.' },

  // Actions
  { name: 'XSmall', category: 'action', size: '12px', lineHeight: '24px', letterSpacing: '-0.2px', weight: '600', fontFamily: 'mono', tailwindClass: 'text-[12px] leading-[24px] tracking-[-0.2px] font-semibold', defaultSample: 'Button X Small' },
  { name: 'Small', category: 'action', size: '14px', lineHeight: '21px', letterSpacing: '-0.2px', weight: '500', fontFamily: 'mono', tailwindClass: 'text-[14px] leading-[21px] tracking-[-0.2px] font-medium', defaultSample: 'Button Small' },
  { name: 'Medium', category: 'action', size: '15px', lineHeight: '24px', letterSpacing: '-0.2px', weight: '600', fontFamily: 'mono', tailwindClass: 'text-[15px] leading-[24px] tracking-[-0.2px] font-semibold', defaultSample: 'Button Medium' },
  { name: 'Large', category: 'action', size: '16px', lineHeight: '21px', letterSpacing: '-0.2px', weight: '500', fontFamily: 'mono', tailwindClass: 'text-[16px] leading-[21px] tracking-[-0.2px] font-medium', defaultSample: 'Button Large' },
  { name: 'XLarge', category: 'action', size: '20px', lineHeight: '21px', letterSpacing: '-0.2px', weight: '500', fontFamily: 'mono', tailwindClass: 'text-[20px] leading-[21px] tracking-[-0.2px] font-medium', defaultSample: 'Button X Large' },
];

const filters = [
  { label: 'All Categories', value: 'all' },
  { label: 'Displays', value: 'display' },
  { label: 'Headings', value: 'heading' },
  { label: 'Subheadings', value: 'subheading' },
  { label: 'Body', value: 'body' },
  { label: 'Actions', value: 'action' },
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
      description: 'Creato Display handles headers, while Mono Sans controls body, paragraphs, and actions.',
      propsList: [
        { prop: 'Token', type: 'string', defaultVal: selectedToken.name },
        { prop: 'Size', type: 'string', defaultVal: selectedToken.size },
        { prop: 'Height', type: 'string', defaultVal: selectedToken.lineHeight },
        { prop: 'Spacing', type: 'string', defaultVal: selectedToken.letterSpacing },
        { prop: 'Weight', type: 'string', defaultVal: selectedToken.weight },
      ],
      compositionNotes: [
        `Font Family: ${selectedToken.fontFamily === 'display' ? 'Creato Display' : 'Mono Sans'}`,
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
      {/* Font Family: ${selectedToken.fontFamily === 'display' ? 'Creato Display' : 'Mono Sans'} */}
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
          style={{ fontFamily: selectedToken.fontFamily === 'display' ? 'var(--font-display)' : 'inherit' }}
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