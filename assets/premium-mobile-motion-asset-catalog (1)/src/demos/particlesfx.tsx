import { Coins, Sparkles, Gem, Cloud, Flame, Zap, HeartPulse, Stars } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { R, pick } from '../lib/core';
import { FXStage, boltPts } from '../lib/particles';
import type { Spawn } from '../lib/particles';

const spawns: Record<string, Spawn> = {
  coins: (ps, _w, _h, x, y) => {
    for (let i = 0; i < 16; i++) {
      const a = R(-Math.PI / 2 - 0.85, -Math.PI / 2 + 0.85);
      const sp = R(3.2, 8);
      ps.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: R(52, 92), max: 92, size: R(4, 7), rot: 0, vr: 0, color: pick(['#fbbf24', '#fde68a', '#f59e0b']), shape: 'coin', grav: 0.26, drag: 0.996, seed: R(0, 9) });
    }
  },
  confetti: (ps, _w, _h, x, y) => {
    for (let i = 0; i < 26; i++) {
      const a = R(-Math.PI / 2 - 1.1, -Math.PI / 2 + 1.1);
      const sp = R(2.4, 7);
      ps.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: R(60, 110), max: 110, size: R(5, 9), rot: R(0, 6), vr: R(-0.22, 0.22), color: pick(['#f472b6', '#22d3ee', '#fbbf24', '#4ade80', '#a78bfa', '#fb7185']), shape: 'rect', grav: 0.14, drag: 0.99, seed: 0 });
    }
  },
  shards: (ps, _w, _h, x, y) => {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + R(-0.2, 0.2);
      const sp = R(2, 6.5);
      ps.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, life: R(50, 90), max: 90, size: R(5, 9), rot: a, vr: R(-0.16, 0.16), color: pick(['#34d399', '#67e8f9', '#f0abfc', '#fde68a']), shape: 'shard', grav: 0.28, drag: 0.985, seed: 0 });
    }
  },
  smoke: (ps, _w, _h, x, y) => {
    for (let i = 0; i < 9; i++) {
      ps.push({ x: x + R(-6, 6), y: y + R(-4, 4), vx: R(-0.45, 0.45), vy: R(-1.2, -0.5), life: R(55, 95), max: 95, size: R(9, 16), rot: 0, vr: 0, color: pick(['#9ca3af', '#d1d5db', '#6b7280']), shape: 'soft', grav: -0.004, drag: 0.995, seed: 0, grow: 2.6 });
    }
  },
  spark: (ps, _w, _h, x, y) => {
    if (ps.length > 150) return;
    for (let i = 0; i < 2; i++) {
      ps.push({ x: x + R(-6, 6), y: y + R(-6, 6), vx: R(-0.5, 0.5), vy: R(-0.45, 0.15), life: R(22, 44), max: 44, size: R(4, 9), rot: R(0, 3), vr: R(-0.06, 0.06), color: pick(['#ffffff', '#67e8f9', '#f0abfc', '#fde68a']), shape: 'star', grav: 0, drag: 1, seed: 0 });
    }
  },
  fire: (ps, w, h) => {
    if (ps.length > 160) return;
    const cx = w / 2, cy = h * 0.62;
    const a = R(0, Math.PI * 2);
    const rr = R(20, 30);
    ps.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 0.32, vx: R(-0.1, 0.1), vy: R(-1.7, -0.9), life: R(34, 58), max: 58, size: R(2.5, 5.5), rot: 0, vr: 0, color: pick(['#f97316', '#fbbf24', '#ef4444', '#fdba74']), shape: 'soft', grav: -0.012, drag: 0.99, seed: 0, grow: 1.4 });
  },
  heal: (ps, w, h) => {
    if (ps.length > 110) return;
    const cx = w / 2, cy = h * 0.6;
    const a = R(0, Math.PI * 2);
    const rr = R(6, 36);
    ps.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 0.5, vx: R(-0.08, 0.08), vy: R(-0.95, -0.5), life: R(50, 85), max: 85, size: R(5, 9), rot: 0, vr: R(-0.02, 0.02), color: pick(['#4ade80', '#86efac', '#bbf7d0']), shape: 'plus', grav: -0.004, drag: 1, seed: 0 });
  },
  bolt: (ps, w, h, x, y) => {
    const targets: [number, number][] = [[R(w * 0.15, w * 0.85), R(h * 0.15, h * 0.6)], [R(w * 0.2, w * 0.8), h * 0.85], [R(w * 0.1, w * 0.5), R(h * 0.2, h * 0.8)]];
    for (const [tx, ty] of targets) {
      ps.push({ x, y, vx: 0, vy: 0, life: R(11, 17), max: 17, size: 1, rot: 0, vr: 0, color: '#a78bfa', shape: 'bolt', grav: 0, drag: 1, seed: 0, segs: boltPts(x, y, tx, ty) });
    }
  },
};

function FxDemo({ icon: Icon, tint, spawn, auto, ambient, note }: {
  icon: LucideIcon; tint: string; spawn: Spawn; auto?: number; ambient?: boolean; note: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle, ${tint}2e, transparent 70%)` }} />
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border bg-black/30" style={{ borderColor: `${tint}55` }}>
          <Icon className="h-5 w-5" style={{ color: tint }} />
        </div>
      </div>
      <FXStage spawn={spawn} auto={auto} ambient={ambient} />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">{note}</div>
    </div>
  );
}

export const assets: AssetDef[] = [
  { id: 'coin-fountain', name: 'Coin Fountain', cat: 'particles', origin: 'ARCHIVE', trigger: 'TAP', duration: '≈1.5s', easing: 'gravity 0.26', tags: ['loot', 'physics', 'econ'], desc: 'Sixteen gravity-driven coins with flip-spin and rim stroke. The sound of a dungeon paying out.', Component: () => (<FxDemo icon={Coins} tint="#fbbf24" spawn={spawns.coins} note="16 COINS / TAP · GRAV 0.26" />) },
  { id: 'confetti-burst', name: 'Confetti Burst', cat: 'particles', origin: 'ARCHIVE', trigger: 'AUTO', duration: '≈1.8s', easing: 'drag 0.99', tags: ['celebration', 'win'], desc: 'Multi-hue confetti salvo with flutter rotation and air drag. Victory screens, first-load celebrations.', Component: () => (<FxDemo icon={Sparkles} tint="#f472b6" spawn={spawns.confetti} auto={2600} note="26 PIECES · AUTO 2.6s" />) },
  { id: 'sparkle-trail', name: 'Sparkle Trail', cat: 'particles', origin: 'EXPANSION', trigger: 'HOVER', duration: 'continuous', easing: 'twinkle sin', tags: ['pointer', 'magic', 'trail'], desc: 'Pointer-reactive star dust. Remove your finger and the emitter keeps orbiting on its own.', Component: () => (<FxDemo icon={Stars} tint="#67e8f9" spawn={spawns.spark} ambient note="POINTER-REACTIVE EMITTER" />) },
  { id: 'loot-shards', name: 'Loot Shards', cat: 'particles', origin: 'EXPANSION', trigger: 'AUTO', duration: '≈1.5s', easing: 'radial burst', tags: ['gems', 'detonation'], desc: 'Twelve-way gem-shard detonation with even angular spread. Chest pops, golem kills, piñatas.', Component: () => (<FxDemo icon={Gem} tint="#34d399" spawn={spawns.shards} auto={2800} note="12-WAY RADIAL · AUTO 2.8s" />) },
  { id: 'smoke-poof', name: 'Smoke Poof', cat: 'particles', origin: 'ARCHIVE', trigger: 'AUTO', duration: '≈1.6s', easing: 'grow 2.6×', tags: ['dust', 'soft', 'vanish'], desc: 'Soft-body smoke puffs that balloon 2.6× while fading. Teleports, despawn, cartoon dashes.', Component: () => (<FxDemo icon={Cloud} tint="#9ca3af" spawn={spawns.smoke} auto={2300} note="9 PUFFS · AUTO 2.3s" />) },
  { id: 'fire-ring', name: 'Fire Ring', cat: 'particles', origin: 'EXPANSION', trigger: 'AUTO', duration: 'loop', easing: 'rise −1.7vy', tags: ['elemental', 'buff', 'portal'], desc: 'Self-sustaining elemental ring for buff zones, portals and enrage states. Zero input required.', Component: () => (<FxDemo icon={Flame} tint="#f97316" spawn={spawns.fire} ambient note="SELF-SUSTAINING RING" />) },
  { id: 'lightning-arc', name: 'Lightning Arc', cat: 'particles', origin: 'EXPANSION', trigger: 'AUTO', duration: '≈0.3s', easing: 'flicker 50%', tags: ['electric', 'bolt', 'storm'], desc: 'Midpoint-displacement bolts with violet glow shell and white-hot flicker core. Tap to aim the storm.', Component: () => (<FxDemo icon={Zap} tint="#a78bfa" spawn={spawns.bolt} auto={2400} note="3 FORKS · AUTO 2.4s" />) },
  { id: 'heal-aura', name: 'Healing Aura', cat: 'particles', origin: 'EXPANSION', trigger: 'AUTO', duration: 'loop', easing: 'sin in/out', tags: ['holy', 'regen', 'revive'], desc: 'Rising restorative glyphs with sine fade-in/out. Regen zones, revives, sanctuary saves.', Component: () => (<FxDemo icon={HeartPulse} tint="#4ade80" spawn={spawns.heal} ambient note="REGEN ZONE LOOP" />) },
];
