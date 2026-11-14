'use client';

import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Check, CaretDown } from '@phosphor-icons/react';
import { sounds } from '@/lib/sounds';

export interface PropDef {
  prop: string;
  type: string;
  defaultVal: string;
}

export interface InspectorContent {
  title: string;
  description: string;
  propsList?: PropDef[];
  compositionNotes?: string[];
}

interface CustomizerPanelProps {
  content?: InspectorContent;
  isVisible?: boolean;
  children?: ReactNode;
}

export default function CustomizerPanel({
  content = {
    title: 'Overview',
    description: 'Select a component or foundation from the sidebar to inspect its properties.',
    propsList: [],
    compositionNotes: ['Built for Tabs Design System.'],
  },
  isVisible = true,
  children,
}: CustomizerPanelProps) {
  if (!isVisible) return null;

  // Automatically transform any native <select> element found in children into the custom dropdown
  const renderCustomizedChildren = (node: ReactNode): ReactNode => {
    return React.Children.map(node, (child) => {
      if (!isValidElement(child)) return child;

      // If the child itself is a <select> element
      if (child.type === 'select') {
        const { value, onChange, children: optionChildren } = child.props;
        
        // Extract options from the <option> children of the <select>
        const options: { label: string; value: string }[] = [];
        React.Children.forEach(optionChildren, (opt) => {
          if (isValidElement(opt) && opt.type === 'option') {
            options.push({
              label: opt.props.children?.toString() || '',
              value: opt.props.value?.toString() || '',
            });
          }
        });

        return (
          <AutoCustomizerSelect
            value={value}
            options={options}
            onChange={(val) => {
              // Simulate the native change event expected by the page's onChange handler
              if (onChange) {
                onChange({
                  target: { value: val },
                } as unknown as React.ChangeEvent<HTMLSelectElement>);
              }
            }}
          />
        );
      }

      // If it's a wrapper container (like a div), recursively check its children
      if (child.props && child.props.children) {
        return React.cloneElement(child, {
          ...child.props,
          children: renderCustomizedChildren(child.props.children),
        });
      }

      return child;
    });
  };

  return (
    <aside className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col h-full overflow-y-auto select-none p-6 gap-6 text-xs">
      
      {/* Dynamic Component Overview Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="font-bold text-sm text-zinc-900 dark:text-white tracking-tight">
          {content.title}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {content.description}
        </p>
      </div>

      {/* Custom Interactive Controls (Automatically transformed) */}
      {children && (
        <div className="flex flex-col gap-4 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
          {renderCustomizedChildren(children)}
        </div>
      )}

      {/* Prop Types Table */}
      {content.propsList && content.propsList.length > 0 && (
        <div className="flex flex-col gap-2.5 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-3 font-semibold text-zinc-400 uppercase text-[10px]">
            <span>Prop</span>
            <span>Type</span>
            <span>Default</span>
          </div>
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/60 border-y border-zinc-100 dark:border-zinc-800/60">
            {content.propsList.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 py-2.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-300 items-center">
                <span className="font-semibold text-zinc-900 dark:text-white truncate">{item.prop}</span>
                <span className="text-zinc-500 truncate">{item.type}</span>
                <span className="text-zinc-400 text-[10px] truncate">{item.defaultVal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Composition Notes */}
      {content.compositionNotes && content.compositionNotes.length > 0 && (
        <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
          <span className="font-medium text-zinc-400 capitalize text-[12px]">
            Composition
          </span>
          <ul className="flex flex-col gap-1.5">
            {content.compositionNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </aside>
  );
}

// Helper check for React elements
function isValidElement(element: unknown): element is React.ReactElement<{ value?: string; onChange?: (e: any) => void; children?: ReactNode }> {
  return React.isValidElement(element);
}

// // Internal drop-in replacement renderer matching your InputDropdown specs
// interface AutoCustomizerSelectProps {
//   value: string;
//   options: { label: string; value: string }[];
//   onChange: (value: string) => void;
// }

// function AutoCustomizerSelect({ value, options, onChange }: AutoCustomizerSelectProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   const selectedOption = options.find((opt) => opt.value === value);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
//       <button
//         type="button"
//         onClick={() => {
//           setIsOpen(!isOpen);
//           sounds.playClick();
//         }}
//         className="w-full h-[40px] px-4 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl flex items-center justify-between text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-sm focus:outline-none"
//       >
//         <span className="truncate">{selectedOption?.label || value}</span>
//         <CaretDown 
//           size={14} 
//           weight="bold" 
//           className={`text-zinc-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
//         />
//       </button>

//       {isOpen && (
//         <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden p-1 flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95 duration-150">
//           {options.map((option) => {
//             const isSelected = value === option.value;
//             return (
//               <button
//                 key={option.value}
//                 type="button"
//                 onClick={() => {
//                   onChange(option.value);
//                   setIsOpen(false);
//                   sounds.playClick();
//                 }}
//                 className={`w-full px-3.5 py-2.5 text-left rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
//                   isSelected
//                     ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
//                     : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
//                 }`}
//               >
//                 <span className="truncate">{option.label}</span>
//                 {isSelected && <Check size={14} className="text-zinc-900 dark:text-white shrink-0 ml-2" />}
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// Internal drop-in replacement renderer matching your InputDropdown specs
interface AutoCustomizerSelectProps {
  value?: string; // Made optional here
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

function AutoCustomizerSelect({ value = '', options, onChange }: AutoCustomizerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        className="w-full h-[40px] px-4 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl flex items-center justify-between text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer focus:outline-none"
      >
        <span className="truncate">{selectedOption?.label || value || 'Select...'}</span>
        <CaretDown 
          size={14} 
          weight="bold" 
          className={`text-zinc-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden p-1 flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95 duration-150">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  sounds.playClick();
                }}
                className={`w-full px-3.5 py-2.5 text-left rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check size={14} className="text-zinc-900 dark:text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}