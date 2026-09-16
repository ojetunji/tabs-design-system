'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleNotch, CheckCircle, Warning } from '@phosphor-icons/react';

export type ToastState = 'default' | 'loading' | 'success' | 'error' | null;

interface ToastProps {
  state: ToastState;
}

export const Toast = ({ state }: ToastProps) => {
  return (
    <AnimatePresence>
      {state && state !== 'default' && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          {state === 'loading' && (
            <div className="flex items-center justify-center px-3 py-1.5 gap-2.5 w-[165px] h-[36px] bg-[#F5F5F5] rounded-full shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.1)]">
              <CircleNotch size={16} weight="bold" className="animate-spin text-[#171717] shrink-0" />
              <span className="font-['Mona_Sans'] font-medium text-[14px] leading-[24px] tracking-[-0.2px] text-[#00050D] whitespace-nowrap">
                Copying screens...
              </span>
            </div>
          )}

          {state === 'success' && (
            <div className="flex items-center justify-center px-3 py-1.5 gap-2.5 w-[232px] h-[36px] bg-[#F5F5F5] rounded-full shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.1)]">
              <CheckCircle size={16} weight="fill" className="text-[#1EAF62] shrink-0" />
              <span className="font-['Mona_Sans'] font-medium text-[14px] leading-[24px] tracking-[-0.2px] text-[#00050D] whitespace-nowrap">
                Screens copied to clipboard!
              </span>
            </div>
          )}

          {state === 'error' && (
            <div className="flex items-center justify-center px-3 py-1.5 gap-2.5 w-[357px] h-[36px] bg-[#FFEBEC] rounded-full shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.1)]">
              <Warning size={16} weight="fill" className="text-[#E93544] shrink-0" />
              <span className="font-['Mona_Sans'] font-medium text-[14px] leading-[24px] tracking-[-0.2px] text-[#00050D] whitespace-nowrap">
                There was an error copying this image. Try again
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};