'use client';

import { useState, useEffect } from 'react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { MultiSelect, MultiSelectOption } from '@/app/components/multi-select/MultiSelect';
import { CheckSquare } from '@phosphor-icons/react';

const INITIAL_OPTIONS: MultiSelectOption[] = [
  { id: '1', label: 'Launch screens' },
  { id: '2', label: 'Guided tours' },
  { id: '3', label: 'Account Set Up' },
  { id: '4', label: 'Log in' },
  { id: '5', label: 'Verification' },
  { id: '6', label: 'Search bar' },
];

export default function MultiSelectPage() {
  const [variant, setVariant] = useState<'default' | 'active' | 'selected'>('default');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Sync state when customizer variant dropdown changes
  useEffect(() => {
    if (variant === 'default') {
      setSelectedIds([]);
      setIsOpen(false);
    } else if (variant === 'active') {
      setIsOpen(true);
    } else if (variant === 'selected') {
      setSelectedIds(['1', '6']);
      setIsOpen(false); // Popover closed for selected variant
    }
  }, [variant]);

  const { 
    setInspectorContent, 
    setCustomControls, 
    setCodeSnippet, 
    setComponentTitle, 
    setComponentCategory,
    setComponentIcon 
  } = useDesignSystem();

  useEffect(() => {
    setComponentTitle('Multi-select');
    setComponentIcon(<CheckSquare size={14} strokeWidth={1.5} />);
    setComponentCategory('Form / MultiSelect');

    setInspectorContent({
      title: 'Multi-select Component',
      description: 'Filter dropdown popover with search bar input, section headers, and selected states.',
      propsList: [
        { prop: 'Variant', type: 'enum', defaultVal: variant },
      ],
      compositionNotes: [
        'Trigger button matches 100px rounded pill button specifications.',
        'Selected options automatically jump to the top of the list.',
        'Popover height dynamically hugs content.'
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-700 dark:text-zinc-300">Variants</span>
          <select
            value={variant}
            onChange={(e) => {
              setVariant(e.target.value as 'default' | 'active' | 'selected');
              sounds.playClick();
            }}
            className="w-full h-[36px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="active">Active (Dropdown Open)</option>
            <option value="selected">Selected State</option>
          </select>
        </div>
      </div>
    );

    setCodeSnippet(`import { useState } from 'react';
import { MultiSelect } from '@/app/components/multi-select/MultiSelect';

export default function CustomMultiSelect() {
  const [selected, setSelected] = useState<string[]>([]);

  const options = [
    { id: '1', label: 'Launch screens' },
    { id: '2', label: 'Guided tours' },
    { id: '3', label: 'Account Set Up' },
  ];

  return (
    <MultiSelect 
      label="Screens"
      options={options}
      selectedIds={selected}
      onChange={setSelected}
    />
  );
}`);
  }, [variant]);

  return (
    // <PreviewCanvas>
    //   <div className="flex items-start justify-center w-full pt-16">
    //     <MultiSelect 
    //       label="Screens"
    //       options={INITIAL_OPTIONS}
    //       selectedIds={selectedIds}
    //       onChange={setSelectedIds}
    //       isOpen={isOpen}
    //       onOpenChange={setIsOpen}
    //     />
    //   </div>
    // </PreviewCanvas>
  <PreviewCanvas align="top">
  <MultiSelect 
    label="Screens"
    options={INITIAL_OPTIONS}
    selectedIds={selectedIds}
    onChange={setSelectedIds}
    isOpen={isOpen}
    onOpenChange={setIsOpen}
  />
</PreviewCanvas>);
}