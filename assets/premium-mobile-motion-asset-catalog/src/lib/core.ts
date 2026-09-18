import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Clapperboard, Zap, Sparkles, Gauge, Trophy, Type, Pointer, LayoutDashboard, Video,
} from 'lucide-react';

export type Origin = 'ARCHIVE' | 'EXPANSION';
export type Trigger = 'AUTO' | 'TAP' | 'HOLD' | 'DRAG' | 'HOVER';

export interface AssetDef {
  id: string;
  name: string;
  cat: string;
  origin: Origin;
  trigger: Trigger;
  duration: string;
  easing: string;
  tags: string[];
  desc: string;
  Component: ComponentType;
}

export interface Category {
  id: string;
  label: string;
  color: string;
  icon: LucideIcon;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: 'transitions', label: 'Scene Transitions', color: '#22d3ee', icon: Clapperboard, blurb: 'Level-to-level wipes, warps & cuts. The handshake between worlds.' },
  { id: 'gamefeel', label: 'Game Feel & Juice', color: '#fb7185', icon: Zap, blurb: 'Impact physics — shake, stop, squash. Why hits feel expensive.' },
  { id: 'particles', label: 'Particles & FX', color: '#a78bfa', icon: Sparkles, blurb: 'Canvas emitters: coins, bolts, auras. 60fps reward weather.' },
  { id: 'hud', label: 'HUD & Feedback', color: '#4ade80', icon: Gauge, blurb: 'Bars, radials, tickers. The UI that argues back when punched.' },
  { id: 'rewards', label: 'Rewards & Meta', color: '#fbbf24', icon: Trophy, blurb: 'Gacha reveals, chests, streaks — dopamine choreography.' },
  { id: 'text', label: 'Kinetic Type', color: '#f472b6', icon: Type, blurb: 'Typography that moves like it was directed, not rendered.' },
  { id: 'touch', label: 'Touch & Gesture', color: '#60a5fa', icon: Pointer, blurb: 'Ripples, magnets, tilt — input you can feel through glass.' },
  { id: 'menu', label: 'Menu & Nav Motion', color: '#2dd4bf', icon: LayoutDashboard, blurb: 'Cascades, sheets, blooms — screens with stage presence.' },
  { id: 'camera', label: 'Camera & World', color: '#fb923c', icon: Video, blurb: 'Parallax rigs, lag follow, zoom punches. The invisible cameraman.' },
];

export const catOf = (id: string): Category => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];

export const R = (a: number, b: number) => a + Math.random() * (b - a);
export const RI = (a: number, b: number) => Math.round(R(a, b));
export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Increments every `ms` — drives keyed animation replays. */
export function useCycle(ms: number, active = true) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setK((x) => x + 1), ms);
    return () => clearInterval(t);
  }, [ms, active]);
  return k;
}

/** Cycle + scene index that flips mid-cover for transition demos. */
export function useWipe(swapAt = 420, cycle = 2600) {
  const k = useCycle(cycle);
  const [scene, setScene] = useState(0);
  useEffect(() => {
    if (k === 0) return;
    const t = setTimeout(() => setScene((s) => s + 1), swapAt);
    return () => clearTimeout(t);
  }, [k, swapAt]);
  return { k, scene };
}
