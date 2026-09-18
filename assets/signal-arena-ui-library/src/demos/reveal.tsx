import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Brain,
  ChevronRight,
  Flame,
  Gauge,
  HeartPulse,
  Share2,
  Skull,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { buzz, fmt, HAPTIC, useCountUp } from "../lib/fx";
import { cn } from "../utils/cn";

/* small rAF number */
function Num({ to, active, className }: { to: number; active: boolean; className?: string }) {
  const v = useCountUp(active ? to : 0, 900);
  return <span className={className}>{fmt(v)}</span>;
}

/* ---------------------------------- D-02 ---------------------------------- */
const ROWS = [
  { k: "TIMING", v: 86, c: "#c9ff2e" },
  { k: "DIRECTION", v: 92, c: "#31e58c" },
  { k: "RISK", v: 61, c: "#ffc24b" },
  { k: "DISCIPLINE", v: 74, c: "#4bd9ff" },
];

export function ScoreDemo() {
  const [step, setStep] = useState(0); // 0 idle, 1 grade, 2 ring+rows, 3 total

  const reveal = () => {
    buzz(HAPTIC.medium);
    setStep(1);
    setTimeout(() => setStep(2), 500);
    setTimeout(() => {
      setStep(3);
      buzz(HAPTIC.success);
    }, 1500);
  };

  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      <div className="absolute top-12 text-center">
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">scenario #042 — verdict</div>
      </div>

      {/* grade + ring */}
      <div className="relative grid place-items-center">
        <svg width="150" height="150" viewBox="0 0 130 130" className="-rotate-90">
          <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(242,240,232,0.08)" strokeWidth="9" />
          <motion.circle
            cx="65"
            cy="65"
            r={R}
            fill="none"
            stroke="#c9ff2e"
            strokeWidth="9"
            strokeLinecap="butt"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: step >= 2 ? C * (1 - 0.78) : C }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute text-center">
          {step >= 1 ? (
            <motion.div
              initial={{ scale: 3.4, opacity: 0, rotate: 10 }}
              animate={{ scale: 1, opacity: 1, rotate: -4 }}
              transition={{ type: "spring", stiffness: 480, damping: 19 }}
              className="font-display text-6xl text-acid"
            >
              B+
            </motion.div>
          ) : (
            <div className="font-display text-6xl text-ink/10">?</div>
          )}
        </div>
      </div>

      {/* rows */}
      <div className="mt-6 w-full space-y-2.5">
        {ROWS.map((r, i) => (
          <motion.div
            key={r.k}
            initial={{ opacity: 0, x: -18 }}
            animate={step >= 2 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25 + i * 0.14, type: "spring", stiffness: 300, damping: 26 }}
          >
            <div className="mb-1 flex items-center justify-between font-mono text-[10px]">
              <span className="uppercase tracking-widest text-ink/50">{r.k}</span>
              <Num to={r.v} active={step >= 2} className="font-bold text-ink" />
            </div>
            <div className="h-2 w-full overflow-hidden rounded-sm bg-ink/8">
              <motion.div
                className="h-full origin-left rounded-sm"
                style={{ background: r.c }}
                initial={{ scaleX: 0 }}
                animate={step >= 2 ? { scaleX: r.v / 100 } : {}}
                transition={{ delay: 0.35 + i * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* total / cta */}
      <div className="mt-6 w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.button
              key="cta"
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={reveal}
              className="animate-pulse-ring pressable mx-auto flex items-center gap-2 rounded-full border-2 border-black bg-acid px-7 py-3.5 font-display text-lg uppercase tracking-widest text-black shadow-[4px_4px_0_#000]"
            >
              <Trophy className="size-5" /> reveal
            </motion.button>
          )}
          {step >= 3 && (
            <motion.div
              key="total"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-2">
                <Flame className="size-4 text-orange-400" />
                <span className="font-mono text-[10px] font-bold uppercase text-orange-400">streak 8 saved</span>
              </div>
              <button
                onClick={() => setStep(0)}
                className="pressable flex items-center gap-1.5 rounded-full border border-acid/50 px-4 py-2 font-mono text-[10px] font-bold uppercase text-acid"
              >
                next <ChevronRight className="size-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------- confetti -------------------------------- */
function ConfettiBurst() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const W = cv.clientWidth;
    const H = cv.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["#c9ff2e", "#ffc24b", "#f2f0e8", "#4bd9ff", "#ff3355"];
    const parts = Array.from({ length: 90 }, () => {
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 7;
      return {
        x: W / 2,
        y: H * 0.42,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 3,
        r: 2 + Math.random() * 3.4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0],
        life: 1,
      };
    });

    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const dt = t - t0;
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14;
        p.vx *= 0.985;
        p.rot += p.vr;
        p.life = Math.max(0, 1 - dt / 1500);
        if (p.life <= 0) continue;
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        // 4-point star
        ctx.beginPath();
        const r = p.r;
        ctx.moveTo(0, -r * 2);
        ctx.quadraticCurveTo(0, 0, r * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, r * 2);
        ctx.quadraticCurveTo(0, 0, -r * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r * 2);
        ctx.fill();
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

/* ---------------------------------- E-01 ---------------------------------- */
export function RewardDemo() {
  const [state, setState] = useState<"idle" | "open" | "claimed">("idle");
  const amount = useCountUp(state === "claimed" || state === "open" ? 150 : 0, 1100);

  const open = () => {
    setState("open");
    buzz(HAPTIC.medium);
  };
  const claim = () => {
    setState("claimed");
    buzz(HAPTIC.success);
    setTimeout(() => setState("idle"), 1600);
  };

  return (
    <div className="relative grid h-full place-items-center">
      <button
        onClick={open}
        className="pressable flex items-center gap-2 rounded-full border-2 border-black bg-acid px-6 py-3.5 font-display text-lg uppercase tracking-widest text-black shadow-[4px_4px_0_#000]"
      >
        <Sparkles className="size-5" /> complete mission
      </button>

      <AnimatePresence>
        {(state === "open" || state === "claimed") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 grid place-items-center bg-black/80 px-8"
          >
            <ConfettiBurst />
            <motion.div
              initial={{ scale: 0.7, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="relative rounded-3xl border-2 border-acid bg-coal px-8 py-8 text-center shadow-[0_0_60px_rgba(201,255,46,0.25)]"
            >
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
              >
                <Star className="mx-auto size-14 fill-amber text-amber" />
              </motion.div>
              <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-ink/50">
                daily triad cleared
              </div>
              <div className="mt-1 font-display text-6xl text-ink tabular-nums">
                +<Num to={150} active={state === "open"} className="tabular-nums" />
                <span className="ml-1 text-2xl text-amber">STARS</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40">
                ≈ {fmt(amount)}.00 exactly. no slippage here.
              </div>

              <div className="relative mt-5 h-[52px]">
                <AnimatePresence mode="wait">
                  {state === "open" ? (
                    <motion.button
                      key="claim"
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={claim}
                      className="pressable absolute inset-0 rounded-xl border-2 border-black bg-amber font-display text-lg uppercase tracking-widest text-black shadow-[3px_3px_0_#000]"
                    >
                      claim
                    </motion.button>
                  ) : (
                    <motion.div
                      key="done"
                      initial={{ scale: 2.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, rotate: -8 }}
                      className="absolute inset-0 grid place-items-center"
                    >
                      <span className="border-4 border-up px-4 py-1 font-display text-2xl uppercase tracking-widest text-up">
                        claimed
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- D-03 ---------------------------------- */
const TRAITS = [
  { k: "TIMING", v: 0.8, icon: Activity },
  { k: "RISK", v: 0.45, icon: Gauge },
  { k: "PATTERN", v: 0.7, icon: Brain },
  { k: "NERVES", v: 0.35, icon: HeartPulse },
  { k: "GREED CTRL", v: 0.86, icon: Skull },
];

function polar(cx: number, cy: number, r: number, i: number, n: number): [number, number] {
  const a = (Math.PI * 2 * i) / n - Math.PI / 2;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

export function InsightDemo() {
  const n = TRAITS.length;
  const cx = 120;
  const cy = 105;
  const R = 78;
  const pts = TRAITS.map((t, i) => polar(cx, cy, R * t.v, i, n).map((v) => v.toFixed(1)).join(",")).join(" ");
  const ring1 = TRAITS.map((_, i) => polar(cx, cy, R, i, n).join(",")).join(" ");
  const ring2 = TRAITS.map((_, i) => polar(cx, cy, R * 0.5, i, n).join(",")).join(" ");

  return (
    <div className="h-full overflow-y-auto px-5 pb-12 pt-12">
      <div className="sticker -rotate-2">weekly autopsy</div>
      <div className="mt-3 font-display text-2xl uppercase leading-tight">
        You cut winners
        <br />
        <span className="text-alarm">early.</span> Again.
      </div>

      <div className="relative mx-auto mt-3 w-[240px]">
        <svg viewBox="0 0 240 210" className="w-full">
          <polygon points={ring1} fill="none" stroke="rgba(242,240,232,0.12)" strokeDasharray="3 4" />
          <polygon points={ring2} fill="none" stroke="rgba(242,240,232,0.08)" strokeDasharray="3 4" />
          {TRAITS.map((t, i) => {
            const [x, y] = polar(cx, cy, R + 16, i, n);
            return (
              <text
                key={t.k}
                x={x}
                y={y}
                textAnchor="middle"
                className="fill-ink/50 font-mono"
                fontSize="7.5"
                fontWeight="700"
              >
                {t.k}
              </text>
            );
          })}
          <motion.g
            initial={{ scale: 0, opacity: 0, transformOrigin: "120px 105px" }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 160, damping: 20 }}
          >
            <polygon points={pts} fill="rgba(201,255,46,0.14)" stroke="#c9ff2e" strokeWidth="2" />
            {TRAITS.map((t, i) => {
              const [x, y] = polar(cx, cy, R * t.v, i, n);
              return <circle key={i} cx={x} cy={y} r="3" fill="#c9ff2e" />;
            })}
          </motion.g>
        </svg>
      </div>

      <div className="space-y-2.5">
        {[
          {
            icon: Skull,
            cls: "text-alarm border-alarm/50 bg-alarm/10",
            t: "CUTS WINNERS EARLY",
            d: "68% сделок закрыты до +1R. Прибыль пугает тебя больше убытка.",
          },
          {
            icon: HeartPulse,
            cls: "text-amber border-amber/50 bg-amber/10",
            t: "REVENGE TIMER: 06:12",
            d: "Среднее время от стопа до нового входа. Протокол — 20 минут.",
          },
        ].map((v, i) => (
          <motion.div
            key={v.t}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.18 }}
            className={cn("rounded-xl border-l-4 border p-3", v.cls)}
          >
            <div className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-ink">
              <v.icon className="size-4" /> {v.t}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-ink/60">{v.d}</p>
          </motion.div>
        ))}
      </div>

      <button className="pressable mx-auto mt-4 flex items-center gap-2 rounded-full border border-line px-4 py-2.5 font-mono text-[10px] font-bold uppercase text-ink/60">
        <Share2 className="size-3.5" /> leak your diagnosis
      </button>
    </div>
  );
}
