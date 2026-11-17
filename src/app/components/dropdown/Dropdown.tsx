'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DotsThreeVertical, 
  X, 
  CaretUp,
  Check,
  GlobeSimple, 
  ArrowUpRight, 
  Link as LinkIcon, 
  PlusCircle,
  GearSix,
  Sun,
  Moon,
  CaretDown
} from '@phosphor-icons/react';
import { sounds } from '@/lib/sounds';

// Custom hook for outside click handling
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Shared pieces of the dark menus, from the Tabs Figma file: a 24px-radius panel
// with 16px padding, 40px rows, 20px icons and a hairline between groups.
const menuPanel =
  'absolute right-0 top-full z-50 mt-[6px] flex origin-top-right flex-col gap-4 rounded-[24px] bg-popover p-4 text-on-popover shadow-xl';
const menuMotion = {
  initial: { opacity: 0, y: -6, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.97 },
  transition: { type: 'spring', stiffness: 400, damping: 30 },
} as const;

function MenuRow({
  icon,
  trailing,
  onSelect,
  children,
}: {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className="flex h-10 w-full items-center justify-between rounded-[12px] text-left transition-opacity hover:opacity-70 cursor-pointer"
    >
      <span className="flex items-center gap-2">
        {icon}
        <span className="type-label-small text-on-popover">{children}</span>
      </span>
      {trailing}
    </button>
  );
}

const MenuDivider = () => <div className="h-px w-full bg-night-600" />;

// --- VARIANT 1: ICON-ONLY TRIGGER DROPDOWN ---
export function IconDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));

  const close = () => {
    setIsOpen(false);
    sounds.playClick();
  };

  return (
    <div className="relative inline-block font-sans" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-fg-secondary transition-colors hover:bg-surface-raised cursor-pointer"
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <X size={18} weight="bold" /> : <DotsThreeVertical size={18} weight="bold" />}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div role="menu" {...menuMotion} className={`${menuPanel} w-[280px]`}>
            <div className="flex flex-col gap-1">
              <MenuRow icon={<GlobeSimple size={20} />} onSelect={close}>
                Visit website
              </MenuRow>
              <MenuRow icon={<ArrowUpRight size={20} />} onSelect={close}>
                View in App Store
              </MenuRow>
              <MenuDivider />
              <MenuRow icon={<LinkIcon size={20} />} onSelect={close}>
                Copy link
              </MenuRow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- VARIANT 2: AVATAR TRIGGER DROPDOWN ---
export function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));

  const close = () => {
    setIsOpen(false);
    sounds.playClick();
  };

  return (
    <div className="relative inline-block font-sans" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="h-10 w-10 overflow-hidden rounded-full transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer"
      >
        <img src="/avatar.png" alt="" className="h-full w-full object-cover" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div role="menu" {...menuMotion} className={`${menuPanel} w-[310px]`}>
            <div className="flex flex-col gap-1">
              <span className="type-heading-2 text-on-popover">Hannah Zighan</span>
              <span className="type-body-5 text-on-popover-muted">email@example.com</span>
            </div>

            <div className="flex flex-col gap-1">
              <MenuRow icon={<PlusCircle size={20} />} onSelect={close}>
                Request an app
              </MenuRow>
              <MenuRow icon={<GearSix size={20} />} onSelect={close}>
                Settings
              </MenuRow>
              <MenuDivider />

              <div className="flex h-10 items-center justify-between">
                <span className="type-label-small text-on-popover">Theme</span>
                <div role="group" aria-label="Theme" className="flex items-center gap-1.5 rounded-full bg-night-700 p-1">
                  {(
                    [
                      ['light', Sun],
                      ['dark', Moon],
                    ] as const
                  ).map(([value, ThemeIcon]) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`${value === 'light' ? 'Light' : 'Dark'} theme`}
                      aria-pressed={theme === value}
                      onClick={() => {
                        setTheme(value);
                        sounds.playClick();
                      }}
                      className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors cursor-pointer ${
                        theme === value ? 'bg-night-800 text-on-popover' : 'text-on-popover-muted hover:text-on-popover'
                      }`}
                    >
                      <ThemeIcon size={18} />
                    </button>
                  ))}
                </div>
              </div>

              <MenuRow onSelect={close}>Pricing</MenuRow>
              <button
                type="button"
                role="menuitem"
                onClick={close}
                className="flex h-10 w-full items-center gap-2 rounded-[12px] text-left transition-opacity hover:opacity-70 cursor-pointer"
              >
                <span className="type-label-small text-on-popover">Changelog</span>
                <span className="type-label-x-small rounded-full bg-night-700 px-1.5 text-on-popover">New</span>
              </button>
              <MenuRow trailing={<ArrowUpRight size={20} />} onSelect={close}>
                Upload content
              </MenuRow>
              <MenuRow onSelect={close}>Log out</MenuRow>
              <MenuDivider />

              <div className="type-label-x-small flex h-10 items-center gap-3 text-on-popover-muted">
                <button type="button" onClick={close} className="flex-1 text-left transition-colors hover:text-on-popover cursor-pointer">
                  Term &amp; Conditions
                </button>
                <button type="button" onClick={close} className="flex-1 text-left transition-colors hover:text-on-popover cursor-pointer">
                  Privacy Policy
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- VARIANT 3: INPUT DROPDOWN (Role Selection) ---
const ROLES = ['Student', 'Designer', 'Product Manager', 'Software Engineer', 'Others'];

export function InputDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div className="w-[320px] flex flex-col font-sans relative" ref={ref}>
      <label className="type-label-small text-fg mb-1.5">Role</label>

      {/* Input field */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Role: ${selectedRole ?? 'none selected'}`}
        className={`w-[320px] h-10 px-4 bg-surface border rounded-[12px] flex items-center justify-between transition-colors cursor-pointer ${
          isOpen ? 'border-line-strong' : 'border-line hover:border-line-hover'
        }`}
      >
        <span className={`text-sm font-medium ${selectedRole ? 'text-fg-secondary' : 'text-fg-placeholder'}`}>
          {selectedRole || 'Choose your role'}
        </span>
        {/* <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <CaretUp size={18} className="text-fg-secondary" />
        </motion.div> */}
        {isOpen ? (
  <CaretUp size={18} className="text-fg-secondary" />
) : (
  <CaretDown size={18} className="text-fg-secondary" />
)}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            role="listbox"
            aria-label="Role"
            className="w-[320px] bg-surface border border-line rounded-2xl shadow-xl overflow-hidden p-1 flex flex-col gap-1 mt-[6px] z-50 absolute left-0 top-full origin-top"
          >
            {ROLES.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  role="option"
                  aria-selected={isSelected}
                  // onClick={() => {
                  //   setSelectedRole(role);
                  //   // setIsOpen(false);
                  //   sounds.playClick();
                  onClick={() => {
                    // If it's already selected, uncheck/revert it to null. Otherwise, select it.
                    setSelectedRole(isSelected ? null : role);
                  }}
                  className={`w-full flex items-center justify-between h-10 px-3.5 rounded-[10px] transition-colors cursor-pointer ${
                    isSelected ? 'bg-surface-raised' : 'hover:bg-surface-raised/60'
                  }`}
                >
                  <span className="text-sm font-medium text-fg-secondary">{role}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-[22px] h-[22px] bg-brand rounded-full flex items-center justify-center text-on-brand"
                    >
                      <Check size={14} weight="bold" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}