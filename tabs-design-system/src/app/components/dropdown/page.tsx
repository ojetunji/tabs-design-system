'use client';

import React, { useState, useEffect } from 'react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { IconDropdown, AvatarDropdown, InputDropdown } from '@/app/components/dropdown/Dropdown';
import { CaretDown } from '@phosphor-icons/react';
import { sounds } from '@/lib/sounds';

type DropdownVariant = 'input' | 'icon' | 'avatar';

export default function DropdownPage() {
  const [variant, setVariant] = useState<DropdownVariant>('input');

  const { 
    setInspectorContent, 
    setCustomControls, 
    setCodeSnippet, 
    setComponentTitle, 
    setComponentCategory,
    setComponentIcon,
    isCodeDrawerOpen 
  } = useDesignSystem();

  useEffect(() => {
    setComponentTitle('Dropdown Menus');
    setComponentIcon(<CaretDown size={14} strokeWidth={1.5} />);
    setComponentCategory('Navigation / Overlays');

    setInspectorContent({
      title: 'Dropdown Family',
      description: 'Versatile menu overlays supporting input selection lists, morphing icon menu, and user details.',
      propsList: [
        { prop: 'Variant', type: 'enum', defaultVal: 'input' },
        { prop: 'Animation', type: 'spring', defaultVal: 'stiffness: 400' },
      ],
      compositionNotes: [
        'Features spring-physics scaling transitions via Framer Motion.',
        'Supports single-select checkmark logic for form inputs.',
        // 'Includes spatial audio triggers on interaction.'
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-700 dark:text-zinc-300">Variants</span>
        <select
          value={variant}
          onChange={(e) => {
            setVariant(e.target.value as DropdownVariant);
            sounds.playClick();
          }}
          className="w-full h-[36px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
        >
          <option value="input">Input Dropdown (Role)</option>
          <option value="icon">Icon Dropdown</option>
          <option value="avatar">Avatar Dropdown</option>
        </select>
      </div>
    );

    setCodeSnippet(`import { useState } from 'react';
import { InputDropdown, IconDropdown, AvatarDropdown } from '@/components/dropdown/Dropdown';

export default function DropdownDemo() {
  return (
    <div className="relative">
      <InputDropdown />
    </div>
  );
}`);
  }, [variant]);

//   return (
//     <PreviewCanvas>
//       <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[350px] p-6">
//         {variant === 'input' && <InputDropdown />}
//         {variant === 'icon' && <IconDropdown />}
//         {variant === 'avatar' && <AvatarDropdown />}
//       </div>
//     </PreviewCanvas>
//   );
return (
    <PreviewCanvas>
      {/* Changed justify-center to justify-start and added pt-12 to anchor content near the top */}
      <div className="relative w-full h-full flex flex-col items-center justify-start pt-12 min-h-[350px] p-6">
        {variant === 'input' && <InputDropdown />}
        {variant === 'icon' && <IconDropdown />}
        {variant === 'avatar' && <AvatarDropdown />}
      </div>
    </PreviewCanvas>
  );
// return (
//   <PreviewCanvas>
//     {/* Dynamic vertical positioning so it stays centered inside the reduced visible space when code drawer is open */}
//     <div className={`relative w-full h-full flex flex-col items-center justify-center p-6 transition-all duration-300 ${
//       isCodeDrawerOpen ? 'pb-40 pt-4' : ''
//     }`}>
//       {variant === 'input' && <InputDropdown />}
//       {variant === 'icon' && <IconDropdown />}
//       {variant === 'avatar' && <AvatarDropdown />}
//     </div>
//   </PreviewCanvas>
// );
// return (
//   <PreviewCanvas align={isCodeDrawerOpen ? 'top' : 'center'}>
//     <div className={`relative w-full h-full flex flex-col items-center p-6 transition-all duration-300 ${
//       isCodeDrawerOpen ? 'pt-8' : 'justify-center'
//     }`}>
//       {variant === 'input' && <InputDropdown />}
//       {variant === 'icon' && <IconDropdown />}
//       {variant === 'avatar' && <AvatarDropdown />}
//     </div>
//   </PreviewCanvas>
// );
}