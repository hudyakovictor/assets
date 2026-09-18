import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { Crosshair, Gem, MousePointerClick, Shield, Zap } from "lucide-react";
import { Btn, StageNote, rand } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* CTL-01 — VIRTUAL STICK                                              */
/* ------------------------------------------------------------------ */
const R = 46;

export function JoystickDemo() {
  const baseRef = useRef<HTMLDivElement>(null);
  const [vec, setVec] = useState({ x: 0, y: 0 });
  const [on, setOn] = useState(false);
  const vecRef = useRef(vec);
  vecRef.current = vec;
  const [cam, setCam] = useState({ x: 0, y: 0 });

  useAnimationFrame((_, d) => {
    if (!on) return;
    setCam((c) => ({
      x: c.x - vecRef.current.x * 0.03 * d,
      y: c.y - vecRef.current.y * 0.03 * d,
    }));
  });

  const applyPoint = (e: React.PointerEvent) => {
    const r = baseRef.current?.getBoundingClientRect();
    if (!r) return;
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx = (dx / len) * R;
      dy = (dy / len) * R;
    }
    setVec({ x: dx, y: dy });
  };

  const power = Math.min(1, Math.hypot(vec.x, vec.y) / R);
  const ang = (Math.atan2(vec.y, vec.x) * 180) / Math.PI;
  const gate = Math.round(((ang + 360 + 22.5) % 360) / 45) % 8;

  return (
    <div className="absolute inset-0 select-none overflow-hidden">
      {/* parallax camera field */}
      <div
        className="stage-dots-dense pointer-events-none absolute -inset-24 opacity-60"
        style={{ transform: `translate(${cam.x % 24}px, ${cam.y % 24}px)` }}
      />
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        dx {(vec.x / R).toFixed(2)} · dy {(vec.y / R).toFixed(2)} · pwr {(power * 100) | 0}%
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={baseRef}
          className="relative h-36 w-36 cursor-grab touch-none rounded-full border border-line2 bg-panel2/80 active:cursor-grabbing"
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            setOn(true);
            applyPoint(e);
          }}
          onPointerMove={(e) => on && applyPoint(e)}
          onPointerUp={() => {
            setOn(false);
            setVec({ x: 0, y: 0 });
          }}
          onPointerCancel={() => {
            setOn(false);
            setVec({ x: 0, y: 0 });
          }}
        >
          {/* 8-way gates */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * 45 - 90) * (Math.PI / 180);
            const lit = power > 0.4 && gate === i;
            return (
              <span
                key={i}
                className={cn(
                  "absolute h-1.5 w-1.5 rounded-full transition-colors duration-150",
                  lit ? "bg-volt shadow-[0_0_10px_var(--color-volt)]" : "bg-line2"
                )}
                style={{
                  left: `calc(50% + ${Math.cos(a) * 62}px - 3px)`,
                  top: `calc(50% + ${Math.sin(a) * 62}px - 3px)`,
                }}
              />
            );
          })}
          {/* knob */}
          <motion.div
            className="absolute top-1/2 left-1/2 -mt-7 -ml-7 flex h-14 w-14 items-center justify-center rounded-full border-2 border-volt bg-ink shadow-[0_0_24px_rgba(215,255,62,0.25)]"
            animate={{ x: vec.x, y: vec.y, scale: on ? 1.06 : 1 }}
            transition={
              on
                ? { type: "tween", duration: 0.04 }
                : { type: "spring", stiffness: 420, damping: 16, mass: 0.7 }
            }
          >
            <Crosshair className="h-5 w-5 text-volt" />
          </motion.div>
          <span className="absolute inset-x-0 -bottom-7 text-center font-mono text-[9px] tracking-[0.2em] text-fog uppercase">
            {on ? "TRACKING" : "RELEASE → SPRING"}
          </span>
        </div>
      </div>
      <StageNote>зажми и тяни · камера движется в параллаксе</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTL-02 — CHARGE & RELEASE                                           */
/* ------------------------------------------------------------------ */
export function ChargeDemo() {
  const [charge, setCharge] = useState(0);
  const holdRef = useRef(false);
  const chargeRef = useRef(0);
  const [bursts, setBursts] = useState<{ id: number; power: number }[]>([]);

  useAnimationFrame((_, d) => {
    if (holdRef.current && chargeRef.current < 1) {
      chargeRef.current = Math.min(1, chargeRef.current + d / 950);
      setCharge(chargeRef.current);
    }
  });

  const release = () => {
    if (!holdRef.current) return;
    holdRef.current = false;
    const p = chargeRef.current;
    if (p > 0.12) {
      const id = Date.now();
      setBursts((b) => [...b, { id, power: p }]);
      window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900);
    }
    chargeRef.current = 0;
    setCharge(0);
  };

  const maxed = charge > 0.985;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        {maxed ? "MAXIMUM" : `charge ${(charge * 100) | 0}%`}
      </div>

      <div className="relative">
        {/* burst particles */}
        {bursts.map((b) => (
          <div key={b.id} className="pointer-events-none absolute top-1/2 left-1/2 z-0">
            {Array.from({ length: Math.round(10 + b.power * 22) }).map((_, i, arr) => {
              const a = (i / arr.length) * Math.PI * 2 + rand(-0.2, 0.2);
              const dist = (46 + rand(20, 90)) * (0.4 + b.power);
              return (
                <motion.span
                  key={i}
                  className={cn(
                    "absolute block h-1.5 w-1.5 rounded-full",
                    b.power > 0.9 ? "bg-amb" : "bg-volt"
                  )}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(a) * dist,
                    y: Math.sin(a) * dist + 24,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                />
              );
            })}
          </div>
        ))}

        <motion.button
          type="button"
          className={cn(
            "relative z-10 flex h-28 w-28 cursor-pointer touch-none items-center justify-center overflow-hidden rounded-2xl border-2 transition-colors",
            maxed ? "border-amb shadow-[0_0_36px_rgba(255,180,58,0.4)]" : "border-volt"
          )}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            holdRef.current = true;
          }}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          animate={{ scale: charge > 0 ? 0.94 + charge * 0.1 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
        >
          {/* charge fill */}
          <div
            className="absolute inset-x-0 bottom-0 bg-volt/25 transition-[height] duration-75"
            style={{ height: `${charge * 100}%` }}
          />
          {maxed && (
            <motion.span
              className="absolute inset-0 border-2 border-amb"
              initial={{ opacity: 0.8, scale: 0.9 }}
              animate={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
          <Zap
            className={cn(
              "relative z-10 h-9 w-9 transition-colors",
              maxed ? "text-amb" : charge > 0.4 ? "text-volt" : "text-fog"
            )}
            fill={charge > 0.4 ? "currentColor" : "none"}
          />
        </motion.button>
      </div>

      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-line">
        <div
          className={cn("h-full transition-[width] duration-75", maxed ? "bg-amb" : "bg-volt")}
          style={{ width: `${charge * 100}%` }}
        />
      </div>
      <StageNote>держи кнопку · отпусти для залпа</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTL-03 — SWIPE LANES                                                */
/* ------------------------------------------------------------------ */
const LANES = [
  { name: "ВЕРХ", color: "text-cyc", border: "border-cyc" },
  { name: "ЦЕНТР", color: "text-volt", border: "border-volt" },
  { name: "ЛЕС", color: "text-amb", border: "border-amb" },
];

export function LanesDemo() {
  const [lane, setLane] = useState(1);
  const [flash, setFlash] = useState(0);
  const clampLane = (l: number) => Math.max(0, Math.min(2, l));

  const go = (l: number) => {
    setLane(clampLane(l));
    setFlash((f) => f + 1);
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden select-none">
      <div className="pointer-events-none absolute top-2 left-3 z-10 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        lane → {LANES[lane].name}
      </div>
      <div className="relative mx-4 mt-8 mb-3 flex flex-1 overflow-hidden rounded-lg border border-line">
        {LANES.map((l, i) => (
          <div
            key={l.name}
            className={cn(
              "flex h-full w-1/3 items-start justify-center border-line pt-2 transition-colors",
              i < 2 && "border-r",
              lane === i && "bg-white/[0.03]"
            )}
          >
            <span className={cn("font-mono text-[9px] tracking-[0.25em]", l.color)}>{l.name}</span>
          </div>
        ))}
        {/* the creep card */}
        <motion.div
          className="absolute top-1/2 left-0 z-10 w-1/3 -translate-y-1/2 cursor-grab touch-none p-2 active:cursor-grabbing"
          animate={{ x: `${lane * 100}%` }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            const dir = info.offset.x > 40 ? 1 : info.offset.x < -40 ? -1 : 0;
            if (dir !== 0) go(lane + dir);
            else setFlash((f) => f + 1);
          }}
        >
          <motion.div
            key={flash}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.25 }}
            className={cn(
              "flex h-24 flex-col items-center justify-center gap-1.5 rounded-lg border-2 bg-panel2 shadow-lg",
              LANES[lane].border
            )}
            whileDrag={{ scale: 1.06, boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}
          >
            <Shield className={cn("h-6 w-6", LANES[lane].color)} />
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-snow">КРИП</span>
            <span className="font-mono text-[8px] tracking-widest text-fog">LVL 4</span>
          </motion.div>
        </motion.div>
      </div>
      <div className="flex items-center justify-center gap-2 pb-4">
        <Btn tone="ghost" onClick={() => go(lane - 1)} disabled={lane === 0}>
          ← левее
        </Btn>
        <Btn tone="ghost" onClick={() => go(lane + 1)} disabled={lane === 2}>
          правее →
        </Btn>
      </div>
      <StageNote>тяни карточку или жми стрелки</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTL-04 — DRAG TO SOCKET                                             */
/* ------------------------------------------------------------------ */
export function DragDropDemo() {
  const socketRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [done, setDone] = useState(0);

  const overSocket = (e: unknown) => {
    const r = socketRef.current?.getBoundingClientRect();
    const p = e as { clientX: number; clientY: number };
    if (!r) return false;
    return p.clientX > r.left - 8 && p.clientX < r.right + 8 && p.clientY > r.top - 8 && p.clientY < r.bottom + 8;
  };

  useEffect(() => {
    if (done === 0) return;
    const t = window.setTimeout(() => setDone(0), 1400);
    return () => window.clearTimeout(t);
  }, [done]);

  return (
    <div ref={areaRef} className="absolute inset-0 flex items-center justify-around overflow-hidden px-6 select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        {placed ? "socketed" : "drag → drop"}
      </div>

      {/* item */}
      <div className="relative z-10">
        <AnimatePresence>
          {!placed && (
            <motion.div
              key="gem"
              className="flex h-16 w-16 cursor-grab touch-none items-center justify-center rounded-xl border-2 border-vio bg-panel2 shadow-[0_0_20px_rgba(167,139,255,0.3)] active:cursor-grabbing"
              drag
              dragConstraints={areaRef}
              dragElastic={0.12}
              whileDrag={{ scale: 1.12, rotate: 4, zIndex: 30 }}
              onDrag={(e) => setHot(overSocket(e))}
              onDragEnd={(e) => {
                if (overSocket(e)) {
                  setPlaced(true);
                  setHot(false);
                  setDone((d) => d + 1);
                }
                setHot(false);
              }}
              exit={{ scale: 0.4, opacity: 0 }}
            >
              <Gem className="h-7 w-7 text-vio" />
            </motion.div>
          )}
        </AnimatePresence>
        {!placed && (
          <span className="absolute inset-x-0 -bottom-6 text-center font-mono text-[8px] tracking-[0.2em] text-fog uppercase">
            руна
          </span>
        )}
      </div>

      {/* socket */}
      <div className="relative">
        <motion.div
          ref={socketRef}
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed transition-colors",
            hot ? "border-volt bg-volt/10" : placed ? "border-solid border-vio bg-vio/10" : "border-line2"
          )}
          animate={hot ? { scale: 1.08 } : { scale: 1 }}
        >
          {placed ? (
            <motion.div
              initial={{ scale: 1.5, rotate: 12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              <Gem className="h-8 w-8 text-vio" />
            </motion.div>
          ) : (
            <MousePointerClick className="h-5 w-5 text-line2" />
          )}
        </motion.div>
        {placed && (
          <motion.div
            key={done}
            initial={{ opacity: 0.9, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.7 }}
            className="pointer-events-none absolute inset-0 rounded-xl border-2 border-volt"
          />
        )}
        <span className="absolute inset-x-0 -bottom-6 text-center font-mono text-[8px] tracking-[0.2em] text-fog uppercase">
          гнездо
        </span>
      </div>

      <AnimatePresence>
        {placed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 flex items-center gap-2"
          >
            <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-volt">
              +12 К ЗАЩИТЕ
            </span>
            <Btn tone="ghost" onClick={() => setPlaced(false)}>
              вынуть
            </Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
