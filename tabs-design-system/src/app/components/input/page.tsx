'use client';

import { useState, useEffect } from 'react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { Input, InputVariant } from '@/app/components/input/Input';
import { MagnifyingGlass } from '@phosphor-icons/react';

export default function InputPage() {
  const [selectedVariant, setSelectedVariant] = useState<InputVariant>('basic');
  const [inputLabel, setInputLabel] = useState('Email address');
  const [showLabel, setShowLabel] = useState(true);
  const [helpText, setHelpText] = useState('Info that helps a user with this field');
  const [showHelpText, setShowHelpText] = useState(true);
  const [inputState, setInputState] = useState<'default' | 'error' | 'disabled'>('default');
  const [inputValue, setInputValue] = useState('');

  const { 
    setInspectorContent, 
    setCustomControls, 
    setCodeSnippet, 
    setComponentTitle, 
    setComponentCategory,
    setComponentIcon 
  } = useDesignSystem();

  useEffect(() => {
    setComponentTitle('Input');
    setComponentIcon(<MagnifyingGlass size={14} strokeWidth={1.5} />);
    setComponentCategory(`Form / ${selectedVariant}`);

    setInspectorContent({
      title: 'Input Component',
      description: 'Robust form controls featuring built-in state validation, dynamic prefix handling, and integrated icon attachments.',
      propsList: [
        { prop: 'Variant', type: 'string', defaultVal: selectedVariant },
        { prop: 'State', type: 'string', defaultVal: inputState },
        { prop: 'Label', type: 'boolean', defaultVal: String(showLabel) },
        { prop: 'Help Text', type: 'boolean', defaultVal: String(showHelpText) },
      ],
      compositionNotes: [
        'Inputs utilize precision boundary outlines with responsive focus and error state transitions.',
        'Password and icon wrappers are structurally decoupled from native inputs for exact padding alignment.'
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-4">
        {/* Label Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-zinc-400 capitalize tracking-wider">Field Label</label>
          <input 
            type="text" 
            value={inputLabel}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputLabel(e.target.value)}
            className="w-full h-[42px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 text-xs text-zinc-900 dark:text-white focus:outline-none flex items-center"
          />
        </div>

        {/* Variant Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-zinc-400 capitalize tracking-wider">Variant</label>
          <select
            value={selectedVariant}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedVariant(e.target.value as InputVariant);
              sounds.playClick();
            }}
            className="w-full h-[42px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 text-xs text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="basic">Basic</option>
            <option value="left-icon">Left Icon</option>
            <option value="right-icon">Right Icon</option>
            <option value="two-side-icons">Two Side Icons</option>
            <option value="prefix">Prefix</option>
            <option value="password">Password</option>
          </select>
        </div>

        {/* State Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-zinc-400 capitalize tracking-wider">State</label>
          <select
            value={inputState}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setInputState(e.target.value as any);
              sounds.playClick();
            }}
            className="w-full h-[42px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 text-xs text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="error">Error</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Help Text Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-zinc-400 capitalize tracking-wider">Help Text</label>
          <input 
            type="text" 
            value={helpText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHelpText(e.target.value)}
            className="w-full h-[42px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 text-xs text-zinc-900 dark:text-white focus:outline-none flex items-center"
          />
        </div>

        {/* Addons & Toggles Group */}
        <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
          <label className="text-[12px] font-medium text-zinc-400 capitalize tracking-wider">Addons & Elements</label>
          
          {/* Toggle Label */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-700 dark:text-zinc-300">Show Label</span>
            <button 
              type="button"
              onClick={() => {
                setShowLabel(!showLabel);
                sounds.playToggle();
              }}
              className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                showLabel ? 'bg-[#0074FC]' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${
                showLabel ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Toggle Help Text */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-700 dark:text-zinc-300">Show Help Text</span>
            <button 
              type="button"
              onClick={() => {
                setShowHelpText(!showHelpText);
                sounds.playToggle();
              }}
              className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                showHelpText ? 'bg-[#0074FC]' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${
                showHelpText ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
    );

    setCodeSnippet(`import { Input } from '@/app/components/input/Input';

export default function CustomInput() {
  return (
    <Input 
      variant="${selectedVariant}"
      label="${inputLabel}"
      showLabel={${showLabel}}
      helpText="${helpText}"
      showHelpText={${showHelpText}}
      state="${inputState}"
    />
  );
}`);
  }, [selectedVariant, inputLabel, showLabel, helpText, showHelpText, inputState]);

  return (
    <PreviewCanvas>
      <div className="flex items-center justify-center w-full h-full my-auto">
        <Input 
          variant={selectedVariant}
          label={inputLabel}
          showLabel={showLabel}
          helpText={helpText}
          showHelpText={showHelpText}
          state={inputState}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </PreviewCanvas>
  );
}