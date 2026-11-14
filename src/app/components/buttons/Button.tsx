import React from 'react';
import { CircleNotch } from '@phosphor-icons/react/dist/ssr';

/**
 * Button, as Tabs ships it today. Variants, sizes and state colours mirror the
 * `button` recipe in the platform (use-tabs/tabs, theme.ts); every value here is a token.
 */
export const buttonVariants = {
  solid:
    'bg-brand text-on-brand enabled:hover:bg-brand-hover disabled:bg-brand-disabled disabled:text-on-brand-disabled',
  secondary:
    'bg-surface text-fg-secondary border-line enabled:hover:bg-surface-subtle disabled:bg-fill-strong disabled:text-fg-subtle',
  flat: 'bg-transparent text-fg-secondary',
  destructive:
    'bg-danger-fill text-on-brand enabled:hover:bg-danger-fill-hover disabled:bg-danger-fill-disabled',
  destructiveLight:
    'bg-danger-subtle text-on-danger-subtle enabled:hover:bg-danger-subtle-hover disabled:text-on-danger-subtle-disabled',
} as const;

export const buttonSizes = {
  xs: 'px-3 py-1.5 gap-2.5 type-label-x-small',
  sm: 'px-[15px] py-2 gap-2 type-label-small',
  md: 'px-5 py-2.5 gap-2 type-label-medium',
  lg: 'px-5 py-[11px] gap-2 type-label-large',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Called `visual` in the platform's Chakra recipe. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button. The label keeps its width. */
  loading?: boolean;
  /** Replaces the label while loading, next to the spinner. */
  loadingText?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

const base =
  'relative inline-flex max-w-[470px] items-center justify-center rounded-full border border-transparent whitespace-nowrap select-none transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

export function Button({
  variant = 'solid',
  size = 'md',
  loading = false,
  loadingText,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [base, buttonVariants[variant], buttonSizes[size], className].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
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
          <span className="contents invisible">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
