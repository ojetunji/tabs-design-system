'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CaretDown, MagnifyingGlass, Check, XCircle, CaretUp } from '@phosphor-icons/react';

export interface MultiSelectOption {
  id: string;
  label: string;
  section?: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const MultiSelect = ({
  label = 'Screens',
  options,
  selectedIds,
  onChange,
  placeholder = 'Search screens...',
  disabled = false,
  isOpen: externalIsOpen,
  onOpenChange,
}: MultiSelectProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleOpenChange = (newIsOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
    if (externalIsOpen === undefined) {
      setInternalIsOpen(newIsOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleOpenChange(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [externalIsOpen, onOpenChange]);

  const handleToggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(item => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Selected rows go to the top, but only when the menu opens. Re-sorting on every
  // click would move the row out from under the pointer.
  const selectedFirst = () =>
    [...options].sort((a, b) => Number(selectedIds.includes(b.id)) - Number(selectedIds.includes(a.id))).map((o) => o.id);
  const [order, setOrder] = useState<string[]>(selectedFirst);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setOrder(selectedFirst());
  }
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? order.length : i;
  };
  const sortedOptions = [...filteredOptions].sort((a, b) => rank(a.id) - rank(b.id));

  const hasSelections = selectedIds.length > 0;

  const getSummaryLabel = () => {
    if (selectedIds.length === 0) return label;
    const firstSelected = options.find(opt => opt.id === selectedIds[0])?.label || '';
    if (selectedIds.length === 1) return firstSelected;
    return `${firstSelected} + ${selectedIds.length - 1} more`;
  };

  return (
    <div className="multiselect-container" ref={containerRef}>
      {!hasSelections ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleOpenChange(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`multiselect-trigger-default ${disabled ? 'disabled' : ''}`}
        >
          <span>{label}</span>
          {/* <CaretDown size={16} weight="regular" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} /> */}
          {isOpen ? (
    <CaretUp size={16} weight="regular" />
  ) : (
    <CaretDown size={16} weight="regular" />
  )}
        </button>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => !disabled && handleOpenChange(!isOpen)}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleOpenChange(!isOpen);
            }
          }}
          className="multiselect-trigger-badge"
        >
          <span>{getSummaryLabel()}</span>
          <button 
            type="button" 
            onClick={handleClearAll}
            className="multiselect-badge-clear"
            aria-label="Clear selection"
          >
            <XCircle size={16} weight="fill" />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="multiselect-popover">
          <div className="multiselect-search-wrapper">
            <MagnifyingGlass size={20} weight="regular" className="text-night-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleOpenChange(false);
              }}
              autoFocus
              className="multiselect-search-input"
            />
          </div>

          <span className="multiselect-section-title">Controls</span>

          <div className="multiselect-options-list" role="listbox" aria-multiselectable="true" aria-label={label}>
            {sortedOptions.length === 0 ? (
              <div className="multiselect-empty">No results found</div>
            ) : (
              sortedOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onClick={() => handleToggleOption(option.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggleOption(option.id);
                      } else if (e.key === 'Escape') {
                        handleOpenChange(false);
                      }
                    }}
                    className={`multiselect-option-item ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="multiselect-option-label">{option.label}</span>
                    <div className={`multiselect-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <Check size={16} weight="bold" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .multiselect-container {
          position: relative;
          display: inline-block;
          font-family: var(--font-sans);
          user-select: none;
        }

        .multiselect-trigger-default {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 15px;
          gap: 6px;
          background: var(--tabs-surface);
          border: 1px solid var(--tabs-line);
          border-radius: 100px;
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: -0.15px;
          color: var(--tabs-fg);
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: var(--shadow-sm);
        }

        .multiselect-trigger-default:hover:not(.disabled) {
          background: var(--tabs-surface-subtle);
          border-color: var(--tabs-line-hover);
        }

        .multiselect-trigger-default.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .multiselect-trigger-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 12px 0 15px;
          gap: 8px;
          background: var(--tabs-brand);
          border-radius: 100px;
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: -0.15px;
          color: var(--tabs-on-brand);
          cursor: pointer;
          box-shadow: 0 2px 6px color-mix(in srgb, var(--tabs-brand) 25%, transparent);
          transition: background-color 0.15s ease;
        }

        .multiselect-trigger-badge:hover {
          background: var(--tabs-brand-hover);
        }

        .multiselect-badge-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--tabs-on-brand);
          cursor: pointer;
          padding: 0;
          opacity: 0.8;
          transition: opacity 0.15s ease;
        }

        .multiselect-badge-clear:hover {
          opacity: 1;
        }

        .multiselect-popover {
          transform-origin: top center;
          position: absolute;
          top: calc(100% + 8px);
          /* Centred under the button: the button changes width as you select, and a
             left-anchored menu would slide sideways with it. */
          left: 50%;
          translate: -50% 0;
          width: 360px;
          background: var(--tabs-popover);
          box-shadow: var(--shadow-xl);
          border-radius: 24px;
          padding: 16px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-x: hidden; /* Prevent horizontal spill */
          animation: popoverFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .multiselect-search-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
          width: fill;
          height: 46px;
          background: color-mix(in srgb, var(--color-paper-0) 8%, transparent);
          border: 1px solid var(--color-night-700);
          border-radius: 24px;
          padding: 0 15px;
          flex-shrink: 0;
        }

        .multiselect-search-input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: var(--color-paper-0);
          font-family: var(--font-sans);
        }

        .multiselect-search-input::placeholder {
          color: var(--color-night-400);
        }

        .multiselect-section-title {
          font-size: 12px;
          font-weight: 500;
          color: var(--color-night-400);
          letter-spacing: -0.2px;
          padding-left: 2px;
        }

        .multiselect-options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
          overflow-x: hidden; /* Disable horizontal scroll completely */
          max-height: 200px; /* Exactly 4 items visible */
          padding-right: 2px;
          
          /* Hide scrollbars for Firefox & WebKit */
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          
        //   /* Gradient fade mask for smooth vertical edges */
        //   -webkit-mask-image: linear-gradient(
        //     to bottom,
        //     transparent 0%,
        //     black 15%,
        //     black 85%,
        //     transparent 100%
        //   );
        //   mask-image: linear-gradient(
        //     to bottom,
        //     transparent 0%,
        //     black 15%,
        //     black 85%,
        //     transparent 100%
        //   );
        -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        }

        .multiselect-options-list::-webkit-scrollbar {
          display: none; /* Completely hide standard scrollbar rectangles */
        }

        .multiselect-option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: fill;
          height: 44px;
          padding: 6px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.1s ease;
          flex-shrink: 0;
        }

        .multiselect-option-item.selected {
          background: var(--color-paper-0);
        }

        .multiselect-option-item:not(.selected) {
          background: color-mix(in srgb, var(--color-paper-0) 4%, transparent);
        }

        .multiselect-option-item:not(.selected):hover {
          background: color-mix(in srgb, var(--color-paper-0) 8%, transparent);
        }

        .multiselect-option-item:focus-visible {
          outline: 2px solid var(--tabs-brand);
          outline-offset: -2px;
        }

        .multiselect-trigger-badge:focus-visible,
        .multiselect-trigger-default:focus-visible {
          outline: 2px solid var(--tabs-brand);
          outline-offset: 2px;
        }

        .multiselect-option-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-night-900);
        }

        .multiselect-option-item:not(.selected) .multiselect-option-label {
          color: var(--color-paper-0);
        }

        .multiselect-checkbox {
          width: 32px;
          height: 32px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-night-900);
          color: var(--color-paper-0);
          transition: all 0.15s ease;
        }

        .multiselect-option-item:not(.selected) .multiselect-checkbox {
          background: var(--color-night-600);
          border: 1px solid var(--color-night-500);
        }

        .multiselect-empty {
          padding: 24px;
          text-align: center;
          font-size: 14px;
          color: var(--color-night-400);
        }
      `}</style>
    </div>
  );
};