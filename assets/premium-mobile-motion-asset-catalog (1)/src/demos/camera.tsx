import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { Crosshair, FlaskConical, Gem, Coins } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { useCycle } from '../lib/core';

/* ---------------- Parallax Layers ---------------- */
function Layer({ mx, f, children }: { mx: MotionValue<number>; f: number; children: ReactNode }) {
  const x = useTransform(mx, (v) => v * f);
  return <motion.div style={{ x }} className="absolute inset-x-[-10%]">{children}</motion.div>;
}
const BUILDINGS = [34, 52, 28, 44, 60, 38, 50, 30, 46, 56, 40, 32];
function ParallaxScene() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16 });
  const sunX = useTransform(sx, (v) => v * 4);
  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden bg-[#0b1c26]"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); }}
      onPointerLeave={() => mx.set(0)}
    >
      <motion.div style={{ x: sunX }} className="absolute right-10 top-4 h-8 w-8 rounded-full bg-[#ffd76a] shadow-[0_0_30px_8px_rgba(255,215,106,.35)]" />
      <div className="absolute inset-x-0 bottom-0 top-0">
        <Layer mx={sx} f={8}>
          <div className="absolute bottom-8 left-0 right-0 h-[52%] bg-[#10242e]" style={{ clipPath: 'polygon(0 100%,0 40%,18% 8%,36% 46%,54% 10%,72% 42%,90% 14%,100% 44%,100% 100%)' }} />
        </Layer>
        <Layer mx={sx} f={18}>
          <div className="absolute bottom-8 left-0 right-0 h-[34%] bg-[#0c1b22]" style={{ clipPath: 'polygon(0 100%,0 34%,24% 8%,44% 40%,66% 12%,86% 44%,100% 22%,100% 100%)' }} />
        </Layer>
        <Layer mx={sx} f={34}>
          <div className="absolute bottom-8 left-0 right-0 flex items-end gap-[3px]">
            {BUILDINGS.map((h, i) => (<div key={i} className="flex-1 bg-[#071118]" style={{ height: `${h * 0.75}px` }} />))}
          </div>
        </Layer>
        <Layer mx={sx} f={52}>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#03080c]"><div className="mx-auto mt-3.5 h-px w-[70%] bg-white/15" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.25) 0 8px, transparent 8px 18px)' }} /></div>
        </Layer>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-orange-100/60">4 PLANES · DEPTH 4/8/18/34/52</div>
    </div>
  );
}

/* ---------------- Zoom Punch ---------------- */
function ZoomPunch() {
  const k = useCycle(2200);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div key={k} className="absolute inset-0" animate={{ scale: [1, 1.17, 0.985, 1] }} transition={{ duration: 0.55, times: [0, 0.32, 0.68, 1] }}>
        <div className="absolute inset-0 dotgrid opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#fb7185]" />
      </motion.div>
      <motion.div key={`c${k}`} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.18, type: 'spring', stiffness: 300, damping: 16 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Crosshair className="h-8 w-8 text-orange-300" />
      </motion.div>
      <motion.div key={`l${k}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }} className="absolute left-1/2 top-[26%] -translate-x-1/2 rounded-full border border-orange-300/50 bg-orange-400/10 px-2.5 py-0.5 font-mono text-[8px] font-bold tracking-[0.3em] text-orange-200">LOCK-ON</motion.div>
      <div key={`f${k}`} className="cm-flash pointer-events-none absolute inset-0" />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">PUNCH +17% → SETTLE −1.5%</div>
      <style>{`.cm-flash{background:rgba(255,255,255,.12);animation:cmFlash .4s ease-out forwards}@keyframes cmFlash{0%{opacity:0}25%{opacity:1}100%{opacity:0}}`}</style>
    </div>
  );
}

/* ---------------- Follow Lag ---------------- */
function FollowLag() {
  const ref = useRef<HTMLDivElement | null>(null);
  const tx = useMotionValue(80);
  const ty = useMotionValue(60);
  const f1x = useSpring(tx, { stiffness: 140, damping: 15 });
  const f1y = useSpring(ty, { stiffness: 140, damping: 15 });
  const f2x = useSpring(tx, { stiffness: 75, damping: 13 });
  const f2y = useSpring(ty, { stiffness: 75, damping: 13 });
  const f3x = useSpring(tx, { stiffness: 42, damping: 11 });
  const f3y = useSpring(ty, { stiffness: 42, damping: 11 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const r = el.getBoundingClientRect();
      tx.set(r.width / 2 + Math.sin(t / 950) * r.width * 0.3);
      ty.set(r.height / 2 + Math.cos(t / 720) * r.height * 0.26);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tx, ty]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ x: tx, y: ty }} className="absolute left-0 top-0 -ml-2 -mt-2"><Crosshair className="h-4 w-4 text-white/70" /></motion.div>
      <motion.div style={{ x: f3x, y: f3y }} className="absolute left-0 top-0 -ml-[7px] -mt-[7px] h-3.5 w-3.5 rounded-full bg-orange-400/25" />
      <motion.div style={{ x: f2x, y: f2y }} className="absolute left-0 top-0 -ml-2 -mt-2 h-4 w-4 rounded-full bg-orange-400/40" />
      <motion.div style={{ x: f1x, y: f1y }} className="absolute left-0 top-0 -ml-[9px] -mt-[9px] h-[18px] w-[18px] rounded-full bg-orange-400 shadow-[0_0_16px_rgba(251,146,60,.6)]" />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-orange-100/60">STIFFNESS 140/75/42 · 3 GHOSTS</div>
    </div>
  );
}

/* ---------------- Float Idle ---------------- */
const FLOATERS = [
  { icon: FlaskConical, c: '#f472b6', d: '0s' },
  { icon: Gem, c: '#22d3ee', d: '0.4s' },
  { icon: Coins, c: '#fbbf24', d: '0.8s' },
];
function FloatIdle() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-7 overflow-hidden pb-9">
      {FLOATERS.map((f) => (
        <div key={f.c} className="flex flex-col items-center gap-1.5">
          <div className="cm-float flex h-11 w-11 items-center justify-center rounded-xl border bg-black/40" style={{ animationDelay: f.d, borderColor: `${f.c}55` }}>
            <f.icon className="h-5 w-5" style={{ color: f.c }} />
          </div>
          <div className="cm-shadow h-1.5 w-8 rounded-full bg-black/70" style={{ animationDelay: f.d }} />
        </div>
      ))}
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">SINE ±8px · PHASE 0/.4/.8</div>
      <style>{`.cm-float{animation:cmFloat 3.2s ease-in-out infinite}@keyframes cmFloat{0%,100%{transform:translateY(4px)}50%{transform:translateY(-7px)}}.cm-shadow{animation:cmSh 3.2s ease-in-out infinite}@keyframes cmSh{0%,100%{transform:scaleX(1);opacity:.6}50%{transform:scaleX(.65);opacity:.3}}`}</style>
    </div>
  );
}

export const assets: AssetDef[] = [
  { id: 'parallax-layers', name: 'Parallax Rig', cat: 'camera', origin: 'ARCHIVE', trigger: 'HOVER', duration: 'continuous', easing: 'spring(55,16)', tags: ['depth', 'layers', 'world'], desc: 'Five-plane parallax — sun, ridges, skyline, road — each sprung at its own depth factor.', Component: ParallaxScene },
  { id: 'zoom-punch', name: 'Zoom Punch', cat: 'camera', origin: 'EXPANSION', trigger: 'AUTO', duration: '0.55s', easing: 'keys [.32,.68]', tags: ['lock-on', 'beat', 'impact'], desc: 'Beat-synced +17% zoom punch with a −1.5% settle overshoot and lock-on reticle.', Component: ZoomPunch },
  { id: 'follow-lag', name: 'Camera Follow Lag', cat: 'camera', origin: 'EXPANSION', trigger: 'AUTO', duration: 'continuous', easing: 'multi-spring', tags: ['lag', 'ghosts', 'soft-follow'], desc: 'Soft-follow rig: three ghost dots at stiffness 140/75/42 trailing a drifting lissajous target.', Component: FollowLag },
  { id: 'float-idle', name: 'Floating Idle', cat: 'camera', origin: 'ARCHIVE', trigger: 'AUTO', duration: '3.2s loop', easing: 'sine', tags: ['bob', 'pickup', 'idle'], desc: 'Pickup bob cycle with phased sine offsets and contact shadows breathing in counterphase.', Component: FloatIdle },
];
