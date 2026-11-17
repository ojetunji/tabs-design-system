'use client';

import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';

export interface PropDef {
  prop: string;
  type: string;
  defaultVal: string;
  /** What the prop does, shown beside its type. */
  description?: string;
}

export interface InspectorContent {
  title: string;
  description: string;
  propsList?: PropDef[];
  compositionNotes?: string[];
  /** What the component is for, how it behaves and where Tabs uses it. Shown as the page's notes. */
  guidance?: { purpose: string; behaviour: string; usage: string };
}
import { TextT } from '@phosphor-icons/react';

interface DesignSystemContextType {
  inspectorContent: InspectorContent;
  setInspectorContent: (content: InspectorContent) => void;
  /** Path of the page that last published content, so the stage can wait for the right one. */
  contentPath: string | null;
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
  const [inspectorContent, setInspectorContentState] = useState<InspectorContent>({
    title: 'Overview',
    description: 'Select a component or foundation from the sidebar to inspect its properties.',
    propsList: [],
    compositionNotes: ['Built for Tabs Design System.'],
  });
  const [contentPath, setContentPath] = useState<string | null>(null);
  const setInspectorContent = useCallback((content: InspectorContent) => {
    setInspectorContentState(content);
    setContentPath(window.location.pathname);
  }, []);
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
      contentPath,
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