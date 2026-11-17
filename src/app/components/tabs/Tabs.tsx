'use client';

import React, { useId } from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'text' | 'icon';
  disabled?: boolean;
}

export const Tabs = ({
  tabs,
  activeId,
  onChange,
  variant = 'text',
  disabled = false,
}: TabsProps) => {
  // Unique per instance, so two Tabs on one page don't animate into each other.
  const pillId = useId();

  return (
    <div role="tablist" className={`tabs-container ${disabled ? 'disabled' : ''}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={variant === 'icon' ? tab.label ?? tab.id : undefined}
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={`tab-item ${variant} ${isActive ? 'active' : 'inactive'}`}
          >
            {/* Absolute sliding background for buttery-smooth motion */}
            {isActive && (
              <motion.div
                layoutId={pillId}
                layoutDependency={activeId}
                className="absolute inset-0 z-0 rounded-full border border-paper-200 bg-surface"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {variant === 'icon' && tab.icon}
              {variant === 'text' && <span>{tab.label}</span>}
            </span>
          </button>
        );
      })}

      <style jsx>{`
        .tabs-container {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 40px;
          background: var(--tabs-surface-subtle);
          border: 0.5px solid var(--color-paper-200);
          border-radius: 24px;
          font-family: var(--font-sans);
          user-select: none;
          width: fit-content;
        }

        .tabs-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tab-item {
          position: relative;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          height: 100%;
          border-radius: 100px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 14px;
          line-height: 24px;
          letter-spacing: -0.2px;
          transition: color 0.15s ease, padding 0.2s ease;
          flex-shrink: 0;
        }

        /* The active pill has 15px side padding; inactive labels sit 16px apart, 12px from the track edge. */
        .tab-item.text {
          padding: 0 8px;
        }

        .tab-item.text.active {
          padding: 0 15px;
        }

        .tab-item.text.inactive:first-child {
          padding-left: 12px;
        }

        .tab-item.text.inactive:last-of-type {
          padding-right: 12px;
        }

        .tab-item.icon {
          padding: 0;
          width: 48px;
        }

        .tab-item.active {
          color: var(--color-night-700);
        }

        .tab-item.inactive {
          color: var(--color-night-600);
        }

        .tab-item.inactive:hover {
          color: var(--color-night-700);
        }

        .tab-item:focus-visible {
          outline: 2px solid var(--tabs-brand);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};