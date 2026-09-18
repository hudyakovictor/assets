import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import {
  Bomb,
  Crosshair,
  Flame,
  Heart,
  Shield,
  Swords,
  Target,
  Zap,
} from "lucide-react";
import { Btn, StageNote, polar, rand, randInt, pick } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* HUD-01 — HEALTH + GHOST BAR                                         */
/* ------------------------------------------------------------------ */
export function HealthDemo() {
  const MAX = 100;
  const [hp, setHp] = useState(84);
  const [flash, setFlash] = useState(0);
  const low = hp <= 30;

  const hit = (min: number, max: number) => {
    setHp((h) => Math.max(0, h - randInt(min, max)));
    setFlash((f) => f + 1);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 select-none">
      <div className="w-full max-w-xs">
        <div className="mb-1.5 flex items-end justify-between font-mono text-[10px] tracking-[0.18em]">
          <span className={cn("flex items-center gap-1", low ? "text-blood" : "text-fog")}>
            <Heart className="h-3 w-3" fill={low ? "currentColor" : "none"} />
            ОЗ {low && "· КРИТИЧНО"}
          </span>
          <motion.span key={hp} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className={low ? "text-blood" : "text-snow"}>
            {hp}/{MAX}
          </motion.span>
        </div>
        <motion.div
          className={cn("relative h-5 overflow-hidden rounded border", low ? "border-blood/60" : "border-line2 bg-panel")}
          animate={low ? { boxShadow: ["0 0 0px rgba(255,70,85,0)", "0 0 22px rgba(255,70,85,0.55)", "0 0 0px rgba(255,70,85,0)"] } : { boxShadow: "0 0 0px rgba(0,0,0,0)" }}
          transition={low ? { duration: 0.9, repeat: Infinity } : { duration: 0.3 }}
        >
          {/* ghost lag bar */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-snow/80"
            animate={{ width: `${hp}%` }}
            transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
          />
          {/* hp bar */}
          <motion.div
            className={cn("absolute inset-y-0 left-0", low ? "bg-blood" : "bg-volt")}
            animate={{ width: `${hp}%` }}
            transition={{ duration: 0.12 }}
          />
          {/* flash on hit */}
          {flash > 0 && (
            <motion.span
              key={flash}
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}
          {/* segments */}
          {[1, 2, 3].map((i) => (
            <span key={i} className="absolute inset-y-0 w-px bg-ink/70" style={{ left: `${i * 25}%` }} />
          ))}
        </motion.div>
      </div>
      <div className="flex gap-2">
        <Btn tone="red" onClick={() => hit(8, 16)}>
          удар
        </Btn>
        <Btn tone="amber" onClick={() => hit(20, 34)}>
          крит!
        </Btn>
        <Btn
          tone="ghost"
          onClick={() => setHp((h) => Math.min(MAX, h + 22))}
        >
          + хил
        </Btn>
        <Btn tone="ghost" onClick={() => setHp(MAX)}>
          сброс
        </Btn>
      </div>
      <StageNote>белый след — «отложенный» урон</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HUD-02 — COOLDOWN WHEELS                                            */
/* ------------------------------------------------------------------ */
const SKILLS = [
  { k: "Q", icon: Zap, cd: 4, name: "РАЗРЯД" },
  { k: "W", icon: Shield, cd: 7, name: "КУПОЛ" },
  { k: "E", icon: Crosshair, cd: 10, name: "ЗАХВАТ" },
  { k: "R", icon: Flame, cd: 16, name: "УЛЬТА" },
];

export function CooldownDemo() {
  const [ends, setEnds] = useState<number[]>([0, 0, 0, 0]);
  const [, setTick] = useState(0);
  const [readyPing, setReadyPing] = useState<[number, number] | null>(null);
  const wasCd = useRef([false, false, false, false]);

  useAnimationFrame(() => setTick((t) => t + 1));

  const now = performance.now();

  const cast = (i: number) => {
    setEnds((e) => {
      if (e[i] > now) return e;
      const n = [...e];
      n[i] = now + SKILLS[i].cd * 1000;
      return n;
    });
  };

  // readiness ping detector
  ends.forEach((end, i) => {
    const cd = end > now;
    if (wasCd.current[i] && !cd) setReadyPing([i, Date.now()]);
    wasCd.current[i] = cd;
  });

  useEffect(() => {
    if (!readyPing) return;
    const t = window.setTimeout(() => setReadyPing(null), 700);
    return () => window.clearTimeout(t);
  }, [readyPing]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 select-none">
      <div className="flex gap-4">
        {SKILLS.map((s, i) => {
          const left = Math.max(0, ends[i] - now);
          const frac = left / (s.cd * 1000);
          const active = left > 0;
          const C = 2 * Math.PI * 26;
          return (
            <div key={s.k} className="flex flex-col items-center gap-1.5">
              <motion.button
                type="button"
                onClick={() => cast(i)}
                whileTap={active ? undefined : { scale: 0.9 }}
                className={cn(
                  "relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border-2 transition-colors",
                  active ? "border-line2 bg-panel2/60" : "border-cyc/60 bg-panel2 hover:border-cyc"
                )}
              >
                <s.icon className={cn("h-6 w-6", active ? "text-line2" : "text-cyc")} />
                {active && (
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="rgba(6,7,11,0.68)"
                      stroke="var(--color-cyc)"
                      strokeWidth="3"
                      strokeDasharray={C}
                      strokeDashoffset={C * frac}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {active && (
                  <span className="absolute font-mono text-sm font-bold text-snow">
                    {(left / 1000).toFixed(0)}
                  </span>
                )}
                {readyPing && readyPing[0] === i && (
                  <motion.span
                    key={readyPing[1]}
                    className="absolute inset-0 rounded-xl border-2 border-volt"
                    initial={{ opacity: 1, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 1.3 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.button>
              <span className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-fog">
                <kbd className="rounded border border-line2 bg-panel px-1 text-[8px] text-snow">{s.k}</kbd>
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
      <Btn tone="ghost" onClick={() => setEnds([0, 0, 0, 0])}>
        сброс кд
      </Btn>
      <StageNote>жми способности · кольцо проточки в реальном времени</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HUD-03 — DAMAGE NUMBERS                                             */
/* ------------------------------------------------------------------ */
interface Dmg {
  id: number;
  x: number;
  y: number;
  v: number;
  crit: boolean;
  drift: number;
}

export function DamageDemo() {
  const [nums, setNums] = useState<Dmg[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [hits, setHits] = useState(0);
  const areaRef = useRef<HTMLDivElement>(null);

  const spawn = (clientX: number, clientY: number) => {
    const r = areaRef.current?.getBoundingClientRect();
    if (!r) return;
    const crit = Math.random() < 0.22;
    const d: Dmg = {
      id: Date.now() + Math.random(),
      x: clientX - r.left,
      y: clientY - r.top,
      v: crit ? randInt(380, 999) : randInt(24, 160),
      crit,
      drift: rand(-30, 30),
    };
    setNums((n) => [...n.slice(-14), d]);
    setHits((h) => h + 1);
    if (crit) setShakeKey((s) => s + 1);
    window.setTimeout(() => setNums((n) => n.filter((x) => x.id !== d.id)), 850);
  };

  return (
    <motion.div
      ref={areaRef}
      key={shakeKey}
      initial={false}
      animate={{ x: [0, -6, 5, -3, 0], y: [0, 4, -5, 2, 0] }}
      transition={{ duration: 0.32 }}
      className="absolute inset-0 cursor-crosshair overflow-hidden select-none"
      onPointerDown={(e) => spawn(e.clientX, e.clientY)}
    >
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        попаданий: {hits}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          key={hits}
          initial={false}
          animate={{ scale: hits ? [1.12, 1] : 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 20 }}
          className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-line2 bg-panel2"
        >
          <Target className="h-9 w-9 text-fog" />
        </motion.div>
      </div>

      {nums.map((n) => (
        <motion.div
          key={n.id}
          className="pointer-events-none absolute z-10"
          style={{ left: n.x, top: n.y }}
          initial={{ opacity: 0, y: 0, x: "-50%", scale: 0.4, rotate: rand(-8, 8) }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: -78,
            x: `calc(-50% + ${n.drift}px)`,
            scale: n.crit ? 1.5 : 1,
            rotate: 0,
          }}
          transition={{ duration: 0.8, times: [0, 0.12, 0.7, 1], ease: "easeOut" }}
        >
          <span
            className={cn(
              "font-display font-black whitespace-nowrap",
              n.crit ? "text-xl text-amb drop-shadow-[0_0_10px_rgba(255,180,58,0.7)]" : "text-sm text-snow"
            )}
          >
            {n.crit && <span className="mr-1 align-middle font-mono text-[9px] tracking-widest text-blood">КРИТ</span>}
            {n.v}
          </span>
        </motion.div>
      ))}
      <StageNote>кликай по сцене · 22% шанс крита</StageNote>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* HUD-04 — COMBO METER                                                */
/* ------------------------------------------------------------------ */
const RANKS: [number, string, string][] = [
  [30, "SS", "text-blood"],
  [18, "S", "text-amb"],
  [10, "A", "text-volt"],
  [5, "B", "text-cyc"],
  [1, "C", "text-fog"],
];

export function ComboDemo() {
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const timer = useRef<number | null>(null);

  const hit = () => {
    const c = combo + 1;
    setCombo(c);
    setBest((b) => Math.max(b, c));
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCombo(0), 1350);
  };

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const rank = RANKS.find(([min]) => combo >= min) ?? [0, "—", "text-line2"];
  const maxed = combo >= 30;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        max серия: {best}
      </div>
      <div className="flex items-center gap-5">
        <motion.span
          key={rank[1] as string}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className={cn("font-display text-5xl font-black", rank[2])}
        >
          {rank[1]}
        </motion.span>
        <div className="flex flex-col items-start">
          <motion.span
            key={combo}
            initial={{ scale: 1.6, y: -6 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 550, damping: 16 }}
            className="font-display text-4xl font-black text-snow"
          >
            {combo}
          </motion.span>
          <span className="font-mono text-[9px] tracking-[0.3em] text-fog uppercase">ХИТОВ ПОДРЯД</span>
        </div>
      </div>

      {/* decay window */}
      <div className="h-1 w-44 overflow-hidden rounded bg-line">
        {combo > 0 && (
          <motion.div
            key={combo}
            className={cn("h-full", maxed ? "bg-blood" : "bg-volt")}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 1.35, ease: "linear" }}
            style={{ transformOrigin: "left" }}
          />
        )}
      </div>

      <Btn onClick={hit} className="mt-1 px-6 py-3">
        <Swords className="h-4 w-4" /> бей!
      </Btn>
      <StageNote>успевай бить, пока линия не сгорела</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HUD-05 — RADAR SWEEP                                                */
/* ------------------------------------------------------------------ */
const BLIPS = [
  { deg: 24, d: 66, t: "e" },
  { deg: 88, d: 38, t: "a" },
  { deg: 150, d: 74, t: "e" },
  { deg: 205, d: 30, t: "a" },
  { deg: 262, d: 58, t: "e" },
  { deg: 318, d: 44, t: "e" },
];

export function RadarDemo() {
  const [deg, setDeg] = useState(0);
  useAnimationFrame((_, d) => setDeg((g) => (g + d * 0.09) % 360));

  const wedge = (() => {
    const p0 = polar(95, 95, 82, -90);
    const p1 = polar(95, 95, 82, -128);
    return `M 95 95 L ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A 82 82 0 0 0 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Z`;
  })();

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-5 select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        swp {deg.toFixed(0).padStart(3, "0")}°
      </div>
      <svg viewBox="0 0 190 190" className="h-48 w-48">
        <circle cx="95" cy="95" r="90" fill="var(--color-panel)" stroke="var(--color-line2)" strokeWidth="1.5" />
        {[30, 56, 82].map((r) => (
          <circle key={r} cx="95" cy="95" r={r} fill="none" stroke="var(--color-line)" strokeWidth="1" />
        ))}
        <line x1="95" y1="6" x2="95" y2="184" stroke="var(--color-line)" />
        <line x1="6" y1="95" x2="184" y2="95" stroke="var(--color-line)" />
        {/* sweep */}
        <g transform={`rotate(${deg} 95 95)`}>
          <path d={wedge} fill="rgba(215,255,62,0.16)" />
          <line x1="95" y1="95" x2="95" y2="13" stroke="var(--color-volt)" strokeWidth="1.5" />
        </g>
        {/* blips */}
        {BLIPS.map((b, i) => {
          const age = ((deg - b.deg) % 360 + 360) % 360;
          const op = age < 250 ? 1 - age / 250 : 0;
          const p = polar(95, 95, b.d, b.deg - 90);
          const colr = b.t === "e" ? "var(--color-blood)" : "var(--color-cyc)";
          return (
            <g key={i} opacity={Math.max(0.05, op)}>
              <circle cx={p.x} cy={p.y} r={7} fill={colr} opacity={0.25} />
              <circle cx={p.x} cy={p.y} r={3} fill={colr} />
            </g>
          );
        })}
        <circle cx="95" cy="95" r="3" fill="var(--color-snow)" />
      </svg>
      <div className="flex flex-col gap-1.5 font-mono text-[9px] tracking-[0.14em] text-fog uppercase">
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-blood" /> цель ×4</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-cyc" /> отряд ×2</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-volt" /> луч 0.3rpm</span>
      </div>
      <StageNote>контакты вспыхивают под лучом и гаснут</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HUD-06 — KILL FEED                                                  */
/* ------------------------------------------------------------------ */
const NAMES = ["VEX_9", "KIRA", "DOOMfist", "R4ZOR", "MIRA", "GHOST", "ТЫ", "PULSE"];
const WEAPONS = [Swords, Crosshair, Bomb, Zap, Flame];

interface FeedRow {
  id: number;
  a: string;
  b: string;
  w: number;
  hs: boolean;
}

export function FeedDemo() {
  const [rows, setRows] = useState<FeedRow[]>([]);
  const idRef = useRef(0);
  const [running, setRunning] = useState(true);

  const push = () => {
    const id = ++idRef.current;
    setRows((r) =>
      [
        ...r,
        { id, a: pick(NAMES), b: pick(NAMES), w: randInt(0, WEAPONS.length - 1), hs: Math.random() < 0.3 },
      ]
        .filter((x) => x.a !== x.b)
        .slice(-4)
    );
  };

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(push, 1700);
    return () => window.clearInterval(t);
  }, [running]);

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div className="absolute top-2 right-3 flex w-52 flex-col items-stretch gap-1.5">
        <AnimatePresence initial={false}>
          {rows.map((r) => {
            const W = WEAPONS[r.w];
            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, height: 0, marginBottom: -6 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="flex items-center justify-between gap-2 rounded border border-line bg-panel2/90 px-2.5 py-1.5 backdrop-blur"
              >
                <span className={cn("font-mono text-[9px] font-bold tracking-wider", r.a === "ТЫ" ? "text-volt" : "text-snow")}>
                  {r.a}
                </span>
                <span className="flex items-center gap-1 text-line2">
                  <W className={cn("h-3.5 w-3.5", r.hs ? "text-blood" : "text-fog")} />
                  {r.hs && <span className="font-mono text-[7px] tracking-widest text-blood">ХЕД</span>}
                </span>
                <span className={cn("font-mono text-[9px] tracking-wider", r.b === "ТЫ" ? "text-volt" : "text-fog")}>
                  {r.b}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <Btn tone="ghost" onClick={push}>
          + событие
        </Btn>
        <Btn tone="ghost" onClick={() => setRunning((v) => !v)}>
          {running ? "пауза" : "старт"}
        </Btn>
      </div>
      <StageNote>очередь максимум 4 · вытеснение вверх</StageNote>
    </div>
  );
}
