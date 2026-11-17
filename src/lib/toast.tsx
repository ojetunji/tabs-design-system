'use client';

import { toast } from 'sonner';
import { CheckCircle, CircleNotch, Warning } from '@phosphor-icons/react';

type ToastKind = 'success' | 'error' | 'loading';

const ICONS: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle size={16} weight="fill" className="shrink-0 text-success" />,
  error: <Warning size={16} weight="fill" className="shrink-0 text-on-danger-subtle" />,
  loading: <CircleNotch size={16} weight="bold" className="shrink-0 animate-spin text-fg" />,
};

/** The Tabs toast: a small pill, as in the product's screen viewer. */
function TabsToast({ kind, message }: { kind: ToastKind; message: string }) {
  return (
    // Sonner centres a box of --width; keep to that width and let a long pill overflow evenly on both sides.
    <div className="flex w-[var(--width)] justify-center">
      <div
        role="status"
        className={`flex h-9 items-center gap-2.5 rounded-full px-3 type-label-small text-base-black whitespace-nowrap ${
          kind === 'error' ? 'bg-danger-surface' : 'bg-surface-raised'
        }`}
      >
        {ICONS[kind]}
        {message}
      </div>
    </div>
  );
}

const show = (kind: ToastKind, message: string, id?: string | number) =>
  toast.custom(() => <TabsToast kind={kind} message={message} />, {
    id,
    duration: kind === 'loading' ? Infinity : 3000,
  });

/**
 * Site toasts. The pill is Tabs'; Sonner supplies the motion (enter, exit,
 * stacking, swipe to dismiss). Pass the id from `loading` to replace it in place.
 */
export const notify = {
  success: (message: string, id?: string | number) => show('success', message, id),
  error: (message: string, id?: string | number) => show('error', message, id),
  loading: (message: string, id?: string | number) => show('loading', message, id),
  dismiss: (id?: string | number) => toast.dismiss(id),
};
