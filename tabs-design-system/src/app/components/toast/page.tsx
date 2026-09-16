'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Toast, ToastState } from '@/app/components/toast/Toast';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { sounds } from '@/lib/sounds';
import { Copy, BellRinging } from '@phosphor-icons/react';

export default function ToastPage() {
  const [toastState, setToastState] = useState<ToastState>(null);
  const [isCopying, setIsCopying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    setInspectorContent, 
    setCustomControls, 
    setCodeSnippet, 
    setComponentTitle, 
    setComponentCategory,
    setComponentIcon 
  } = useDesignSystem();

  const handleCopyAction = (forcedState?: ToastState) => {
    if (isCopying && forcedState === undefined) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (forcedState !== undefined) {
      setToastState(forcedState);
      setIsCopying(forcedState === 'loading');
      if (forcedState !== 'loading' && forcedState !== 'default') {
        timeoutRef.current = setTimeout(() => {
          setToastState(null);
          setIsCopying(false);
        }, 4000);
      }
      return;
    }

    setIsCopying(true);
    setToastState('loading');
    sounds.playClick();

    timeoutRef.current = setTimeout(() => {
      const outcome: ToastState = Math.random() > 0.3 ? 'success' : 'error';
      setToastState(outcome);

      timeoutRef.current = setTimeout(() => {
        setToastState(null);
        setIsCopying(false);
      }, 4000);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setComponentTitle('Toast Notifications');
    setComponentIcon(<BellRinging size={14} strokeWidth={1.5} />);
    setComponentCategory('Feedback / Toast');

    setInspectorContent({
      title: 'Toast Notifications',
      description: 'Drop-down notification toast banner with distinct loading, success, and error states.',
      propsList: [
        { prop: 'State', type: 'enum', defaultVal: toastState || 'default' },
        { prop: 'Duration', type: 'number', defaultVal: '4000ms' },
      ],
      compositionNotes: [
        'Drops down smoothly from the very top center of the canvas right below the header bar.',
        'Customizer features a dropdown select to preview Default, Loading, Success, and Error states.',
        'Supports automated randomized sequences on trigger click.'
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-700 dark:text-zinc-300">States</span>
        <select
          value={toastState || 'default'}
          onChange={(e) => {
            const val = e.target.value as ToastState;
            handleCopyAction(val === 'default' ? null : val);
            sounds.playClick();
          }}
          className="w-full h-[36px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
        >
          <option value="default">Default (Idle)</option>
          <option value="loading">Loading</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
      </div>
    );

    setCodeSnippet(`import { useState } from 'react';
import { Toast } from '@/app/components/toast/Toast';

export default function ToastDemo() {
  const [toastState, setToastState] = useState<'loading' | 'success' | 'error' | null>(null);

  return (
    <div className="relative">
      <button 
        onClick={() => setToastState('success')}
        className="flex items-center justify-center px-5 py-2.5 gap-2 h-[38px] bg-[#F7F7F7] border-[0.5px] border-[#E8E8E8] rounded-full shadow-sm hover:bg-zinc-100"
      >
        <Copy size={18} weight="regular" className="text-[#171717]" />
      </button>

      <Toast state={toastState} />
    </div>
  );
}`);
  }, []);

  // return (
  //   <PreviewCanvas>
  //     <div className="relative flex flex-col items-center justify-center min-h-[200px] w-full">
  //       <Toast state={toastState} />

  //       <button
  //         type="button"
  //         disabled={isCopying}
  //         onClick={() => handleCopyAction()}
  //         className={`flex items-center justify-center px-5 py-2.5 gap-2 h-[38px] bg-[#F7F7F7] border-[0.5px] border-[#E8E8E8] rounded-[100px] shadow-[0px_3px_4px_-1px_rgba(229,229,229,0.07),inset_0px_4px_2px_rgba(232,232,232,0.04),inset_0px_-4px_2px_rgba(255,255,255,0.03)] transition-all ${
  //           isCopying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#EFEFEF] cursor-pointer'
  //         }`}
  //         aria-label="Copy screens"
  //       >
  //         <Copy size={18} weight="regular" className="text-[#171717]" />
  //       </button>
  //     </div>
  //   </PreviewCanvas>
  // );
  return (
    <PreviewCanvas>
      <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[250px]">
        <Toast state={toastState} />

        <button
          type="button"
          disabled={isCopying}
          onClick={() => handleCopyAction()}
          className={`flex items-center justify-center px-5 py-2.5 gap-2 h-[38px] bg-[#F7F7F7] border-[0.5px] border-[#E8E8E8] rounded-[100px] shadow-[0px_3px_4px_-1px_rgba(229,229,229,0.07),inset_0px_4px_2px_rgba(232,232,232,0.04),inset_0px_-4px_2px_rgba(255,255,255,0.03)] transition-all ${
            isCopying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#EFEFEF] cursor-pointer'
          }`}
          aria-label="Copy screens"
        >
          <Copy size={18} weight="regular" className="text-[#171717]" />
        </button>
      </div>
    </PreviewCanvas>
  );

}