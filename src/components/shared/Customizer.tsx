'use client';

import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretDown, Check } from '@phosphor-icons/react';
import { sounds } from '@/lib/sounds';

type SelectProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: ReactNode;
};

const isElement = (node: unknown): node is React.ReactElement<SelectProps> => React.isValidElement(node);

/**
 * Renders a page's controls. Any native <select> in them is swapped for the
 * Tabs-style menu below, so pages can keep writing plain form elements.
 */
export default function CustomizerControls({ children }: { children: ReactNode }) {
  const upgrade = (node: ReactNode): ReactNode =>
    React.Children.map(node, (child) => {
      if (!isElement(child)) return child;

      if (child.type === 'select') {
        const { value, onChange, children: optionChildren } = child.props;
        const options: { label: string; value: string }[] = [];
        React.Children.forEach(optionChildren, (opt) => {
          if (isElement(opt) && opt.type === 'option') {
            options.push({ label: String(opt.props.children ?? ''), value: String(opt.props.value ?? '') });
          }
        });
        return (
          <MenuSelect
            value={value}
            options={options}
            // Hand the page the same shape a native change event would give it.
            onChange={(next) => onChange?.({ target: { value: next } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
          />
        );
      }

      if (child.props?.children) {
        return React.cloneElement(child, { ...child.props, children: upgrade(child.props.children) });
      }
      return child;
    });

  return <div className="flex flex-col gap-4">{upgrade(children)}</div>;
}

/** Pill trigger with the dark menu Tabs uses for filters: the selected row is a white pill with a check. */
function MenuSelect({
  value = '',
  options,
  onChange,
}: {
  value?: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((v) => !v);
          sounds.playClick();
        }}
        className="flex h-10 w-full items-center justify-between rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg-secondary transition-colors hover:bg-surface-subtle cursor-pointer"
      >
        <span className="truncate">{selected?.label || value || 'Select'}</span>
        <CaretDown size={14} weight="bold" className={`ml-2 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
        <motion.div
          role="listbox"
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformOrigin: 'top' }}
          className="absolute inset-x-0 top-full z-50 mt-1.5 flex flex-col gap-1 rounded-[20px] bg-popover p-1.5 shadow-xl"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  sounds.playClick();
                }}
                className={`flex h-9 w-full items-center justify-between rounded-full px-3.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                  isSelected ? 'bg-white text-fg' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate">{option.label}</span>
                <span
                  className={`ml-2 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                    isSelected ? 'bg-fg text-white' : 'bg-white/15'
                  }`}
                >
                  {isSelected && <Check size={11} weight="bold" />}
                </span>
              </button>
            );
          })}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
