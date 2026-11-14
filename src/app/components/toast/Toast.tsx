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
          role="status"
          aria-live="polite"
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          {state === 'loading' && (
            <div className="flex items-center justify-center px-3 py-1.5 gap-2.5 w-[165px] h-[36px] bg-surface-raised rounded-full shadow-lg">
              <CircleNotch size={16} weight="bold" className="animate-spin text-fg shrink-0" />
              <span className="type-label-small text-fg whitespace-nowrap">
                Copying screens...
              </span>
            </div>
          )}

          {state === 'success' && (
            <div className="flex items-center justify-center px-3 py-1.5 gap-2.5 w-[232px] h-[36px] bg-surface-raised rounded-full shadow-lg">
              <CheckCircle size={16} weight="fill" className="text-success shrink-0" />
              <span className="type-label-small text-fg whitespace-nowrap">
                Screens copied to clipboard!
              </span>
            </div>
          )}

          {state === 'error' && (
            <div className="flex items-center justify-center px-3 py-1.5 gap-2.5 w-[357px] h-[36px] bg-danger-surface rounded-full shadow-lg">
              <Warning size={16} weight="fill" className="text-danger shrink-0" />
              <span className="type-label-small text-fg whitespace-nowrap">
                There was an error copying this image. Try again
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};