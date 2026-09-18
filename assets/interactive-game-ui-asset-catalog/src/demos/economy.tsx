import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Crown, Gift, Check, Lock, Trophy, Wallet, Zap, RotateCcw, Star, Flame } from 'lucide-react';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ============ AF-19 VAULT CRACKER — loot crate reveal ============ */
const LOOT_POOL = [
  { n: 'VOID BLADE', r: 'L' }, { n: 'HOLO WYRM', r: 'L' }, { n: 'AEGIS CORE', r: 'E' },
  { n: 'STAR CHART', r: 'E' }, { n: 'PHASE BOOTS', r: 'E' }, { n: 'SCRAP KIT', r: 'C' },
  { n: 'FIELD STIM', r: 'C' }, { n: 'OLD COIN', r: 'C' },
];
const RCOL: Record<string, string> = { L: '#FFC24B', E: '#8B7CFF', C: '#5BE7FF' };
const RNAME: Record<string, string> = { L: 'LEGENDARY', E: 'EPIC', C: 'COMMON' };

export function DemoCrate() {
  const [phase, setPhase] = useState<'idle' | 'shake' | 'open'>('idle');
  const [items, setItems] = useState<typeof LOOT_POOL>([]);

  const open = () => {
    if (phase !== 'idle') return;
    setItems([]);
    setPhase('shake');
    setTimeout(() => {
      const pull = Array.from({ length: 3 }, () => {
        const roll = Math.random();
        const rr = roll < 0.14 ? 'L' : roll < 0.5 ? 'E' : 'C';
        const pool = LOOT_POOL.filter((i) => i.r === rr);
        return pool[Math.floor(Math.random() * pool.length)];
      });
      setItems(pull);
      setPhase('open');
    }, 680);
  };

  const legendary = items.some((i) => i.r === 'L');

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* rays */}
      {phase === 'open' && (
        <motion.div initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1.6 }} transition={{ duration: 0.5 }} className="absolute left-1/2 top-[44%] aspect-square w-[340px] -translate-x-1/2 -translate-y-1/2">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} className="size-full" style={{ background: `conic-gradient(from 0deg, transparent 0 10deg, ${legendary ? 'rgba(255,194,75,0.14)' : 'rgba(91,231,255,0.1)'} 10deg 18deg, transparent 18deg 36deg, ${legendary ? 'rgba(255,194,75,0.14)' : 'rgba(91,231,255,0.1)'} 36deg 44deg, transparent 44deg 72deg, ${legendary ? 'rgba(255,194,75,0.14)' : 'rgba(91,231,255,0.1)'} 72deg 82deg, transparent 82deg 120deg, ${legendary ? 'rgba(255,194,75,0.14)' : 'rgba(91,231,255,0.1)'} 120deg 132deg, transparent 132deg 180deg, ${legendary ? 'rgba(255,194,75,0.14)' : 'rgba(91,231,255,0.1)'} 180deg 190deg, transparent 190deg 240deg, ${legendary ? 'rgba(255,194,75,0.14)' : 'rgba(91,231,255,0.1)'} 240deg 250deg, transparent 250deg 300deg, ${legendary ? 'rgba(255,194,75,0.14)' : 'rgba(91,231,255,0.1)'} 300deg 312deg, transparent 312deg 360deg)` }} />
        </motion.div>
      )}
      {/* crate */}
      {phase !== 'open' && (
        <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
          {/* glow floor */}
          <span className="absolute -bottom-5 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-volt/20 blur-md" />
          {/* lid */}
          <motion.div
            animate={phase === 'shake' ? { x: [0, -4, 4, -3, 3, 0], rotate: [0, -2, 2, -1, 0] } : { x: 0, rotate: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 h-5 w-24 rounded-t-lg border border-b-0 border-amb/60 bg-gradient-to-b from-amb/40 to-amb/10"
          >
            <span className="absolute inset-x-0 top-1.5 mx-auto h-px w-16 bg-amb/60" />
          </motion.div>
          {/* body */}
          <motion.div
            animate={phase === 'shake' ? { x: [0, -5, 5, -4, 4, 0], rotate: [0, -1.5, 1.5, 0] } : { x: 0, rotate: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-16 w-24 rounded-b-lg border border-amb/50 bg-gradient-to-b from-[#1a1509] to-[#0d0b06]"
          >
            <span className="absolute left-1/2 top-0 h-full w-px bg-amb/25" />
            <div className="absolute left-1/2 top-1/2 z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md border border-volt/70 bg-black shadow-[0_0_14px_rgba(200,255,49,0.4)]">
              <Lock size={12} className="text-volt" />
            </div>
            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[7px] tracking-[0.3em] text-amb/50">SALVAGE-03</span>
          </motion.div>
        </div>
      )}
      {/* items */}
      {phase === 'open' && (
        <div className="absolute left-1/2 top-[42%] flex -translate-x-1/2 -translate-y-1/2 gap-2.5">
          {items.map((it, i) => (
            <motion.div
              key={it.n + i}
              initial={{ scale: 0, y: 40, rotate: (i - 1) * 14 }}
              animate={{ scale: 1, y: 0, rotate: (i - 1) * 5 }}
              transition={{ type: 'spring', stiffness: 320, damping: 17, delay: 0.08 + i * 0.14 }}
              className="relative h-[104px] w-[76px] overflow-hidden rounded-lg border p-1.5"
              style={{ borderColor: `${RCOL[it.r]}AA`, background: `linear-gradient(160deg, ${RCOL[it.r]}26 0%, #0A0C11 60%)`, boxShadow: `0 14px 34px -10px ${RCOL[it.r]}77` }}
            >
              {/* shine sweep */}
              <motion.span initial={{ x: '-110%' }} animate={{ x: '110%' }} transition={{ delay: 0.3 + i * 0.14, duration: 0.7, ease: 'easeInOut' }} className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="font-mono text-[7px] tracking-[0.18em]" style={{ color: RCOL[it.r] }}>{RNAME[it.r]}</span>
              <div className="mt-3 grid place-items-center">
                {it.r === 'L' ? <Crown size={22} style={{ color: RCOL[it.r] }} /> : it.r === 'E' ? <Star size={20} style={{ color: RCOL[it.r] }} /> : <Gift size={18} style={{ color: RCOL[it.r] }} />}
              </div>
              <div className="absolute inset-x-1.5 bottom-1.5 font-display text-[8px] font-800 leading-tight text-white">{it.n}</div>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {legendary && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-2.5 -translate-x-1/2 rounded-full border border-amb/60 bg-amb/10 px-3 py-1 font-display text-[10px] font-900 tracking-[0.24em] text-amb" style={{ textShadow: '0 0 16px rgba(255,194,75,0.7)' }}>
            LEGENDARY DROP
          </motion.div>
        )}
      </AnimatePresence>
      {/* button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={phase === 'open' ? () => { setPhase('idle'); setItems([]); } : open}
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border px-5 py-2 font-mono text-[9px] tracking-[0.24em] transition-colors ${phase === 'open' ? 'border-white/25 bg-white/5 text-white/70' : 'border-amb/60 bg-amb/10 text-amb hover:bg-amb/20'}`}
      >
        {phase === 'open' ? 'SEAL VAULT' : phase === 'shake' ? 'CRACKING…' : 'CRACK OPEN · 250G'}
      </motion.button>
    </div>
  );
}

/* ============ AF-20 STREAK ROW — daily rewards ============ */
const DAYS = [100, 150, 220, 300, 400, 520, 0];

export function DemoDaily() {
  const [claimed, setClaimed] = useState(2);
  const [stamp, setStamp] = useState(-1);
  const [confetti, setConfetti] = useState<{ id: number; dx: number; dy: number; c: string }[]>([]);

  const claim = () => {
    if (claimed >= 7) return;
    setStamp(claimed);
    const cols = ['#C8FF31', '#FFC24B', '#5BE7FF', '#FF5B6E'];
    const pieces = Array.from({ length: 14 }, (_, i) => ({ id: Date.now() + i, dx: (Math.random() - 0.5) * 90, dy: -20 - Math.random() * 70, c: cols[i % 4] }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 900);
    setTimeout(() => { setClaimed((c) => c + 1); setStamp(-1); }, 420);
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-center p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.22em] text-white/45">LOGIN CIRCUIT</span>
        <motion.span key={claimed} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="flex items-center gap-1 font-mono text-[9px] font-bold text-amb">
          <Flame size={11} className="text-amb" /> {claimed} DAY STREAK
        </motion.span>
      </div>
      <div className="relative flex gap-1">
        {/* confetti */}
        {confetti.map((p) => (
          <motion.span key={p.id} initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }} animate={{ opacity: 0, x: p.dx, y: p.dy, rotate: 260 }} transition={{ duration: 0.85, ease: 'easeOut' }} className="absolute left-1/2 top-1/2 z-20 size-1.5" style={{ background: p.c }} />
        ))}
        {DAYS.map((v, i) => {
          const isClaimed = i < claimed;
          const isToday = i === claimed;
          const mega = i === 6;
          return (
            <div key={i} className={`relative flex flex-1 flex-col items-center gap-1 rounded-lg border py-2 ${isClaimed ? 'border-volt/30 bg-volt/[0.06]' : isToday ? 'border-amb/60 bg-amb/[0.07]' : 'border-line bg-white/[0.02]'}`}>
              {isToday && <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} className="absolute inset-0 rounded-lg border border-amb/50" />}
              <span className="font-mono text-[7px] tracking-[0.12em] text-white/35">D{i + 1}</span>
              {isClaimed || stamp === i ? (
                <motion.span key={stamp === i ? 'st' : 'ok'} initial={stamp === i ? { scale: 2.4, opacity: 0, rotate: -14 } : false} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }} className="grid size-5 place-items-center rounded-full bg-volt">
                  <Check size={11} className="text-black" strokeWidth={3.5} />
                </motion.span>
              ) : mega ? (
                <Crown size={18} className={isToday ? 'text-amb' : 'text-white/25'} />
              ) : (
                <Coins size={16} className={isToday ? 'text-amb' : 'text-white/25'} />
              )}
              <span className={`font-mono text-[8px] font-bold ${isClaimed ? 'text-volt/70' : isToday ? 'text-amb' : 'text-white/30'}`}>{mega ? 'MEGA' : v}</span>
            </div>
          );
        })}
      </div>
      <motion.button whileTap={{ scale: 0.94 }} onClick={claimed >= 7 ? () => setClaimed(0) : claim} className={`mt-2.5 rounded-md border py-2 font-mono text-[9px] tracking-[0.22em] transition-colors ${claimed >= 7 ? 'border-white/25 bg-white/5 text-white/60' : 'border-amb/60 bg-amb/10 text-amb hover:bg-amb/20'}`}>
        {claimed >= 7 ? 'CIRCUIT COMPLETE — RESTART' : `CLAIM DAY ${claimed + 1}`}
      </motion.button>
    </div>
  );
}

/* ============ AF-21 ASCENSION ROAD — battle pass track ============ */
export function DemoPass() {
  const NEED = 140;
  const [xp, setXp] = useState(330);
  const [claimed, setClaimed] = useState<number[]>([]);
  const [pop, setPop] = useState<number | null>(null);
  const tiers = Array.from({ length: 8 }, (_, i) => ({ need: (i + 1) * NEED, big: i === 7 }));
  const maxXp = NEED * 8;

  const earn = () => setXp((x) => clamp(x + 90 + Math.random() * 130, 0, maxXp));
  const claim = (i: number) => {
    if (xp < tiers[i].need || claimed.includes(i)) return;
    setClaimed((c) => [...c, i]);
    setPop(i);
    setTimeout(() => setPop(null), 700);
  };

  return (
    <div className="absolute inset-0 flex flex-col p-3">
      <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em]">
        <span className="text-white/45">SEASON 07 — NEON DRIFT</span>
        <span className="text-vio">{Math.round(xp)} XP</span>
      </div>
      {/* track */}
      <div className="relative mt-4 h-28 flex-1">
        {/* line */}
        <div className="absolute left-[6%] right-[6%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/8">
          <motion.div animate={{ width: `${(clamp(xp / maxXp, 0, 1)) * 100}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-vio to-volt" style={{ boxShadow: '0 0 12px rgba(139,124,255,0.5)' }} />
        </div>
        <div className="relative flex justify-between px-[6%]">
          {tiers.map((t, i) => {
            const unlocked = xp >= t.need;
            const got = claimed.includes(i);
            const up = i % 2 === 0;
            return (
              <div key={i} className="relative flex flex-col items-center" style={{ transform: `translateY(${up ? -8 : 8}px)` }}>
                <span className={`mb-1 font-mono text-[7px] tracking-[0.1em] ${unlocked ? 'text-vio' : 'text-white/25'}`}>T{i + 1}</span>
                <motion.button
                  onClick={() => claim(i)}
                  animate={pop === i ? { scale: [1, 1.5, 1] } : {}}
                  className={`relative grid ${t.big ? 'size-10' : 'size-8'} place-items-center rounded-full border-2 transition-colors ${got ? 'border-mint/60 bg-mint/10' : unlocked ? 'border-vio bg-vio/15 shadow-[0_0_16px_rgba(139,124,255,0.4)]' : 'border-white/12 bg-black/50'}`}
                >
                  {got ? <Check size={12} className="text-mint" /> : unlocked ? (t.big ? <Crown size={15} className="text-vio" /> : <Gift size={13} className="text-vio" />) : <Lock size={11} className="text-white/25" />}
                  {unlocked && !got && <span className="absolute inset-0 animate-ping rounded-full border border-vio/50" style={{ animationDuration: '1.6s' }} />}
                </motion.button>
                {unlocked && !got && <span className="absolute -bottom-4 whitespace-nowrap font-mono text-[7px] font-bold tracking-[0.1em] text-vio">CLAIM</span>}
              </div>
            );
          })}
        </div>
      </div>
      <motion.button whileTap={{ scale: 0.94 }} onClick={earn} className="rounded-md border border-vio/50 bg-vio/10 py-2 font-mono text-[9px] tracking-[0.22em] text-vio transition-colors hover:bg-vio/20">
        COMPLETE MATCH · +XP
      </motion.button>
    </div>
  );
}

/* ============ AF-22 LAUREL POP — achievement toast queue ============ */
const ACH = ['FIRST BLOOD II', 'VOID WALKER', 'SHARPSHOOTER', 'ECHO HUNTER', 'GRAVE DIGGER', 'STARFALL'];

function ToastCard({ title, id, onDone }: { title: string; id: number; onDone: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 3200);
    return () => clearTimeout(t);
  }, [id, onDone]);
  return (
    <motion.div layout initial={{ x: 130, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 130, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="pointer-events-auto relative flex w-[210px] items-center gap-2 overflow-hidden rounded-lg border border-amb/40 bg-[#12100a]/95 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
      <motion.span initial={{ x: '-120%' }} animate={{ x: '240%' }} transition={{ delay: 0.3, duration: 0.9, ease: 'easeInOut' }} className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amb/20 to-transparent" />
      <div className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-md border border-amb/50 bg-amb/10">
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} className="absolute inset-0" style={{ background: 'conic-gradient(from 0deg, transparent 0 40deg, rgba(255,194,75,0.3) 40deg 70deg, transparent 70deg 130deg, rgba(255,194,75,0.3) 130deg 160deg, transparent 160deg)' }} />
        <Trophy size={14} className="relative text-amb" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[7px] tracking-[0.24em] text-amb/80">ACHIEVEMENT UNLOCKED</div>
        <div className="truncate font-display text-[10px] font-800 text-white">{title}</div>
        <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: '12%' }} animate={{ width: '100%' }} transition={{ delay: 0.25, duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-amb" />
        </div>
      </div>
      <span className="font-mono text-[8px] font-bold text-amb">+40G</span>
    </motion.div>
  );
}

export function DemoToast() {
  const [list, setList] = useState<{ id: number; t: string }[]>([]);
  const ctr = useRef(0);
  const spawn = () => {
    const id = Date.now() + ctr.current++;
    setList((l) => [...l, { id, t: ACH[id % ACH.length] }]);
  };
  return (
    <div className="absolute inset-0">
      <div className="pointer-events-none absolute right-2.5 top-2.5 flex flex-col items-end gap-1.5">
        <AnimatePresence>
          {list.slice(-2).map((t) => (
            <ToastCard key={t.id} id={t.id} title={t.t} onDone={(id) => setList((l) => l.filter((x) => x.id !== id))} />
          ))}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <motion.button whileTap={{ scale: 0.92 }} onClick={spawn} className="rounded-md border border-amb/50 bg-amb/10 px-5 py-2.5 font-mono text-[9px] tracking-[0.22em] text-amb transition-colors hover:bg-amb/20">
            COMPLETE OBJECTIVE
          </motion.button>
          <div className="mt-2 font-mono text-[8px] tracking-[0.24em] text-white/30">SPAM IT — TOASTS QUEUE ×2</div>
        </div>
      </div>
    </div>
  );
}

/* ============ AF-23 GOLD MAGNET — currency vacuum ============ */
export function DemoMagnet() {
  const stageRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const [coins, setCoins] = useState<{ id: number; sx: number; sy: number; dx: number; up: number; wx: number; wy: number; v: number }[]>([]);
  const [total, setTotal] = useState(1240);

  const spawn = (e: React.PointerEvent) => {
    const sr = stageRef.current!.getBoundingClientRect();
    const wr = walletRef.current!.getBoundingClientRect();
    const sx = e.clientX - sr.left, sy = e.clientY - sr.top;
    const wx = wr.left + wr.width / 2 - sr.left, wy = wr.top + wr.height / 2 - sr.top;
    const batch = Array.from({ length: 7 }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      sx, sy,
      dx: (Math.random() - 0.5) * 110,
      up: 26 + Math.random() * 60,
      wx, wy,
      v: 5 + Math.round(Math.random() * 20),
    }));
    setCoins((c) => [...c, ...batch]);
  };

  return (
    <div ref={stageRef} onPointerDown={spawn} className="absolute inset-0 cursor-pointer">
      {/* wallet */}
      <div className="absolute right-2.5 top-2.5 z-10">
        <motion.div key={total} initial={{ scale: 1.22 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 16 }}>
          <div ref={walletRef} className="flex items-center gap-1.5 rounded-full border border-amb/50 bg-black/60 px-2.5 py-1.5 backdrop-blur">
            <Wallet size={11} className="text-amb" />
            <span className="font-mono text-[10px] font-bold text-amb">{total.toLocaleString()}</span>
          </div>
        </motion.div>
      </div>
      {/* coins */}
      {coins.map((c) => (
        <motion.span
          key={c.id}
          initial={{ x: c.sx - 5, y: c.sy - 5, scale: 0, opacity: 0 }}
          animate={{ x: [c.sx - 5, c.sx - 5 + c.dx, c.wx - 5], y: [c.sy - 5, c.sy - 5 - c.up, c.wy - 5], scale: [0, 1, 0.55], opacity: [0, 1, 1] }}
          transition={{ duration: 0.82, times: [0, 0.34, 1], ease: ['easeOut', 'easeIn'], delay: Math.random() * 0.08 }}
          onAnimationComplete={() => {
            setTotal((t) => t + c.v);
            setCoins((p) => p.filter((k) => k.id !== c.id));
          }}
          className="pointer-events-none absolute left-0 top-0 size-2.5 rounded-full"
          style={{ background: 'radial-gradient(circle at 32% 30%, #FFE8A3 0%, #FFC24B 45%, #B87A14 100%)', boxShadow: '0 0 8px rgba(255,194,75,0.7)' }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-black/40 px-3.5 py-2.5 backdrop-blur">
          <Coins size={14} className="text-amb" />
          <span className="font-mono text-[9px] tracking-[0.26em] text-white/60">TAP FIELD TO LOOT</span>
        </div>
      </div>
    </div>
  );
}

/* ============ AF-24 ASTRA TREE — skill constellation ============ */
const NODES = [
  { id: 'core', x: 50, y: 82, n: 'IGNITION', req: [] as string[] },
  { id: 'dash', x: 24, y: 60, n: 'PHASE DASH', req: ['core'] },
  { id: 'volt', x: 76, y: 60, n: 'VOLT EDGE', req: ['core'] },
  { id: 'nova', x: 14, y: 34, n: 'NOVA BURST', req: ['dash'] },
  { id: 'aegis', x: 40, y: 30, n: 'AEGIS WALL', req: ['dash'] },
  { id: 'storm', x: 84, y: 32, n: 'STORMCALL', req: ['volt'] },
  { id: 'apex', x: 50, y: 10, n: 'APEX FORM', req: ['aegis', 'storm'] },
];
const EDGES: [string, string][] = [['core', 'dash'], ['core', 'volt'], ['dash', 'nova'], ['dash', 'aegis'], ['volt', 'storm'], ['aegis', 'apex'], ['storm', 'apex']];

export function DemoSkill() {
  const [unlocked, setUnlocked] = useState<string[]>(['core']);
  const [points, setPoints] = useState(4);
  const [ping, setPing] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);

  const node = (id: string) => NODES.find((n) => n.id === id)!;
  const can = (id: string) => !unlocked.includes(id) && points > 0 && node(id).req.every((r) => unlocked.includes(r));

  const tap = (id: string) => {
    setTip(id);
    if (!can(id)) return;
    setUnlocked((u) => [...u, id]);
    setPoints((p) => p - 1);
    setPing(id);
    setTimeout(() => setPing(null), 800);
  };

  return (
    <div className="absolute inset-0">
      {/* svg edges */}
      <svg className="absolute inset-0 h-full w-full">
        {EDGES.map(([a, b]) => {
          const A = node(a), B = node(b);
          const on = unlocked.includes(a) && unlocked.includes(b);
          return on ? (
            <motion.line key={a + b} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }} x1={`${A.x}%`} y1={`${A.y}%`} x2={`${B.x}%`} y2={`${B.y}%`} stroke="#8B7CFF" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 4px rgba(139,124,255,0.8))' }} />
          ) : (
            <line key={a + b} x1={`${A.x}%`} y1={`${A.y}%`} x2={`${B.x}%`} y2={`${B.y}%`} stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="3 4" />
          );
        })}
      </svg>
      {/* nodes */}
      {NODES.map((n) => {
        const on = unlocked.includes(n.id);
        const av = can(n.id);
        return (
          <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            {av && <span className="absolute inset-0 animate-ping rounded-full border border-vio/60" style={{ animationDuration: '1.8s' }} />}
            {ping === n.id && <motion.span initial={{ scale: 0.6, opacity: 1 }} animate={{ scale: 2.6, opacity: 0 }} className="absolute inset-0 rounded-full border-2 border-vio" />}
            <motion.button
              onClick={() => tap(n.id)}
              whileTap={{ scale: 0.85 }}
              className={`relative grid size-10 place-items-center rounded-full border-2 transition-colors ${on ? 'border-vio bg-vio/25 shadow-[0_0_18px_rgba(139,124,255,0.5)]' : av ? 'border-vio/70 bg-black/60' : 'border-white/12 bg-black/60'}`}
            >
              {on ? <Zap size={14} className="text-vio" fill="currentColor" /> : av ? <Zap size={14} className="text-vio/80" /> : <Lock size={12} className="text-white/20" />}
            </motion.button>
            <AnimatePresence>
              {tip === n.id && (
                <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onAnimationComplete={() => setTimeout(() => setTip((t) => (t === n.id ? null : t)), 900)} className={`absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[7px] tracking-[0.18em] ${on ? 'border-vio/50 bg-vio/10 text-vio' : 'border-line bg-black/70 text-white/50'}`}>
                  {n.n} {on ? '· ONLINE' : av ? '· 1 PT' : '· LOCKED'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      {/* hud */}
      <div className="absolute left-2.5 top-2.5 font-mono text-[9px] tracking-[0.2em] text-white/45">
        SKILL POINTS <span className="text-vio">{points}</span>
      </div>
      <button onClick={() => { setUnlocked(['core']); setPoints(4); }} className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded border border-line bg-black/50 px-2 py-1 font-mono text-[8px] tracking-[0.18em] text-white/50 transition-colors hover:text-white">
        <RotateCcw size={9} /> RESPEC
      </button>
    </div>
  );
}
