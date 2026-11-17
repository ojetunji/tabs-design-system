import React from 'react';
import { CircleNotch } from '@phosphor-icons/react/dist/ssr';

/**
 * Button, following the Tabs Figma component: five types, five sizes, and an
 * icon on the left, on the right, or on its own. Every value here is a token.
 */
export const buttonVariants = {
  // Figma: Primary
  primary:
    'bg-brand text-on-brand not-disabled:hover:bg-brand-hover disabled:bg-fill-disabled disabled:text-fg-disabled',
  // Figma: Secondary
  secondary:
    'bg-surface text-fg-secondary inset-ring inset-ring-line not-disabled:hover:bg-surface-subtle disabled:bg-fill-disabled disabled:text-fg-disabled disabled:inset-ring-transparent',
  // Figma: Destructive Primary
  destructive:
    'bg-danger-fill text-on-brand not-disabled:hover:bg-danger-fill-hover disabled:bg-fill-disabled disabled:text-fg-disabled',
  // Figma: Destructive Light
  'destructive-light':
    'bg-danger-subtle text-on-danger-subtle not-disabled:hover:bg-danger-subtle-hover disabled:bg-fill-disabled disabled:text-fg-disabled',
  // Figma: Link Grey. Text only, with the same padding so it lines up beside other buttons.
  link: 'bg-transparent text-fg-secondary not-disabled:hover:text-fg disabled:text-fg-disabled',
} as const;

// Height comes from the 24px label plus padding: 36, 40, 44, 46 and 46.
export const buttonSizes = {
  xs: 'px-3 py-1.5 gap-1.5 type-label-x-small',
  sm: 'px-[15px] py-2 gap-1.5 type-label-small',
  md: 'px-5 py-2.5 gap-1.5 type-label-medium',
  lg: 'px-5 py-[11px] gap-2 type-label-large',
  xl: 'px-5 py-[11px] gap-2 type-label-x-large',
} as const;

/** Icon size that pairs with each button size. */
export const buttonIconSizes = { xs: 16, sm: 16, md: 18, lg: 20, xl: 24 } as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
export type ButtonIconPosition = 'left' | 'right' | 'only';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** An icon element. Use `buttonIconSizes[size]` for its size. */
  icon?: React.ReactNode;
  /** Where the icon sits. `only` hides the label, so give the button an `aria-label`. */
  iconPosition?: ButtonIconPosition;
  /** Shows a spinner and disables the button. The label keeps its width. */
  loading?: boolean;
  /** Replaces the label while loading, next to the spinner. */
  loadingText?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

const base =
  'relative inline-flex max-w-[470px] items-center justify-center rounded-full whitespace-nowrap select-none transition-[color,background-color,box-shadow,scale] duration-150 ease-out not-disabled:active:scale-[0.97] cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

/** The button's classes on their own, for links that should look like a button. */
export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className = '') =>
  [base, buttonVariants[variant], buttonSizes[size], className].filter(Boolean).join(' ');

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  loadingText,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const content =
    icon && iconPosition === 'only' ? (
      icon
    ) : (
      <>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </>
    );

  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && loadingText ? (
        <>
          <CircleNotch size="1em" weight="bold" className="shrink-0 animate-spin" aria-hidden />
          {loadingText}
        </>
      ) : loading ? (
        <>
          <span className="absolute inset-0 flex items-center justify-center">
            <CircleNotch size="1em" weight="bold" className="animate-spin" aria-hidden />
          </span>
          <span className="contents invisible">{content}</span>
        </>
      ) : (
        content
      )}
    </button>
  );
}
