import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, FlaskConical, Crosshair, Swords } from 'lucide-react';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ============ AF-01 DRIFT CORE — floating virtual joystick ============ */
export function DemoJoystick() {
  const ref = useRef<HTMLDivElement>(null);
  const [base, setBase] = useState<{ x: number; y: number } | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const R = 50;

  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e: React.PointerEvent) => {
    ref.current?.setPointerCapture(e.pointerId);
    setBase(pos(e));
    setKnob({ x: 0, y: 0 });
  };
  const move = (e: React.PointerEvent) => {
    if (!base) return;
    const p = pos(e);
    let dx = p.x - base.x;
    let dy = p.y - base.y;
    const l = Math.hypot(dx, dy);
    if (l > R) { dx = (dx / l) * R; dy = (dy / l) * R; }
    setKnob({ x: dx, y: dy });
  };
  const up = () => { setBase(null); setKnob({ x: 0, y: 0 }); };

  const active = base !== null;
  const pow = clamp(Math.hypot(knob.x, knob.y) / R, 0, 1);
  const ang = ((Math.atan2(-knob.y, knob.x) * 180) / Math.PI + 360) % 360;
  const dirs = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'];
  const dir = pow > 0.22 ? dirs[Math.round(ang / 45) % 8] : '---';

  return (
    <div ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className="absolute inset-0 cursor-crosshair">
      {!active && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative grid place-items-center">
            <span className="absolute size-16 animate-ping rounded-full border border-volt/25" style={{ animationDuration: '2.2s' }} />
            <span className="size-16 rounded-full border border-dashed border-white/20" />
            <span className="absolute font-mono text-[9px] tracking-[0.3em] text-white/35 -bottom-8 whitespace-nowrap">TOUCH ANYWHERE</span>
          </div>
        </div>
      )}
      {base && (
        <>
          {/* base plate */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="absolute size-[108px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-volt/40"
            style={{ left: base.x, top: base.y, boxShadow: `0 0 40px ${pow * 30}px rgba(200,255,49,${0.08 + pow * 0.22})` }}
          >
            <span className="absolute inset-3 rounded-full border border-white/12" />
            <span className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, rgba(200,255,49,${0.05 + pow * 0.12}) 0%, transparent 70%)` }} />
            {/* 8-way notches */}
            {dirs.map((d, i) => (
              <span key={d} className={`absolute left-1/2 top-1/2 h-1.5 w-px ${dir === d ? 'bg-volt' : 'bg-white/20'}`} style={{ transform: `translate(-50%,-50%) rotate(${i * 45}deg) translateY(-50px)` }} />
            ))}
          </motion.div>
          {/* dead zone */}
          <span className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" style={{ left: base.x, top: base.y }} />
          {/* knob */}
          <motion.div
            className="absolute left-0 top-0 size-12"
            animate={{ x: base.x + knob.x - 24, y: base.y + knob.y - 24 }}
            transition={{ type: 'spring', stiffness: 700, damping: 32, mass: 0.6 }}
          >
            <div className="size-12 rounded-full border border-volt/60 bg-gradient-to-br from-white/25 to-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur" />
            <span className="absolute inset-4 rounded-full bg-volt/70 blur-[6px]" style={{ opacity: 0.3 + pow * 0.7 }} />
          </motion.div>
        </>
      )}
      {/* vector readout */}
      <div className="pointer-events-none absolute bottom-2.5 left-2.5 space-y-0.5 font-mono text-[9px] tracking-[0.14em] text-white/50">
        <div>VEC <span className="text-volt">{(knob.x / R).toFixed(2)} / {(-knob.y / R).toFixed(2)}</span></div>
        <div>PWR <span className="text-white">{Math.round(pow * 100)}%</span> · DIR <span className="text-white">{dir}</span></div>
      </div>
    </div>
  );
}

/* ============ AF-02 TRIO ARC — ability cluster with cooldowns ============ */
export function DemoAbilities() {
  const CD = [2600, 4200, 6000];
  const [ends, setEnds] = useState<number[]>([0, 0, 0]);
  const [now, setNow] = useState(Date.now());
  const [log, setLog] = useState<string[]>([]);
  const [slashes, setSlashes] = useState<{ id: number; r: number }[]>([]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 90);
    return () => clearInterval(t);
  }, []);

  const cast = (i: number, label: string) => {
    if (ends[i] - now > 0) return;
    setEnds((p) => p.map((v, j) => (j === i ? Date.now() + CD[i] : v)));
    setLog((l) => [label, ...l].slice(0, 3));
  };
  const attack = () => {
    const id = Date.now();
    setSlashes((s) => [...s, { id, r: -30 + Math.random() * 60 }]);
    setTimeout(() => setSlashes((s) => s.filter((x) => x.id !== id)), 480);
  };

  const abs = [
    { icon: Zap, label: 'VOLT DASH', c: '#5BE7FF' },
    { icon: Shield, label: 'AEGIS', c: '#8B7CFF' },
    { icon: FlaskConical, label: 'STIM', c: '#7CFFB2' },
  ];

  return (
    <div className="absolute inset-0">
      {/* cast log */}
      <div className="absolute left-2.5 top-2.5 space-y-1">
        <AnimatePresence>
          {log.map((l, i) => (
            <motion.div key={l + i} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 - i * 0.3 }} exit={{ opacity: 0 }} className="w-max rounded border border-line bg-black/50 px-2 py-1 font-mono text-[8px] tracking-[0.2em] text-volt">
              CAST · {l}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* slash fx */}
      <AnimatePresence>
        {slashes.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 0, scale: 0.4, rotate: s.r }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.25, 1.5], rotate: s.r + 18 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-px w-44 origin-left"
            style={{ background: 'linear-gradient(90deg, transparent, #fff, #C8FF31, transparent)', translateX: '-50%', translateY: '-50%' }}
          />
        ))}
      </AnimatePresence>
      {/* cluster */}
      <div className="absolute bottom-5 right-5 flex items-end gap-2.5">
        {abs.map((a, i) => {
          const left = Math.max(0, ends[i] - now);
          const p = left / CD[i];
          const ready = left <= 0;
          return (
            <motion.button
              key={a.label}
              whileTap={ready ? { scale: 0.82 } : { x: [0, -3, 3, 0] }}
              onPointerDown={() => cast(i, a.label)}
              className="relative grid size-12 place-items-center overflow-hidden rounded-2xl border backdrop-blur transition-colors"
              style={{ borderColor: ready ? `${a.c}66` : 'rgba(255,255,255,0.1)', background: 'rgba(8,10,16,0.7)' }}
            >
              <a.icon size={17} style={{ color: ready ? a.c : 'rgba(255,255,255,0.25)' }} />
              {left > 0 && (
                <>
                  <span className="absolute inset-0" style={{ background: `conic-gradient(from 0deg, rgba(4,6,10,0.88) ${p * 360}deg, transparent ${p * 360}deg)` }} />
                  <span className="absolute font-mono text-[10px] font-bold text-white/85">{(left / 1000).toFixed(1)}</span>
                </>
              )}
              {ready && <span className="absolute inset-x-2 bottom-1 h-0.5 rounded-full" style={{ background: a.c }} />}
            </motion.button>
          );
        })}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onPointerDown={attack}
          className="relative grid size-16 place-items-center overflow-hidden rounded-full border-2 border-volt/70 bg-gradient-to-br from-volt/30 to-volt/5 shadow-[0_0_28px_rgba(200,255,49,0.3)]"
        >
          <Swords size={22} className="text-volt" />
          <span className="absolute inset-x-4 bottom-2 font-mono text-[7px] tracking-[0.24em] text-volt/80">ATK</span>
        </motion.button>
      </div>
    </div>
  );
}

/* ============ AF-03 OVERDRIVE — hold-to-charge shot ============ */
export function DemoCharge() {
  const [charge, setCharge] = useState(0);
  const chargeRef = useRef(0);
  const pressing = useRef(false);
  const [shots, setShots] = useState<{ id: number; pow: number }[]>([]);
  const stage = charge >= 100 ? 'MAX' : charge > 66 ? 'HOT' : charge > 33 ? 'WARM' : 'IDLE';
  const col = charge >= 100 ? '#FF5B6E' : charge > 66 ? '#FFC24B' : '#C8FF31';

  useEffect(() => { chargeRef.current = charge; }, [charge]);

  const start = () => {
    if (pressing.current) return;
    pressing.current = true;
    const t = setInterval(() => {
      if (!pressing.current) { clearInterval(t); return; }
      setCharge((c) => Math.min(100, c + 2.6));
    }, 26);
  };
  const release = () => {
    if (!pressing.current) return;
    pressing.current = false;
    const c = chargeRef.current;
    if (c > 12) {
      const id = Date.now();
      setShots((s) => [...s.slice(-3), { id, pow: c }]);
      setTimeout(() => setShots((s) => s.filter((x) => x.id !== id)), 900);
    }
    setCharge(0);
  };

  return (
    <div className="absolute inset-0">
      {/* projectiles */}
      {shots.map((s) => (
        <motion.div
          key={s.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: 0, y: -190, opacity: [1, 1, 0] }}
          transition={{ duration: 0.7, ease: [0.16, 0.84, 0.32, 1] }}
          className="absolute bottom-[92px] left-1/2 -ml-3"
        >
          <div className="mx-auto rounded-full" style={{ width: 8 + s.pow * 0.3, height: 8 + s.pow * 0.3, background: `radial-gradient(circle, #fff 0%, ${s.pow > 66 ? '#FFC24B' : '#C8FF31'} 55%, transparent 72%)`, boxShadow: `0 0 ${10 + s.pow * 0.5}px rgba(200,255,49,0.9)` }} />
          <div className="mt-1 text-center font-display text-[11px] font-800 text-volt">{Math.round(s.pow * 12.7)}</div>
        </motion.div>
      ))}
      {/* status */}
      <div className="absolute left-2.5 top-2.5 font-mono text-[9px] tracking-[0.2em]">
        <div className="text-white/40">CORE STATE</div>
        <div className="mt-0.5 font-display text-sm font-800" style={{ color: col }}>{stage}</div>
      </div>
      <div className="absolute right-2.5 top-2.5 text-right font-mono text-[9px] tracking-[0.18em] text-white/40">
        <div>OUTPUT</div>
        <div className="mt-0.5 font-display text-sm font-800 text-white">{Math.round(charge * 12.7)}</div>
      </div>
      {/* charge button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <motion.button
          onPointerDown={start}
          onPointerUp={release}
          onPointerLeave={release}
          animate={charge >= 100 ? { x: [0, -1.5, 1.5, -1, 1, 0] } : { x: 0 }}
          transition={charge >= 100 ? { duration: 0.24, repeat: Infinity } : {}}
          className="relative grid size-20 place-items-center overflow-hidden rounded-full border-2 backdrop-blur"
          style={{ borderColor: col, boxShadow: `0 0 ${charge * 0.5}px ${col}55` }}
        >
          <span className="absolute bottom-0 left-0 right-0 transition-none" style={{ height: `${charge}%`, background: `linear-gradient(to top, ${col}55, ${col}11)` }} />
          <span className="absolute inset-1.5 rounded-full border border-white/10" />
          <span className="relative font-mono text-[10px] font-bold tracking-[0.2em]" style={{ color: charge > 4 ? '#06070A' : 'rgba(255,255,255,0.7)', textShadow: charge > 4 ? 'none' : undefined, mixBlendMode: charge > 40 ? 'normal' : undefined }}>
            <span className={charge > 45 ? 'text-white' : ''}>{charge > 0 ? `${Math.round(charge)}` : 'HOLD'}</span>
          </span>
        </motion.button>
        <div className="mt-1.5 text-center font-mono text-[8px] tracking-[0.3em] text-white/35">HOLD · RELEASE TO FIRE</div>
      </div>
    </div>
  );
}

/* ============ AF-04 TACTILE CROSS — d-pad with live arena ============ */
export function DemoDPad() {
  const [held, setHeld] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dot, setDot] = useState({ x: 50, y: 50 });
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!held.x && !held.y) return;
    let raf = 0;
    const step = () => {
      setDot((d) => ({ x: clamp(d.x + held.x * 1.5, 7, 93), y: clamp(d.y + held.y * 1.5, 12, 88) }));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [held]);

  const press = (x: number, y: number, l: string) => () => {
    setHeld({ x, y });
    setLog((p) => [l, ...p].slice(0, 4));
  };
  const release = () => setHeld({ x: 0, y: 0 });

  const Btn = ({ x, y, l, className }: { x: number; y: number; l: string; className: string }) => (
    <motion.button
      onPointerDown={press(x, y, l)}
      onPointerUp={release}
      onPointerLeave={release}
      whileTap={{ scale: 0.86 }}
      className={`absolute grid size-9 place-items-center rounded-lg border font-mono text-[10px] font-bold transition-colors ${className} ${
        (held.x === x && held.y === y && (x || y)) ? 'border-volt bg-volt/25 text-volt shadow-[0_0_16px_rgba(200,255,49,0.35)]' : 'border-white/15 bg-white/[0.04] text-white/50'
      }`}
    >
      {l}
    </motion.button>
  );

  return (
    <div className="absolute inset-0 flex">
      {/* arena */}
      <div className="relative m-3 flex-1 overflow-hidden rounded-lg border border-line bg-black/40">
        <span className="absolute left-1/2 top-0 h-full w-px bg-white/5" />
        <span className="absolute left-0 top-1/2 h-px w-full bg-white/5" />
        <motion.span className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-volt" style={{ left: `${dot.x}%`, top: `${dot.y}%`, boxShadow: '0 0 14px rgba(200,255,49,0.8), 0 0 40px rgba(200,255,49,0.3)' }} animate={{ rotate: held.x || held.y ? 45 : 0 }} />
        <div className="absolute bottom-1.5 left-2 font-mono text-[8px] tracking-[0.2em] text-white/35">ARENA // {Math.round(dot.x)},{Math.round(dot.y)}</div>
      </div>
      {/* dpad */}
      <div className="relative m-3 ml-0 w-32 shrink-0">
        <Btn x={0} y={-1} l="▲" className="left-1/2 top-6 -translate-x-1/2" />
        <Btn x={0} y={1} l="▼" className="bottom-6 left-1/2 -translate-x-1/2" />
        <Btn x={-1} y={0} l="◀" className="left-[14px] top-1/2 -translate-y-1/2" />
        <Btn x={1} y={0} l="▶" className="right-[14px] top-1/2 -translate-y-1/2" />
        <span className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md border border-white/10 bg-white/[0.03]">
          <span className={`size-1.5 rounded-full ${held.x || held.y ? 'bg-volt' : 'bg-white/20'}`} />
        </span>
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1">
          {log.map((l, i) => (
            <span key={l + i} className="font-mono text-[9px] text-volt/80" style={{ opacity: 1 - i * 0.25 }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ AF-05 BLADE TRACE — slash trail + gesture read ============ */
export function DemoSwipe() {
  const ref = useRef<HTMLDivElement>(null);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const heads = useRef<number[]>([]);
  const drawing = useRef(false);
  const [fx, setFx] = useState<{ id: number; x: number; y: number; kind: string; rot: number }[]>([]);

  useEffect(() => {
    const t = setInterval(() => setPts((p) => (drawing.current ? p : p.slice(2))), 40);
    return () => clearInterval(t);
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e: React.PointerEvent) => {
    ref.current?.setPointerCapture(e.pointerId);
    drawing.current = true;
    heads.current = [];
    setPts([pos(e)]);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const p = pos(e);
    setPts((prev) => {
      const last = prev[prev.length - 1];
      if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 7) {
        heads.current.push(Math.atan2(p.y - last?.y || 0, p.x - last?.x || 0));
        return [...prev.slice(-26), p];
      }
      return prev;
    });
  };
  const up = () => {
    drawing.current = false;
    setPts((prev) => {
      if (prev.length > 6) {
        const a = prev[0], b = prev[prev.length - 1];
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        let turns = 0;
        for (let i = 1; i < heads.current.length; i++) {
          if (Math.abs(heads.current[i] - heads.current[i - 1]) > 0.9) turns++;
        }
        const cx = prev.reduce((s, p) => s + p.x, 0) / prev.length;
        const cy = prev.reduce((s, p) => s + p.y, 0) / prev.length;
        const kind = turns >= 3 && prev.length > 10 ? 'Z-SLASH · CRIT' : len > 70 ? 'CLEAN SLASH' : 'FLICK';
        const id = Date.now();
        setFx((f) => [...f, { id, x: cx, y: cy, kind, rot: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI }]);
        setTimeout(() => setFx((f) => f.filter((x) => x.id !== id)), 900);
      }
      return prev;
    });
  };

  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className="absolute inset-0 cursor-crosshair">
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="bladeG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C8FF31" stopOpacity="0" />
            <stop offset="60%" stopColor="#C8FF31" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        {pts.length > 1 && (
          <>
            <path d={d} fill="none" stroke="url(#bladeG)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.18" />
            <path d={d} fill="none" stroke="url(#bladeG)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      <AnimatePresence>
        {fx.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, scale: 0.5, rotate: f.rot }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 1.25], y: -18, rotate: f.rot }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-display text-[13px] font-800 tracking-wide ${f.kind.includes('CRIT') ? 'text-amb' : 'text-volt'}`}
            style={{ left: f.x, top: f.y, textShadow: '0 0 18px currentColor' }}
          >
            {f.kind}
          </motion.div>
        ))}
      </AnimatePresence>
      {pts.length === 0 && !drawing.current && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="font-mono text-[9px] tracking-[0.34em] text-white/30">DRAG TO SLASH — ZIGZAG FOR CRIT</span>
        </div>
      )}
    </div>
  );
}

/* ============ AF-06 LOCK-ON — aim assist reticle ============ */
export function DemoAim() {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<{ d: { x: number; y: number }[]; p: { x: number; y: number }; lock: number; heat: number }>({
    d: [], p: { x: 160, y: 120 }, lock: -1, heat: 0,
  });
  const pointer = useRef({ x: 160, y: 120 });
  const lockRef = useRef(-1);
  const heatRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const el = ref.current;
      const W = el?.clientWidth || 380, H = el?.clientHeight || 240;
      const s = (t - t0) / 1000;
      const drones = [
        { x: W * 0.5 + Math.sin(s * 0.9) * W * 0.3, y: H * 0.45 + Math.cos(s * 1.4) * H * 0.26 },
        { x: W * 0.5 + Math.cos(s * 0.7 + 2) * W * 0.34, y: H * 0.5 + Math.sin(s * 1.1 + 1) * H * 0.3 },
      ];
      // nearest drone in range
      let best = -1, bd = 78;
      drones.forEach((d, i) => {
        const dist = Math.hypot(d.x - pointer.current.x, d.y - pointer.current.y);
        if (dist < bd) { bd = dist; best = i; }
      });
      if (best === lockRef.current && best >= 0) heatRef.current = clamp(heatRef.current + 0.035, 0, 1);
      else { heatRef.current = Math.max(0, heatRef.current - 0.06); if (heatRef.current === 0) lockRef.current = best; else if (best < 0) lockRef.current = -1; }
      if (best >= 0 && lockRef.current < 0) lockRef.current = best;
      setFrame({ d: drones, p: { ...pointer.current }, lock: lockRef.current, heat: heatRef.current });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const locked = frame.lock >= 0 && frame.heat >= 1;
  const magnetOn = frame.lock >= 0 && frame.heat > 0.25;
  const ret = magnetOn ? frame.d[frame.lock] : frame.p;
  const col = locked ? '#FF5B6E' : frame.lock >= 0 ? '#C8FF31' : 'rgba(255,255,255,0.55)';

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      className="absolute inset-0 cursor-none"
    >
      {/* drones */}
      {frame.d.map((d, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: d.x, top: d.y }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className={`size-9 rounded-md border ${frame.lock === i ? 'border-volt/70' : 'border-white/25'} bg-white/[0.04]`} style={{ boxShadow: frame.lock === i ? '0 0 20px rgba(200,255,49,0.25)' : undefined }}>
            <span className="absolute inset-2 rounded-sm border border-white/10" />
          </motion.div>
          <Crosshair size={10} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${locked && frame.lock === i ? 'text-red' : 'text-white/50'}`} />
        </div>
      ))}
      {/* reticle */}
      {ret && (
        <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75" style={{ left: ret.x, top: ret.y }}>
          <motion.div animate={{ scale: magnetOn ? 1 - frame.heat * 0.35 : 1 }} className="relative size-16">
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
              <span key={i} className="absolute size-3 border-t-2 border-l-2" style={{ borderColor: col, left: sx < 0 ? 0 : 'auto', right: sx > 0 ? 0 : 'auto', top: sy < 0 ? 0 : 'auto', bottom: sy > 0 ? 0 : 'auto', transform: `scale(${sx},${sy})` }} />
            ))}
            <svg className="absolute inset-0 size-16 -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <circle cx="32" cy="32" r="26" fill="none" stroke={col} strokeWidth="2" strokeDasharray={`${frame.heat * 163} 163`} strokeLinecap="round" />
            </svg>
          </motion.div>
          <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] tracking-[0.26em]" style={{ color: col }}>
            {locked ? '◈ LOCKED' : frame.lock >= 0 ? `ACQ ${Math.round(frame.heat * 100)}%` : 'SEEKING'}
          </div>
        </div>
      )}
    </div>
  );
}
