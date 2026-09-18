import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationControls } from 'framer-motion';
import { Grab, Gamepad2 } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { clamp } from '../lib/core';

/* ---------------- Tap Ripple ---------------- */
function TapRipple() {
  const [rips, setRips] = useState<{ id: number; x: number; y: number }[]>([]);
  const tap = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRips((s) => [...s.slice(-8), { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRips((s) => s.filter((x) => x.id !== id)), 700);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={tap}>
      <div className="absolute inset-0 dotgrid opacity-50" />
      {rips.map((r) => (
        <span key={r.id} className="pointer-events-none absolute" style={{ left: r.x, top: r.y }}>
          <motion.span className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-cyan-300" initial={{ scale: 0.3, opacity: 0.9 }} animate={{ scale: 2.8, opacity: 0 }} transition={{ duration: 0.62, ease: 'easeOut' }} />
          <motion.span className="absolute -ml-2 -mt-2 h-4 w-4 rounded-full border border-cyan-100" initial={{ scale: 0.2, opacity: 0.8 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut', delay: 0.06 }} />
          <motion.span className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-cyan-200" initial={{ scale: 1, opacity: 1 }} animate={{ scale: 0, opacity: 0 }} transition={{ duration: 0.4 }} />
        </span>
      ))}
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-blue-100/50">DUAL RING · 0.62s EXPANSION</div>
    </div>
  );
}

/* ---------------- Swipe Trail ---------------- */
function SwipeTrail() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const S = useRef({ pts: [] as { x: number; y: number; t: number }[], inView: true });
  const fire = (x: number, y: number) => { S.current.pts.push({ x, y, t: performance.now() }); };
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    const resize = () => { const r = cv.getBoundingClientRect(); cv.width = r.width * dpr; cv.height = r.height * dpr; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = new IntersectionObserver((es) => { S.current.inView = es[0].isIntersecting; }); io.observe(cv);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || !S.current.inView) return;
      const now = performance.now();
      const w = cv.width / dpr, h = cv.height / dpr;
      const s = S.current;
      s.pts = s.pts.filter((p) => now - p.t < 700);
      const last = s.pts[s.pts.length - 1];
      if (!last || now - last.t > 1600 || true) {
        if (!last || now - last.t > 90) {
          // idle emitter orbit when untouched
          if (!last || now - last.t > 1400) {
            fire(w / 2 + Math.sin(now / 620) * w * 0.3, h / 2 + Math.cos(now / 430) * h * 0.24);
          }
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      for (let i = 1; i < s.pts.length; i++) {
        const a = s.pts[i - 1], b = s.pts[i];
        const age = 1 - (now - b.t) / 700;
        if (age <= 0) continue;
        ctx.strokeStyle = `hsla(${(b.t / 6) % 360}, 95%, 66%, ${age * 0.95})`;
        ctx.lineWidth = 1 + age * 8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);
  return (
    <div
      className="absolute inset-0 cursor-crosshair overflow-hidden"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); fire(e.clientX - r.left, e.clientY - r.top); }}
      onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); fire(e.clientX - r.left, e.clientY - r.top); }}
    >
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">0.7s DECAY · HUE BY VELOCITY</div>
    </div>
  );
}

/* ---------------- Magnetic Button ---------------- */
function MagneticBtn() {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 170, damping: 14 });
  const y = useSpring(useMotionValue(0), { stiffness: 170, damping: 14 });
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set(clamp((e.clientX - (r.left + r.width / 2)) * 0.38, -30, 30));
        y.set(clamp((e.clientY - (r.top + r.height / 2)) * 0.38, -24, 24));
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      <div className="absolute h-24 w-24 rounded-full border border-dashed border-blue-300/20" />
      <motion.button style={{ x, y }} whileTap={{ scale: 0.9 }} className="relative flex items-center gap-2 rounded-full bg-blue-400 px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.15em] text-black shadow-[0_0_26px_rgba(96,165,250,.55)]">
        <Grab className="h-3.5 w-3.5" />GRAB ME
      </motion.button>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">±30px CLAMP · SPRING(170,14)</div>
    </div>
  );
}

/* ---------------- Drag Card ---------------- */
function DragCard() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-12, 12]);
  return (
    <div ref={stageRef} className="absolute inset-0 flex touch-none items-center justify-center overflow-hidden">
      <div className="absolute inset-x-[16%] top-1/2 border-t border-dashed border-white/12" />
      <motion.div
        drag
        dragConstraints={stageRef}
        dragElastic={0.22}
        animate={controls}
        onDragEnd={() => controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 280, damping: 16 } })}
        style={{ x, rotate }}
        className="relative w-28 cursor-grab rounded-xl border border-blue-300/30 bg-[#101623] p-3 shadow-2xl active:cursor-grabbing"
      >
        <div className="mb-2 flex h-12 items-center justify-center rounded-lg bg-blue-400/10">
          <Gamepad2 className="h-6 w-6 text-blue-300" />
        </div>
        <div className="mb-1.5 h-1.5 w-4/5 rounded bg-white/12" />
        <div className="h-1.5 w-3/5 rounded bg-white/8" />
        <div className="mt-2 font-mono text-[8px] tracking-[0.25em] text-blue-200/60">DRAG ME</div>
      </motion.div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">ROT COUPLED ±12° · ELASTIC 0.22</div>
    </div>
  );
}

/* ---------------- Hold to Charge ---------------- */
function HoldCharge() {
  const [charge, setCharge] = useState(0);
  const [flash, setFlash] = useState(0);
  const holding = useRef(false);
  const rafRef = useRef(0);
  const C = 2 * Math.PI * 44;
  const start = () => {
    if (holding.current) return;
    holding.current = true;
    const t0 = performance.now();
    const loop = (t: number) => {
      if (!holding.current) return;
      const c = Math.min(1, (t - t0) / 1100);
      setCharge(c);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };
  const end = () => {
    if (!holding.current) return;
    holding.current = false;
    cancelAnimationFrame(rafRef.current);
    setCharge((c) => {
      if (c >= 0.99) setFlash((f) => f + 1);
      return 0;
    });
  };
  return (
    <div
      className="absolute inset-0 cursor-pointer touch-none overflow-hidden"
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={end}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[104px] w-[104px]">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="44" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="5" />
            <circle cx="52" cy="52" r="44" fill="none" stroke={charge > 0.9 ? '#fbbf24' : '#60a5fa'} strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - charge)} style={{ transition: 'stroke .15s' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ scale: 1 + charge * 0.42 }} className="h-9 w-9 rounded-full" style={{ background: charge > 0.9 ? '#fbbf24' : '#60a5fa', boxShadow: `0 0 ${18 + charge * 26}px ${charge > 0.9 ? 'rgba(251,191,36,.75)' : 'rgba(96,165,250,.6)'}` }} />
          </div>
        </div>
        {flash > 0 && (
          <motion.div key={flash} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span className="absolute h-[104px] w-[104px] rounded-full border-2 border-amber-300" initial={{ scale: 0.6, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
            <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.05 }} className="absolute top-[22%] font-display text-[14px] font-extrabold tracking-widest text-amber-300">PERFECT!</motion.span>
          </motion.div>
        )}
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">HOLD 1.1s · RELEASE AT 100%</div>
      <div className="absolute right-3 top-2.5 font-mono text-[10px] tabular-nums text-blue-200/60">{Math.round(charge * 100)}%</div>
    </div>
  );
}

/* ---------------- 3D Tilt Card ---------------- */
function TiltCard() {
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 16 });
  const [gl, setGl] = useState({ x: 50, y: 50 });
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ perspective: '700px' }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 18);
        rx.set(-(py - 0.5) * 18);
        setGl({ x: px * 100, y: py * 100 });
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="relative h-40 w-32 overflow-hidden rounded-2xl border border-blue-300/25 bg-[#0f1524] p-3.5 shadow-2xl">
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(240px at ${gl.x}% ${gl.y}%, rgba(255,255,255,.14), transparent 60%)` }} />
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/15" style={{ transform: 'translateZ(30px)' }}>
          <Gamepad2 className="h-5 w-5 text-blue-300" />
        </div>
        <div className="mt-3 font-display text-[12px] font-extrabold tracking-wider text-white" style={{ transform: 'translateZ(24px)' }}>ELITE<br />PASS</div>
        <div className="mt-2 h-1.5 w-3/4 rounded bg-white/10" style={{ transform: 'translateZ(16px)' }} />
        <div className="mt-1.5 h-1.5 w-1/2 rounded bg-white/8" style={{ transform: 'translateZ(16px)' }} />
        <div className="absolute right-3 top-3 rounded-full border border-blue-300/40 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.2em] text-blue-200" style={{ transform: 'translateZ(36px)' }}>S12</div>
      </motion.div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">±18° TILT · SPECULAR GLARE</div>
    </div>
  );
}

export const assets: AssetDef[] = [
  { id: 'tap-ripple', name: 'Tap Ripple', cat: 'touch', origin: 'ARCHIVE', trigger: 'TAP', duration: '0.62s', easing: 'easeOut ×3 layers', tags: ['feedback', 'sonar'], desc: 'Triple-layer sonar: outer ring, delayed inner ring and a collapsing core dot at the exact touch point.', Component: TapRipple },
  { id: 'swipe-trail', name: 'Swipe Trail', cat: 'touch', origin: 'EXPANSION', trigger: 'DRAG', duration: '0.7s decay', easing: 'hsl velocity map', tags: ['ribbon', 'input', 'fruit-ninja'], desc: 'Velocity ribbon with hue cycling by stroke speed and width tapering into the fade. Fruit-Ninja grade.', Component: SwipeTrail },
  { id: 'magnetic-btn', name: 'Magnetic Button', cat: 'touch', origin: 'ARCHIVE', trigger: 'HOVER', duration: 'continuous', easing: 'spring(170,14)', tags: ['cta', 'snap'], desc: 'CTA leans toward your cursor inside a dashed capture radius and snaps home on exit.', Component: MagneticBtn },
  { id: 'drag-card', name: 'Drag Physics Card', cat: 'touch', origin: 'EXPANSION', trigger: 'DRAG', duration: 'spring return', easing: 'spring(280,16)', tags: ['inertia', 'tilt', 'elastic'], desc: 'Inertial drag with rotation coupled to x-velocity and an elastic slingshot return to origin.', Component: DragCard },
  { id: 'hold-charge', name: 'Hold to Charge', cat: 'touch', origin: 'EXPANSION', trigger: 'HOLD', duration: '1.1s', easing: 'linear fill', tags: ['charge', 'perfect-release'], desc: 'Hold-to-charge ring with orb growth and a PERFECT window at 100% that fires a shockwave.', Component: HoldCharge },
  { id: 'tilt-card', name: '3D Tilt Card', cat: 'touch', origin: 'EXPANSION', trigger: 'HOVER', duration: 'continuous', easing: 'spring(150,16)', tags: ['3d', 'glare', 'depth'], desc: 'Pointer tilt with translateZ layer separation and a specular glare that tracks your thumb.', Component: TiltCard },
];
