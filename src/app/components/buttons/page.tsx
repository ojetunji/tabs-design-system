'use client';

import { useEffect, useState } from 'react';
import { ArrowCounterClockwise, ArrowUpRight, CursorClick, Sparkle } from '@phosphor-icons/react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { Button, buttonSizes, buttonVariants, type ButtonSize, type ButtonVariant } from './Button';

const SIZE_LABELS: Record<ButtonSize, string> = { xs: 'XSmall', sm: 'Small', md: 'Medium', lg: 'Large' };
const VARIANT_LABELS: Record<ButtonVariant, string> = {
  solid: 'Solid',
  secondary: 'Secondary',
  flat: 'Flat',
  destructive: 'Destructive',
  destructiveLight: 'Destructive Light',
};
const ICON_SIZES: Record<ButtonSize, number> = { xs: 16, sm: 16, md: 18, lg: 20 };
const DEFAULT_LABEL = 'Button';

const fieldClass =
  'w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none';
const labelClass = 'text-[12px] font-medium text-zinc-400';

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-700 dark:text-zinc-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => {
          onChange(!checked);
          sounds.playToggle();
        }}
        className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
          checked ? 'bg-brand' : 'bg-zinc-300 dark:bg-zinc-700'
        }`}
      >
        <span
          className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

/** The exact JSX a consumer would write for the current control state. */
function buildSnippet(o: {
  variant: ButtonVariant;
  size: ButtonSize;
  label: string;
  disabled: boolean;
  loading: boolean;
  leading: boolean;
  trailing: boolean;
}) {
  const icons = [o.leading && 'Sparkle', o.trailing && 'ArrowUpRight'].filter(Boolean);
  const props = [
    o.variant !== 'solid' && `variant="${o.variant}"`,
    o.size !== 'md' && `size="${o.size}"`,
    o.disabled && 'disabled',
    o.loading && 'loading',
  ].filter(Boolean);
  const iconSize = ICON_SIZES[o.size];
  const children = [
    o.leading && `<Sparkle size={${iconSize}} />`,
    o.label,
    o.trailing && `<ArrowUpRight size={${iconSize}} />`,
  ].filter(Boolean);

  const open = `<Button${props.length ? ` ${props.join(' ')}` : ''}>`;
  const body =
    children.length === 1 ? `${open}${children[0]}</Button>` : `${open}\n  ${children.join('\n  ')}\n</Button>`;

  return [
    icons.length ? `import { ${icons.join(', ')} } from '@phosphor-icons/react';` : null,
    `import { Button } from '@/app/components/buttons/Button';`,
    '',
    body,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export default function ButtonsPage() {
  const [size, setSize] = useState<ButtonSize>('md');
  const [variant, setVariant] = useState<ButtonVariant>('solid');
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const [leading, setLeading] = useState(false);
  const [trailing, setTrailing] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    setInspectorContent,
    setCustomControls,
    setCodeSnippet,
    setComponentTitle,
    setComponentCategory,
    setComponentIcon,
  } = useDesignSystem();

  useEffect(() => {
    setComponentTitle('Button');
    setComponentIcon(<CursorClick size={14} />);
    setComponentCategory(`${SIZE_LABELS[size]} / ${VARIANT_LABELS[variant]}`);

    setInspectorContent({
      title: 'Button',
      description: 'The button Tabs ships today: five variants, four sizes, with disabled and loading states.',
      propsList: [
        { prop: 'variant', type: Object.keys(buttonVariants).join(' | '), defaultVal: 'solid' },
        { prop: 'size', type: Object.keys(buttonSizes).join(' | '), defaultVal: 'md' },
        { prop: 'loading', type: 'boolean', defaultVal: 'false' },
        { prop: 'loadingText', type: 'ReactNode', defaultVal: '-' },
        { prop: 'disabled', type: 'boolean', defaultVal: 'false' },
      ],
      compositionNotes: [
        'Values mirror the button recipe in the Tabs platform (theme.ts).',
        'Icons are passed as children, before or after the label.',
        'Disabled states use their own colours, not reduced opacity.',
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="button-label" className={labelClass}>
              Label
            </label>
            {label !== DEFAULT_LABEL && (
              <button
                type="button"
                onClick={() => {
                  setLabel(DEFAULT_LABEL);
                  sounds.playToggle();
                }}
                className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              >
                <ArrowCounterClockwise size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
          <input id="button-label" type="text" value={label} onChange={(e) => setLabel(e.target.value)} className={fieldClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Size</label>
          <select
            value={size}
            onChange={(e) => {
              setSize(e.target.value as ButtonSize);
              sounds.playClick();
            }}
            className={`${fieldClass} cursor-pointer`}
          >
            {(Object.keys(buttonSizes) as ButtonSize[]).map((s) => (
              <option key={s} value={s}>
                {SIZE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Variant</label>
          <select
            value={variant}
            onChange={(e) => {
              setVariant(e.target.value as ButtonVariant);
              sounds.playClick();
            }}
            className={`${fieldClass} cursor-pointer`}
          >
            {(Object.keys(buttonVariants) as ButtonVariant[]).map((v) => (
              <option key={v} value={v}>
                {VARIANT_LABELS[v]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <span className={labelClass}>States & icons</span>
          <Toggle label="Disabled" checked={disabled} onChange={setDisabled} />
          <Toggle label="Loading" checked={loading} onChange={setLoading} />
          <Toggle label="Leading icon" checked={leading} onChange={setLeading} />
          <Toggle label="Trailing icon" checked={trailing} onChange={setTrailing} />
        </div>
      </div>,
    );

    setCodeSnippet(buildSnippet({ variant, size, label, disabled, loading, leading, trailing }));
  }, [
    size,
    variant,
    label,
    leading,
    trailing,
    disabled,
    loading,
    setInspectorContent,
    setCustomControls,
    setCodeSnippet,
    setComponentTitle,
    setComponentCategory,
    setComponentIcon,
  ]);

  const iconSize = ICON_SIZES[size];

  return (
    <PreviewCanvas>
      <Button variant={variant} size={size} disabled={disabled} loading={loading} onClick={() => sounds.playClick()}>
        {leading && <Sparkle size={iconSize} className="shrink-0" />}
        {label}
        {trailing && <ArrowUpRight size={iconSize} className="shrink-0" />}
      </Button>
    </PreviewCanvas>
  );
}
