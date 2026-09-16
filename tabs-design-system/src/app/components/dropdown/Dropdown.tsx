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
  Clock, 
  UploadSimple, 
  SignOut,
  Plus,
  GearSix,
  Sun,
  Moon
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
    <div className="relative inline-block font-['Mona_Sans']" ref={ref}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] dark:bg-zinc-800 dark:border-zinc-700 flex items-center justify-center text-[#333333] dark:text-zinc-200 hover:bg-[#F7F7F7] dark:hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <X size={18} weight="bold" /> : <DotsThreeVertical size={18} weight="bold" />}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: '280px', height: '164px', background: '#262626', boxShadow: '0px 24px 50px -12px rgba(45, 54, 67, 0.12)' }}
            className="absolute right-0 mt-[12px] rounded-[24px] p-4 flex flex-col gap-3 z-50 text-white overflow-hidden origin-top"
          >
            <div className="flex flex-col gap-1 w-[248px]">
              {/* Visit website */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[40px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GlobeSimple size={20} className="text-[#D1D1D1]" />
                  <span className="font-medium text-[14px] text-white tracking-[-0.2px]">Visit website</span>
                </div>
              </div>

              {/* View in App Store */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[40px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpRight size={20} className="text-[#D1D1D1]" />
                  <span className="font-medium text-[14px] text-white tracking-[-0.2px]">View in App Store</span>
                </div>
              </div>

              <div className="w-[248px] border-t border-[#5C5C5C]/30 my-0.5" />

              {/* Copy link */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[40px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon size={20} className="text-[#D1D1D1]" />
                  <span className="font-medium text-[14px] text-white tracking-[-0.2px]">Copy link</span>
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
    <div className="relative inline-block font-['Mona_Sans']" ref={ref}>
      {/* 32x32px Circular Avatar Trigger */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        className="w-[40px] h-[40px] rounded-full overflow-hidden border border-zinc-700 focus:outline-none cursor-pointer transition-transform active:scale-95"
      >
        <div className="w-full h-full bg-[#0074FC] text-white font-semibold text-xs flex items-center justify-center">
          HZ
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: '310px', maxHeight: '340px', background: '#262626', boxShadow: '0px 24px 50px -12px rgba(45, 54, 67, 0.12)' }}
            className="absolute right-0 mt-[12px] rounded-[24px] p-4 flex flex-col gap-3 z-50 text-white overflow-y-auto origin-top"
          >
            {/* Header Profile Info */}
            <div className="flex items-center gap-3 w-[278px] h-[40px] shrink-0">
              <div className="w-[40px] h-[40px] rounded-full bg-[#0074FC] text-white font-semibold text-sm flex items-center justify-center shrink-0">
                HZ
              </div>
              <div className="flex flex-col justify-center gap-0.5">
                <span className="font-['Creato_Display'] font-medium text-[14px] leading-[20px] text-white tracking-[-0.02em]">
                  Hannah Zighan
                </span>
                <span className="font-['Mona_Sans'] font-normal text-[12px] leading-[16px] text-[#D1D1D1]">
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
                  <Plus size={18} className="text-[#D1D1D1]" />
                  <span className="font-medium text-[14px] text-white tracking-[-0.2px]">Request an app</span>
                </div>
              </div>

              {/* Settings */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GearSix size={18} className="text-[#D1D1D1]" />
                  <span className="font-medium text-[14px] text-white tracking-[-0.2px]">Settings</span>
                </div>
              </div>

              <div className="w-full border-t border-[#5C5C5C]/30 my-1" />

              {/* Theme Toggle */}
              <div className="flex items-center justify-between h-[36px] px-0">
                <span className="font-medium text-[14px] text-white tracking-[-0.2px]">Theme</span>
                <div className="flex items-center p-1 bg-[#333333] rounded-full gap-1">
                  <button
                    onClick={() => { setTheme('light'); sounds.playClick(); }}
                    className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#D1D1D1]'}`}
                  >
                    <Sun size={14} />
                  </button>
                  <button
                    onClick={() => { setTheme('dark'); sounds.playClick(); }}
                    className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#D1D1D1]'}`}
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
                <span className="font-medium text-[14px] text-white tracking-[-0.2px]">Pricing</span>
              </div>

              {/* Changelog */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="font-medium text-[14px] text-white tracking-[-0.2px]">Changelog</span>
                <span className="px-2 py-0.5 bg-[#333333] text-white text-[12px] font-medium rounded-full">New</span>
              </div>

              {/* Upload content */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="font-medium text-[14px] text-white tracking-[-0.2px]">Upload content</span>
                <ArrowUpRight size={18} className="text-[#D1D1D1]" />
              </div>

              <div className="w-full border-t border-[#5C5C5C]/30 my-1" />

              {/* Log out */}
              <div 
                onClick={() => { setIsOpen(false); sounds.playClick(); }}
                className="flex items-center justify-between h-[36px] px-0 rounded-[12px] hover:bg-red-500/10 transition-colors cursor-pointer text-red-400"
              >
                <span className="font-medium text-[14px] tracking-[-0.2px]">Log out</span>
              </div>
            </div>

            {/* Footer Legal Terms */}
            <div className="flex items-center justify-between w-[278px] text-[12px] text-[#D1D1D1] pt-2 border-t border-[#5C5C5C]/20 shrink-0">
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
    <div className="w-[320px] flex flex-col font-['Mona_Sans'] relative" ref={ref}>
      <label className="text-sm font-medium text-[#333333] dark:text-zinc-200 mb-2">Role</label>

      {/* Input field */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        className={`w-[320px] h-[44px] px-4 bg-white dark:bg-zinc-900 border rounded-2xl flex items-center justify-between transition-colors cursor-pointer ${
          isOpen ? 'border-[#0074FC]' : 'border-[#E5E5E5] dark:border-zinc-700 hover:border-[#D4D4D4]'
        }`}
      >
        <span className={`text-sm font-medium ${selectedRole ? 'text-[#333333] dark:text-zinc-100' : 'text-[#A3A3A3] dark:text-zinc-500'}`}>
          {selectedRole || 'Choose your role'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <CaretUp size={18} className="text-[#333333] dark:text-zinc-300" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-[320px] bg-white dark:bg-zinc-900 border border-[#E5E5E5] dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden p-1 flex flex-col gap-1 mt-[12px] z-50 absolute left-0 top-full origin-top"
          >
            {ROLES.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setIsOpen(false);
                    sounds.playClick();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#F7F7F7] dark:bg-zinc-800' : 'hover:bg-[#F7F7F7]/60 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="text-sm font-medium text-[#333333] dark:text-zinc-200">{role}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-[22px] h-[22px] bg-[#0074FC] rounded-full flex items-center justify-center text-white"
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