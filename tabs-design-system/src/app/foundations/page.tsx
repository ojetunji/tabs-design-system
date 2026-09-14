export default function FoundationsPage() {
    return (
      <div className="max-w-5xl mx-auto flex flex-col gap-12 pb-16">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2 border-b border-zinc-200 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900" style={{ fontFamily: 'var(--font-display)' }}>
            Foundations & Tokens
          </h1>
          <p className="text-xs text-zinc-500">
            The core atomic design tokens powering the Tabs system, including color palettes, neutral scales, typography hierarchy, spacing, and elevation.
          </p>
        </div>
  
        {/* Section 1: Typography System */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-400">Typography Pairing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-zinc-400">Headers / Display</span>
                <span className="text-xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-display)' }}>
                  Creato Display
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-6 leading-relaxed">
                Used across all high-impact titles, card headers, and navigation milestones to establish crisp, geometric hierarchy.
              </p>
            </div>
  
            <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-zinc-400">Body / UI Text</span>
                <span className="text-xl font-medium text-zinc-900" style={{ fontFamily: 'var(--font-sans)' }}>
                  Mona Sans
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-6 leading-relaxed">
                Optimized for interface readability, documentation notes, code blocks, and micro-copy across all viewport sizes.
              </p>
            </div>
          </div>
        </div>
  
        {/* Section 2: Primary Color Scale */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-400">Primary Color Scale (11 Steps)</h2>
          <p className="text-xs text-zinc-500">Systematic tonal ramp spanning from light highlights (25) to deepest core contrast (950).</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {[
              { step: '25', hex: '#F4F6F9' },
              { step: '50', hex: '#E9EEF4' },
              { step: '100', hex: '#D3DDE9' },
              { step: '200', hex: '#A8BBD4' },
              { step: '300', hex: '#7D99BE' },
              { step: '400', hex: '#5277A8' },
              { step: '500', hex: '#2B5593' },
              { step: '600', hex: '#224476' },
              { step: '700', hex: '#193358' },
              { step: '800', hex: '#11223B' },
              { step: '950', hex: '#08111D' },
            ].map((item) => (
              <div key={item.step} className="border border-zinc-200 rounded-xl p-3 bg-white flex flex-col gap-2 shadow-sm">
                <div className="h-10 rounded-lg border border-zinc-100" style={{ backgroundColor: item.hex }} />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-900">{item.step}</span>
                  <span className="font-mono text-zinc-400">{item.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Section 3: Neutral Grays */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-400">Neutral Grays</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { step: '0', hex: '#FFFFFF' },
              { step: '50', hex: '#FAFAFA' },
              { step: '100', hex: '#F4F4F5' },
              { step: '200', hex: '#E4E4E7' },
              { step: '300', hex: '#D4D4D8' },
              { step: '400', hex: '#A1A1AA' },
              { step: '600', hex: '#52525B' },
              { step: '800', hex: '#27272A' },
              { step: '900', hex: '#18181B' },
              { step: '950', hex: '#09090B' },
            ].map((item) => (
              <div key={item.step} className="border border-zinc-200 rounded-xl p-3 bg-white flex flex-col gap-2 shadow-sm">
                <div className="h-10 rounded-lg border border-zinc-200" style={{ backgroundColor: item.hex }} />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-900">{item.step}</span>
                  <span className="font-mono text-zinc-400">{item.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Section 4: Spacing Scale */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-400">Spacing & Layout Tokens</h2>
          <div className="border border-zinc-200 rounded-2xl bg-white overflow-hidden">
            <div className="grid grid-cols-3 p-4 bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-700">
              <span>Token Name</span>
              <span>Size Value</span>
              <span>Visual Width Representation</span>
            </div>
            {[
              { name: 'space-1', value: '4px', width: '16px' },
              { name: 'space-2', value: '8px', width: '32px' },
              { name: 'space-3', value: '12px', width: '48px' },
              { name: 'space-4', value: '16px', width: '64px' },
              { name: 'space-6', value: '24px', width: '96px' },
              { name: 'space-8', value: '32px', width: '128px' },
            ].map((space) => (
              <div key={space.name} className="grid grid-cols-3 p-4 border-b border-zinc-100 items-center text-xs">
                <span className="font-mono text-zinc-900 font-medium">{space.name}</span>
                <span className="text-zinc-500 font-mono">{space.value}</span>
                <div>
                  <div className="bg-zinc-900 h-2.5 rounded-sm" style={{ width: space.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Section 5: Elevation & Shadows */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-400">Elevation & Shadows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
              <span className="font-semibold text-xs text-zinc-900">Elevation 1 (Card / Box)</span>
              <span className="text-[11px] font-mono text-zinc-400">shadow-sm</span>
            </div>
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-md flex flex-col gap-2">
              <span className="font-semibold text-xs text-zinc-900">Elevation 2 (Dropdown / Popover)</span>
              <span className="text-[11px] font-mono text-zinc-400">shadow-md</span>
            </div>
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-xl flex flex-col gap-2">
              <span className="font-semibold text-xs text-zinc-900">Elevation 3 (Modal / Floating Header)</span>
              <span className="text-[11px] font-mono text-zinc-400">shadow-xl</span>
            </div>
          </div>
        </div>
  
      </div>
    );
  }