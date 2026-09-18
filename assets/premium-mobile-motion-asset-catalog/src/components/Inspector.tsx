import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { catOf } from '../lib/core';

export function Inspector({ asset, all, onClose, onSwap }: { asset: AssetDef; all: AssetDef[]; onClose: () => void; onSwap: (a: AssetDef) => void }) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', f);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', f); document.body.style.overflow = ''; };
  }, [onClose]);
  const cat = catOf(asset.cat);
  const related = all.filter((a) => a.cat === asset.cat && a.id !== asset.id).slice(0, 4);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.92, y: 26, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0b0b13] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${cat.color}1c` }}>
              <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
            </span>
            <div>
              <div className="font-display text-[13px] font-extrabold tracking-wide text-white">{asset.name}</div>
              <div className="font-mono text-[9px] tracking-[0.2em] text-white/40">{cat.label.toUpperCase()} · {asset.origin === 'ARCHIVE' ? 'COURSE CORE' : 'EXPANSION UNIT'}</div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/60 transition-colors hover:border-white/35 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div key={asset.id} className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#0a0a11]">
          <asset.Component />
        </div>
        <div className="grid gap-4 overflow-y-auto p-4 sm:grid-cols-[1fr_230px]">
          <div>
            <p className="text-[13px] leading-relaxed text-white/65">{asset.desc}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[['TRIGGER', asset.trigger], ['DURATION', asset.duration], ['EASING', asset.easing], ['ORIGIN', asset.origin === 'ARCHIVE' ? 'COURSE 40%' : 'NEW 60%']].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-2">
                  <div className="font-mono text-[8px] tracking-[0.2em] text-white/35">{k}</div>
                  <div className="mt-0.5 font-mono text-[10px] font-bold" style={{ color: cat.color }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {asset.tags.map((t) => (<span key={t} className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-white/50">#{t}</span>))}
            </div>
          </div>
          <div>
            <div className="mb-2 font-mono text-[8px] tracking-[0.25em] text-white/35">COMBINES WITH</div>
            <div className="flex flex-col gap-1.5">
              {related.map((r) => (
                <button key={r.id} onClick={() => onSwap(r)} className="group flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-2.5 py-2 text-left transition-colors hover:border-white/25">
                  <span className="font-mono text-[10px] font-bold text-white/70">{r.name}</span>
                  <ArrowRight className="h-3 w-3 text-white/30 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
