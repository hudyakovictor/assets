import { motion } from 'framer-motion';
import { Maximize2, MousePointerClick, Move, Timer, Scan, Activity } from 'lucide-react';
import type { AssetDef, Trigger } from '../lib/core';
import { catOf } from '../lib/core';
import type { CSSProperties } from 'react';

const TRIG: Record<Trigger, typeof Scan> = { AUTO: Activity, TAP: MousePointerClick, HOLD: Timer, DRAG: Move, HOVER: Scan };

export function AssetCard({ asset, index, onOpen }: { asset: AssetDef; index: number; onOpen: (a: AssetDef) => void }) {
  const cat = catOf(asset.cat);
  const TIcon = TRIG[asset.trigger];
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-panel transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
      style={{ '--c': cat.color } as CSSProperties}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0a11]">
        <asset.Component />
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10">
          <span className={`rounded-full border px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.18em] ${asset.origin === 'ARCHIVE' ? 'border-white/20 bg-black/50 text-white/55' : 'border-amber-300/40 bg-amber-400/10 text-amber-300'}`}>
            {asset.origin === 'ARCHIVE' ? 'CORE·40%' : 'NEW·60%'}
          </span>
        </div>
        <div className="pointer-events-none absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full border border-white/12 bg-black/50 px-2 py-0.5 font-mono text-[8px] tracking-[0.15em] text-white/60">
          {asset.trigger === 'AUTO' && <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: cat.color }} />}
          <TIcon className="h-3 w-3" />{asset.trigger}
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: `inset 0 0 0 1px ${cat.color}66, inset 0 -40px 60px -40px ${cat.color}30` }} />
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(asset); }}
          className="absolute bottom-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-white/60 opacity-0 backdrop-blur transition-all duration-200 hover:border-white/40 hover:text-white group-hover:opacity-100"
          aria-label="Open inspector"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <button onClick={() => onOpen(asset)} className="flex flex-1 flex-col gap-1.5 border-t border-white/5 p-3 text-left">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-[12px] font-bold tracking-wide text-white">{asset.name}</h3>
          <span className="font-mono text-[9px]" style={{ color: cat.color }}>#{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="font-mono text-[9px] tracking-[0.08em] text-white/40">{asset.duration} · {asset.easing}</div>
        <div className="mt-0.5 flex flex-wrap gap-1">
          {asset.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/8 bg-white/[0.03] px-1.5 py-px font-mono text-[8px] tracking-[0.08em] text-white/45">{t}</span>
          ))}
        </div>
      </button>
    </motion.article>
  );
}
