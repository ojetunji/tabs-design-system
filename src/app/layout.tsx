import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { DesignSystemProvider } from '@/context/DesignSystemContext';
import { themeInitScript } from '@/lib/theme';

export const metadata: Metadata = {
  title: {
    default: 'Tabs Design System',
    template: '%s · Tabs Design System',
  },
  description:
    'The open-source design system behind Tabs: tokens, typography and React components with live controls and copyable code.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-hidden">
        <DesignSystemProvider>
          <AppShell>{children}</AppShell>
        </DesignSystemProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
