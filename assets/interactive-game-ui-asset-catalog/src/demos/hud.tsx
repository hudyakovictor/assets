import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, ShieldOff, Zap, Flame, Check, Radio } from 'lucide-react';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ============ AF-13 LIFEFORGE — vitality bars w/ ghost damage ============ */
export function DemoVitality() {
  const [hp, setHp] = useState(82);
  const [sh, setSh] = useState(60);
  const [en, setEn] = useState(34);
  const [tick, setTick] = useState(0);
  const [flash, setFlash] = useState<'hit' | 'heal' | null>(null);

  useEffect(() => {
    const t = setInterval(() => setEn((e) => clamp(e + 1.2, 0, 100)), 120);
    return () => clearInterval(t);
  }, []);

  const pulse = (kind: 'hit' | 'heal') => { setFlash(kind); setTimeout(() => setFlash(null), 320); };
  const hit = () => {
    const d = 8 + Math.random() * 14;
    if (sh > 0) { setSh((s) => clamp(s - d * 0.9, 0, 100)); if (d * 0.9 > sh) setHp((h) => clamp(h - (d * 0.9 - sh) * 0.7, 0, 100)); }
    else setHp((h) => clamp(h - d, 0, 100));
    setTick((t) => t + 1); pulse('hit');
  };
  const heal = () => { setHp((h) => clamp(h + 14, 0, 100)); pulse('heal'); };
  const emp = () => { setSh(0); setTick((t) => t + 1); pulse('hit'); };

  const Bar = ({ v, c, ghost, h = 'h-3' }: { v: number; c: string; ghost?: boolean; h?: string }) => (
    <div className={`relative ${h} overflow-hidden rounded-sm bg-white/10`}>
      {ghost && <motion.div animate={{ width: `${v}%` }} transition={{ delay: 0.45, duration: 0.55, ease: 'easeOut' }} className="absolute inset-y-0 left-0 bg-white/45" />}
      <motion.div animate={{ width: `${v}%` }} transition={{ duration: 0.18, ease: 'easeOut' }} className="absolute inset-y-0 left-0" style={{ background: `linear-gradient(90deg, ${c}, ${c}CC)`, boxShadow: `0 0 12px ${c}66` }} />
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, transparent 0 24%, rgba(0,0,0,0.45) 24% calc(24% + 1px))' }} />
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col justify-center p-3.5">
      <motion.div key={tick} animate={{ x: [0, -5, 4, -2, 0] }} transition={{ duration: 0.4 }} className="relative rounded-lg border border-line bg-black/45 p-3 backdrop-blur">
        {flash && <motion.span initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} className={`pointer-events-none absolute inset-0 rounded-lg ${flash === 'hit' ? 'bg-red/25' : 'bg-mint/25'}`} />}
        <div className="mb-2 flex items-center gap-2.5">
          <div className="relative grid size-10 place-items-center">
            <span className="absolute inset-0 rotate-45 rounded-[4px] border border-volt/50 bg-gradient-to-br from-volt/25 to-transparent" />
            <span className="font-display text-[13px] font-900 text-volt">V</span>
          </div>
          <div>
            <div className="font-display text-[11px] font-800 tracking-wide text-white">VEX // STRIKER</div>
            <div className="font-mono text-[8px] tracking-[0.22em] text-white/40">LV 24 · RAID FRAME</div>
          </div>
          <div className="ml-auto text-right font-mono text-[9px] text-white/60">
            <div><span className="text-red">{Math.round(hp)}</span>/100</div>
            <div className="text-cy">{Math.round(sh)} SH</div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5"><Heart size={9} className="text-red" /><div className="flex-1"><Bar v={hp} c="#FF5B6E" ghost /></div></div>
          <div className="flex items-center gap-1.5"><Shield size={9} className="text-cy" /><div className="flex-1"><Bar v={sh} c="#5BE7FF" h="h-1.5" /></div></div>
          <div className="flex items-center gap-1.5"><Zap size={9} className="text-amb" /><div className="flex-1"><Bar v={en} c="#FFC24B" h="h-1.5" /></div></div>
        </div>
      </motion.div>
      <div className="mt-2.5 flex gap-1.5">
        {[{ l: 'TAKE HIT', f: hit, icon: Zap, c: '#FF5B6E' }, { l: 'REPAIR', f: heal, icon: Heart, c: '#7CFFB2' }, { l: 'EMP BURST', f: emp, icon: ShieldOff, c: '#5BE7FF' }].map((b) => (
          <motion.button key={b.l} whileTap={{ scale: 0.9 }} onClick={b.f} className="flex flex-1 items-center justify-center gap-1.5 rounded-md border py-2 font-mono text-[8px] tracking-[0.16em] transition-colors" style={{ borderColor: `${b.c}44`, color: b.c, background: `${b.c}0D` }}>
            <b.icon size={10} /> {b.l}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ============ AF-14 HITCALL — damage number physics ============ */
export function DemoDamage() {
  const ref = useRef<HTMLDivElement>(null);
  const [nums, setNums] = useState<{ id: number; x: number; y: number; v: number; kind: 'hit' | 'crit' | 'heal'; rot: number }[]>([]);
  const [squash, setSquash] = useState(0);
  const critNext = useRef(false);

  const spawn = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const onDummy = Math.hypot(x - r.width / 2, y - 148) < 44;
    const roll = Math.random();
    const kind: 'hit' | 'crit' | 'heal' = critNext.current || roll < (onDummy ? 0.32 : 0.16) ? 'crit' : roll > 0.88 ? 'heal' : 'hit';
    critNext.current = false;
    if (onDummy) setSquash((s) => s + 1);
    const v = kind === 'crit' ? Math.round(400 + Math.random() * 900) : kind === 'heal' ? Math.round(50 + Math.random() * 120) : Math.round(80 + Math.random() * 260);
    const id = Date.now() + Math.random();
    setNums((n) => [...n.slice(-20), { id, x, y, v, kind, rot: (Math.random() - 0.5) * 26 }]);
    setTimeout(() => setNums((n) => n.filter((k) => k.id !== id)), 950);
  };

  return (
    <div ref={ref} onPointerDown={spawn} className="absolute inset-0 cursor-crosshair">
      {/* dummy */}
      <motion.div key={squash} animate={{ scale: [1, 0.82, 1.1, 1] }} transition={{ duration: 0.32 }} className="absolute left-1/2 top-[148px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid size-[72px] place-items-center rounded-full border-2 border-dashed border-white/25 bg-white/[0.03]">
          <span className="absolute size-[46px] rounded-full border border-white/20" />
          <span className="size-3.5 rounded-full bg-red/80 shadow-[0_0_14px_rgba(255,91,110,0.8)]" />
        </div>
        <div className="mt-1.5 text-center font-mono text-[8px] tracking-[0.26em] text-white/35">TRAINING HUSK</div>
      </motion.div>
      {/* numbers */}
      {nums.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, y: 6, scale: n.kind === 'crit' ? 1.6 : 0.7, rotate: n.rot }}
          animate={{ opacity: [0, 1, 1, 0], y: -62, scale: n.kind === 'crit' ? [1.6, 1, 0.95] : [0.7, 1, 0.9], x: n.rot * 0.9 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="pointer-events-none absolute -translate-x-1/2 text-center"
          style={{ left: n.x, top: n.y }}
        >
          {n.kind === 'crit' && <div className="font-display text-[8px] font-900 tracking-[0.3em] text-red" style={{ textShadow: '0 0 12px rgba(255,91,110,0.9)' }}>CRITICAL</div>}
          <div
            className={`font-display font-900 ${n.kind === 'crit' ? 'text-[22px] text-amb' : n.kind === 'heal' ? 'text-[14px] text-mint' : 'text-[15px] text-white'}`}
            style={{ textShadow: n.kind === 'crit' ? '0 0 18px rgba(255,194,75,0.8), 0 2px 0 rgba(0,0,0,0.6)' : '0 2px 6px rgba(0,0,0,0.7)' }}
          >
            {n.kind === 'heal' ? `+${n.v}` : n.v.toLocaleString()}
          </div>
        </motion.div>
      ))}
      <div className="pointer-events-none absolute left-2.5 top-2.5 font-mono text-[8px] leading-relaxed tracking-[0.18em] text-white/35">
        TAP FIELD — FREE HIT<br />TAP HUSK — CRIT BIAS
      </div>
    </div>
  );
}

/* ============ AF-15 RAMPAGE — combo chain meter ============ */
export function DemoCombo() {
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const endRef = useRef(0);
  const [now, setNow] = useState(Date.now());
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      setCombo((c) => {
        if (c > 0 && Date.now() > endRef.current) { setBest((b) => Math.max(b, c)); return 0; }
        return c;
      });
    }, 60);
    return () => clearInterval(t);
  }, []);

  const tiers = [
    { n: 16, t: 'GODLIKE', c: '#FF5B6E', m: 5 },
    { n: 9, t: 'RAMPAGE', c: '#FFC24B', m: 3 },
    { n: 4, t: 'FRENZY', c: '#5BE7FF', m: 2 },
    { n: 0, t: 'CHAIN', c: 'rgba(255,255,255,0.5)', m: 1 },
  ];
  const tier = tiers.find((t) => combo >= t.n)!;
  const left = clamp((endRef.current - now) / 900, 0, 1);

  const tap = () => {
    const crossing = tiers.find((t) => combo + 1 === t.n);
    if (crossing && crossing.n > 0) setBurst((b) => b + 1);
    setCombo((c) => c + 1);
    setScore((s) => s + (combo + 1) * tier.m * 10);
    endRef.current = Date.now() + 900;
    setNow(Date.now());
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between px-3 pt-2.5 font-mono text-[9px] tracking-[0.2em] text-white/45">
        <span>SCORE <span className="text-white">{score.toLocaleString()}</span></span>
        <span>BEST CHAIN <span className="text-volt">{best}</span></span>
      </div>
      {/* decay bar */}
      <div className="mx-3 mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full transition-none" style={{ width: `${left * 100}%`, background: tier.c }} />
      </div>
      {/* pad */}
      <motion.button whileTap={{ scale: 0.97 }} onPointerDown={tap} className="relative m-3 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-line bg-white/[0.02]">
        <AnimatePresence>
          {burst > 0 && (
            <motion.span key={burst} initial={{ opacity: 0.55, scale: 0.6 }} animate={{ opacity: 0, scale: 2.2 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="absolute inset-0" style={{ background: `radial-gradient(circle, ${tier.c}33 0%, transparent 70%)` }} />
          )}
        </AnimatePresence>
        {combo > 0 ? (
          <div className="text-center">
            <motion.div key={combo} initial={{ scale: 1.28 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="font-display text-6xl font-900 leading-none" style={{ color: tier.c, textShadow: `0 0 34px ${tier.c}88` }}>
              {combo}
            </motion.div>
            <div className="mt-1.5 font-mono text-[9px] tracking-[0.4em]" style={{ color: tier.c }}>×{tier.m} {tier.t}</div>
          </div>
        ) : (
          <span className="font-mono text-[9px] tracking-[0.34em] text-white/30">TAP TO CHAIN — 0.9S WINDOW</span>
        )}
      </motion.button>
    </div>
  );
}

/* ============ AF-16 TITAN FRAME — boss plate with phases ============ */
export function DemoBoss() {
  const MAX = 3000;
  const [hp, setHp] = useState(MAX);
  const [banner, setBanner] = useState<string | null>(null);
  const [hitFx, setHitFx] = useState(0);
  const phase = hp > MAX * 0.66 ? 0 : hp > MAX * 0.33 ? 1 : hp > 0 ? 2 : 3;
  const prevPhase = useRef(0);
  const PC = ['#FF5B6E', '#FFC24B', '#C8FF31'];

  useEffect(() => {
    if (phase !== prevPhase.current && phase < 3) {
      prevPhase.current = phase;
      setBanner(phase === 1 ? 'PHASE II — WRATH UNBOUND' : 'FINAL PHASE — CORE EXPOSED');
      const t = setTimeout(() => setBanner(null), 1700);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const deal = () => {
    if (hp <= 0) return;
    setHp((h) => clamp(h - (90 + Math.random() * 110), 0, MAX));
    setHitFx((f) => f + 1);
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-center p-3.5">
      <div className="relative">
        {/* frame corners */}
        {['-left-1 -top-1 border-l-2 border-t-2', '-right-1 -top-1 border-r-2 border-t-2', '-left-1 -bottom-1 border-b-2 border-l-2', '-right-1 -bottom-1 border-b-2 border-r-2'].map((c) => (
          <span key={c} className={`absolute size-3.5 ${c}`} style={{ borderColor: phase === 2 ? '#C8FF31' : '#FF5B6E' }} />
        ))}
        <div className="rounded-sm border border-white/12 bg-black/55 p-2.5 backdrop-blur">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-display text-[10px] font-800 tracking-[0.14em] text-white">VEXALITH — EMBER COLOSSUS</span>
            <span className="font-mono text-[8px] tracking-[0.18em] text-white/50">{Math.ceil(hp)} / {MAX}</span>
          </div>
          <motion.div key={hitFx} animate={{ x: [0, -3, 3, 0] }} transition={{ duration: 0.25 }} className="relative h-3.5 overflow-hidden rounded-sm bg-white/8">
            <motion.div animate={{ width: `${(hp / MAX) * 100}%` }} transition={{ duration: 0.25 }} className="h-full" style={{ background: `linear-gradient(90deg, ${PC[Math.min(phase, 2)]}, ${PC[Math.min(phase, 2)]}BB)`, boxShadow: `0 0 16px ${PC[Math.min(phase, 2)]}66` }} />
            <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, transparent 0 33%, rgba(0,0,0,0.5) 33% calc(33% + 1px))' }} />
            {/* phase markers */}
            {[66, 33].map((m) => <span key={m} className="absolute inset-y-0 w-0.5 bg-white/30" style={{ left: `${m}%` }} />)}
          </motion.div>
          {/* armor plates */}
          <div className="mt-1.5 flex gap-1">
            {[75, 50, 25].map((th, i) => (
              <motion.span key={th} animate={hp < MAX * (th / 100) ? { rotate: 40 + i * 15, y: 14, opacity: 0 } : { rotate: 0, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="flex h-1.5 flex-1 items-center rounded-sm bg-cy/30" style={{ border: '1px solid rgba(91,231,255,0.3)' }} />
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {banner && (
          <motion.div initial={{ opacity: 0, scaleY: 0.4 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-x-0 top-1/3 z-10 border-y border-red/60 bg-black/70 py-2 text-center backdrop-blur-sm">
            <span className="font-display text-sm font-900 tracking-[0.24em] text-red" style={{ textShadow: '0 0 20px rgba(255,91,110,0.8)' }}>{banner}</span>
          </motion.div>
        )}
        {hp <= 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10 grid place-items-center bg-black/60 backdrop-blur-[2px]">
            <div className="text-center">
              <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="font-display text-2xl font-900 tracking-wide text-volt" style={{ textShadow: '0 0 30px rgba(200,255,49,0.7)' }}>TITAN BANISHED</motion.div>
              <button onClick={() => { setHp(MAX); prevPhase.current = 0; }} className="mt-3 rounded-md border border-volt/50 bg-volt/10 px-4 py-1.5 font-mono text-[9px] tracking-[0.24em] text-volt">SUMMON AGAIN</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileTap={{ scale: 0.92 }} onClick={deal} className="mt-2.5 rounded-md border border-red/50 bg-red/10 py-2 font-mono text-[9px] tracking-[0.24em] text-red transition-colors hover:bg-red/20">
        DEAL DAMAGE
      </motion.button>
    </div>
  );
}

/* ============ AF-17 PULSE MAP — radar minimap ============ */
export function DemoRadar() {
  const blips = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ a: i * 67 + 20, r: 26 + ((i * 37) % 30), id: i })), []);
  const [ripples, setRipples] = useState<number[]>([]);
  const ping = () => {
    const id = Date.now();
    setRipples((r) => [...r, id]);
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 1100);
  };

  return (
    <div className="absolute inset-0 flex items-center gap-3 p-3.5">
      <div className="relative aspect-square h-full max-h-[196px] shrink-0">
        <div className="absolute inset-0 rounded-full border border-mint/25 bg-[#05080A]" />
        {[25, 50, 75].map((r) => <span key={r} className="absolute rounded-full border border-mint/12" style={{ inset: `${(100 - r) / 2}%` }} />)}
        <span className="absolute left-1/2 top-0 h-full w-px bg-mint/10" />
        <span className="absolute left-0 top-1/2 h-px w-full bg-mint/10" />
        {/* sweep */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3.4, repeat: Infinity, ease: 'linear' }} className="absolute inset-0" style={{ background: 'conic-gradient(from 0deg, rgba(124,255,178,0.5) 0deg, rgba(124,255,178,0.12) 55deg, transparent 80deg)' }} />
        </div>
        {/* blips */}
        {blips.map((b) => {
          const rad = (b.a * Math.PI) / 180;
          return (
            <motion.span
              key={b.id}
              animate={{ opacity: [0.12, 1, 0.12], scale: [1, 1.7, 1] }}
              transition={{ duration: 3.4, repeat: Infinity, delay: (b.a / 360) * 3.4, times: [0, 0.08, 1] }}
              className="absolute size-1.5 rounded-full bg-mint"
              style={{ left: `calc(50% + ${Math.cos(rad) * b.r}% - 3px)`, top: `calc(50% + ${Math.sin(rad) * b.r}% - 3px)`, boxShadow: '0 0 10px rgba(124,255,178,0.8)' }}
            />
          );
        })}
        {/* player */}
        <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="block h-0 w-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-volt" style={{ filter: 'drop-shadow(0 0 6px rgba(200,255,49,0.9))' }} />
        </motion.span>
        {/* ripples */}
        {ripples.map((r) => (
          <motion.span key={r} initial={{ opacity: 0.8, scale: 0.15 }} animate={{ opacity: 0, scale: 1.6 }} transition={{ duration: 1, ease: 'easeOut' }} className="absolute inset-0 rounded-full border border-volt/70" />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 font-mono text-[8px] tracking-[0.18em]">
        <div className="flex items-center gap-1.5 text-mint"><Radio size={9} /> LIVE SCAN</div>
        <div className="text-white/45">CONTACTS <span className="text-white">{blips.length}</span></div>
        <div className="text-white/45">GRID <span className="text-white">K-7 / NE</span></div>
        <div className="text-white/45">RANGE <span className="text-white">240M</span></div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={ping} className="mt-1 rounded-md border border-mint/40 bg-mint/10 py-1.5 text-mint transition-colors hover:bg-mint/20">PULSE PING</motion.button>
      </div>
    </div>
  );
}

/* ============ AF-18 CONTRACT PANEL — quest tracker ============ */
const INIT_Q = [
  { t: 'EMBER PROTOCOL', v: 400, subs: [{ l: 'Collect 6 ash cores', d: true }, { l: 'Defeat the warden', d: true }, { l: 'Seal the rift gate', d: false }] },
  { t: 'SKYBOUND LEDGER', v: 250, subs: [{ l: 'Chart 3 sky lanes', d: true }, { l: 'Dock at Aerie', d: false }, { l: 'Deliver the ledger', d: false }] },
  { t: 'HOLLOW STATIC', v: 600, subs: [{ l: 'Trace signal source', d: false }, { l: 'Purge echo nests', d: false }, { l: 'Silence the tower', d: false }] },
];

export function DemoQuest() {
  const [qs, setQs] = useState(INIT_Q);
  const [xp, setXp] = useState(0);
  const [bump, setBump] = useState(0);
  const [gone, setGone] = useState<string[]>([]);

  const toggle = (qi: number, si: number) =>
    setQs((p) => p.map((q, i) => (i === qi ? { ...q, subs: q.subs.map((s, j) => (j === si ? { ...s, d: !s.d } : s)) } : q)));
  const claim = (qi: number) => {
    setGone((g) => [...g, qs[qi].t]);
    setXp((x) => x + qs[qi].v);
    setBump((b) => b + 1);
    setTimeout(() => setQs((p) => p.filter((_, i) => i !== qi)), 350);
  };

  return (
    <div className="absolute inset-0 flex flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.24em] text-white/45">ACTIVE CONTRACTS · {qs.length}</span>
        <motion.span key={bump} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="flex items-center gap-1 rounded border border-vio/40 bg-vio/10 px-2 py-0.5 font-mono text-[9px] font-bold text-vio">
          <Flame size={9} /> {xp} XP
        </motion.span>
      </div>
      <div className="flex-1 space-y-1.5 overflow-hidden">
        <AnimatePresence>
          {qs.map((q, qi) => {
            const done = q.subs.filter((s) => s.d).length;
            const full = done === q.subs.length;
            const leaving = gone.includes(q.t);
            return (
              <motion.div
                key={q.t}
                layout
                animate={leaving ? { opacity: 0, x: 60, filter: 'blur(4px)' } : { opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className={`rounded-lg border p-2 ${full ? 'border-volt/50 bg-volt/[0.05]' : 'border-line bg-white/[0.02]'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[10px] font-800 tracking-wide text-white">{q.t}</span>
                  {full ? (
                    <motion.button whileTap={{ scale: 0.9 }} initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => claim(qi)} className="rounded bg-volt px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.14em] text-black">CLAIM +{q.v}</motion.button>
                  ) : (
                    <span className="font-mono text-[8px] text-white/35">{done}/{q.subs.length}</span>
                  )}
                </div>
                <div className="my-1.5 h-0.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div animate={{ width: `${(done / q.subs.length) * 100}%` }} transition={{ type: 'spring', stiffness: 240, damping: 26 }} className={`h-full rounded-full ${full ? 'bg-volt' : 'bg-vio'}`} />
                </div>
                <div className="space-y-0.5">
                  {q.subs.map((s, si) => (
                    <button key={s.l} onClick={() => toggle(qi, si)} className="flex w-full items-center gap-1.5 py-0.5 text-left">
                      <motion.span animate={s.d ? { scale: [1, 1.4, 1], backgroundColor: '#C8FF31', borderColor: '#C8FF31' } : { scale: 1, backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(255,255,255,0.25)' }} className="grid size-3 shrink-0 place-items-center rounded-sm border">
                        {s.d && <Check size={8} className="text-black" strokeWidth={4} />}
                      </motion.span>
                      <span className={`relative font-mono text-[8px] tracking-[0.08em] ${s.d ? 'text-white/30' : 'text-white/65'}`}>
                        {s.l}
                        <motion.span animate={{ width: s.d ? '100%' : '0%' }} className="absolute left-0 top-1/2 h-px bg-white/40" />
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {qs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid h-full place-items-center">
            <button onClick={() => { setQs(INIT_Q); setGone([]); }} className="rounded-md border border-vio/50 bg-vio/10 px-4 py-2 font-mono text-[9px] tracking-[0.2em] text-vio">REQUEST NEW CONTRACTS</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
