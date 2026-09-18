import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Plus, Sword, Shield, FlaskConical, Map, Star, Settings, ChevronLeft, ChevronRight, Check, X, Gamepad2, Trophy, Store, Users } from 'lucide-react';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ============ AF-07 COVER VAULT — 3D deck carousel ============ */
const VAULT = [
  { n: 'NOVA DRIFT', r: 'ARCADE / RACER', h: 185, d: 'zero-g drift league' },
  { n: 'VOIDBORN', r: 'ROGUELIKE', h: 268, d: 'procedural deep runs' },
  { n: 'SUNFORGE', r: 'ACTION RPG', h: 32, d: 'ember-forged realms' },
  { n: 'NULL SECTOR', r: 'TACTICS', h: 205, d: 'grid warfare protocol' },
  { n: 'AETHER FALL', r: 'PLATFORMER', h: 320, d: 'vertical sky descent' },
];

export function DemoCarousel() {
  const n = VAULT.length;
  const [active, setActive] = useState(0);
  const wrap = (i: number) => ((i % n) + n) % n;
  const off = (i: number) => {
    let o = i - active;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  };
  const item = VAULT[wrap(active)];

  return (
    <div className="absolute inset-0" style={{ perspective: 900 }}>
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        onDragEnd={(_, info) => {
          if (info.offset.x < -55 || info.velocity.x < -350) setActive((a) => wrap(a + 1));
          else if (info.offset.x > 55 || info.velocity.x > 350) setActive((a) => wrap(a - 1));
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-[46%] flex justify-center">
        {VAULT.map((v, i) => {
          const o = off(i);
          if (Math.abs(o) > 2) return null;
          return (
            <motion.div
              key={v.n}
              animate={{
                x: o * 76,
                scale: 1 - Math.abs(o) * 0.16,
                rotateY: o * -16,
                opacity: Math.abs(o) > 1.6 ? 0.35 : 1,
                filter: `brightness(${1 - Math.abs(o) * 0.28})`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute -mt-[86px] h-[172px] w-[118px] overflow-hidden rounded-xl border border-white/15"
              style={{ zIndex: 10 - Math.abs(o), transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, hsl(${v.h}, 90%, ${o === 0 ? 58 : 42}%) 0%, hsl(${(v.h + 60) % 360}, 85%, 16%) 100%)` }} />
              <div className="bg-noise absolute inset-0 opacity-40 mix-blend-overlay" />
              <span className="absolute right-2 top-1 font-display text-4xl font-900 text-white/15">0{i + 1}</span>
              <div className="absolute inset-x-2 bottom-2">
                <div className="font-display text-[11px] font-800 leading-tight text-white">{v.n}</div>
                <div className="mt-0.5 font-mono text-[7px] tracking-[0.2em] text-white/60">{v.r}</div>
              </div>
              {o === 0 && <span className="absolute left-2 top-2 rounded-sm bg-volt px-1 py-px font-mono text-[7px] font-bold tracking-[0.14em] text-black">NEW</span>}
            </motion.div>
          );
        })}
      </div>
      {/* controls */}
      <button onClick={() => setActive((a) => wrap(a - 1))} className="absolute left-2.5 top-1/2 z-20 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-black/50 text-white/60 backdrop-blur transition-colors hover:border-volt/50 hover:text-volt">
        <ChevronLeft size={13} />
      </button>
      <button onClick={() => setActive((a) => wrap(a + 1))} className="absolute right-2.5 top-1/2 z-20 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-black/50 text-white/60 backdrop-blur transition-colors hover:border-volt/50 hover:text-volt">
        <ChevronRight size={13} />
      </button>
      {/* info */}
      <div className="absolute inset-x-0 bottom-2.5 flex items-end justify-between px-3">
        <AnimatePresence mode="wait">
          <motion.div key={item.n} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="font-display text-[13px] font-800 text-white">{item.n}</div>
            <div className="font-mono text-[8px] tracking-[0.18em] text-volt/80">{item.d}</div>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1.5 pb-1 pr-14">
          {VAULT.map((v, i) => (
            <button key={v.n} onClick={() => setActive(i)} className={`h-1 rounded-full transition-all ${wrap(active) === i ? 'w-4 bg-volt' : 'w-1 bg-white/25'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ AF-08 CUT SUITE — screen transition engine ============ */
type FX = 'WIPE' | 'IRIS' | 'BLINDS' | 'PIXEL' | 'GLITCH';
const FXT: FX[] = ['WIPE', 'IRIS', 'BLINDS', 'PIXEL', 'GLITCH'];

function Screen({ kind }: { kind: 'A' | 'B' }) {
  return kind === 'A' ? (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(140deg, rgba(91,231,255,0.2) 0%, rgba(10,14,22,0.4) 60%), radial-gradient(80% 60% at 30% 20%, rgba(91,231,255,0.25), transparent)' }}>
      <div className="absolute left-3 top-3">
        <div className="font-mono text-[8px] tracking-[0.28em] text-cy">LOBBY // READY</div>
        <div className="mt-1 font-display text-xl font-800 text-white">STAGING AREA</div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
        {[0, 1, 2].map((i) => <span key={i} className="h-8 flex-1 rounded-md border border-cy/25 bg-cy/[0.06]" />)}
      </div>
    </div>
  ) : (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(140deg, rgba(255,91,110,0.24) 0%, rgba(14,8,10,0.4) 60%), radial-gradient(80% 60% at 70% 20%, rgba(255,194,75,0.22), transparent)' }}>
      <div className="absolute left-3 top-3">
        <div className="font-mono text-[8px] tracking-[0.28em] text-red">ARENA // LIVE</div>
        <div className="mt-1 font-display text-xl font-800 text-white">COMBAT ZONE</div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 bg-gradient-to-r from-red to-amb" />
      </div>
    </div>
  );
}

export function DemoTransitions() {
  const [scr, setScr] = useState<'A' | 'B'>('A');
  const [fx, setFx] = useState<{ type: FX; phase: 'cover' | 'reveal' } | null>(null);
  const busy = useRef(false);
  const pixels = useMemo(() => Array.from({ length: 60 }, (_, i) => ({ i, d: Math.random() * 0.34 })), []);
  const glitchShift = useMemo(() => Array.from({ length: 7 }, () => (Math.random() - 0.5) * 44), []);

  const run = async (type: FX) => {
    if (busy.current) return;
    busy.current = true;
    setFx({ type, phase: 'cover' });
    await wait(type === 'GLITCH' ? 380 : 520);
    setScr((s) => (s === 'A' ? 'B' : 'A'));
    setFx({ type, phase: 'reveal' });
    await wait(type === 'GLITCH' ? 380 : 560);
    setFx(null);
    busy.current = false;
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-x-2.5 top-2.5 bottom-12 overflow-hidden rounded-lg border border-line">
        <Screen kind={scr} />
        {/* overlays */}
        {fx?.type === 'WIPE' && (
          <motion.div key={`w-${fx.phase}`} initial={fx.phase === 'cover' ? { x: '-102%' } : { x: '0%' }} animate={fx.phase === 'cover' ? { x: '0%' } : { x: '102%' }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0 bg-volt">
            <span className="absolute inset-y-0 right-2 font-display text-2xl font-900 text-black/20" style={{ writingMode: 'vertical-rl' }}>TRANSITION</span>
          </motion.div>
        )}
        {fx?.type === 'IRIS' && (
          <motion.div key={`i-${fx.phase}`} initial={fx.phase === 'cover' ? { clipPath: 'circle(0% at 78% 50%)' } : { clipPath: 'circle(150% at 78% 50%)' }} animate={fx.phase === 'cover' ? { clipPath: 'circle(150% at 78% 50%)' } : { clipPath: 'circle(0% at 78% 50%)' }} transition={{ duration: 0.52, ease: [0.7, 0, 0.3, 1] }} className="absolute inset-0 bg-[#0B0D13]">
            <span className="absolute inset-0 rounded-full border-2 border-volt/70" style={{ clipPath: 'inherit' }} />
          </motion.div>
        )}
        {fx?.type === 'BLINDS' && (
          <div className="absolute inset-0 flex flex-col">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div key={`b-${fx.phase}-${i}`} initial={{ x: fx.phase === 'cover' ? '-101%' : '0%' }} animate={{ x: fx.phase === 'cover' ? '0%' : '101%' }} transition={{ duration: 0.42, delay: (fx.phase === 'cover' ? i : 4 - i) * 0.05, ease: [0.76, 0, 0.24, 1] }} className="flex-1" style={{ background: i % 2 ? '#0E1118' : '#C8FF31' }} />
            ))}
          </div>
        )}
        {fx?.type === 'PIXEL' && (
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-6">
            {pixels.map((p) => (
              <motion.div key={`p-${fx.phase}-${p.i}`} initial={{ scale: fx.phase === 'cover' ? 0 : 1 }} animate={{ scale: fx.phase === 'cover' ? 1 : 0 }} transition={{ duration: 0.2, delay: p.d, ease: 'easeOut' }} className={(p.i + Math.floor(p.i / 10)) % 2 ? 'bg-volt' : 'bg-[#0E1118]'} />
            ))}
          </div>
        )}
        {fx?.type === 'GLITCH' && (
          <div className="absolute inset-0 overflow-hidden">
            {glitchShift.map((gx, i) => (
              <motion.div key={`g-${fx.phase}-${i}`} initial={{ x: 0, opacity: 0 }} animate={{ x: [0, gx, -gx * 0.6, 0], opacity: [0, 1, 1, 0] }} transition={{ duration: 0.36, times: [0, 0.3, 0.7, 1] }} className="absolute inset-x-0" style={{ top: `${i * 14.5}%`, height: '14.5%', background: i % 3 === 0 ? 'rgba(91,231,255,0.5)' : i % 3 === 1 ? 'rgba(255,91,110,0.5)' : 'rgba(255,255,255,0.85)', mixBlendMode: 'screen' }} />
            ))}
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-lg font-900 tracking-[0.2em] text-white" style={{ textShadow: '2px 0 rgba(255,91,110,0.8), -2px 0 rgba(91,231,255,0.8)' }}>SIGNAL CUT</span>
            </div>
          </div>
        )}
      </div>
      {/* effect buttons */}
      <div className="absolute inset-x-2.5 bottom-2.5 flex gap-1.5">
        {FXT.map((t) => (
          <button key={t} onClick={() => run(t)} className={`flex-1 rounded-md border py-1.5 font-mono text-[8px] tracking-[0.16em] transition-all ${fx?.type === t ? 'border-volt bg-volt/15 text-volt' : 'border-line bg-black/40 text-white/50 hover:border-white/30 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ AF-09 ORBIT RING — radial spring menu ============ */
export function DemoRadial() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const items = [
    { icon: Sword, l: 'STRIKE' }, { icon: Shield, l: 'GUARD' }, { icon: FlaskConical, l: 'TONIC' },
    { icon: Map, l: 'ATLAS' }, { icon: Star, l: 'FAVOR' }, { icon: Settings, l: 'TUNE' },
  ];
  const r = 76;

  return (
    <div className="absolute inset-0">
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />}
      </AnimatePresence>
      <AnimatePresence>
        {picked && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-volt/40 bg-volt/10 px-3 py-1 font-mono text-[9px] tracking-[0.24em] text-volt">
            {picked} QUEUED
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute left-1/2 top-1/2 z-10">
        {items.map((it, i) => {
          const a = ((i * 60 - 90) * Math.PI) / 180;
          return (
            <AnimatePresence key={it.l}>
              {open && (
                <motion.button
                  initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
                  animate={{ x: `calc(-50% + ${Math.cos(a) * r}px)`, y: `calc(-50% + ${Math.sin(a) * r}px)`, scale: 1, opacity: 1 }}
                  exit={{ x: '-50%', y: '-50%', scale: 0, opacity: 0, transition: { delay: (5 - i) * 0.03 } }}
                  transition={{ type: 'spring', stiffness: 340, damping: 21, delay: i * 0.045 }}
                  whileTap={{ scale: 0.82 }}
                  onClick={() => { setPicked(it.l); setTimeout(() => setPicked(null), 1200); setOpen(false); }}
                  className="absolute grid size-11 place-items-center rounded-full border border-volt/40 bg-[#0C0F16] shadow-[0_0_18px_rgba(200,255,49,0.15)]"
                >
                  <it.icon size={16} className="text-volt" />
                </motion.button>
              )}
            </AnimatePresence>
          );
        })}
        <motion.button
          animate={{ rotate: open ? 135 : 0, scale: open ? 1.08 : 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          onClick={() => setOpen((o) => !o)}
          className="absolute grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-volt bg-gradient-to-br from-volt/40 to-volt/5 shadow-[0_0_32px_rgba(200,255,49,0.35)]"
        >
          <Plus size={22} className="text-volt" />
        </motion.button>
      </div>
      {!open && <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.3em] text-white/30">TAP CORE TO EXPAND</div>}
    </div>
  );
}

/* ============ AF-10 FATE DECK — swipeable quest stack ============ */
const QUESTS = [
  { t: 'CULL THE EMBER PACK', zone: 'ASHEN FIELDS', rw: '320G', c: '#FF5B6E' },
  { t: 'RECOVER THE RELIC CORE', zone: 'NULL VAULT', rw: '1 GEM', c: '#8B7CFF' },
  { t: 'ESCORT THE DRIFT MONK', zone: 'SKY CAUSEWAY', rw: '540G', c: '#5BE7FF' },
  { t: 'SEAL THREE RIFTS', zone: 'HOLLOW MARCH', rw: 'RELIC', c: '#C8FF31' },
  { t: 'OUTRUN THE STATIC STORM', zone: 'GREY DUNES', rw: '410G', c: '#FFC24B' },
];

export function DemoStack() {
  const [order, setOrder] = useState([0, 1, 2, 3, 4]);
  const [resolved, setResolved] = useState(0);
  const [flying, setFlying] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-190, 0, 190], [-13, 0, 13]);
  const okO = useTransform(x, [30, 110], [0, 1]);
  const noO = useTransform(x, [-30, -110], [0, 1]);

  const fling = (dir: number) => {
    if (flying) return;
    setFlying(true);
    animate(x, dir * 380, { type: 'spring', stiffness: 200, damping: 22 });
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setResolved((r) => r + 1);
      x.set(0);
      setFlying(false);
    }, 290);
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute left-2.5 top-2.5 font-mono text-[9px] tracking-[0.2em] text-white/45">
        CONTRACTS CLEARED · <span className="text-volt">{resolved}</span>
      </div>
      <div className="absolute inset-x-0 top-[52%] flex justify-center">
        {order.slice(0, 3).map((qi, pos) => {
          const q = QUESTS[qi];
          if (pos === 0) {
            return (
              <motion.div
                key={`${qi}-${resolved}`}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 95 || info.velocity.x > 480) fling(1);
                  else if (info.offset.x < -95 || info.velocity.x < -480) fling(-1);
                }}
                className="absolute -mt-[76px] h-[152px] w-[218px] cursor-grab touch-none rounded-xl border p-3 active:cursor-grabbing"
                style={{ x, rotate, zIndex: 10, borderColor: `${q.c}88`, background: `linear-gradient(150deg, ${q.c}22 0%, #0B0D13 55%)`, boxShadow: `0 18px 44px -14px ${q.c}44` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] tracking-[0.22em]" style={{ color: q.c }}>{q.zone}</span>
                  <span className="rounded border border-white/15 bg-black/40 px-1.5 py-0.5 font-mono text-[8px] font-bold text-amb">{q.rw}</span>
                </div>
                <div className="mt-3 font-display text-[14px] font-800 leading-snug text-white">{q.t}</div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[8px] tracking-[0.18em] text-white/40">
                  <span className="flex items-center gap-1"><X size={9} className="text-red" /> SKIP</span>
                  <span className="flex items-center gap-1">ACCEPT <Check size={9} className="text-volt" /></span>
                </div>
                <motion.span style={{ opacity: okO }} className="absolute left-3 top-8 -rotate-12 rounded border-2 border-volt px-2 py-0.5 font-display text-sm font-900 text-volt">ACCEPT</motion.span>
                <motion.span style={{ opacity: noO }} className="absolute right-3 top-8 rotate-12 rounded border-2 border-red px-2 py-0.5 font-display text-sm font-900 text-red">SKIP</motion.span>
              </motion.div>
            );
          }
          return (
            <motion.div
              key={qi}
              animate={{ scale: 1 - pos * 0.055, y: pos * 11, opacity: 1 - pos * 0.24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="absolute -mt-[76px] h-[152px] w-[218px] rounded-xl border p-3"
              style={{ zIndex: 10 - pos, borderColor: `${q.c}44`, background: `linear-gradient(150deg, ${q.c}12 0%, #0A0C11 55%)` }}
            >
              <span className="font-mono text-[8px] tracking-[0.22em]" style={{ color: q.c }}>{q.zone}</span>
              <div className="mt-3 font-display text-[13px] font-800 text-white/70">{q.t}</div>
            </motion.div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] tracking-[0.3em] text-white/30">DRAG CARD TO RULE</div>
    </div>
  );
}

/* ============ AF-11 PIVOT BAR — directional tab engine ============ */
const TABS = [
  { l: 'LOADOUT', icon: Gamepad2, rows: [['PULSE CARBINE', 86, '#C8FF31'], ['RIFT BLADE', 64, '#5BE7FF'], ['ION SIDEARM', 42, '#8B7CFF']] },
  { l: 'HEROES', icon: Users, rows: [['NOVA — STRIKER', 92, '#FF5B6E'], ['KAI — WARDEN', 71, '#FFC24B'], ['MIRA — SAGE', 55, '#7CFFB2']] },
  { l: 'SHOP', icon: Store, rows: [['VOID CRATE ×3', 78, '#8B7CFF'], ['GOLD PACK L', 61, '#FFC24B'], ['SKIN: ECLIPSE', 34, '#5BE7FF']] },
  { l: 'RANKS', icon: Trophy, rows: [['#004 — VEX', 96, '#C8FF31'], '#018 — ORIN', '#023 — SEI'].map((r, i) => Array.isArray(r) ? r : [r, 80 - i * 22, '#FFC24B']) as [string, number, string][] },
];

export function DemoTabs() {
  const [idx, setIdx] = useState(0);
  const dir = useRef(1);
  const go = (i: number) => { dir.current = i > idx ? 1 : -1; setIdx(i); };
  const T = TABS[idx];

  return (
    <div className="absolute inset-0 flex flex-col p-2.5">
      <div className="flex gap-1 rounded-full border border-line bg-black/40 p-1">
        {TABS.map((t, i) => (
          <button key={t.l} onClick={() => go(i)} className="relative flex-1 rounded-full py-1.5">
            {idx === i && <motion.span layoutId="tabPill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-full bg-volt" />}
            <span className={`relative z-10 font-mono text-[8px] font-bold tracking-[0.14em] ${idx === i ? 'text-black' : 'text-white/50'}`}>{t.l}</span>
          </button>
        ))}
      </div>
      <div className="relative mt-2 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir.current}>
          <motion.div
            key={idx}
            custom={dir.current}
            initial={{ x: 52 * dir.current, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -52 * dir.current, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 space-y-1.5"
          >
            {(T.rows as [string, number, string][]).map(([label, v, c], r) => (
              <div key={label} className="flex items-center gap-2.5 rounded-lg border border-line bg-white/[0.03] px-2.5 py-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-md" style={{ background: `${c}1A`, border: `1px solid ${c}44` }}>
                  <T.icon size={12} style={{ color: c }} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-[9px] tracking-[0.14em] text-white/75">{label}</div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/8">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.12 + r * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full" style={{ background: c }} />
                  </div>
                </div>
                <span className="font-mono text-[9px] font-bold" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============ AF-12 LAUNCH LIST — expanding menu navigator ============ */
const MENU = [
  { l: 'START RUN', d: 'procedural descent — seed 4482', c: '#C8FF31' },
  { l: 'HANGAR', d: '3 frames ready — one damaged', c: '#5BE7FF' },
  { l: 'FORGE', d: 'craft & overclock modules', c: '#FFC24B' },
  { l: 'ARCHIVE', d: 'lore fragments 12/40', c: '#8B7CFF' },
  { l: 'PROTOCOL', d: 'settings & bindings', c: '#FF5B6E' },
];

export function DemoMenuList() {
  const [active, setActive] = useState(0);
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-0.5 p-3">
      {MENU.map((m, i) => (
        <div key={m.l} className="overflow-hidden rounded-lg">
          <button
            onPointerEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all duration-200 ${active === i ? 'border-white/15 bg-white/[0.05]' : 'border-transparent'}`}
          >
            <span className="font-mono text-[9px] tracking-[0.15em]" style={{ color: active === i ? m.c : 'rgba(255,255,255,0.3)' }}>0{i + 1}</span>
            <span className={`font-display text-[13px] font-800 tracking-wide transition-all duration-200 ${active === i ? 'translate-x-1 text-white' : 'text-white/45'}`}>{m.l}</span>
            <motion.span animate={{ x: active === i ? 0 : -8, opacity: active === i ? 1 : 0 }} className="ml-auto font-mono text-[10px]" style={{ color: m.c }}>→</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {active === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 58, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
                <div className="relative mx-3 mb-1 h-[52px] overflow-hidden rounded-md border border-white/10">
                  <motion.div initial={{ scale: 1.14 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${m.c}40 0%, transparent 70%), radial-gradient(60% 120% at 80% 50%, ${m.c}55 0%, transparent 70%)` }} />
                  <div className="bg-noise absolute inset-0 opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="font-display text-lg font-900 uppercase" style={{ color: `${m.c}E6`, WebkitTextStroke: `1px ${m.c}` }}>{m.l}</span>
                    <span className="max-w-[45%] text-right font-mono text-[8px] leading-relaxed tracking-[0.12em] text-white/55">{m.d}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
