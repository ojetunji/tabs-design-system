'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { useDesignSystem } from '@/context/DesignSystemContext';

export default function DiscoveryPage() {
  const { setCodeSnippet, setComponentTitle, setComponentCategory } = useDesignSystem();

  useEffect(() => {
    setCodeSnippet('');
    setComponentTitle('');
    setComponentCategory('');
  }, [setCodeSnippet, setComponentTitle, setComponentCategory]);

  return (
    <div className="w-full max-w-3xl mx-auto pt-20 pb-28 px-6 md:px-10 space-y-10 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>Tabs</span>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100 font-medium">Introduction</span>
      </div>

      {/* Main Title & Lead */}
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Introduction
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Specs, micro-interactions, and token details often gets lost between Figma and the codebase. I built this as an extention of Tabs to fix that gap for myself. It is a living, self-hosted product library and design system built completely from scratch, serving as a direct bridge between precise design tokens and production-ready React, TypeScript, and Tailwind code.
        </p>
      </div>

      <p className="text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed">
        This started as an intentional learning journey. It became my personal sandbox to explore how far frontend engineering can go when you build out component, token, and state specs with your own hands rather than relying on heavy third-party dependencies.
      </p>

      {/* Core Philosophy Section */}
      <div className="space-y-4 pt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
        <p>
          Flipping that script by keeping full source control right in the repository. It has taught me how to architect systems where design and code speak the exact same language, anchored by a few guiding principles:
        </p>

        <ul className="list-disc pl-5 space-y-2 pt-2">
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Transparency:</strong> Every component layer is completely open, unstyled, and inspectable right from the code drawer in a way I can understand and tweak as needed. Also allows for easy import and use in other projects.
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Token-First Architecture:</strong> Sizing scales, typography, and layout states map directly back to foundational system variables rather than guessing.
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Live Experimentation:</strong> Real-time parameters let me test component variants, scaling metrics, and edge cases instantly on the fly.
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">UX Intent:</strong> The library is informed by real-world product thinking—tailored for mobile-first constraints, high-density data views, and workflows.
          </li>
        </ul>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

      {/* Platform Anatomy Header */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50" id="anatomy">
          Platform Anatomy
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          To make engineering handoffs seamless and keep the feedback loop as tight as possible, the interface is structured around three core controls:
        </p>

        <div className="space-y-6 pt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">1. Navigation Header</h3>
            <p>Your command center for the workspace. It lets you toggle background grid matrices, haptic audio feedback, theme synchronization, and code inspection views on the fly.</p>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">2. Live Code Drawer</h3>
            <p>A sliding drawer that strips away the abstraction, revealing the exact TSX implementations and Tailwind utility classes for whatever component you are looking at.</p>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">3. Inspector Panel</h3>
            <p>An interactive sidebar designed for live-tweaking. It lets you adjust token parameters, sizing scales, and component states in real-time to see how variations hold up under pressure.</p>
          </div>
        </div>
      </div>

      {/* Call to action footer link */}
      <div className="pt-6">
        <Link 
          href="/foundations/typography"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
        >
          <span>Get started</span>
          <ArrowRight weight="bold" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}