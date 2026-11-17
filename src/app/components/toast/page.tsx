'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BellRinging, Copy } from '@phosphor-icons/react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { notify } from '@/lib/toast';
import { sounds } from '@/lib/sounds';

type ToastKind = 'loading' | 'success' | 'error';

const MESSAGES: Record<ToastKind, string> = {
  loading: 'Copying screens...',
  success: 'Screens copied to clipboard!',
  error: 'There was an error copying this image. Try again',
};

// One id, so loading turns into the result in place instead of stacking.
const TOAST_ID = 'toast-demo';

const SNIPPET = `import { notify } from '@/lib/toast';

async function copyScreens() {
  const id = notify.loading('Copying screens...');
  try {
    await copy();
    notify.success('Screens copied to clipboard!', id);
  } catch {
    notify.error('There was an error copying this image. Try again', id);
  }
}`;

export default function ToastPage() {
  const [kind, setKind] = useState<ToastKind | 'idle'>('idle');
  const [isCopying, setIsCopying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { setInspectorContent, setCustomControls, setCodeSnippet, setComponentTitle, setComponentCategory, setComponentIcon } =
    useDesignSystem();

  const show = useCallback((next: ToastKind) => {
    notify[next](MESSAGES[next], TOAST_ID);
    setKind(next);
  }, []);

  // The trigger plays the real sequence: loading, then success or (sometimes) an error.
  const runCopy = () => {
    if (isCopying) return;
    if (timer.current) clearTimeout(timer.current);
    sounds.playClick();
    setIsCopying(true);
    show('loading');
    timer.current = setTimeout(() => {
      show(Math.random() > 0.3 ? 'success' : 'error');
      setIsCopying(false);
    }, 1500);
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      notify.dismiss(TOAST_ID);
    },
    [],
  );

  useEffect(() => {
    setComponentTitle('Toast');
    setComponentIcon(<BellRinging size={14} />);
    setComponentCategory('Feedback');

    setInspectorContent({
      title: 'Toast',
      description: 'A small pill at the top of the page that confirms an action. It has loading, success and error states.',
      guidance: {
        purpose:
          'Confirms the result of something the person just did, without interrupting them. It answers "did that work?" and then leaves.',
        behaviour:
          'A small pill appears at the top centre of the page. A slow action shows a loading pill first, which then changes in place to success or error. Success leaves on its own after three seconds; an error is tinted red and says what to do next.',
        usage:
          'The screen viewer: copying a screen ("Screens copied to clipboard!"), downloading, saving to a tab and removing a saved tab.',
      },
      propsList: [
        {
          prop: 'notify.success',
          type: '(message: string, id?: string | number) => id',
          defaultVal: '-',
          description: 'Confirms that something worked. Leaves on its own after three seconds.',
        },
        {
          prop: 'notify.error',
          type: '(message: string, id?: string | number) => id',
          defaultVal: '-',
          description: 'Says what went wrong and what to do next.',
        },
        {
          prop: 'notify.loading',
          type: '(message: string, id?: string | number) => id',
          defaultVal: '-',
          description: 'Stays until replaced. Pass its id to success or error to swap it in place.',
        },
      ],
    });

    setCustomControls(
      <div className="flex flex-col gap-1.5">
        <label>State</label>
        <select
          value={kind}
          onChange={(e) => {
            const next = e.target.value as ToastKind | 'idle';
            if (timer.current) clearTimeout(timer.current);
            setIsCopying(false);
            if (next === 'idle') {
              notify.dismiss(TOAST_ID);
              setKind('idle');
            } else {
              show(next);
            }
          }}
        >
          <option value="idle">Idle</option>
          <option value="loading">Loading</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
      </div>,
    );

    setCodeSnippet(SNIPPET);
  }, [kind, show, setInspectorContent, setCustomControls, setCodeSnippet, setComponentTitle, setComponentCategory, setComponentIcon]);

  return (
    <PreviewCanvas>
      <button
        type="button"
        disabled={isCopying}
        onClick={runCopy}
        aria-label="Copy screens"
        className={`flex h-[38px] items-center justify-center rounded-full border-[0.5px] border-line bg-surface px-5 shadow-sm transition-[background-color,scale,opacity] duration-150 ${
          isCopying ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-surface-raised active:scale-[0.97]'
        }`}
      >
        <Copy size={18} className="text-fg" />
      </button>
    </PreviewCanvas>
  );
}
