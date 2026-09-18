import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import type { AssetDef, Category } from '../lib/types';

const TIER_COLOR: Record<string, string> = { S: '#C8FF31', A: '#5BE7FF', B: 'rgba(255,255,255,0.45)' };

/* -------- stage: the bounded interactive demo viewport -------- */
export function AssetStage({
  hint,
  accent,
  children,
}: {
  hint: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="scanline relative h-[252px] overflow-hidden rounded-xl border border-line bg-[#07080D]">
      <div className="gridlines absolute inset-0 opacity-50" />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(120% 100% at 50% 0%, ${accent}14 0%, transparent 55%)` }}
      />
      <div className="absolute inset-0 touch-none select-none">{children}</div>

      {/* corner ticks */}
      <span className="absolute left-1.5 top-1.5 size-2.5 border-l border-t border-white/25" />
      <span className="absolute right-1.5 top-1.5 size-2.5 border-r border-t border-white/25" />
      <span className="absolute bottom-1.5 left-1.5 size-2.5 border-b border-l border-white/25" />
      <span className="absolute bottom-1.5 right-1.5 size-2.5 border-b border-r border-white/25" />

      <div className="pointer-events-none absolute bottom-2 right-2 z-30 flex items-center gap-1.5 rounded-full border border-line bg-black/60 px-2 py-1 font-mono text-[8px] tracking-[0.2em] text-white/45 backdrop-blur">
        <MousePointer2 size={8} className="text-volt" />
        {hint}
      </div>
    </div>
  );
}

/* -------- card shell -------- */
export function AssetCard({ asset, cat, index }: { asset: AssetDef; cat: Category; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const { Demo } = asset;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-line bg-panel p-3 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.14em]"
            style={{ color: cat.color, borderColor: `${cat.color}55`, background: `${cat.color}0D` }}
          >
            {asset.id}
          </span>
          <span className="font-display text-[13px] font-800 uppercase tracking-wide text-white">
            {asset.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[8px] tracking-[0.18em] ${
              asset.source === 'CORE'
                ? 'border-cy/40 bg-cy/5 text-cy'
                : 'border-volt/40 bg-volt/5 text-volt'
            }`}
          >
            {asset.source === 'CORE' ? 'COURSE' : 'EXT+'}
          </span>
          <span
            className="grid size-5 place-items-center rounded font-display text-[10px] font-800"
            style={{ color: TIER_COLOR[asset.tier], background: `${TIER_COLOR[asset.tier]}14` }}
          >
            {asset.tier}
          </span>
        </div>
      </div>

      <AssetStage hint={asset.hint} accent={cat.color}>
        {inView && <Demo />}
      </AssetStage>

      <div className="px-1 pb-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-600 text-white/90">{asset.title}</h3>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-white/40">{asset.desc}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {asset.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 font-mono text-[8px] tracking-[0.16em] text-white/40"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/* -------- category section frame -------- */
export function CategorySection({
  cat,
  count,
  children,
}: {
  cat: Category;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section id={`cat-${cat.id}`} className="relative scroll-mt-28 border-b border-line">
      <div className="mx-auto max-w-[1500px] px-4 py-14 md:px-8 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3 font-mono text-[10px] tracking-[0.28em]" style={{ color: cat.color }}>
              <span className="h-px w-10" style={{ background: cat.color }} />
              SEC {cat.index} / 06 — {cat.label}
            </div>
            <h2 className="font-display text-3xl font-800 uppercase leading-none tracking-tight text-white md:text-5xl">
              {cat.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50">{cat.desc}</p>
          </div>
          <div
            className="rounded-xl border px-4 py-3 text-right"
            style={{ borderColor: `${cat.color}44`, background: `${cat.color}0A` }}
          >
            <div className="font-display text-2xl font-800" style={{ color: cat.color }}>
              {String(count).padStart(2, '0')}
            </div>
            <div className="font-mono text-[8px] tracking-[0.24em] text-white/40">UNITS</div>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
      </div>
    </section>
  );
}
