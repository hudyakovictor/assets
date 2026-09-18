import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Gem, Flame } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { useCycle, RI } from '../lib/core';

/* ---------------- Kinetic Headline ---------------- */
function KineticHeadline() {
  const k = useCycle(2600);
  const word = 'GET READY';
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div key={k} className="flex" animate={{ opacity: [1, 1, 0], y: [0, 0, -10] }} transition={{ duration: 2.6, times: [0, 0.82, 1] }}>
        {word.split('').map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1">
            <motion.span
              initial={{ y: '110%', rotate: 6 }}
              animate={{ y: '0%', rotate: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22, delay: i * 0.05 }}
              className="inline-block font-display text-[24px] font-black tracking-wide text-white"
            >{ch === ' ' ? '\u00A0' : ch}</motion.span>
          </span>
        ))}
      </motion.div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-pink-100/50">MASKED STAGGER 45ms/CHAR</div>
    </div>
  );
}

/* ---------------- Glitch Type ---------------- */
function GlitchType() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative select-none font-display text-[28px] font-black tracking-widest text-white">
        <span className="tx-gbase relative z-10">VICTORY</span>
        <span className="tx-ga absolute inset-0 text-rose-500" aria-hidden>VICTORY</span>
        <span className="tx-gb absolute inset-0 text-cyan-400" aria-hidden>VICTORY</span>
      </div>
      <div className="tx-scan pointer-events-none absolute inset-0" />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-pink-100/50">CHANNEL SPLIT ±5px · 12Hz</div>
    </div>
  );
}

/* ---------------- Typewriter ---------------- */
const LINES = ['> LINK ESTABLISHED :: SECTOR 07', '> PAYLOAD DEPLOYED :: 100%', '> EXTRACT NOW :: 00:59'];
function Typewriter() {
  const [txt, setTxt] = useState('');
  const [li, setLi] = useState(0);
  useEffect(() => {
    const line = LINES[li % LINES.length];
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTxt(line.slice(0, i));
      if (i >= line.length) {
        clearInterval(t);
        setTimeout(() => { setTxt(''); setLi((l) => l + 1); }, 1400);
      }
    }, 42);
    return () => clearInterval(t);
  }, [li]);
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="rounded-lg border border-emerald-400/25 bg-black/60 px-4 py-3 font-mono text-[11px] text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,.12)]">
        {txt}<span className="caret ml-0.5 inline-block h-[12px] w-[7px] translate-y-[2px] bg-emerald-300" />
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">42ms/CHAR · BLOCK CARET</div>
    </div>
  );
}

/* ---------------- Wave Float ---------------- */
function WaveFloat() {
  const word = 'JACKPOT';
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="tx-wave flex">
        {word.split('').map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.09}s` }} className={`font-display text-[26px] font-black ${i % 2 ? 'text-pink-400' : 'text-amber-300'}`}>{ch}</span>
        ))}
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">SINE BOB · 90ms PHASE/CHAR</div>
    </div>
  );
}

/* ---------------- Score Roll ---------------- */
function ScoreRoll() {
  const k = useCycle(3000);
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    const target = RI(8000, 98000);
    let raf = 0;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      setDisp(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [k]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden">
      <div className="font-mono text-[9px] tracking-[0.35em] text-white/40">FINAL SCORE</div>
      <div className="font-mono text-[26px] font-bold tabular-nums text-white [text-shadow:0_0_18px_rgba(244,114,182,.35)]">{disp.toLocaleString('en-US')}</div>
      <motion.div key={k} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5, type: 'spring', stiffness: 380, damping: 14 }} className="rounded-full border border-pink-400/40 bg-pink-400/10 px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.2em] text-pink-300">+BONUS ×4</motion.div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">EASE-OUT⁴ COUNT · 1.4s</div>
    </div>
  );
}

/* ---------------- News Ticker ---------------- */
const ITEMS = [
  { icon: Star, t: 'DAILY REWARDS LIVE' },
  { icon: Zap, t: 'DOUBLE XP WEEKEND' },
  { icon: Gem, t: 'LIMITED SKIN DROP' },
  { icon: Flame, t: 'CLAN WARS OPEN' },
];
function Ticker() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden">
      {[0, 1].map((r) => (
        <div key={r} className="mq-wrap border-y border-white/8 bg-white/[0.02] py-2">
          <div className="mq-track" style={{ ['--mqd' as string]: '16s', animationDirection: r ? 'reverse' : 'normal' }}>
            {row.map((it, i) => (
              <div key={i} className="mr-8 flex shrink-0 items-center gap-2 font-mono text-[10px] font-bold tracking-[0.25em] text-pink-200/70">
                <it.icon className="h-3 w-3 text-pink-400" />{it.t}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const css = `
.tx-ga{animation:txGa 1.8s steps(2) infinite;clip-path:inset(18% 0 42% 0)}
@keyframes txGa{0%,88%{transform:translate(-5px,0);opacity:.85}10%,80%{transform:translate(0,0);opacity:0}90%{transform:translate(-5px,1px);opacity:.85}100%{transform:translate(-5px,0);opacity:.85}}
.tx-gb{animation:txGb 1.8s steps(2) infinite;clip-path:inset(52% 0 8% 0)}
@keyframes txGb{0%,88%{transform:translate(5px,0);opacity:.85}10%,80%{transform:translate(0,0);opacity:0}90%{transform:translate(5px,-1px);opacity:.85}100%{transform:translate(5px,0);opacity:.85}}
.tx-gbase{animation:txGf 3.6s steps(1) infinite}
@keyframes txGf{0%,94%{opacity:1}95%{opacity:.4}96%{opacity:1}97%{opacity:.6}98%,100%{opacity:1}}
.tx-scan{background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.045) 0 1px,transparent 1px 3px)}
.tx-wave span{display:inline-block;animation:txWave 1.35s ease-in-out infinite}
@keyframes txWave{0%,100%{transform:translateY(4px)}50%{transform:translateY(-7px)}}
`;

function Style() { return <style>{css}</style>; }

export const assets: AssetDef[] = [
  { id: 'kinetic-headline', name: 'Kinetic Headline', cat: 'text', origin: 'ARCHIVE', trigger: 'AUTO', duration: '2.6s loop', easing: 'spring(280,22)', tags: ['stagger', 'mask', 'intro'], desc: 'Masked per-letter cascade with 6° rotational settle. VS screens, round intros, boss name cards.', Component: () => (<><Style /><KineticHeadline /></>) },
  { id: 'glitch-type', name: 'Glitch Type', cat: 'text', origin: 'ARCHIVE', trigger: 'AUTO', duration: '1.8s loop', easing: 'steps(2)', tags: ['rgb', 'cyber', 'scanline'], desc: 'Channel-split victory type with clip-slice jitter, base flicker and scanline film.', Component: () => (<><Style /><GlitchType /></>) },
  { id: 'typewriter', name: 'Terminal Typewriter', cat: 'text', origin: 'EXPANSION', trigger: 'AUTO', duration: '42ms/char', easing: 'linear', tags: ['terminal', 'story', 'caret'], desc: 'Terminal mission-feed typing with block caret and auto-advancing log lines.', Component: () => (<><Style /><Typewriter /></>) },
  { id: 'wave-float', name: 'Wave Float', cat: 'text', origin: 'EXPANSION', trigger: 'AUTO', duration: '1.35s loop', easing: 'sine 90ms/char', tags: ['sine', 'bob', 'jackpot'], desc: 'Sine-wave letter bobbing phased 90ms per character. Jackpots, sales, candy worlds.', Component: () => (<><Style /><WaveFloat /></>) },
  { id: 'score-roll', name: 'Score Roll', cat: 'text', origin: 'ARCHIVE', trigger: 'AUTO', duration: '1.4s', easing: 'ease-out⁴', tags: ['tally', 'results', 'count-up'], desc: 'Result-screen score roll with quartic ease-out and a spring-loaded bonus chip.', Component: () => (<><Style /><ScoreRoll /></>) },
  { id: 'news-ticker', name: 'Live-Ops Ticker', cat: 'text', origin: 'ARCHIVE', trigger: 'AUTO', duration: '16s loop', easing: 'linear', tags: ['marquee', 'live-ops', 'banner'], desc: 'Dual counter-scrolling marquee for live-ops events with icon separators.', Component: () => (<><Style /><Ticker /></>) },
];
