import { useEffect, useRef, useState } from "react";

/* Animated numeric counter with cubic ease-out — mimic of Phaser tweened counter */
export function useCountUp(value: number, duration = 700): number {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

/* Deterministic PRNG so chart demos render identical data every mount */
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const fmt = (n: number) => n.toLocaleString("en-US");

/* Haptic shortcuts — in the real app these proxy Telegram.WebApp.HapticFeedback */
export function buzz(pattern: number | number[] = 12) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* noop — haptics are progressive enhancement */
  }
}

export const HAPTIC: Record<string, number[]> = {
  light: [8],
  medium: [18],
  heavy: [34],
  success: [14, 40, 14],
  error: [50, 30, 50],
  seal: [20, 60, 20, 60, 45],
  tick: [5],
};

/* Interval that only ticks while `active` — pairs with useInView in demos */
export function useInterval(cb: () => void, ms: number, active: boolean) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms, active]);
}
