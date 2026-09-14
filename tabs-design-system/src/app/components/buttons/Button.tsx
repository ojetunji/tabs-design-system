'use client';

import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'destructive-light' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  iconPosition?: 'none' | 'left' | 'right' | 'only';
  icon?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  iconPosition = 'none',
  icon,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    xs: 'h-9 px-3 text-xs gap-1.5 font-medium',
    sm: 'h-10 px-3.5 text-sm gap-1.5 font-medium',
    md: 'h-11 px-5 text-base gap-1.5 font-medium',
    lg: 'h-[46px] px-5 text-lg gap-2 font-medium',
    xl: 'h-[46px] px-5 text-xl gap-2 font-medium',
  };

  const iconOnlySizes = {
    xs: 'w-9 p-0 gap-0',
    sm: 'w-10 p-0 gap-0',
    md: 'w-11 p-0 gap-0',
    lg: 'w-[46px] p-0 gap-0',
    xl: 'w-[46px] p-0 gap-0',
  };

  const variantClasses = {
    primary: 'bg-[#0074FC] text-white hover:bg-[#005DCA]',
    secondary: 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800',
    destructive: 'bg-[#DC3545] text-white hover:bg-opacity-90',
    'destructive-light': 'bg-[#F8D7DA] text-[#721C24] dark:bg-red-950 dark:text-red-300',
    link: 'bg-transparent text-[#0074FC] p-0 h-auto underline underline-offset-4 hover:opacity-80',
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-full border border-transparent cursor-pointer transition-all duration-150 text-decoration-none whitespace-nowrap select-none disabled:opacity-40 disabled:cursor-not-allowed';

  const computedClassName = [
    baseClasses,
    variantClasses[variant],
    iconPosition === 'only' ? iconOnlySizes[size] : sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={computedClassName} disabled={disabled || isLoading} {...props}>
      {isLoading && <CircleNotch size={16} className="animate-spin shrink-0" />}
      {!isLoading && iconPosition === 'left' && icon}
      {iconPosition !== 'only' && children}
      {iconPosition === 'only' && icon}
      {!isLoading && iconPosition === 'right' && icon}
    </button>
  );
};