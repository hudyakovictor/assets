import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ShoppingBag, Mail, User, Volume2, Vibrate, Music4, ChevronRight, X } from 'lucide-react';

/* ============ AF-25 ROSTER STAGE — character select ============ */
const HEROES = [
  { n: 'NOVA', role: 'STRIKER', h: 350, s: { PWR: 88, SPD: 72, END: 54 }, tag: 'close-quarters burst blade' },
  { n: 'KAI', role: 'WARDEN', h: 200, s: { PWR: 64, SPD: 42, END: 96 }, tag: 'aegis wall specialist' },
  { n: 'MIRA', role: 'SAGE', h: 265, s: { PWR: 76, SPD: 58, END: 61 }, tag: 'long-range volt caster' },
  { n: 'RHO', role: 'SUPPORT', h: 140, s: { PWR: 47, SPD: 83, END: 70 }, tag: 'field repair & tempo' },
];

export function DemoRoster() {
  const [i, setI] = useState(0);
  const [locked, setLocked] = useState(false);
  const h = HEROES[i];
  const c1 = `hsl(${h.h}, 95%, 62%)`;

  return (
    <div className="absolute inset-0 flex gap-2 p-2.5">
      {/* preview */}
      <div className="relative flex-1 overflow-hidden rounded-lg border border-line">
        <AnimatePresence mode="wait">
          {locked ? (
            <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <motion.div initial={{ scale: 0.5, rotate: -6, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="font-display text-xl font-900 tracking-wide text-volt" style={{ textShadow: '0 0 24px rgba(200,255,49,0.7)' }}>UNIT LOCKED</motion.div>
                <div className="mt-1 font-mono text-[8px] tracking-[0.3em] text-white/50">{h.n} ENTERS THE DROP</div>
                <button onClick={() => setLocked(false)} className="mt-3 font-mono text-[8px] tracking-[0.2em] text-white/40 underline underline-offset-4">RESELECT</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={h.n} initial={{ x: 44, opacity: 0, rotate: 3 }} animate={{ x: 0, opacity: 1, rotate: 0 }} exit={{ x: -44, opacity: 0, rotate: -3 }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
              <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, ${c1}26 0%, #090B10 62%)` }} />
              {/* orbit ring */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 11, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-[42%] size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed" style={{ borderColor: `${c1}55` }}>
                <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full" style={{ background: c1, boxShadow: `0 0 10px ${c1}` }} />
              </motion.div>
              {/* glyph */}
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2">
                <span className="font-display text-[64px] font-900 leading-none" style={{ color: c1, textShadow: `0 0 40px ${c1}aa, 0 0 90px ${c1}55` }}>{h.n[0]}</span>
              </motion.div>
              <div className="absolute left-2.5 top-2 font-mono text-[8px] tracking-[0.24em]" style={{ color: c1 }}>{h.role}</div>
              {/* name + tag */}
              <div className="absolute bottom-8 left-2.5 right-2.5">
                <div className="font-display text-2xl font-900 text-white">{h.n}</div>
                <div className="font-mono text-[8px] tracking-[0.16em] text-white/45">{h.tag}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* stats */}
        <div className="absolute bottom-1.5 left-2.5 right-2.5 flex gap-3 rounded-md border border-line bg-black/55 px-2 py-1.5 backdrop-blur">
          {(Object.entries(h.s) as [string, number][]).map(([k, v]) => (
            <div key={k} className="flex flex-1 items-center gap-1.5">
              <span className="font-mono text-[7px] tracking-[0.1em] text-white/40">{k}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                <motion.div animate={{ width: `${v}%` }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} className="h-full rounded-full" style={{ background: c1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* selector */}
      <div className="flex w-24 shrink-0 flex-col gap-1.5">
        {HEROES.map((hh, j) => (
          <button key={hh.n} onClick={() => { setI(j); setLocked(false); }} className={`relative flex flex-1 items-center gap-1.5 rounded-lg border px-2 transition-all ${j === i ? 'border-white/30 bg-white/[0.06]' : 'border-line bg-white/[0.02]'}`}>
            {j === i && <motion.span layoutId="rosterDot" className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full" style={{ background: `hsl(${hh.h}, 95%, 62%)` }} />}
            <span className="font-display text-[11px] font-800" style={{ color: `hsl(${hh.h}, 95%, ${j === i ? 70 : 45}%)` }}>{hh.n[0]}</span>
            <span className={`font-mono text-[7px] tracking-[0.14em] ${j === i ? 'text-white' : 'text-white/35'}`}>{hh.n}</span>
          </button>
        ))}
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => setLocked(true)} className="rounded-lg border border-volt/60 bg-volt/15 py-2 font-mono text-[8px] font-bold tracking-[0.18em] text-volt">LOCK IN</motion.button>
      </div>
    </div>
  );
}

/* ============ AF-26 LINK RADAR — matchmaking sequence ============ */
const STATUS = ['SEARCHING REGION EU-WEST…', 'PING 24MS · STABLE', 'SYNCING LOBBY SLOTS…', 'VALIDATING LOADOUTS…', 'SEALING MATCH…'];

export function DemoMatchmaking() {
  const [phase, setPhase] = useState<'idle' | 'search' | 'found'>('idle');
  const [players, setPlayers] = useState(0);
  const [st, setSt] = useState(0);

  useEffect(() => {
    if (phase !== 'search') return;
    const s = setInterval(() => setSt((p) => (p + 1) % STATUS.length), 1000);
    const p = setInterval(() => {
      setPlayers((n) => {
        if (n >= 6) { setPhase('found'); return n; }
        return n + 1;
      });
    }, 620);
    return () => { clearInterval(s); clearInterval(p); };
  }, [phase]);

  const reset = () => { setPhase('idle'); setPlayers(0); setSt(0); };
  const DOTS = [0, 60, 120, 180, 240, 300];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="relative grid size-32 place-items-center">
        {/* rings */}
        {phase === 'search' && [0, 1, 2].map((i) => (
          <motion.span key={i} animate={{ scale: [0.4, 1.9], opacity: [0.55, 0] }} transition={{ duration: 2.1, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }} className="absolute inset-0 rounded-full border border-cy/60" />
        ))}
        <span className={`absolute inset-0 rounded-full border ${phase === 'found' ? 'border-volt/70' : 'border-cy/25'}`} />
        <span className="absolute inset-4 rounded-full border border-white/8" />
        {/* player dots */}
        {DOTS.slice(0, players).map((a, i) => {
          const rad = ((a - 90) * Math.PI) / 180;
          return (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 15 }} className="absolute size-3 rounded-full border-2 border-ink" style={{ left: `calc(50% + ${Math.cos(rad) * 48}px - 6px)`, top: `calc(50% + ${Math.sin(rad) * 48}px - 6px)`, background: phase === 'found' ? '#C8FF31' : '#5BE7FF', boxShadow: `0 0 10px ${phase === 'found' ? 'rgba(200,255,49,0.8)' : 'rgba(91,231,255,0.8)'}` }} />
          );
        })}
        {/* center state */}
        <div className="relative z-10 grid size-14 place-items-center rounded-full bg-black/60 text-center backdrop-blur">
          {phase === 'found' ? (
            <motion.span animate={{ scale: [1, 1.14, 1] }} transition={{ duration: 1.1, repeat: Infinity }} className="font-display text-[10px] font-900 leading-tight text-volt">MATCH<br />FOUND</motion.span>
          ) : phase === 'search' ? (
            <span className="font-display text-lg font-900 text-cy">{players}<span className="text-[9px] text-white/40">/6</span></span>
          ) : (
            <Play size={16} className="text-white/60" />
          )}
        </div>
        {phase === 'found' && <motion.span initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-[-30px] rounded-full bg-volt/25 blur-xl" />}
      </div>
      <div className="mt-3 h-4 font-mono text-[8px] tracking-[0.24em] text-white/45">
        {phase === 'search' && <motion.span key={st} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-cy/80">{STATUS[st]}</motion.span>}
        {phase === 'found' && <span className="text-volt">LOBBY SEALED · 6 OPERATIVES</span>}
        {phase === 'idle' && <span>QUEUE: CONQUEST RANKED</span>}
      </div>
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={phase === 'idle' ? () => setPhase('search') : reset}
        className={`mt-2.5 rounded-md border px-5 py-2 font-mono text-[9px] tracking-[0.22em] transition-colors ${phase === 'found' ? 'border-volt/60 bg-volt/15 text-volt' : 'border-cy/50 bg-cy/10 text-cy hover:bg-cy/20'}`}
      >
        {phase === 'idle' ? 'FIND MATCH' : phase === 'search' ? 'CANCEL' : 'ENTER MATCH'}
      </motion.button>
    </div>
  );
}

/* ============ AF-27 STASIS GLASS — pause / resume system ============ */
const PM = ['RESUME', 'RESTART RUN', 'TUNE SETTINGS', 'ABANDON · QUIT'];

export function DemoPause() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* fake gameplay */}
      <div className="absolute inset-0 transition-all duration-500" style={{ filter: paused ? 'grayscale(0.85) brightness(0.55)' : 'none' }}>
        <motion.span animate={{ x: [0, 90, 0], y: [0, 30, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-8 top-8 size-16 rounded-full bg-vio/25 blur-xl" />
        <motion.span animate={{ x: [0, -70, 0], y: [0, 50, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-6 right-10 size-20 rounded-full bg-cy/20 blur-xl" />
        <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }} className="absolute left-[18%] top-[34%] size-6 rotate-45 rounded-md border border-volt/70 bg-volt/20 shadow-[0_0_18px_rgba(200,255,49,0.4)]" />
        <motion.div animate={{ y: [4, -4, 4], rotate: 360 }} transition={{ y: { duration: 2.6, repeat: Infinity }, rotate: { duration: 8, repeat: Infinity, ease: 'linear' } }} className="absolute right-[22%] top-[52%] size-5 rounded-md border border-red/60 bg-red/20" />
        <div className="absolute left-2.5 top-2.5 font-mono text-[8px] tracking-[0.2em] text-white/50">
          SECTOR 4 · 02:41<br /><span className="text-volt">SCORE 18,400</span>
        </div>
      </div>
      {/* pause trigger */}
      <button onClick={() => setPaused(true)} className="absolute right-2.5 top-2.5 z-20 grid size-8 place-items-center rounded-md border border-line bg-black/60 text-white/70 backdrop-blur transition-colors hover:border-volt/50 hover:text-volt">
        <Pause size={12} />
      </button>
      {/* stasis overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex backdrop-blur-md">
            <div className="absolute inset-0 bg-black/45" onClick={() => setPaused(false)} />
            <div className="relative ml-auto flex w-[58%] flex-col justify-center border-l border-line bg-panel/70 p-4">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="mb-3">
                <div className="font-mono text-[8px] tracking-[0.3em] text-cy">TIME DILATION ACTIVE</div>
                <div className="text-hollow font-display text-2xl font-900 tracking-wider">STASIS</div>
              </motion.div>
              {PM.map((l, i) => (
                <motion.button
                  key={l}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.08 + i * 0.06 } }}
                  exit={{ opacity: 0, x: 40, transition: { delay: (PM.length - i) * 0.03 } }}
                  onClick={() => i === 0 && setPaused(false)}
                  className={`group flex items-center justify-between border-b border-line py-2.5 text-left transition-colors ${i === 0 ? 'text-volt' : i === 3 ? 'text-red/80' : 'text-white/70'}`}
                >
                  <span className="font-display text-[11px] font-800 tracking-wider transition-transform duration-200 group-hover:translate-x-1">{l}</span>
                  <ChevronRight size={11} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.button>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.36 } }} exit={{ opacity: 0 }} className="mt-3 font-mono text-[7px] tracking-[0.2em] text-white/30">ELAPSED 00:00.000 — WORLD FROZEN</motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ AF-28 TUNER RACK — settings with juicy springs ============ */
export function DemoSettings() {
  const [toggles, setToggles] = useState([true, true, false]);
  const [vol, setVol] = useState(72);
  const [sens, setSens] = useState(38);
  const [q, setQ] = useState(2);

  const TG = [
    { l: 'MUSIC BUS', icon: Music4 },
    { l: 'SFX BUS', icon: Volume2 },
    { l: 'HAPTICS', icon: Vibrate },
  ];

  const Slider = ({ v, set, label }: { v: number; set: (n: number) => void; label: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const grab = (e: React.PointerEvent) => {
      ref.current?.setPointerCapture(e.pointerId);
      const r = ref.current!.getBoundingClientRect();
      set(Math.round(((e.clientX - r.left) / r.width) * 100));
    };
    return (
      <div>
        <div className="mb-1 flex justify-between font-mono text-[8px] tracking-[0.18em] text-white/45">
          <span>{label}</span><span className="text-volt">{v}</span>
        </div>
        <div ref={ref} onPointerDown={grab} onPointerMove={(e) => e.buttons === 1 && grab(e)} className="relative h-6 cursor-ew-resize touch-none">
          <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/8" />
          <motion.span className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-volt" animate={{ width: `${v}%` }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
          <span className="absolute inset-x-0 top-full flex justify-between pr-px">
            {Array.from({ length: 9 }, (_, i) => <span key={i} className={`h-1 w-px ${v / 100 > i / 8 ? 'bg-volt/60' : 'bg-white/15'}`} />)}
          </span>
          <motion.span animate={{ left: `${v}%` }} transition={{ type: 'spring', stiffness: 500, damping: 28 }} className="absolute top-1/2 grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-volt bg-ink shadow-[0_0_12px_rgba(200,255,49,0.5)]" />
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 flex flex-col gap-2 overflow-hidden p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.24em] text-white/45">FIELD TUNER</span>
        <span className="font-mono text-[8px] text-volt/70">AUTO-SAVED</span>
      </div>
      {/* toggles */}
      <div className="flex gap-1.5">
        {TG.map((t, i) => (
          <button key={t.l} onClick={() => setToggles((p) => p.map((v, j) => (j === i ? !v : v)))} className={`flex flex-1 flex-col items-center gap-1 rounded-lg border py-2 transition-colors ${toggles[i] ? 'border-volt/40 bg-volt/[0.06]' : 'border-line bg-white/[0.02]'}`}>
            <t.icon size={12} className={toggles[i] ? 'text-volt' : 'text-white/30'} />
            <span className={`font-mono text-[7px] tracking-[0.12em] ${toggles[i] ? 'text-white/70' : 'text-white/30'}`}>{t.l}</span>
            <span className={`relative h-3.5 w-7 rounded-full border transition-colors ${toggles[i] ? 'border-volt/60 bg-volt/20' : 'border-white/15 bg-white/5'}`}>
              <motion.span animate={{ x: toggles[i] ? 14 : 2 }} transition={{ type: 'spring', stiffness: 550, damping: 26 }} className={`absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full ${toggles[i] ? 'bg-volt shadow-[0_0_8px_rgba(200,255,49,0.7)]' : 'bg-white/30'}`} />
            </span>
          </button>
        ))}
      </div>
      <Slider v={vol} set={setVol} label="MASTER VOLUME" />
      <Slider v={sens} set={setSens} label="AIM SENSITIVITY" />
      {/* quality segmented */}
      <div>
        <div className="mb-1 font-mono text-[8px] tracking-[0.18em] text-white/45">RENDER QUALITY</div>
        <div className="flex gap-1 rounded-full border border-line bg-black/40 p-0.5">
          {['LOW', 'MED', 'ULTRA'].map((o, i) => (
            <button key={o} onClick={() => setQ(i)} className="relative flex-1 rounded-full py-1">
              {q === i && <motion.span layoutId="qPill" transition={{ type: 'spring', stiffness: 460, damping: 30 }} className="absolute inset-0 rounded-full bg-volt" />}
              <span className={`relative z-10 font-mono text-[8px] font-bold tracking-[0.12em] ${q === i ? 'text-black' : 'text-white/40'}`}>{o}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ AF-29 WAYPOINT GUIDE — onboarding coach tour ============ */
const SPOTS = [
  { x: 5, y: 6, w: 24, h: 22, l: 'SUPPLY DEPOT', tip: 'Restock stims and ammo between runs. Stock rotates hourly.' },
  { x: 71, y: 6, w: 24, h: 22, l: 'COMMS', tip: 'Squad invites and system alerts land here. Red badge = urgent.' },
  { x: 5, y: 66, w: 24, h: 28, l: 'OPERATIVE', tip: 'Spend skill points, swap frames, review combat record.' },
  { x: 61, y: 62, w: 34, h: 32, l: 'DROP GATE', tip: 'Launch a run. Seeded sectors refresh at 00:00 UTC.' },
];

export function DemoCoach() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const t = step >= 0 ? SPOTS[step] : null;

  const end = (ok: boolean) => {
    setStep(-1);
    if (ok) { setDone(true); setTimeout(() => setDone(false), 1600); }
  };

  return (
    <div className="absolute inset-0">
      {/* mock UI */}
      {SPOTS.map((s, i) => (
        <div key={s.l} className="absolute flex flex-col items-center justify-center gap-1 rounded-lg border border-line bg-white/[0.03]" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%` }}>
          {i === 0 && <ShoppingBag size={13} className="text-white/30" />}
          {i === 1 && <Mail size={13} className="text-white/30" />}
          {i === 2 && <User size={13} className="text-white/30" />}
          {i === 3 && <Play size={13} className="text-volt/60" />}
          <span className="font-mono text-[7px] tracking-[0.16em] text-white/35">{s.l}</span>
        </div>
      ))}
      <span className="absolute left-1/2 top-[44%] -translate-x-1/2 font-mono text-[8px] tracking-[0.3em] text-white/25">HOME BASE v3</span>

      {/* start */}
      {step < 0 && !done && (
        <div className="absolute inset-0 grid place-items-center">
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setStep(0)} className="rounded-md border border-cy/50 bg-cy/10 px-5 py-2.5 font-mono text-[9px] tracking-[0.24em] text-cy transition-colors hover:bg-cy/20">
            START FIELD TOUR
          </motion.button>
        </div>
      )}
      {done && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-volt/50 bg-volt/10 px-3 py-1 font-mono text-[8px] tracking-[0.22em] text-volt">
          SETUP COMPLETE · +100 XP
        </motion.div>
      )}

      {/* overlay */}
      <AnimatePresence>
        {t && (
          <>
            <motion.div
              key="spot"
              initial={false}
              animate={{ left: `${t.x - 1.5}%`, top: `${t.y - 3}%`, width: `${t.w + 3}%`, height: `${t.h + 6}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="absolute z-20 rounded-xl border-2 border-volt"
              style={{ boxShadow: '0 0 0 999px rgba(3,5,9,0.68), 0 0 24px rgba(200,255,49,0.35)' }}
            >
              <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.3, repeat: Infinity }} className="absolute -right-1.5 -top-1.5 size-3 rounded-full bg-volt" />
            </motion.div>
            <motion.div key={`tip-${step}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-3 bottom-2.5 z-30 rounded-lg border border-line bg-black/85 p-2.5 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[7px] tracking-[0.24em] text-volt">WAYPOINT {step + 1}/4 — {t.l}</span>
                <button onClick={() => end(false)} className="text-white/30 transition-colors hover:text-white"><X size={10} /></button>
              </div>
              <p className="mt-1 font-mono text-[8px] leading-relaxed text-white/60">{t.tip}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <div className="flex gap-1">
                  {SPOTS.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-4 bg-volt' : i < step ? 'w-1 bg-volt/40' : 'w-1 bg-white/15'}`} />)}
                </div>
                <button onClick={() => (step === 3 ? end(true) : setStep((s) => s + 1))} className="rounded bg-volt px-3 py-1 font-mono text-[8px] font-bold tracking-[0.16em] text-black">
                  {step === 3 ? 'DEPLOY' : 'NEXT'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
