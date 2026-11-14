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
  Plus,
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

// --- VARIANT 1: ICON-ONLY TRIGGER DROPDOWN ---
export function IconDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div className="relative inline-block font-sans" ref={ref}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-fg-secondary hover:bg-surface-raised transition-colors cursor-pointer"
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <X size={18} weight="bold" /> : <DotsThreeVertical size={18} weight="bold" />}
        </motion.div>
        {/* {isOpen ? (
  <CaretUp size={18} className="text-fg-secondary" />
) : (
  <CaretDown size={18} className="text-fg-secondary" />
)} */}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: '280px', height: '164px' }}
            className="bg-popover shadow-xl absolute right-0 mt-[6px] rounded-[24px] p-4 flex flex-col gap-3 z-50 text-white overflow-hidden origin-top"
          >
            <div className="flex flex-col gap-1 w-[248px]">
              {/* Visit website */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[40px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GlobeSimple size={20} className="text-gray-300" />
                  <span className="type-label-small text-white">Visit website</span>
                </div>
              </div>

              {/* View in App Store */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[40px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpRight size={20} className="text-gray-300" />
                  <span className="type-label-small text-white">View in App Store</span>
                </div>
              </div>

              <div className="w-[248px] border-t border-gray-600/30 my-0.5" />

              {/* Copy link */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[40px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon size={20} className="text-gray-300" />
                  <span className="type-label-small text-white">Copy link</span>
                </div>
              </div>
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div className="relative inline-block font-sans" ref={ref}>
      {/* 32x32px Circular Avatar Trigger */}
      {/* <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        className="w-[40px] h-[40px] rounded-full overflow-hidden border border-zinc-700 focus:outline-none cursor-pointer transition-transform active:scale-95"
      >
        <div className="w-full h-full bg-brand text-white font-semibold text-xs flex items-center justify-center">
          HZ
        </div>
      </button> */}

<button
  onClick={() => {
    setIsOpen(!isOpen);
    sounds.playClick();
  }}
  aria-label="Open account menu"
  aria-haspopup="menu"
  aria-expanded={isOpen}
  className="w-[40px] h-[40px] rounded-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer transition-transform active:scale-95"
>
  <img 
    src="/avatar.png" 
    alt="User Avatar" 
    className="w-full h-full object-cover"
  />
</button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: '310px', maxHeight: '340px' }}
            className="bg-popover shadow-xl absolute right-0 mt-[6px] rounded-[24px] p-4 flex flex-col gap-3 z-50 text-white overflow-y-auto origin-top"
          >
            {/* Header Profile Info */}
            <div className="flex items-center gap-3 w-[278px] h-[40px] shrink-0">
              {/* <div className="w-[40px] h-[40px] rounded-full bg-brand text-white font-semibold text-sm flex items-center justify-center shrink-0">
                HZ
              </div> */}
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden shrink-0 border border-zinc-700">
    <img src="/avatar.png" alt="User Avatar" className="w-full h-full object-cover" />
  </div>
              <div className="flex flex-col justify-center gap-0.5">
                <span className="type-heading-4 text-white">
                  Hannah Zighan
                </span>
                <span className="type-body-5 text-gray-300">
                  email@example.com
                </span>
              </div>
            </div>

            {/* Menu List Frame */}
            <div className="flex flex-col gap-1 w-[278px]">
              {/* Request an app */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Plus size={18} className="text-gray-300" />
                  <span className="type-label-small text-white">Request an app</span>
                </div>
              </div>

              {/* Settings */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GearSix size={18} className="text-gray-300" />
                  <span className="type-label-small text-white">Settings</span>
                </div>
              </div>

              <div className="w-full border-t border-gray-600/30 my-1" />

              {/* Theme Toggle */}
              <div className="flex items-center justify-between h-[36px] px-0">
                <span className="type-label-small text-white">Theme</span>
                <div className="flex items-center p-1 bg-gray-700 rounded-full gap-1">
                  <button
                    aria-label="Light theme"
                    aria-pressed={theme === 'light'}
                    onClick={() => { setTheme('light'); sounds.playClick(); }}
                    className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-300'}`}
                  >
                    <Sun size={14} />
                  </button>
                  <button
                    aria-label="Dark theme"
                    aria-pressed={theme === 'dark'}
                    onClick={() => { setTheme('dark'); sounds.playClick(); }}
                    className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-300'}`}
                  >
                    <Moon size={14} />
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="type-label-small text-white">Pricing</span>
              </div>

              {/* Changelog */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="type-label-small text-white">Changelog</span>
                <span className="px-2 py-0.5 bg-gray-700 text-white text-[12px] font-medium rounded-full">New</span>
              </div>

              {/* Upload content */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="type-label-small text-white">Upload content</span>
                <ArrowUpRight size={18} className="text-gray-300" />
              </div>

              <div className="w-full border-t border-gray-600/30 my-1" />

              {/* Log out */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-error-500/10 transition-colors cursor-pointer text-error-400"
              >
                <span className="type-label-small">Log out</span>
              </div>
            </div>

            {/* Footer Legal Terms */}
            <div className="flex items-center justify-between w-[278px] text-[12px] text-gray-300 pt-2 border-t border-gray-600/20 shrink-0">
              <span className="cursor-pointer hover:underline">Term & Conditions</span>
              <span className="cursor-pointer hover:underline">Privacy Policy</span>
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
      <label className="text-sm font-medium text-fg-secondary mb-2">Role</label>

      {/* Input field */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Role: ${selectedRole ?? 'none selected'}`}
        className={`w-[320px] h-[44px] px-4 bg-surface border rounded-2xl flex items-center justify-between transition-colors cursor-pointer ${
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
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                    isSelected ? 'bg-surface-raised' : 'hover:bg-surface-raised/60'
                  }`}
                >
                  <span className="text-sm font-medium text-fg-secondary">{role}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-[22px] h-[22px] bg-brand rounded-full flex items-center justify-center text-white"
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