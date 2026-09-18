import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, Dices, Archive, ArrowDown } from 'lucide-react';
import type { Category } from '../lib/core';

export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const d = 1300;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / d);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className="tabular-nums">{v}{suffix}</span>;
}

export function Nav({ query, setQuery, onRandom }: { query: string; setQuery: (q: string) => void; onRandom: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-void/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-black"><Zap className="h-4 w-4" strokeWidth={2.6} /></span>
          <span className="font-display text-[13px] font-black tracking-wider">MOTION<span className="text-amber-400">/99</span></span>
          <span className="hidden font-mono text-[8px] tracking-[0.35em] text-white/35 md:inline">VAULT</span>
        </a>
        <div className="relative mx-auto w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets, tags…"
            className="w-full rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-9 pr-3 font-mono text-[11px] text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-amber-300/50"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={onRandom} className="flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.15em] text-white/60 transition-colors hover:border-amber-300/50 hover:text-amber-300">
            <Dices className="h-3.5 w-3.5" /><span className="hidden sm:inline">RANDOM</span>
          </button>
          <a href="https://github.com/hudyakovictor/gamedevskils" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/50 transition-colors hover:border-white/35 hover:text-white" aria-label="Source archive">
            <Archive className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function WordCycler() {
  const WORDS = ['TRANSITIONS', 'PARTICLES', 'GAME FEEL', 'REWARD LOOPS', 'GESTURES', 'KINETIC TYPE', 'CAMERA JUICE'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 1700);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex overflow-hidden align-bottom">
      <motion.span key={i} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="inline-block text-amber-400">{WORDS[i]}</motion.span>
    </span>
  );
}

export function Hero({ total, archive, minis, onRandom }: {
  total: number; archive: number; minis: { name: string; node: ReactNode; color: string }[]; onRandom: () => void;
}) {
  return (
    <section id="top" className="relative overflow-hidden pb-14 pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 dotgrid opacity-40" />
        <div className="absolute -top-32 right-[8%] h-[380px] w-[380px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(251,191,36,.08), transparent 65%)' }} />
        <div className="absolute bottom-[-30%] left-[-6%] h-[420px] w-[420px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,211,238,.07), transparent 65%)' }} />
      </div>
      {minis.length > 0 && (
        <div className="pointer-events-none absolute inset-y-0 right-8 z-0 hidden w-[420px] items-center justify-center gap-4 xl:flex">
          {minis.map((m, i) => (
            <div key={m.name} style={{ transform: `rotate(${[-4, 3, -2][i]}deg) translateY(${[-8, 14, -2][i]}px)` }}>
              <div className="floaty relative h-36 w-32 overflow-hidden rounded-xl border bg-panel" style={{ borderColor: `${m.color}55`, animationDelay: `${i * 0.8}s` }}>
                <div className="absolute inset-0">{m.node}</div>
                <div className="absolute bottom-1 left-1.5 font-mono text-[7px] tracking-[0.2em] text-white/55">{m.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 font-mono text-[9px] tracking-[0.28em] text-white/50">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-400" />
          MOBILE GAME MOTION SYSTEM · {archive} CORE + {total - archive} EXPANSION UNITS
        </div>
        <h1 className="font-display font-black leading-[0.98] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
          MOTION <span className="text-stroke">VAULT</span>
          <br />
          <span style={{ fontSize: 'clamp(1.3rem, 3.6vw, 3.2rem)' }} className="font-display font-extrabold tracking-tight text-white/85">
            BUILT FOR <WordCycler />
          </span>
        </h1>
        <p className="mt-6 max-w-xl font-mono text-[11px] leading-relaxed tracking-[0.04em] text-white/45">
          62 live assets — interactive transitions, animation, motion effects & transform UI.
          A brick-by-brick kit for assembling award-winning mobile games: 40% reconstructed
          from the course archive, 60% engineered new. Tap, hold, drag — everything on this page is alive.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#vault" className="group flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-mono text-[11px] font-bold tracking-[0.18em] text-black transition-transform hover:scale-[1.03] active:scale-95">
            BROWSE THE VAULT<ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
          </a>
          <button onClick={onRandom} className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-[11px] font-bold tracking-[0.18em] text-white/70 transition-colors hover:border-amber-300/50 hover:text-amber-300">
            <Dices className="h-3.5 w-3.5" />FEELING LUCKY
          </button>
        </div>
        <div className="mt-12 grid max-w-xl grid-cols-4 gap-4 border-t border-white/8 pt-5">
          {[
            { v: total, s: '', l: 'LIVE ASSETS' },
            { v: 9, s: '', l: 'CATEGORIES' },
            { v: 5, s: '', l: 'TRIGGERS' },
            { v: 60, s: 'fps', l: 'TARGET' },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-[22px] font-extrabold text-white sm:text-[28px]"><CountUp to={s.v} suffix={s.s} /></div>
              <div className="mt-1 font-mono text-[8px] tracking-[0.3em] text-white/35">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Marquee({ items, color = '#fbbf24' }: { items: string[]; color?: string }) {
  return (
    <div className="mq-wrap relative z-10 border-y border-white/8 bg-void py-2.5">
      <div className="mq-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span key={i} className="mr-8 flex shrink-0 items-center gap-8 font-mono text-[10px] font-bold tracking-[0.3em] text-white/40">
                {t}<Zap className="h-3 w-3" style={{ color }} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionHead({ index, cat, count }: { index: number; cat: Category; count: number }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-4">
        <span className="mt-1.5 font-mono text-[11px] tracking-[0.2em]" style={{ color: cat.color }}>[{String(index + 1).padStart(2, '0')}]</span>
        <div>
          <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.5rem)] font-black tracking-tight text-white">{cat.label.toUpperCase()}</h2>
          <p className="mt-1 max-w-md font-mono text-[10px] leading-relaxed tracking-[0.05em] text-white/40">{cat.blurb}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pb-1">
        <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
        <span className="rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.2em]" style={{ borderColor: `${cat.color}44`, color: cat.color }}>{count} ASSETS</span>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8">
      <Marquee items={['SQUASH', 'SHAKE', 'FLASH', 'BLOOM', 'REVEAL', 'PUNCH', 'CASCADE', 'WARP', 'TILT', 'BURST']} color="#fb7185" />
      <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-5 px-6 py-16 text-center">
        <div className="font-display leading-tight" style={{ fontSize: 'clamp(1.8rem,5vw,3.6rem)' }}>
          <span className="font-black text-white">NOW GO </span><span className="font-black text-amber-400">JUICE</span><span className="font-black text-stroke"> SOMETHING.</span>
        </div>
        <p className="max-w-md font-mono text-[10px] leading-relaxed tracking-[0.1em] text-white/40">
          MOTION/99 VAULT — assembled from the course archive (40%) plus new expansion engineering (60%).
          A brick kit for award-winning mobile games.
        </p>
        <div className="font-mono text-[9px] tracking-[0.35em] text-white/25">99LVL MOTION DEPT · 2026 · 60FPS OR NOTHING</div>
      </div>
    </footer>
  );
}
