import { motion } from 'framer-motion';
import { Hexagon, Plus, ArrowDown, Globe, Zap } from 'lucide-react';
import type { Category } from '../lib/types';

/* ------------------------------ NAV ------------------------------ */
export function Nav({ cats }: { cats: Category[] }) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-12 border-b border-line bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-4 md:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative grid size-7 place-items-center">
            <Hexagon size={26} strokeWidth={1.4} className="text-volt" />
            <span className="absolute font-mono text-[9px] font-bold text-volt">99</span>
          </span>
          <span className="font-display text-[11px] font-800 tracking-[0.22em] text-white">
            ASSETFORGE<span className="text-volt">//</span>99
          </span>
        </a>
        <div className="hidden items-center gap-5 lg:flex">
          {cats.map((c, i) => (
            <a
              key={c.id}
              href={`#cat-${c.id}`}
              className="group flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-white/45 transition-colors hover:text-white"
            >
              <span style={{ color: c.color }} className="text-[9px]">0{i + 1}</span>
              {c.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-volt/30 bg-volt/5 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-volt sm:flex">
            <Zap size={9} /> v99.0 // READY
          </span>
          <a
            href="https://github.com/hudyakovictor/gamedevskils"
            target="_blank"
            rel="noreferrer"
            className="grid size-7 place-items-center rounded-full border border-line text-white/50 transition-colors hover:border-white/40 hover:text-white"
          >
            <Globe size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ HERO ------------------------------ */
const TICKER = [
  'CONTROL SYSTEMS', 'NAVIGATION & FLOW', 'HUD & COMBAT FEEDBACK', 'ECONOMY & PROGRESSION',
  'MENUS & META SCREENS', 'WORLD & CAMERA FX', 'INTERACTIVE TRANSITIONS', 'PHYSICS-BASED MOTION',
];

export function Hero({ stats }: { stats: { k: string; l: string }[] }) {
  return (
    <header id="top" className="relative overflow-hidden pt-12">
      <div className="absolute inset-0 gridlines opacity-60" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(90% 60% at 70% 0%, rgba(200,255,49,0.09) 0%, transparent 55%), radial-gradient(70% 50% at 10% 30%, rgba(139,124,255,0.1) 0%, transparent 60%)' }}
      />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" />

      <div className="relative mx-auto max-w-[1500px] px-4 pb-14 pt-16 md:px-8 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <span className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-[10px] tracking-[0.22em] text-white/60">
            <span className="size-1.5 animate-blink rounded-full bg-volt" />
            MOTION SYSTEMS CATALOG — MOBILE GAME CONSTRUCTOR
          </span>
          <span className="rounded-full border border-cy/30 bg-cy/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.22em] text-cy">
            COURSE 40% + EXTENSION 60% = 100% COVERAGE
          </span>
        </motion.div>

        <h1 className="font-display uppercase leading-[0.92] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="block text-[13vw] font-900 text-white md:text-[7.2rem]"
          >
            INTERFACE
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-hollow-volt block text-[13vw] font-900 md:text-[7.2rem]"
          >
            ARSENAL<span className="text-volt" style={{ WebkitTextStroke: '0px' }}>.</span>
          </motion.span>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl text-sm leading-relaxed text-white/55 md:col-span-7 md:text-base"
          >
            A living library of award-grade interface systems — virtual joysticks, deck carousels,
            screen transitions, combat HUDs, loot reveals and camera FX. Every unit below is
            <span className="text-white"> fully interactive</span>: touch it, drag it, break it, steal it.
            Assemble any 99-point mobile game from these blocks like a constructor.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:col-span-5"
          >
            {stats.map((s) => (
              <div key={s.l} className="bg-panel px-4 py-3.5">
                <div className="font-display text-xl font-800 text-volt">{s.k}</div>
                <div className="mt-0.5 font-mono text-[9px] tracking-[0.22em] text-white/40">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/35"
        >
          <ArrowDown size={11} className="animate-floaty text-volt" /> SCROLL TO THE VAULT
        </motion.div>
      </div>

      {/* marquee */}
      <div className="relative border-y border-line bg-panel/60 py-3">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap pr-6">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-6 font-mono text-[10px] tracking-[0.3em] text-white/40">
              {t}
              <Plus size={10} className="text-volt/70" />
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
export function Footer({ cats, totalUnits }: { cats: Category[]; totalUnits: number }) {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" />
      <div className="relative mx-auto max-w-[1500px] px-4 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl font-900 uppercase leading-none md:text-5xl">
              BUILD.<br />
              <span className="text-hollow">THEN PLAY.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
              {totalUnits} production-grade motion systems. Drag them into a frame, wire the data,
              ship the game. No dead ends — every category reaches 100% spec.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between font-mono text-[9px] tracking-[0.22em] text-white/45">
                  <span className="text-cy">CORE COURSE MATERIAL</span><span>40%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '40%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-cy"
                  />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between font-mono text-[9px] tracking-[0.22em] text-white/45">
                  <span className="text-volt">FORGE EXTENSIONS — NEW SYSTEMS</span><span>60%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-volt"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {cats.map((c) => (
                <a
                  key={c.id}
                  href={`#cat-${c.id}`}
                  className="group bg-panel px-4 py-4 transition-colors hover:bg-panel2"
                >
                  <div className="font-mono text-[9px] tracking-[0.22em]" style={{ color: c.color }}>
                    SEC {c.index}
                  </div>
                  <div className="mt-1 font-display text-[11px] font-600 uppercase tracking-wide text-white/80 transition-colors group-hover:text-white">
                    {c.title}
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/30">
              <span>ASSETFORGE//99 — MOTION SYSTEMS DIVISION</span>
              <span>MMXXVI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
