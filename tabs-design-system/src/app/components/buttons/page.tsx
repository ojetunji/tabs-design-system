'use client';

import { useState, useEffect } from 'react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { CursorClick, ArrowUpRight, Sparkle, ArrowCounterClockwise } from '@phosphor-icons/react';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'destructive-light' | 'link';

interface ButtonSizeConfig {
  size: ButtonSize;
  label: string;
  nameDisplay: string;
  classes: string;
  iconSize: number;
}

const buttonSizes: Record<ButtonSize, ButtonSizeConfig> = {
  xs: { size: 'xs', label: 'Button xs', nameDisplay: 'XSmall', classes: 'h-[36px] px-[12px] text-[12px] font-medium leading-[16px] tracking-[-0.1px] gap-[6px]', iconSize: 16 },
  sm: { size: 'sm', label: 'Button sm', nameDisplay: 'Small', classes: 'h-[40px] px-[15px] text-[14px] font-medium leading-[20px] tracking-[-0.15px] gap-[6px]', iconSize: 16 },
  md: { size: 'md', label: 'Button md', nameDisplay: 'Medium', classes: 'h-[44px] px-[20px] text-[16px] font-medium leading-[24px] tracking-[-0.2px] gap-[6px]', iconSize: 18 },
  lg: { size: 'lg', label: 'Button lg', nameDisplay: 'Large', classes: 'h-[46px] px-[20px] text-[18px] font-medium leading-[24px] tracking-[-0.2px] gap-[6px]', iconSize: 20 },
  xl: { size: 'xl', label: 'Button xl', nameDisplay: 'XLarge', classes: 'h-[46px] px-[20px] text-[20px] font-medium leading-[28px] tracking-[-0.25px] gap-[6px]', iconSize: 24 },
};

const variants: { label: string; value: ButtonVariant; classes: string }[] = [
  { label: 'Primary', value: 'primary', classes: 'bg-[#0074FC] text-white hover:bg-[#005DCA]' },
  { label: 'Secondary', value: 'secondary', classes: 'bg-white text-[#333333] border border-[#E8E8E8] hover:bg-[#F8F9FA]' },
  { label: 'Destructive', value: 'destructive', classes: 'bg-[#DC3545] text-white hover:bg-opacity-90' },
  { label: 'Destructive Light', value: 'destructive-light', classes: 'bg-[#F8D7DA] text-[#721C24] hover:bg-opacity-80' },
  { label: 'Link', value: 'link', classes: 'bg-transparent text-[#333333] p-0 h-auto hover:text-[#555555]' },
];

export default function ButtonsPage() {
  const [selectedSize, setSelectedSize] = useState<ButtonSize>('md');
  const [selectedVariant, setSelectedVariant] = useState<ButtonVariant>('primary');
  const [buttonText, setButtonText] = useState('Button md');
  const [hasLeadingIcon, setHasLeadingIcon] = useState(false);
  const [hasTrailingIcon, setHasTrailingIcon] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const { 
    setInspectorContent, 
    setCustomControls, 
    setCodeSnippet, 
    setComponentTitle, 
    setComponentCategory,
    setComponentIcon 
  } = useDesignSystem();

  const currentSizeConfig = buttonSizes[selectedSize];
  const currentVariantConfig = variants.find(v => v.value === selectedVariant)?.classes || '';

  const handleSizeChange = (newSize: ButtonSize) => {
    setSelectedSize(newSize);
    setButtonText(buttonSizes[newSize].label);
    sounds.playClick();
  };

  useEffect(() => {
    setComponentTitle('Button');
    setComponentIcon(<CursorClick size={14} strokeWidth={1.5} />);
    setComponentCategory(`${currentSizeConfig.nameDisplay} / ${selectedVariant}`);

    setInspectorContent({
      title: 'Buttons',
      description: 'Featuring interactive variants, states, add-ons, and stroke icons.',
      propsList: [
        { prop: 'Size', type: 'string', defaultVal: currentSizeConfig.nameDisplay },
        { prop: 'Variant', type: 'string', defaultVal: selectedVariant },
        { prop: 'Disabled', type: 'boolean', defaultVal: String(isDisabled) },
        { prop: 'Leading Icon', type: 'boolean', defaultVal: String(hasLeadingIcon) },
        { prop: 'Trailing Icon', type: 'boolean', defaultVal: String(hasTrailingIcon) },
      ],
      compositionNotes: [
        'Buttons scale using the standard design system actions typography scale.',
        'Icons are set at a strict 1.5px stroke width.'
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-4">
        {/* Button Label Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-zinc-400 capitalize">Label</label>
            {buttonText !== buttonSizes[selectedSize].label && (
              <button
                onClick={() => {
                  setButtonText(buttonSizes[selectedSize].label);
                  sounds.playToggle();
                }}
                className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              >
                <ArrowCounterClockwise size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
          <input 
            type="text" 
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Size Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-zinc-400 capitalize">Size</label>
          <select
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value as ButtonSize)}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {Object.keys(buttonSizes).map((s) => (
              <option key={s} value={s}>{buttonSizes[s as ButtonSize].nameDisplay}</option>
            ))}
          </select>
        </div>

        {/* Variant Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-zinc-400 capitalize">Variant</label>
          <select
            value={selectedVariant}
            onChange={(e) => {
              setSelectedVariant(e.target.value as ButtonVariant);
              sounds.playClick();
            }}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {variants.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Toggles Group */}
        <div className="flex flex-col gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <label className="text-[12px] font-medium text-zinc-400 capitalize">States & Addons</label>
          
          {/* Disabled State Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-700 dark:text-zinc-300">Disabled State</span>
            <button 
              type="button"
              onClick={() => {
                setIsDisabled(!isDisabled);
                sounds.playToggle();
              }}
              className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                isDisabled ? 'bg-[#0074FC]' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${
                isDisabled ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Leading Icon Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-700 dark:text-zinc-300">Leading Icon</span>
            <button 
              type="button"
              onClick={() => {
                setHasLeadingIcon(!hasLeadingIcon);
                sounds.playToggle();
              }}
              className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                hasLeadingIcon ? 'bg-[#0074FC]' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${
                hasLeadingIcon ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Trailing Icon Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-700 dark:text-zinc-300">Trailing Icon</span>
            <button 
              type="button"
              onClick={() => {
                setHasTrailingIcon(!hasTrailingIcon);
                sounds.playToggle();
              }}
              className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                hasTrailingIcon ? 'bg-[#0074FC]' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${
                hasTrailingIcon ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
    );

    const linkDisabledClass = selectedVariant === 'link' && isDisabled ? 'text-[#A3A3A3] cursor-not-allowed' : '';
    const generalDisabledClass = isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

    setCodeSnippet(`export function CustomButton() {
  return (
    <button 
      disabled={${isDisabled}}
      className="inline-flex items-center justify-center rounded-[100px] border border-transparent whitespace-nowrap transition-all box-border ${currentSizeConfig.classes} ${currentVariantConfig} ${linkDisabledClass} ${generalDisabledClass}"
    >
      ${hasLeadingIcon ? `<Sparkle size={${currentSizeConfig.iconSize}} strokeWidth={1.5} />\n      ` : ''}<span>${buttonText}</span>${hasTrailingIcon ? `\n      <ArrowRight size={${currentSizeConfig.iconSize}} strokeWidth={1.5} />` : ''}
    </button>
  );
}`);
  }, [selectedSize, selectedVariant, buttonText, hasLeadingIcon, hasTrailingIcon, isDisabled]);

  const linkDisabledStyle = selectedVariant === 'link' && isDisabled ? 'text-[#A3A3A3] cursor-not-allowed' : '';
  const generalDisabledStyle = isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <PreviewCanvas>
      <div className="flex items-center justify-center w-full h-full my-auto">
        <button 
          disabled={isDisabled}
          onClick={() => sounds.playClick()}
          className={`inline-flex items-center justify-center rounded-[100px] border border-transparent whitespace-nowrap transition-all duration-150 box-border select-none ${currentSizeConfig.classes} ${currentVariantConfig} ${linkDisabledStyle} ${generalDisabledStyle}`}
        >
          {hasLeadingIcon && <Sparkle size={currentSizeConfig.iconSize} strokeWidth={1.5} className="shrink-0" />}
          <span>{buttonText}</span>
          {hasTrailingIcon && <ArrowUpRight size={currentSizeConfig.iconSize} strokeWidth={1.5} className="shrink-0" />}
        </button>
      </div>
    </PreviewCanvas>
  );
}