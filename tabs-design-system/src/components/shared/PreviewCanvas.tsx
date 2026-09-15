'use client';

import React from 'react';
import { useDesignSystem } from '@/context/DesignSystemContext';

interface PreviewCanvasProps {
  children: React.ReactNode;
  align?: 'center' | 'top'; // Added alignment option
}

export default function PreviewCanvas({ children, align = 'center' }: PreviewCanvasProps) {
  const { isCodeDrawerOpen } = useDesignSystem();

  return (
    <div 
      className={`absolute inset-x-0 top-0 bottom-0 transition-all duration-300 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/50 flex justify-center ${
        align === 'top' ? 'items-start pt-16' : 'items-center'
      } ${
        isCodeDrawerOpen ? '!bottom-[16rem]' : ''
      }`}
    >
      <div className={`w-full flex justify-center px-4 ${align === 'top' ? '' : 'h-full items-center'}`}>
        {children}
      </div>
    </div>
  );
}