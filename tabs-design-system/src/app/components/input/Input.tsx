'use client';

import React, { useState } from 'react';
import { Eye, EyeSlash, MagnifyingGlass, CaretDown } from '@phosphor-icons/react';

export type InputVariant = 'basic' | 'left-icon' | 'right-icon' | 'two-side-icons' | 'prefix' | 'password';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showLabel?: boolean;
  helpText?: string;
  showHelpText?: boolean;
  variant?: InputVariant;
  prefixText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  state?: 'default' | 'focused' | 'typing' | 'error' | 'disabled';
  type?: string;
}

export const Input = ({
  label = 'Email address',
  showLabel = true,
  helpText = 'Info that helps a user with this field',
  showHelpText = true,
  variant = 'basic',
  prefixText = 'http://',
  leftIcon = <MagnifyingGlass size={16} weight="regular" />,
  rightIcon = <CaretDown size={16} weight="regular" />,
  state = 'default',
  disabled,
  className = '',
  type = 'text',
  placeholder,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isDisabled = state === 'disabled' || disabled;
  const isError = state === 'error';
  const isFocused = state === 'focused' || state === 'typing';

  const isPasswordVariant = variant === 'password';
  const isTwoSideIconsVariant = variant === 'two-side-icons';
  const isLeftIconVariant = variant === 'left-icon';
  const isRightIconVariant = variant === 'right-icon';
  const isPrefixVariant = variant === 'prefix';

  const inputType = isPasswordVariant ? (showPassword ? 'text' : 'password') : type;

  // Dynamic placeholders based on variant if none provided
  const getDefaultPlaceholder = () => {
    switch (variant) {
      case 'password': return 'Enter password';
      case 'prefix': return 'example.com';
      default: return 'Enter your email...';
    }
  };

  const finalPlaceholder = placeholder || getDefaultPlaceholder();

  const wrapperClasses = [
    'input-field-wrapper',
    isFocused ? 'focused' : '',
    isError ? 'error' : '',
    isDisabled ? 'disabled' : '',
    isPrefixVariant ? 'has-prefix' : '',
    isLeftIconVariant ? 'has-left-icon' : '',
    isRightIconVariant ? 'has-right-icon' : '',
    isTwoSideIconsVariant ? 'has-two-side-icons' : '',
    isPasswordVariant ? 'password-variant' : '',
  ].filter(Boolean).join(' ');

  const groupClasses = [
    'input-group',
    isError ? 'error' : '',
    isDisabled ? 'disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {showLabel && label && <label className="input-label">{label}</label>}
      
      <div className={wrapperClasses}>
        {isPrefixVariant && <span className="input-prefix">{prefixText}</span>}
        {(isLeftIconVariant || isTwoSideIconsVariant) && (
          <span className="input-icon-left">{leftIcon}</span>
        )}
        
        {isPasswordVariant && (
          <span className="input-icon-left">
            <MagnifyingGlass size={16} weight="regular" />
          </span>
        )}

        <input 
          type={inputType}
          className="input-element" 
          disabled={isDisabled}
          placeholder={finalPlaceholder}
          {...props} 
        />

        {/* Right Icons */}
        {isRightIconVariant && <span className="input-icon-right">{rightIcon}</span>}
        {isTwoSideIconsVariant && <span className="input-icon-right">{rightIcon}</span>}

        {isPasswordVariant && (
          <span 
            className="input-icon-right password-toggle" 
            onClick={() => !isDisabled && setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlash size={18} weight="regular" /> : <Eye size={18} weight="regular" />}
          </span>
        )}
      </div>

      {showHelpText && helpText && (
        <span className="input-help-text">{helpText}</span>
      )}

      <style jsx>{`
        .input-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          width: 320px;
          font-family: 'Mona Sans', -apple-system, sans-serif;
          box-sizing: border-box;
        }

        .input-label {
          font-weight: 500;
          font-size: 14px;
          line-height: 24px;
          letter-spacing: -0.2px;
          color: #1A1A1A;
        }

        .input-group.error .input-label {
          color: #DC2828;
        }

        .input-group.disabled .input-label {
          color: #A1A1AA;
        }

        .input-field-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          box-sizing: border-box;
          background: #FFFFFF;
          border: 1px solid rgba(26, 26, 26, 0.1);
          border-radius: 12px;
          transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
        }

        .input-prefix {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          height: 100%;
          background: rgba(26, 26, 26, 0.05);
          border-top-left-radius: 11px;
          border-bottom-left-radius: 11px;
          font-weight: 500;
          font-size: 14px;
          color: #1A1A1A;
          user-select: none;
          border-right: 1px solid rgba(26, 26, 26, 0.1);
        }

        .input-element {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 0 14px;
          font-family: 'Mona Sans', -apple-system, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #1F1F23;
          letter-spacing: -0.2px;
        }

        .input-element::placeholder {
          color: #D4D4D8;
          font-weight: 500;
        }

        /* Strict Padding Calculations for Variants */
        .has-prefix .input-element {
          padding-left: 10px;
        }
        .has-left-icon .input-element,
        .password-variant .input-element {
          padding-left: 38px;
        }
        .has-right-icon .input-element,
        .password-variant .input-element {
          padding-right: 38px;
        }
        .has-two-side-icons .input-element {
          padding-left: 38px;
          padding-right: 38px;
        }

        .input-icon-left {
          position: absolute;
          left: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #71717A;
          pointer-events: none;
          width: 18px;
          height: 18px;
        }

        .input-icon-right {
          position: absolute;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #71717A;
          width: 18px;
          height: 18px;
        }

        .password-toggle {
          cursor: pointer;
        }
        .password-toggle:hover {
          color: #1A1A1A;
        }

        .input-field-wrapper:hover:not(.disabled):not(.error) {
          border-color: #71717A;
        }

        .input-field-wrapper.focused {
          border: 1px solid #71717A;
          box-shadow: 0 0 0 1px #71717A;
        }

        .input-field-wrapper.error {
          background: #FFF5F4;
          border: 1px solid #EF4343;
        }

        .input-group.disabled .input-field-wrapper {
          background: #FFFFFF;
          opacity: 0.7;
          cursor: not-allowed;
        }

        .input-element:disabled {
          cursor: not-allowed;
        }

        .input-help-text {
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          letter-spacing: -0.02em;
          color: #71717A;
        }

        .input-group.error .input-help-text {
          color: #EF4343;
        }
      `}</style>
    </div>
  );
};