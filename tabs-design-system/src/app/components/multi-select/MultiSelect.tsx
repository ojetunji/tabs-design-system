'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CaretDown, MagnifyingGlass, Check, XCircle } from '@phosphor-icons/react';

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

  const sortedOptions = [...filteredOptions].sort((a, b) => {
    const aSelected = selectedIds.includes(a.id);
    const bSelected = selectedIds.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

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
          className={`multiselect-trigger-default ${disabled ? 'disabled' : ''}`}
        >
          <span>{label}</span>
          <CaretDown size={16} weight="regular" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <div 
          onClick={() => handleOpenChange(!isOpen)}
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
            <MagnifyingGlass size={20} weight="regular" className="text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className="multiselect-search-input"
            />
          </div>

          <span className="multiselect-section-title">Controls</span>

          <div className="multiselect-options-list">
            {sortedOptions.length === 0 ? (
              <div className="multiselect-empty">No results found</div>
            ) : (
              sortedOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleToggleOption(option.id)}
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
          font-family: 'Mona Sans', -apple-system, sans-serif;
          user-select: none;
        }

        .multiselect-trigger-default {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 15px;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid rgba(26, 26, 26, 0.1);
          border-radius: 100px;
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: -0.15px;
          color: #1A1A1A;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .multiselect-trigger-default:hover:not(.disabled) {
          background: #FAFAFA;
          border-color: rgba(26, 26, 26, 0.2);
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
          background: #0074FC;
          border-radius: 100px;
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: -0.15px;
          color: #FFFFFF;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 116, 252, 0.25);
          transition: background-color 0.15s ease;
        }

        .multiselect-trigger-badge:hover {
          background: #005DCA;
        }

        .multiselect-badge-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #FFFFFF;
          cursor: pointer;
          padding: 0;
          opacity: 0.8;
          transition: opacity 0.15s ease;
        }

        .multiselect-badge-clear:hover {
          opacity: 1;
        }

        .multiselect-popover {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 320px;
          background: #262626;
          box-shadow: 0px 24px 50px -12px rgba(45, 54, 67, 0.12);
          border-radius: 24px;
          padding: 12px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 12px;
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
          gap: 12px;
          width: fill;
          height: 44px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid #3F3F46;
          border-radius: 24px;
          padding: 0 16px;
          flex-shrink: 0;
        }

        .multiselect-search-input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: #FFFFFF;
          font-family: 'Mona Sans', -apple-system, sans-serif;
        }

        .multiselect-search-input::placeholder {
          color: #A3A3A3;
        }

        .multiselect-section-title {
          font-size: 12px;
          font-weight: 500;
          color: #A3A3A3;
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
          background: #FFFFFF;
        }

        .multiselect-option-item:not(.selected) {
          background: rgba(255, 255, 255, 0.04);
        }

        .multiselect-option-item:not(.selected):hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .multiselect-option-label {
          font-size: 14px;
          font-weight: 500;
          color: #1C1C1C;
        }

        .multiselect-option-item:not(.selected) .multiselect-option-label {
          color: #FFFFFF;
        }

        .multiselect-checkbox {
          width: 32px;
          height: 32px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1C1C1C;
          color: #FFFFFF;
          transition: all 0.15s ease;
        }

        .multiselect-option-item:not(.selected) .multiselect-checkbox {
          background: #5C5C5C;
          border: 1px solid #7B7B7B;
        }

        .multiselect-empty {
          padding: 24px;
          text-align: center;
          font-size: 14px;
          color: #A3A3A3;
        }
      `}</style>
    </div>
  );
};