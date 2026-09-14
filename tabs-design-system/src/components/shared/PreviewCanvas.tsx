'use client';

import React from 'react';
import { useDesignSystem } from '@/context/DesignSystemContext';

interface PreviewCanvasProps {
  children: React.ReactNode;
}

export default function PreviewCanvas({ children }: PreviewCanvasProps) {
  const { isCodeDrawerOpen } = useDesignSystem();

  return (
    <div 
      className={`absolute inset-x-0 top-0 bottom-0 transition-all duration-300 overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-center ${
        isCodeDrawerOpen ? '!bottom-[16rem]' : ''
      }`}
    >
      <div className="w-full h-full flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}