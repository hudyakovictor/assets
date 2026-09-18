import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));
export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const deg2rad = (d: number) => (d * Math.PI) / 180;
export const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos(deg2rad(deg)),
  y: cy + r * Math.sin(deg2rad(deg)),
});

type Tone = "volt" | "ghost" | "red" | "cyan" | "amber";

export function Btn({
  children,
  onClick,
  tone = "volt",
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: Tone;
  className?: string;
  disabled?: boolean;
}) {
  const styles: Record<Tone, string> = {
    volt: "bg-volt text-ink border-volt hover:bg-snow hover:border-snow",
    ghost: "bg-transparent text-fog border-line2 hover:text-snow hover:border-fog",
    red: "bg-blood/15 text-blood border-blood/50 hover:bg-blood hover:text-ink",
    cyan: "bg-cyc/10 text-cyc border-cyc/50 hover:bg-cyc hover:text-ink",
    amber: "bg-amb/10 text-amb border-amb/50 hover:bg-amb hover:text-ink",
  };
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.92 }}
      whileHover={disabled ? undefined : { y: -1 }}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "pointer-events-auto inline-flex cursor-pointer select-none items-center justify-center gap-1.5 rounded-md border px-3 py-2 font-mono text-[10px] font-bold tracking-[0.18em] uppercase transition-colors",
        disabled && "cursor-not-allowed opacity-40",
        styles[tone],
        className
      )}
    >
      {children}
    </motion.button>
  );
}

export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border border-line2 bg-panel2 px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-fog uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Lossless ring gauge used by cooldowns / respawn / xp */
export function RingGauge({
  size = 52,
  stroke = 4,
  frac,
  color = "var(--color-volt)",
  track = "rgba(255,255,255,0.08)",
  children,
}: {
  size?: number;
  stroke?: number;
  frac: number; // 0..1 remaining
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - Math.max(0, Math.min(1, frac)))}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

export function StageNote({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute bottom-2 left-3 z-20 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
      {children}
    </div>
  );
}
