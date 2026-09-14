'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PropDef } from '@/components/layout/CustomizerPanel';
import { TextT } from '@phosphor-icons/react';

interface DesignSystemContextType {
  inspectorContent: {
    title: string;
    description: string;
    propsList?: PropDef[];
    compositionNotes?: string[];
  };
  setInspectorContent: (content: any) => void;
  customControls: ReactNode;
  setCustomControls: (controls: ReactNode) => void;
  codeSnippet: string | { tsx?: string; html?: string; css?: string };
  setCodeSnippet: (code: string | { tsx?: string; html?: string; css?: string }) => void;
  componentTitle: string;
  setComponentTitle: (title: string) => void;
  componentCategory: string;
  setComponentCategory: (category: string) => void;
  componentIcon: ReactNode;
  setComponentIcon: (icon: ReactNode) => void;
  isCodeDrawerOpen: boolean;
  setIsCodeDrawerOpen: (isOpen: boolean) => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export function DesignSystemProvider({ children }: { children: ReactNode }) {
  const [inspectorContent, setInspectorContent] = useState({
    title: 'Overview',
    description: 'Select a component or foundation from the sidebar to inspect its properties.',
    propsList: [],
    compositionNotes: ['Built for Tabs Design System.'],
  });
  const [customControls, setCustomControls] = useState<ReactNode>(null);
  const [codeSnippet, setCodeSnippet] = useState<string | { tsx?: string; html?: string; css?: string }>({
    tsx: '// Select a component to view source',
  });
  
  const [componentTitle, setComponentTitle] = useState('Typography');
  const [componentCategory, setComponentCategory] = useState('Display 1');
  const [componentIcon, setComponentIcon] = useState<ReactNode>(<TextT size={14} strokeWidth={1.5} />);

  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);

  return (
    <DesignSystemContext.Provider value={{
      inspectorContent,
      setInspectorContent,
      customControls,
      setCustomControls,
      codeSnippet,
      setCodeSnippet,
      componentTitle,
      setComponentTitle,
      componentCategory,
      setComponentCategory,
      componentIcon,
      setComponentIcon,
      isCodeDrawerOpen,
      setIsCodeDrawerOpen,
    }}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (!context) throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  return context;
}