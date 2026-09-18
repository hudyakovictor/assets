import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Zap, Heart, Hexagon } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { useCycle, RI } from '../lib/core';

/* ---------------- Ghost Damage Bar ---------------- */
function GhostBar() {
  const [hp, setHp] = useState(100);
  const [hits, setHits] = useState<{ id: number; v: number }[]>([]);
  const hit = () => {
    const v = RI(11, 22);
    setHp((h) => {
      const n = Math.max(0, h - v);
      if (n <= 0) setTimeout(() => setHp(100), 1400);
      return n;
    });
    const id = Date.now() + Math.random();
    setHits((s) => [...s.slice(-3), { id, v }]);
    setTimeout(() => setHits((s) => s.filter((x) => x.id !== id)), 900);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={hit}>
      <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2">
        <div className="mb-1.5 flex justify-between font-mono text-[9px] tracking-[0.2em] text-white/50"><span>BOSS — WARDEN</span><span>{hp}%</span></div>
        <div className="relative h-4 overflow-hidden rounded-md bg-white/8">
          <motion.div className="absolute inset-y-0 left-0 rounded-md bg-white/50" animate={{ width: `${hp}%` }} transition={{ delay: 0.45, duration: 0.65, ease: 'easeOut' }} />
          <motion.div className="relative h-full rounded-md bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,.6)]" animate={{ width: `${hp}%` }} transition={{ type: 'spring', stiffness: 320, damping: 26 }} />
        </div>
      </div>
      {hits.map((h) => (
        <motion.span key={h.id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -26 }} transition={{ duration: 0.8 }} className="absolute left-[70%] top-[36%] font-mono text-[10px] font-bold text-rose-300">-{h.v}</motion.span>
      ))}
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">GHOST DELAY 0.45s · TAP TO HIT</div>
    </div>
  );
}

/* ---------------- XP Shimmer ---------------- */
function XPShimmer() {
  const [lv, setLv] = useState(7);
  const [xp, setXp] = useState(20);
  useEffect(() => {
    const t = setInterval(() => {
      setXp((x) => {
        const n = x + RI(16, 26);
        if (n >= 100) { setLv((l) => l + 1); return n - 100; }
        return n;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <Hexagon className="absolute h-9 w-9 text-amber-400" strokeWidth={1.4} />
            <motion.span key={lv} initial={{ scale: 1.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="font-display text-[11px] font-extrabold text-amber-200">{lv}</motion.span>
          </div>
          <div className="font-mono text-[9px] tracking-[0.25em] text-amber-100/60">SEASON XP</div>
        </div>
        <div className="h-3.5 overflow-hidden rounded-md bg-white/8">
          <motion.div className="relative h-full overflow-hidden rounded-md bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,.55)]" animate={{ width: `${xp}%` }} transition={{ type: 'spring', stiffness: 180, damping: 22 }}>
            <div className="hd-sheen" />
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">SHEEN SWEEP 1.4s · LEVEL BREAK POP</div>
    </div>
  );
}

/* ---------------- Cooldown Radial ---------------- */
function CooldownRadial() {
  const [busy, setBusy] = useState(false);
  const [k, setK] = useState(0);
  const C = 2 * Math.PI * 28;
  const fire = () => {
    if (busy) return;
    setBusy(true);
    setK((x) => x + 1);
    setTimeout(() => setBusy(false), 1500);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={fire}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-16 w-16">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="3" />
            {busy && (
              <motion.circle key={k} cx="32" cy="32" r="28" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: C }} transition={{ duration: 1.5, ease: 'linear' }} />
            )}
          </svg>
          <div className={`absolute inset-[7px] flex items-center justify-center rounded-xl border transition-colors duration-200 ${busy ? 'border-white/10 bg-white/5' : 'border-cyan-300/50 bg-cyan-400/15 shadow-[0_0_18px_rgba(34,211,238,.35)]'}`}>
            <Zap className={`h-6 w-6 transition-colors duration-200 ${busy ? 'text-white/30' : 'text-cyan-200'}`} />
          </div>
          {!busy && k > 0 && (
            <motion.span key={`r${k}`} className="absolute inset-[7px] rounded-xl border-2 border-cyan-300" initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} />
          )}
        </div>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">CD 1.5s · READY PING</div>
    </div>
  );
}

/* ---------------- Damage Numbers ---------------- */
function DamageNumbers() {
  const [items, setItems] = useState<{ id: number; x: number; y: number; jx: number; val: number; crit: boolean }[]>([]);
  const spawn = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const crit = Math.random() < 0.22;
    const id = Date.now() + Math.random();
    setItems((s) => [...s.slice(-9), { id, x: e.clientX - r.left, y: e.clientY - r.top, jx: RI(-16, 16), val: crit ? RI(120, 240) : RI(18, 60), crit }]);
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 850);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={spawn}>
      <div className="absolute left-1/2 top-[62%] h-10 w-10 -translate-x-1/2 rounded-lg border border-white/15 bg-white/5">
        <div className="h-full w-full hd-dummy" />
      </div>
      {items.map((n) => (
        <motion.span
          key={n.id}
          initial={{ opacity: 1, y: 0, x: 0, scale: n.crit ? 1.5 : 1 }}
          animate={{ opacity: 0, y: -56, x: n.jx, scale: n.crit ? 1.1 : 0.92 }}
          transition={{ duration: 0.82, ease: 'easeOut' }}
          className={`pointer-events-none absolute ${n.crit ? 'font-display text-[19px] font-extrabold text-amber-300 [text-shadow:0_0_14px_rgba(251,191,36,.7)]' : 'font-mono text-[12px] font-bold text-white/85'}`}
          style={{ left: n.x, top: n.y }}
        >{n.crit ? `${n.val}!` : n.val}</motion.span>
      ))}
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">CRIT 22% · ×6 SCALE TIER</div>
    </div>
  );
}

/* ---------------- Shield Break ---------------- */
function ShieldBreak() {
  const [segs, setSegs] = useState(5);
  const [fxk, setFxk] = useState(0);
  const hit = () => {
    if (segs === 0) return;
    setFxk((f) => f + 1);
    setSegs((s) => {
      const n = s - 1;
      if (n === 0) setTimeout(() => setSegs(5), 1700);
      return n;
    });
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={hit}>
      <div key={fxk} className="absolute inset-0 flex items-center justify-center hd-miniShake">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => {
            const alive = i < segs;
            const justBroke = i === segs && fxk > 0;
            return (
              <div
                key={i}
                className={`h-7 w-7 rounded-[5px] ${justBroke ? 'hd-crack bg-white/30' : alive ? 'rotate-45 bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.6)]' : 'rotate-45 bg-white/12'}`}
              />
            );
          })}
        </div>
      </div>
      {segs === 0 && (
        <motion.div initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 17 }} className="absolute inset-x-0 top-[24%] text-center font-display text-[15px] font-extrabold tracking-widest text-rose-400">SHIELD DOWN</motion.div>
      )}
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">5 SEGMENTS · REFILL 1.7s</div>
    </div>
  );
}

/* ---------------- Low HP Vignette ---------------- */
function LowHP() {
  const [low, setLow] = useState(false);
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={() => setLow((l) => !l)}>
      {low && <div className="hd-vlow" />}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
        <Heart className={`h-9 w-9 ${low ? 'hd-heart fill-rose-500/40 text-rose-400' : 'fill-emerald-500/30 text-emerald-400'}`} />
        <div className={`font-display text-[24px] font-extrabold transition-colors ${low ? 'text-rose-300' : 'text-emerald-300'}`}>{low ? '12' : '100'}</div>
        <div className={`font-mono text-[9px] tracking-[0.35em] ${low ? 'text-rose-300/80' : 'text-emerald-200/50'}`}>{low ? 'CRITICAL' : 'STABLE'}</div>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">HEARTBEAT 60BPM · TAP TO SIMULATE</div>
    </div>
  );
}

/* ---------------- Coin Odometer ---------------- */
function CoinOdometer() {
  const [val, setVal] = useState(31250);
  const [gain, setGain] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      const g = RI(37, 410);
      setVal((v) => v + g);
      setGain(g);
    }, 1500);
    return () => clearInterval(t);
  }, []);
  const digits = String(val).padStart(8, '0').split('').map(Number);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        <Coins className="h-5 w-5 text-amber-300" />
        <div className="flex font-mono text-[15px] font-bold text-amber-100">
          {digits.map((d, i) => (
            <div key={i} className="relative h-[1.25em] w-[0.72em] overflow-hidden">
              <motion.div className="absolute left-0 top-0" animate={{ y: `-${d * 1.25}em` }} transition={{ type: 'spring', stiffness: 170, damping: 20 }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (<div key={n} className="h-[1.25em] leading-[1.25em] text-center">{n}</div>))}
              </motion.div>
            </div>
          ))}
        </div>
        <motion.span key={val} initial={{ opacity: 1, y: 2 }} animate={{ opacity: 0, y: -14 }} transition={{ duration: 0.9 }} className="font-mono text-[10px] font-bold text-amber-300/80">+{gain}</motion.span>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">SPRING SETTLE PER DIGIT · 1.5s TICK</div>
    </div>
  );
}

/* ---------------- Radar Ping ---------------- */
const PINGS: [number, number][] = [[30, 30], [65, 45], [40, 66], [72, 26], [25, 54]];
function RadarPing() {
  const k = useCycle(2100);
  const [tx, ty] = PINGS[k % PINGS.length];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[138px] w-[138px] rounded-full border border-white/15">
          <div className="absolute inset-[24%] rounded-full border border-white/10" />
          <div className="absolute inset-[42%] rounded-full border border-white/10" />
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 spin-slow" style={{ animationDuration: '2.4s', background: 'conic-gradient(from 90deg, rgba(74,222,128,.45), transparent 26%)' }} />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={`${k}-${i}`} className="hd-ping" style={{ left: `${tx}%`, top: `${ty}%`, animationDelay: `${i * 0.16}s` }} />
          ))}
          <div key={`b${k}`} className="hd-blip" style={{ left: `${tx}%`, top: `${ty}%` }} />
        </div>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">SWEEP 2.4s · PING 2.1s</div>
    </div>
  );
}

const css = `
.hd-sheen{position:absolute;top:0;bottom:0;width:36%;background:rgba(255,255,255,.32);transform:skewX(-20deg);animation:hdSheen 1.4s ease-in-out infinite}
@keyframes hdSheen{0%{left:-42%}60%,100%{left:125%}}
.hd-dummy{border-radius:8px;background:rgba(255,255,255,.06)}
.hd-crack{animation:hdCrack .5s ease-out both}
@keyframes hdCrack{0%{filter:brightness(3.5);transform:rotate(45deg) scale(1.5)}100%{filter:brightness(1);transform:rotate(45deg) scale(1)}}
.hd-miniShake{animation:hdMini .25s ease-out}
@keyframes hdMini{0%{transform:translateX(0)}30%{transform:translateX(-4px)}60%{transform:translateX(3px)}100%{transform:none}}
.hd-vlow{position:absolute;inset:0;box-shadow:inset 0 0 64px 24px rgba(244,63,94,.55);animation:hdVlow 1s ease-in-out infinite;pointer-events:none}
@keyframes hdVlow{0%,100%{opacity:.3}50%{opacity:1}}
.hd-heart{animation:hdHeart 1s ease-in-out infinite}
@keyframes hdHeart{0%,100%{transform:scale(1)}12%{transform:scale(1.3)}24%{transform:scale(1)}36%{transform:scale(1.18)}48%{transform:scale(1)}}
.hd-ping{position:absolute;height:20px;width:20px;margin:-10px 0 0 -10px;border-radius:50%;border:2px solid rgba(74,222,128,.8);animation:hdPing 1.1s ease-out forwards;pointer-events:none}
@keyframes hdPing{0%{transform:scale(.2);opacity:1}100%{transform:scale(2.6);opacity:0}}
.hd-blip{position:absolute;height:6px;width:6px;margin:-3px 0 0 -3px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80;animation:hdBlip 1.4s ease-out forwards;pointer-events:none}
@keyframes hdBlip{0%{opacity:1}100%{opacity:0}}
`;

function Style() { return <style>{css}</style>; }

export const assets: AssetDef[] = [
  { id: 'hp-ghost-bar', name: 'Ghost Damage Bar', cat: 'hud', origin: 'ARCHIVE', trigger: 'TAP', duration: '0.65s + 0.45 delay', easing: 'spring(320,26)', tags: ['hp', 'delayed drain', 'boss'], desc: 'Red snaps instantly, the white ghost drains after 0.45s. Sekiro-grade damage readability.', Component: () => (<><Style /><GhostBar /></>) },
  { id: 'xp-shimmer', name: 'XP Shimmer Bar', cat: 'hud', origin: 'ARCHIVE', trigger: 'AUTO', duration: '1s ticks', easing: 'spring(180,22)', tags: ['xp', 'sheen', 'level'], desc: 'XP fill with a traveling skew sheen and a level-break hexagon pop when it overflows.', Component: () => (<><Style /><XPShimmer /></>) },
  { id: 'cooldown-radial', name: 'Cooldown Radial', cat: 'hud', origin: 'EXPANSION', trigger: 'TAP', duration: '1.5s', easing: 'linear sweep', tags: ['cooldown', 'ability', 'ring'], desc: 'Radial cooldown consumption with a ready-ping shockwave when the ability recovers.', Component: () => (<><Style /><CooldownRadial /></>) },
  { id: 'damage-numbers', name: 'Damage Numbers', cat: 'hud', origin: 'ARCHIVE', trigger: 'TAP', duration: '0.82s', easing: 'expo.out float', tags: ['crit', 'floaters', 'combat'], desc: 'Damage floaters with 22% crit rolls — crits spawn at 1.5× scale with amber glow.', Component: () => (<><Style /><DamageNumbers /></>) },
  { id: 'shield-break', name: 'Shield Segments', cat: 'hud', origin: 'EXPANSION', trigger: 'TAP', duration: '0.5s / hit', easing: 'crack flash', tags: ['armor', 'segments', 'break'], desc: 'Five-segment diamond shield. Each hit cracks one plate off with a brightness spike.', Component: () => (<><Style /><ShieldBreak /></>) },
  { id: 'lowhp-vignette', name: 'Low-HP Vignette', cat: 'hud', origin: 'EXPANSION', trigger: 'TAP', duration: '1s loop', easing: 'sin pulse', tags: ['warning', 'heartbeat', 'rim'], desc: 'Critical-health heartbeat: red inset vignette breathing at 60bpm with a throbbing heart glyph.', Component: () => (<><Style /><LowHP /></>) },
  { id: 'coin-odometer', name: 'Coin Odometer', cat: 'hud', origin: 'EXPANSION', trigger: 'AUTO', duration: 'spring settle', easing: 'spring(170,20)', tags: ['tally', 'economy', 'digits'], desc: 'Per-digit odometer columns settling on independent springs. Shop balances, raid payouts.', Component: () => (<><Style /><CoinOdometer /></>) },
  { id: 'radar-ping', name: 'Radar Ping', cat: 'hud', origin: 'EXPANSION', trigger: 'AUTO', duration: '2.4s sweep', easing: 'easeOut ring', tags: ['minimap', 'scan', 'blip'], desc: 'Rotating conic sweep with triple expanding pings and decaying target blip.', Component: () => (<><Style /><RadarPing /></>) },
];
