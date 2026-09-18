import { useEffect, useRef } from 'react';
import { R } from './core';

export type Shape = 'rect' | 'coin' | 'circle' | 'soft' | 'star' | 'shard' | 'plus' | 'bolt';

export interface P {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; rot: number; vr: number;
  color: string; shape: Shape; grav: number; drag: number; seed: number;
  grow?: number; segs?: { x: number; y: number }[];
}

export type Spawn = (ps: P[], w: number, h: number, x: number, y: number) => void;

/** Midpoint-displacement lightning polyline. */
export function boltPts(x0: number, y0: number, x1: number, y1: number, iters = 5) {
  let pts = [{ x: x0, y: y0 }, { x: x1, y: y1 }];
  for (let i = 0; i < iters; i++) {
    const next = [pts[0]];
    for (let j = 0; j < pts.length - 1; j++) {
      const a = pts[j], b = pts[j + 1];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const off = (Math.random() - 0.5) * len * 0.42;
      next.push({ x: mx - (dy / len) * off, y: my + (dx / len) * off }, b);
    }
    pts = next;
  }
  return pts;
}

function drawP(ctx: CanvasRenderingContext2D, p: P) {
  const t = p.life / p.max; // 1 -> 0
  ctx.save();
  ctx.translate(p.x, p.y);
  switch (p.shape) {
    case 'rect': {
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, t * 1.5);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
      break;
    }
    case 'coin': {
      const sx = Math.max(0.18, Math.abs(Math.cos((1 - t) * 7 + p.seed)));
      ctx.scale(sx, 1);
      ctx.globalAlpha = Math.min(1, t * 2);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 7); ctx.fill();
      ctx.globalAlpha *= 0.45;
      ctx.lineWidth = 1; ctx.strokeStyle = '#5b3a06'; ctx.stroke();
      break;
    }
    case 'circle':
    case 'soft': {
      const r = p.size * (p.grow ? 1 + (1 - t) * p.grow : 1);
      ctx.globalAlpha = (p.shape === 'soft' ? 0.2 : 0.9) * t;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
      break;
    }
    case 'star': {
      const s = Math.max(0.5, p.size * t);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, t * 1.7);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fill();
      break;
    }
    case 'shard': {
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, t * 1.5);
      ctx.fillStyle = p.color;
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s); ctx.lineTo(s * 0.72, s * 0.8); ctx.lineTo(-s * 0.72, s * 0.6);
      ctx.closePath(); ctx.fill();
      break;
    }
    case 'plus': {
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.sin(Math.PI * Math.min(1, 1 - t)) * 0.95;
      ctx.fillStyle = p.color;
      const s = p.size;
      ctx.fillRect(-s / 2, -s * 0.16, s, s * 0.32);
      ctx.fillRect(-s * 0.16, -s / 2, s * 0.32, s);
      break;
    }
    case 'bolt': {
      if (!p.segs) break;
      ctx.globalAlpha = t * (0.5 + Math.random() * 0.5);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(167,139,250,.5)'; ctx.lineWidth = 7;
      ctx.shadowColor = '#8b5cf6'; ctx.shadowBlur = 14;
      ctx.beginPath();
      p.segs.forEach((s, i) => (i ? ctx.lineTo(s.x, s.y) : ctx.moveTo(s.x, s.y)));
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath();
      p.segs.forEach((s, i) => (i ? ctx.lineTo(s.x, s.y) : ctx.moveTo(s.x, s.y)));
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

/**
 * Interactive particle stage. Tap to fire `spawn`; `auto` ms re-fires on a timer;
 * `ambient` keeps emitting at the pointer (or an orbiting idle point).
 */
export function FXStage({ spawn, auto = 0, ambient = false, cap = 360 }: {
  spawn: Spawn; auto?: number; ambient?: boolean; cap?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const spawnRef = useRef(spawn);
  spawnRef.current = spawn;
  const fireRef = useRef<(x: number, y: number) => void>(() => {});
  const S = useRef({ ps: [] as P[], inView: true, px: 0, py: 0, inside: false });

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const io = new IntersectionObserver((es) => { S.current.inView = es[0].isIntersecting; }, { threshold: 0.05 });
    io.observe(cv);
    const fire = (x: number, y: number) => {
      spawnRef.current(S.current.ps, cv.width / dpr, cv.height / dpr, x, y);
      const over = S.current.ps.length - cap;
      if (over > 0) S.current.ps.splice(0, over);
    };
    fireRef.current = fire;
    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(50, t - last);
      last = t;
      if (document.hidden || !S.current.inView) return;
      const w = cv.width / dpr, h = cv.height / dpr;
      const f = dt / 16.66;
      if (auto > 0) {
        acc += dt;
        if (acc >= auto) { acc = 0; fire(R(w * 0.25, w * 0.75), R(h * 0.3, h * 0.72)); }
      }
      if (ambient) {
        const s = S.current;
        const ex = s.inside ? s.px : w / 2 + Math.cos(t / 780) * w * 0.2;
        const ey = s.inside ? s.py : h * 0.42 + Math.sin(t / 960) * h * 0.16;
        spawnRef.current(s.ps, w, h, ex, ey);
        const over = s.ps.length - cap;
        if (over > 0) s.ps.splice(0, over);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const ps = S.current.ps;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life -= f;
        p.vy += p.grav * f;
        const d = Math.pow(p.drag, f);
        p.vx *= d; p.vy *= d;
        p.x += p.vx * f; p.y += p.vy * f;
        p.rot += p.vr * f;
        if (p.life <= 0) { ps.splice(i, 1); continue; }
        drawP(ctx, p);
      }
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [auto, ambient, cap]);

  return (
    <div
      className="absolute inset-0"
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        fireRef.current(e.clientX - r.left, e.clientY - r.top);
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        S.current.px = e.clientX - r.left;
        S.current.py = e.clientY - r.top;
        S.current.inside = true;
      }}
      onPointerLeave={() => { S.current.inside = false; }}
    >
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
