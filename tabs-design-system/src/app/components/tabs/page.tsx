'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabItem } from '@/app/components/tabs/Tabs';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { Desktop, DeviceMobile, Laptop, Globe, Cpu, Sparkle, Rows } from '@phosphor-icons/react';

const ALL_TEXT_TABS: TabItem[] = [
  { id: 'app', label: 'App' },
  { id: 'screens', label: 'Screens' },
  { id: 'categories', label: 'Categories' },
  { id: 'ui-elements', label: 'UI Elements' },
  { id: 'user-flows', label: 'User Flows' },
  { id: 'ux-elements', label: 'UX Elements' },
];

const ALL_ICON_TABS: TabItem[] = [
  { id: 'desktop', icon: <Desktop size={16} strokeWidth={1.5} className="text-zinc-900" /> },
  { id: 'mobile', icon: <DeviceMobile size={16} strokeWidth={1.5} className="text-zinc-900" /> },
  { id: 'laptop', icon: <Laptop size={16} strokeWidth={1.5} className="text-zinc-900" /> },
  { id: 'globe', icon: <Globe size={16} strokeWidth={1.5} className="text-zinc-900" /> },
  { id: 'cpu', icon: <Cpu size={16} strokeWidth={1.5} className="text-zinc-900" /> },
  { id: 'sparkle', icon: <Sparkle size={16} strokeWidth={1.5} className="text-zinc-900" /> },
];

export default function TabsPage() {
  const [variant, setVariant] = useState<'text' | 'icon'>('text');
  const [itemCount, setItemCount] = useState<number>(3);

  const currentTabsSource = variant === 'text' ? ALL_TEXT_TABS : ALL_ICON_TABS;
  const activeTabs = currentTabsSource.slice(0, itemCount);

  // Default the active tab to the first item in the current slice
  const [activeTabId, setActiveTabId] = useState(activeTabs[0].id);

  const { 
    setInspectorContent, 
    setCustomControls, 
    setCodeSnippet, 
    setComponentTitle, 
    setComponentCategory,
    setComponentIcon 
  } = useDesignSystem();

  useEffect(() => {
    // If the active tab ID is no longer within the trimmed item count, reset it to the first tab
    if (!activeTabs.some((tab) => tab.id === activeTabId)) {
      setActiveTabId(activeTabs[0].id);
    }
  }, [itemCount, variant]);

  useEffect(() => {
    setComponentTitle('Tabs');
    setComponentIcon(<Rows size={14} strokeWidth={1.5} />);
    setComponentCategory('Navigation / Tabs');

    setInspectorContent({
      title: 'Tabs Component',
      description: 'Navigation container with layered sections of content and buttery-smooth spring transitions.',
      propsList: [
        { prop: 'Variant', type: 'enum', defaultVal: variant },
        { prop: 'Items Count', type: 'number', defaultVal: String(itemCount) },
      ],
      compositionNotes: [
        'Adjustable items up to 6 tabs with state management.',
        'Uses Framer Motion layoutId physics for buttery-smooth sliding transitions between active tabs.',
        'Inactive tabs use subtle inner shadows and muted gray text, while active states elevate with a crisp white background and dark text.'
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-4">
        {/* Variant Selector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-700 dark:text-zinc-300">Component Variant</span>
          <select
            value={variant}
            onChange={(e) => {
              const newVariant = e.target.value as 'text' | 'icon';
              setVariant(newVariant);
              const newSource = newVariant === 'text' ? ALL_TEXT_TABS : ALL_ICON_TABS;
              setActiveTabId(newSource[0].id);
              sounds.playClick();
            }}
            className="w-full h-[36px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="text">Text Tabs</option>
            <option value="icon">Icon Tabs</option>
          </select>
        </div>

        {/* Item Count Selector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-700 dark:text-zinc-300">Number of Tabs (Max 6)</span>
          <select
            value={itemCount}
            onChange={(e) => {
              setItemCount(Number(e.target.value));
              sounds.playClick();
            }}
            className="w-full h-[36px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value={2}>2 Items</option>
            <option value={3}>3 Items</option>
            <option value={4}>4 Items</option>
            <option value={5}>5 Items</option>
            <option value={6}>6 Items</option>
          </select>
        </div>
      </div>
    );

    setCodeSnippet(`import { useState } from 'react';
import { Tabs } from '@/app/components/tabs/Tabs';

export default function CustomTabs() {
  const [activeId, setActiveId] = useState('${activeTabs[0].id}');

  const tabs = [
    { id: '${activeTabs[0].id}', label: '${activeTabs[0].label || activeTabs[0].id}' },
    { id: '${activeTabs[1]?.id || 'next'}', label: '${activeTabs[1]?.label || 'Next'}' },
  ];

  return (
    <Tabs 
      tabs={tabs}
      activeId={activeId}
      onChange={setActiveId}
      variant="${variant}"
    />
  );
}`);
  }, [variant, itemCount, activeTabId]);

  return (
    <PreviewCanvas>
      <div className="flex flex-col items-center gap-6">
        <Tabs 
          tabs={activeTabs}
          activeId={activeTabId}
          onChange={setActiveTabId}
          variant={variant}
        />
      </div>
    </PreviewCanvas>
  );
}