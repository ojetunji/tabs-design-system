'use client';

import React from 'react';
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
  return (
    <div className={`tabs-container ${disabled ? 'disabled' : ''}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={`tab-item ${variant} ${isActive ? 'active' : 'inactive'}`}
          >
            {/* Absolute sliding background for buttery-smooth motion */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white rounded-full border border-black/10 shadow-[0px_3px_4px_-1px_rgba(229,229,229,0.07),inset_0px_4px_2px_rgba(232,232,232,0.04),inset_0px_-4px_2px_rgba(255,255,255,0.03)] z-0"
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
          /* Zero vertical padding so selection sits flush with the outer track edge */
          padding: 2px;
          gap: 4px;
          height: 42px;
          background: #F4F4F5;
          border-radius: 24px;
          font-family: 'Mona Sans', -apple-system, sans-serif;
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
          height: 38px;
          border-radius: 100px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: 'Mona Sans', -apple-system, sans-serif;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: -0.2px;
          transition: color 0.15s ease;
          flex-shrink: 0;
        }

        .tab-item.text {
          padding: 0 16px;
          min-width: 64px;
        }

        .tab-item.icon {
          padding: 0;
          width: 48px;
        }

        .tab-item.active {
          color: #00050D;
        }

        .tab-item.inactive {
          color: #5C5C5C;
        }

        .tab-item.inactive:hover {
          color: #1A1A1A;
        }
      `}</style>
    </div>
  );
};