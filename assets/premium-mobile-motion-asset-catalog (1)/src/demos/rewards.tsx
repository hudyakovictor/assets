import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Coins, Crown, FlaskConical, Star, Trophy, Flame, Heart, Zap, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { useCycle, RI } from '../lib/core';

/* ---------------- Rarity Reveal ---------------- */
const TIERS = [
  { n: 'COMMON', c: '#9aa3b2', w: 55 },
  { n: 'RARE', c: '#60a5fa', w: 27 },
  { n: 'EPIC', c: '#c084fc', w: 13 },
  { n: 'LEGENDARY', c: '#fbbf24', w: 5 },
];
function rollTier() {
  const r = Math.random() * 100;
  let acc = 0;
  for (let i = 0; i < TIERS.length; i++) { acc += TIERS[i].w; if (r < acc) return i; }
  return 0;
}
function RarityReveal() {
  const [roll, setRoll] = useState(3);
  const [k, setK] = useState(0);
  const T = TIERS[roll];
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={() => { setRoll(rollTier()); setK((x) => x + 1); }}>
      {roll >= 2 && (
        <div key={`ray${k}`} className="rw-rays spin-slow absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2" style={{ background: `repeating-conic-gradient(from 0deg, ${T.c}22 0deg 8deg, transparent 8deg 24deg)` }} />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div key={k} initial={{ rotateY: 95, scale: 0.9 }} animate={{ rotateY: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          className="relative flex h-32 w-24 flex-col items-center justify-center gap-2 rounded-xl border bg-[#14141f]"
          style={{ borderColor: T.c, boxShadow: `0 0 26px ${T.c}59, inset 0 0 18px ${T.c}26` }}>
          <Gem className="h-9 w-9" style={{ color: T.c }} />
          <div className="font-mono text-[9px] font-bold tracking-[0.25em]" style={{ color: T.c }}>{T.n}</div>
        </motion.div>
        {roll >= 2 && (
          <motion.span key={`ring${k}`} className="absolute h-36 w-36 rounded-full border-2" style={{ borderColor: T.c }} initial={{ scale: 0.2, opacity: 1 }} animate={{ scale: 1.7, opacity: 0 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }} />
        )}
      </div>
      <div className="absolute bottom-2.5 left-3 flex gap-2">
        {TIERS.map((t) => (<span key={t.n} className="flex items-center gap-1 font-mono text-[8px] tracking-[0.15em] text-white/45"><span className="h-1.5 w-1.5 rounded-full" style={{ background: t.c }} />{t.w}%</span>))}
      </div>
    </div>
  );
}

/* ---------------- Chest Open ---------------- */
const LOOT: { icon: LucideIcon; c: string }[] = [
  { icon: Coins, c: '#fbbf24' }, { icon: Gem, c: '#22d3ee' }, { icon: FlaskConical, c: '#f472b6' }, { icon: Crown, c: '#fde68a' },
];
function ChestOpen() {
  const [open, setOpen] = useState(false);
  const [k, setK] = useState(0);
  const tap = () => {
    if (open) { setOpen(false); return; }
    setK((x) => x + 1);
    setTimeout(() => setOpen(true), 520);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={tap}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="absolute bottom-[26%] h-8 w-28 rounded-full" animate={{ opacity: open ? 0.9 : 0.25, scale: open ? 1.15 : 0.8 }} style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,.5), transparent 70%)' }} />
        <div key={k} className={`relative ${k > 0 && !open ? 'rw-shake' : ''}`}>
          <AnimatePresence>
            {open && LOOT.map((L, i) => (
              <motion.div key={i} className="absolute left-1/2 top-0 -ml-3"
                initial={{ x: 0, y: -6, scale: 0, opacity: 0 }}
                animate={{ x: (i - 1.5) * 36, y: -78 + Math.abs(i - 1.5) * 20, scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 17, delay: 0.12 + i * 0.08 }}>
                <L.icon className="h-6 w-6" style={{ color: L.c }} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="relative h-16 w-24 rounded-lg border-b-4 border-[#5f3d16] bg-[#8b5a2b]">
            <motion.div className="absolute -top-5 left-0 right-0 h-6 rounded-t-lg bg-[#a1722f]" style={{ transformOrigin: '50% 100%' }} animate={{ rotateX: open ? -105 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: open ? 0.05 : 0 }} />
            <div className="absolute left-1/2 top-2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-amber-200/70 bg-amber-400/80" />
          </div>
        </div>
      </div>
      <div className={`absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] ${open ? 'text-amber-300' : 'text-white/50'}`}>{open ? 'LOOT ×4 ACQUIRED' : 'TAP TO OPEN'}</div>
    </div>
  );
}

/* ---------------- Level Up ---------------- */
function LevelUp() {
  const k = useCycle(3400);
  const word = 'LEVEL UP';
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div key={`ray${k}`} className="rw-raysIn spin-slow absolute left-1/2 top-1/2 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2" style={{ background: 'repeating-conic-gradient(from 0deg, rgba(251,191,36,.10) 0deg 9deg, transparent 9deg 26deg)' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <motion.div key={k} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.08 }}
          className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 border-amber-300 bg-[#1c1503] shadow-[0_0_34px_rgba(251,191,36,.45)]">
          <Star className="h-8 w-8 fill-amber-300 text-amber-300" />
        </motion.div>
        <div className="flex gap-[1px]">
          {word.split('').map((ch, i) => (
            <motion.span key={`${k}-${i}`} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.32 + i * 0.045 }}
              className="font-display text-[16px] font-extrabold tracking-widest text-amber-200">{ch === ' ' ? '\u00A0' : ch}</motion.span>
          ))}
        </div>
        <motion.div key={`s${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="font-mono text-[9px] tracking-[0.3em] text-amber-100/50">LVL {7 + k} → {8 + k}</motion.div>
      </div>
    </div>
  );
}

/* ---------------- Toast Stack ---------------- */
const POOL = [
  { t: 'HEADHUNTER', s: '50 eliminations', icon: Trophy },
  { t: 'GOLD RUSH', s: '10,000 coins banked', icon: Coins },
  { t: 'UNSTOPPABLE', s: '8-win streak', icon: Flame },
  { t: 'CARTOGRAPHER', s: 'All regions unlocked', icon: Star },
];
function ToastStack() {
  const [list, setList] = useState<{ id: number; idx: number }[]>([]);
  const add = () => {
    const id = Date.now() + Math.random();
    setList((l) => [...l.slice(-2), { id, idx: RI(0, POOL.length - 1) }]);
    setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 2600);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={add}>
      <div className="absolute right-2 top-2 flex w-[170px] flex-col gap-1.5">
        <AnimatePresence mode="popLayout">
          {list.map((it) => {
            const P = POOL[it.idx];
            return (
              <motion.div key={it.id} layout initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                className="relative overflow-hidden rounded-lg border border-amber-300/30 bg-[#171310] p-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-400/15"><P.icon className="h-3.5 w-3.5 text-amber-300" /></div>
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[9px] font-bold tracking-[0.12em] text-amber-100">{P.t}</div>
                    <div className="truncate text-[9px] text-white/45">{P.s}</div>
                  </div>
                </div>
                <div className="rw-toastbar absolute bottom-0 left-0 h-[2px] bg-amber-300/80" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">TAP TO PUSH QUEUE · MAX 3</div>
    </div>
  );
}

/* ---------------- Summon Gate ---------------- */
function SummonGate() {
  const k = useCycle(3600);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div key={`g1${k}`} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }} className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-300/60 spin-slow" />
          <div className="absolute inset-3 rounded-full border border-teal-300/30 spin-slow" style={{ animationDirection: 'reverse', animationDuration: '13s' }} />
          <div className="absolute inset-[38%] rounded-full bg-teal-300/15" />
        </motion.div>
        <div key={`b${k}`} className="rw-beam absolute left-1/2 top-1/2 h-40 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-200/50 blur-[6px]" />
        <motion.div key={`c${k}`} initial={{ y: -84, scale: 0.35, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.6 }}
          className="absolute flex h-[86px] w-16 flex-col items-center justify-center gap-1.5 rounded-lg border border-cyan-300/60 bg-[#0e1a1c] shadow-[0_0_26px_rgba(34,211,238,.5)]">
          <Gem className="h-7 w-7 text-cyan-300" />
          <div className="font-mono text-[8px] font-bold tracking-[0.2em] text-cyan-200">SSR</div>
        </motion.div>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">RING CHARGE → BEAM → DROP</div>
    </div>
  );
}

/* ---------------- Streak Flame ---------------- */
function StreakFlame() {
  const [days, setDays] = useState(4);
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={() => setDays((d) => (d % 7) + 1)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="rw-wobble"><Flame className="h-10 w-10 fill-amber-500/40 text-amber-400" /></div>
        <motion.div key={days} initial={{ scale: 1.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 15 }} className="font-display text-[26px] font-extrabold text-amber-200">{days}</motion.div>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div key={`${days}-${i}`} initial={i === days ? { scale: 1.8 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              className={`h-1.5 w-6 rounded-full ${i <= days ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,.7)]' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">DAY STREAK · TAP ++</div>
    </div>
  );
}

/* ---------------- Star Rating ---------------- */
function StarRating() {
  const k = useCycle(3000);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="relative flex gap-2 overflow-hidden px-6 py-2">
          {[0, 1, 2].map((i) => (
            <motion.span key={`${k}-${i}`} initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 12, delay: 0.15 + i * 0.22 }}>
              <Star className={`h-9 w-9 ${i === 2 ? 'fill-amber-200 text-amber-200' : 'fill-amber-400 text-amber-400'} drop-shadow-[0_0_10px_rgba(251,191,36,.6)]`} />
            </motion.span>
          ))}
          <div key={`sh${k}`} className="rw-shine pointer-events-none absolute inset-y-0 w-10 bg-white/35" style={{ transform: 'skewX(-20deg)' }} />
        </div>
        <motion.div key={`l${k}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-mono text-[9px] tracking-[0.3em] text-white/50">STAGE CLEAR — RANK S</motion.div>
      </div>
    </div>
  );
}

/* ---------------- Prize Wheel ---------------- */
const SEGS: { icon: LucideIcon; c: string; n: string }[] = [
  { icon: Coins, c: '#fbbf24', n: 'COINS' }, { icon: Gem, c: '#22d3ee', n: 'GEMS' }, { icon: Heart, c: '#fb7185', n: 'LIFE' }, { icon: Zap, c: '#a78bfa', n: 'ENERGY' },
  { icon: FlaskConical, c: '#4ade80', n: 'POTION' }, { icon: Shield, c: '#60a5fa', n: 'SHIELD' }, { icon: Crown, c: '#fde68a', n: 'CROWN' }, { icon: Star, c: '#f472b6', n: 'STAR' },
];
function PrizeWheel() {
  const [rot, setRot] = useState(0);
  const [res, setRes] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setRes(null);
    const seg = RI(0, 7);
    setRot((r) => {
      const want = (360 - seg * 45 - 22.5 + 360) % 360;
      const cur = ((r % 360) + 360) % 360;
      return r + 1440 + ((want - cur + 360) % 360);
    });
    setTimeout(() => { setRes(SEGS[seg].n); setSpinning(false); }, 3100);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={spin}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -top-1 left-1/2 z-10 h-3.5 w-4 -translate-x-1/2 bg-amber-300" style={{ clipPath: 'polygon(50% 100%,0 0,100% 0)' }} />
          <motion.div className="relative h-40 w-40 rounded-full border-4 border-[#2b2542] shadow-[0_0_30px_rgba(0,0,0,.5)]" animate={{ rotate: rot }} transition={{ duration: 3, ease: [0.12, 0.8, 0.14, 1] }}
            style={{ background: `conic-gradient(${SEGS.map((s, i) => `${s.c}${i % 2 ? '2e' : '47'} ${i * 45}deg ${(i + 1) * 45}deg`).join(',')})` }}>
            {SEGS.map((s, i) => (
              <div key={i} className="absolute left-1/2 top-1/2 -ml-2.5 -mt-2.5 h-5 w-5" style={{ transform: `rotate(${i * 45 + 22.5}deg) translateY(-56px)` }}>
                <s.icon className="h-5 w-5" style={{ color: s.c }} />
              </div>
            ))}
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20 bg-[#14121f]" />
          </motion.div>
        </div>
      </div>
      <div className={`absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] ${res ? 'text-amber-300' : 'text-white/50'}`}>{res ? `WON: ${res}` : spinning ? 'SPINNING…' : 'TAP TO SPIN'}</div>
    </div>
  );
}

const css = `
.rw-shake{animation:rwShake .5s ease-in-out}
@keyframes rwShake{0%,100%{transform:translateX(0) rotate(0)}20%{transform:translateX(-4px) rotate(-2deg)}40%{transform:translateX(4px) rotate(2deg)}60%{transform:translateX(-3px) rotate(-1.4deg)}80%{transform:translateX(3px) rotate(1.4deg)}}
.rw-rays{opacity:0;animation:rwRays .9s ease-out .1s forwards}
@keyframes rwRays{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}30%{opacity:1}100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}}
.rw-raysIn{opacity:0;animation:rwRaysIn 3.4s ease-out forwards}
@keyframes rwRaysIn{0%{opacity:0}12%{opacity:1}70%{opacity:.9}100%{opacity:.4}}
.rw-toastbar{animation:rwToast 2.6s linear forwards}
@keyframes rwToast{0%{width:100%}100%{width:0}}
.rw-beam{animation:rwBeam 3.6s ease-out forwards;transform-origin:center}
@keyframes rwBeam{0%,42%{opacity:0;transform:translate(-50%,-50%) scaleY(0)}55%{opacity:1;transform:translate(-50%,-50%) scaleY(1)}75%{opacity:.8}100%{opacity:.15;transform:translate(-50%,-50%) scaleY(1)}}
.rw-wobble{animation:rwWob 1.6s ease-in-out infinite}
@keyframes rwWob{0%,100%{transform:rotate(-4deg) translateY(0)}50%{transform:rotate(4deg) translateY(-3px)}}
.rw-shine{animation:rwShine .8s ease-in-out .85s both}
@keyframes rwShine{0%{left:-25%}100%{left:125%}}
`;

function Style() { return <style>{css}</style>; }

export const assets: AssetDef[] = [
  { id: 'rarity-reveal', name: 'Rarity Reveal', cat: 'rewards', origin: 'EXPANSION', trigger: 'TAP', duration: 'spring flip', easing: 'spring(240,18)', tags: ['gacha', 'tiers', 'odds'], desc: 'Weighted 55/27/13/5 rarity roll. Epic+ gets god-rays and a shockwave ring; legendary gets the works.', Component: () => (<><Style /><RarityReveal /></>) },
  { id: 'chest-open', name: 'Chest Open Sequence', cat: 'rewards', origin: 'ARCHIVE', trigger: 'TAP', duration: '0.5s + loot arc', easing: 'spring(300,17)', tags: ['loot', 'anticipation', 'cascade'], desc: 'Three-act micro-drama: anticipation shake → lid spring-pop → four-item loot arc cascade.', Component: () => (<><Style /><ChestOpen /></>) },
  { id: 'level-up', name: 'Level Up Burst', cat: 'rewards', origin: 'ARCHIVE', trigger: 'AUTO', duration: '3.4s loop', easing: 'spring(300,14)', tags: ['rank', 'rays', 'badge slam'], desc: 'Rotating god-rays, badge slam, per-letter cascade and an incrementing level readout.', Component: () => (<><Style /><LevelUp /></>) },
  { id: 'toast-stack', name: 'Achievement Toasts', cat: 'rewards', origin: 'EXPANSION', trigger: 'TAP', duration: '2.6s ttl', easing: 'spring(380,26)', tags: ['queue', 'stack', 'shimmer'], desc: 'Spring-stacked toast queue with layout reflow and a draining shimmer underline per card.', Component: () => (<><Style /><ToastStack /></>) },
  { id: 'summon-gate', name: 'Summon Gate', cat: 'rewards', origin: 'EXPANSION', trigger: 'AUTO', duration: '3.6s loop', easing: 'beam → drop', tags: ['portal', 'ssr', 'reveal'], desc: 'Dashed dual-ring gate charges, light beam spikes, and the SSR card drops through the portal.', Component: () => (<><Style /><SummonGate /></>) },
  { id: 'streak-flame', name: 'Streak Flame', cat: 'rewards', origin: 'EXPANSION', trigger: 'TAP', duration: 'loop wobble', easing: 'spring(420,15)', tags: ['daily', 'retention', 'chips'], desc: 'Day-streak counter with a wobbling flame, popping numeral and seven fill chips.', Component: () => (<><Style /><StreakFlame /></>) },
  { id: 'star-rating', name: 'Star Rating Pop', cat: 'rewards', origin: 'ARCHIVE', trigger: 'AUTO', duration: '3s loop', easing: 'spring(320,12)', tags: ['rank', 'results', 'shine'], desc: 'Triple star pop with rotational anticipation and a skewed shine sweep on completion.', Component: () => (<><Style /><StarRating /></>) },
  { id: 'prize-wheel', name: 'Prize Wheel', cat: 'rewards', origin: 'EXPANSION', trigger: 'TAP', duration: '3.0s', easing: 'cubic(.12,.8,.14,1)', tags: ['spin', 'gacha', 'settle'], desc: 'Eight-segment prize wheel: four full rotations, long ease-out settle, result readout.', Component: () => (<><Style /><PrizeWheel /></>) },
];
