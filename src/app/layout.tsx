import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { DesignSystemProvider } from '@/context/DesignSystemContext';

// Code blocks and token names are set in JetBrains Mono.
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: {
    default: 'Tabs Design System',
    template: '%s · Tabs Design System',
  },
  description:
    'The open-source design system behind Tabs: tokens, typography and React components with live controls and copyable code.',
};

// Matches the page background (surface-subtle, Paper 50). Add a dark value once dark mode is switched on.
export const viewport: Viewport = {
  themeColor: '#F7F7F7',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${jetbrainsMono.variable}`}>
      <body className="h-full bg-surface-subtle text-fg antialiased overflow-hidden">
        <DesignSystemProvider>
          <AppShell>{children}</AppShell>
        </DesignSystemProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
