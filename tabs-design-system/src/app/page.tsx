'use client';

import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';

export default function HomeDashboard() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-16">
      
      {/* Hero Intro */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Tabs Design System
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
          A living, self-hosted product library and design system built from scratch. Hand-coded components bridging exact Figma tokens to practice production-ready React, TypeScript, and Tailwind code.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Foundations (Spans 2 cols) */}
        <div className="md:col-span-2 group border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between shadow-xs">
          <div className="flex flex-col gap-6">
            <div className="w-20 h-20 relative">
              <img src="/images/foundations.svg" alt="Foundations" className="w-full h-full object-contain group-hover:scale-105 transition duration-300" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>Foundations</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Core visual style variables and design tokens.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/foundations/colors" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Colors & Palettes <ArrowRight size={12} />
              </Link>
              <Link href="/foundations/typography" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Typography <ArrowRight size={12} />
              </Link>
              <Link href="/foundations/spacing" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Spacing & Layout <ArrowRight size={12} />
              </Link>
              <Link href="/foundations/elevation" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Elevation & Shadows <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Atoms */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between group shadow-xs">
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 relative">
              <img src="/images/atoms.svg" alt="Atoms" className="w-full h-full object-contain group-hover:scale-105 transition duration-300" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>Atoms</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Fundamental building blocks.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/atoms/buttons" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Buttons <ArrowRight size={12} />
              </Link>
              <Link href="/atoms/inputs" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Inputs <ArrowRight size={12} />
              </Link>
              <Link href="/atoms/badges" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Badges <ArrowRight size={12} />
              </Link>
              <Link href="/atoms/icons" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Icons <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3: Molecules */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between group shadow-xs">
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 relative">
              <img src="/images/molecules.svg" alt="Molecules" className="w-full h-full object-contain group-hover:scale-105 transition duration-300" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>Molecules</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Simple grouped components.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/molecules/search-bar" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Search Bar <ArrowRight size={12} />
              </Link>
              <Link href="/molecules/form-group" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Form Groups <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 4: Organisms */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between group shadow-xs">
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 relative">
              <img src="/images/organisms.svg" alt="Organisms" className="w-full h-full object-contain group-hover:scale-105 transition duration-300" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>Organisms</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Complex modular layout sections.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/organisms/navbars" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Navbars <ArrowRight size={12} />
              </Link>
              <Link href="/organisms/data-tables" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Data Tables <ArrowRight size={12} />
              </Link>
              <Link href="/organisms/modals" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Modals <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 5: Templates & Pages */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between group shadow-xs">
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 relative">
              <img src="/images/templates.svg" alt="Templates" className="w-full h-full object-contain group-hover:scale-105 transition duration-300" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>Templates & Pages</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Full screen structural layouts.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/templates-pages/layouts" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Full Layouts <ArrowRight size={12} />
              </Link>
              <Link href="/templates-pages/case-studies" className="text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 transition shadow-xs flex items-center gap-1.5">
                Case Studies <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}