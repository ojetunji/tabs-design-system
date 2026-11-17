'use client';

import { useEffect, useState } from 'react';
import { ArrowCounterClockwise, CursorClick, Cube } from '@phosphor-icons/react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import {
  Button,
  buttonIconSizes,
  buttonSizes,
  buttonVariants,
  type ButtonIconPosition,
  type ButtonSize,
  type ButtonVariant,
} from './Button';

// Names as they appear in the Figma component.
const SIZE_LABELS: Record<ButtonSize, string> = { xs: 'X Small', sm: 'Small', md: 'Medium', lg: 'Large', xl: 'X Large' };
const VARIANT_LABELS: Record<ButtonVariant, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  destructive: 'Destructive Primary',
  'destructive-light': 'Destructive Light',
  link: 'Link Grey',
};
type IconOption = 'none' | ButtonIconPosition;
const ICON_LABELS: Record<IconOption, string> = { none: 'No icon', left: 'Left side', right: 'Right side', only: 'Icon only' };
const DEFAULT_LABEL = 'Button';

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => {
          onChange(!checked);
          sounds.playToggle();
        }}
        className={`flex h-5 w-9 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
          checked ? 'bg-brand' : 'bg-surface-hover'
        }`}
      >
        <span
          className={`h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
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
  icon: IconOption;
  disabled: boolean;
  loading: boolean;
}) {
  const hasIcon = o.icon !== 'none';
  const props = [
    o.variant !== 'primary' && `variant="${o.variant}"`,
    o.size !== 'md' && `size="${o.size}"`,
    hasIcon && `icon={<Cube size={${buttonIconSizes[o.size]}} />}`,
    hasIcon && o.icon !== 'left' && `iconPosition="${o.icon}"`,
    o.icon === 'only' && `aria-label="${o.label}"`,
    o.disabled && 'disabled',
    o.loading && 'loading',
  ].filter(Boolean) as string[];

  const multiline = props.join(' ').length > 48;
  const attrs = props.length === 0 ? '' : multiline ? `\n  ${props.join('\n  ')}\n` : ` ${props.join(' ')}`;
  const element = o.icon === 'only' ? `<Button${attrs}${multiline ? '' : ' '}/>` : `<Button${attrs}>${o.label}</Button>`;

  return [
    hasIcon ? `import { Cube } from '@phosphor-icons/react';` : null,
    `import { Button } from '@/app/components/buttons/Button';`,
    '',
    element,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export default function ButtonsPage() {
  const [size, setSize] = useState<ButtonSize>('md');
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const [icon, setIcon] = useState<IconOption>('none');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setInspectorContent, setCustomControls, setCodeSnippet, setComponentTitle, setComponentCategory, setComponentIcon } =
    useDesignSystem();

  useEffect(() => {
    setComponentTitle('Button');
    setComponentIcon(<CursorClick size={14} />);
    setComponentCategory(`${SIZE_LABELS[size]} / ${VARIANT_LABELS[variant]}`);

    setInspectorContent({
      title: 'Button',
      description: 'Starts an action. Five types, five sizes, with an optional icon and disabled and loading states.',
      guidance: {
        purpose:
          'A button starts an action: save, download, upgrade, delete. The type says how much the action matters, so a screen has one Primary button and everything beside it is Secondary or Link Grey.',
        behaviour:
          'Hover darkens the fill. Keyboard focus shows a blue outline. Disabled buttons switch to their own lighter colours instead of fading, so they stay readable. While loading, a spinner replaces the label and the button keeps its width.',
        usage:
          'Primary: Get Pro in the header, Save to… in the screen viewer, Create account on sign up. Secondary: Download, Cancel, Filter and Choose Plan. Destructive Primary: Delete account in settings. Destructive Light: softer destructive choices in dialogs. Link Grey: low-key text actions such as Clear and Request App in search.',
      },
      propsList: [
        {
          prop: 'variant',
          type: Object.keys(buttonVariants).map((v) => `"${v}"`).join(' | '),
          defaultVal: '"primary"',
          description: 'The button type. In Figma these are Primary, Secondary, Destructive Primary, Destructive Light and Link Grey.',
        },
        {
          prop: 'size',
          type: Object.keys(buttonSizes).map((v) => `"${v}"`).join(' | '),
          defaultVal: '"md"',
          description: 'Sets padding and label size. Heights are 36, 40, 44, 46 and 46 pixels.',
        },
        {
          prop: 'icon',
          type: 'ReactNode',
          defaultVal: '-',
          description: 'An icon element shown with the label. Size it with buttonIconSizes[size].',
        },
        {
          prop: 'iconPosition',
          type: '"left" | "right" | "only"',
          defaultVal: '"left"',
          description: 'Where the icon sits. With "only" the label is hidden, so add an aria-label.',
        },
        {
          prop: 'loading',
          type: 'boolean',
          defaultVal: 'false',
          description: 'Shows a spinner and blocks clicks. The button keeps its width, so nothing around it moves.',
        },
        {
          prop: 'loadingText',
          type: 'ReactNode',
          defaultVal: '-',
          description: 'Replaces the label while loading and sits beside the spinner.',
        },
        {
          prop: 'disabled',
          type: 'boolean',
          defaultVal: 'false',
          description: 'Blocks interaction and switches to the disabled colours for the type.',
        },
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="button-label">Label</label>
            {label !== DEFAULT_LABEL && (
              <button
                type="button"
                onClick={() => {
                  setLabel(DEFAULT_LABEL);
                  sounds.playToggle();
                }}
                className="flex cursor-pointer items-center gap-1 text-[13px] text-fg-muted transition-colors hover:text-fg"
              >
                <ArrowCounterClockwise size={12} />
                Reset
              </button>
            )}
          </div>
          <input id="button-label" type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label>Type</label>
          <select
            value={variant}
            onChange={(e) => {
              const next = e.target.value as ButtonVariant;
              setVariant(next);
              // Figma has no icon-only Link Grey.
              if (next === 'link' && icon === 'only') setIcon('none');
            }}
          >
            {(Object.keys(buttonVariants) as ButtonVariant[]).map((v) => (
              <option key={v} value={v}>
                {VARIANT_LABELS[v]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label>Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value as ButtonSize)}>
            {(Object.keys(buttonSizes) as ButtonSize[]).map((s) => (
              <option key={s} value={s}>
                {SIZE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label>Icon</label>
          <select value={icon} onChange={(e) => setIcon(e.target.value as IconOption)}>
            {(Object.keys(ICON_LABELS) as IconOption[])
              .filter((option) => !(variant === 'link' && option === 'only'))
              .map((option) => (
                <option key={option} value={option}>
                  {ICON_LABELS[option]}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <Toggle label="Disabled" checked={disabled} onChange={setDisabled} />
          <Toggle label="Loading" checked={loading} onChange={setLoading} />
        </div>
      </div>,
    );

    setCodeSnippet(buildSnippet({ variant, size, label, icon, disabled, loading }));
  }, [
    size,
    variant,
    label,
    icon,
    disabled,
    loading,
    setInspectorContent,
    setCustomControls,
    setCodeSnippet,
    setComponentTitle,
    setComponentCategory,
    setComponentIcon,
  ]);

  return (
    <PreviewCanvas>
      <Button
        variant={variant}
        size={size}
        icon={icon === 'none' ? undefined : <Cube size={buttonIconSizes[size]} className="shrink-0" />}
        iconPosition={icon === 'none' ? undefined : icon}
        aria-label={icon === 'only' ? label : undefined}
        disabled={disabled}
        loading={loading}
        onClick={() => sounds.playClick()}
      >
        {label}
      </Button>
    </PreviewCanvas>
  );
}
