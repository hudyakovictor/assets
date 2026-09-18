import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation, useMotionValue, animate, useTransform } from "framer-motion";
import { Coins, Crown, Medal, Skull, Star, Target, Trophy, Zap } from "lucide-react";
import { Btn, StageNote, rand, randInt } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* FEL-01 — SCREEN SHAKE                                               */
/* ------------------------------------------------------------------ */
export function ShakeDemo() {
  const ctr = useAnimation();
  const [trauma, setTrauma] = useState(0.7);
  const [hp, setHp] = useState(100);
  const [flash, setFlash] = useState(0);
  const [busy, setBusy] = useState(false);

  const hit = async (mult: number) => {
    if (busy) return;
    setBusy(true);
    const p = trauma * mult;
    setHp((h) => Math.max(0, h - Math.round(20 + p * 30)));
    setFlash((f) => f + 1);
    await ctr.start({
      x: [0, -14 * p, 11 * p, -8 * p, 5 * p, -2 * p, 0],
      y: [0, 9 * p, -12 * p, 7 * p, -4 * p, 2 * p, 0],
      rotate: [0, -0.6 * p, 0.5 * p, -0.3 * p, 0],
      transition: { duration: 0.5 },
    });
    setBusy(false);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div animate={ctr} className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none">
        {flash > 0 && (
          <motion.span
            key={flash}
            className="pointer-events-none absolute inset-0 z-20 bg-blood"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
        <span className="font-mono text-[9px] tracking-[0.3em] text-blood uppercase">входящий урон</span>
        <span className={cn("font-display text-6xl font-black tabular-nums", hp <= 30 ? "text-blood" : "text-snow")}>
          {hp}
        </span>
        <div className="h-2 w-44 overflow-hidden rounded bg-line">
          <motion.div
            className={cn("h-full", hp <= 30 ? "bg-blood" : "bg-volt")}
            animate={{ width: `${hp}%` }}
            transition={{ duration: 0.15 }}
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Btn tone="red" onClick={() => hit(1)}>
            удар
          </Btn>
          <Btn tone="amber" onClick={() => hit(1.8)}>
            крит
          </Btn>
          <Btn tone="ghost" onClick={() => setHp(100)}>
            рес
          </Btn>
        </div>
        <label className="mt-1 flex w-48 items-center gap-2 font-mono text-[8px] tracking-[0.2em] text-fog uppercase">
          травма
          <input
            type="range"
            min={0.2}
            max={1.5}
            step={0.05}
            value={trauma}
            onChange={(e) => setTrauma(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded bg-line accent-[#d7ff3e]"
          />
          {trauma.toFixed(2)}
        </label>
      </motion.div>
      <StageNote>амплитуда = травма² · затухание за 500 мс</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FEL-02 — HIT STOP / IMPACT FRAMES                                   */
/* ------------------------------------------------------------------ */
export function ImpactDemo() {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const chain = useRef<number[]>([]);

  useEffect(() => () => chain.current.forEach((t) => window.clearTimeout(t)), []);

  const punch = () => {
    if (playing) return;
    setPlaying(true);
    const seq = [
      [0, () => setFrame(1)],
      [90, () => setFrame(2)],
      [180, () => setFrame(3)], // freeze here
      [520, () => setFrame(4)],
      [700, () => setFrame(5)],
      [1050, () => { setFrame(0); setPlaying(false); }],
    ] as const;
    chain.current = seq.map(([t, fn]) => window.setTimeout(fn, t));
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden select-none">
      <motion.div
        key={playing ? "p" : "i"}
        animate={playing ? { scale: [1, 1.09, 1.09, 1] } : { scale: 1 }}
        transition={{ duration: 1.05, times: [0, 0.15, 0.55, 1] }}
        className="relative flex flex-col items-center"
      >
        {/* hanging line */}
        <span className="h-4 w-px bg-line2" />
        {/* bag */}
        <motion.div
          animate={playing ? { x: [0, 26, -14, 7, 0], rotate: [0, 9, -5, 2, 0] } : { x: 0, rotate: 0 }}
          transition={{ duration: 1.05, times: [0, 0.2, 0.5, 0.75, 1] }}
          className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-line2 bg-panel2"
        >
          <Target className="h-8 w-8 text-fog" />
        </motion.div>
        {/* impact star */}
        {playing && (
          <motion.div
            className="pointer-events-none absolute top-3 right-2 z-10"
            initial={{ scale: 0, rotate: -30, opacity: 1 }}
            animate={{ scale: [0, 1.6, 1.6, 0.2], opacity: [1, 1, 1, 0] }}
            transition={{ duration: 0.62, times: [0, 0.15, 0.7, 1] }}
          >
            <svg width="52" height="52" viewBox="0 0 52 52">
              <path
                d="M26 0 L31 19 L52 26 L31 33 L26 52 L21 33 L0 26 L21 19 Z"
                fill="var(--color-volt)"
              />
            </svg>
          </motion.div>
        )}
        {/* white flash */}
        {playing && (
          <motion.span
            className="pointer-events-none absolute -inset-6 z-20 bg-snow"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          />
        )}
      </motion.div>

      {/* frame strip */}
      <div className="flex items-center gap-1.5 font-mono text-[8px] tracking-widest text-fog">
        {["IDLE", "KEY", "STOP", "STOP", "RECV", "IDLE"].map((f, i) => (
          <span
            key={i}
            className={cn(
              "rounded border px-1.5 py-0.5 transition-colors",
              frame === i + 1 || (i === 0 && frame === 0)
                ? i === 2 || i === 3
                  ? "border-blood bg-blood/20 text-blood"
                  : "border-volt bg-volt/15 text-volt"
                : "border-line"
            )}
          >
            {f}
          </span>
        ))}
      </div>
      <Btn tone="amber" onClick={punch}>
        <Zap className="h-3.5 w-3.5" /> ударить
      </Btn>
      <StageNote>hit-stop ~170 мс на кадрах 3–4</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FEL-03 — ACHIEVEMENT TOASTS                                         */
/* ------------------------------------------------------------------ */
const ACHIEVE = [
  { icon: Trophy, t: "ПЕРВАЯ КРОВЬ", d: "Убейте первого врага матча", c: "#ffb43a" },
  { icon: Crown, t: "БЕЗЦАРНЫЙ", d: "Возглавьте рейд 3 раза подряд", c: "#d7ff3e" },
  { icon: Medal, t: "ХИРУРГИЧНО", d: "Точность выше 92%", c: "#38e1ff" },
  { icon: Skull, t: "ТОЛПА — НЕ СТЕНА", d: "10 убийств за 5 секунд", c: "#ff4655" },
  { icon: Star, t: "КОЛЛЕКЦИОНЕР", d: "Соберите все руны сезона", c: "#a78bff" },
];

interface Toast {
  id: number;
  i: number;
}

export function ToastsDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = () => {
    const id = ++idRef.current;
    setToasts((t) => [...t.slice(-2), { id, i: randInt(0, ACHIEVE.length - 1) }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div className="absolute inset-x-0 top-2 z-20 flex flex-col items-center gap-1.5">
        <AnimatePresence>
          {toasts.map((t) => {
            const a = ACHIEVE[t.i];
            return (
              <motion.div
                layout
                key={t.id}
                initial={{ y: -54, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 480, damping: 26 }}
                className="relative flex w-64 items-center gap-2.5 overflow-hidden rounded-lg border border-line2 bg-panel/95 px-3 py-2 shadow-2xl backdrop-blur"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12, delay: 0.1 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
                  style={{ background: `${a.c}22`, border: `1px solid ${a.c}` }}
                >
                  <a.icon className="h-4 w-4" style={{ color: a.c }} />
                </motion.span>
                <span className="min-w-0">
                  <span className="block font-mono text-[7px] tracking-[0.3em] text-fog">ДОСТИЖЕНИЕ</span>
                  <span className="block truncate font-display text-[10px] font-bold" style={{ color: a.c }}>
                    {a.t}
                  </span>
                  <span className="block truncate text-[9px] text-fog">{a.d}</span>
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5"
                  style={{ background: a.c }}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 2.8, ease: "linear" }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <Btn tone="amber" onClick={push}>
          <Trophy className="h-3.5 w-3.5" /> разблокировать
        </Btn>
      </div>
      <StageNote>стек до 3 · автоскрытие 2.8 с</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FEL-04 — COIN FLY-TO-HUD                                            */
/* ------------------------------------------------------------------ */
interface FlyCoin {
  id: number;
  bx: number;
  by: number;
  tx: number;
  ty: number;
  delay: number;
}

export function CoinsDemo() {
  const areaRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [coins, setCoins] = useState<FlyCoin[]>([]);
  const target = useMotionValue(1250);
  const shown = useTransform(target, (v) => Math.round(v).toLocaleString("ru-RU"));
  const [total, setTotal] = useState(1250);

  useEffect(() => {
    const c = animate(target, total, { duration: 0.5, ease: "easeOut" });
    return c.stop;
  }, [total, target]);

  const burst = () => {
    const area = areaRef.current?.getBoundingClientRect();
    const tgt = targetRef.current?.getBoundingClientRect();
    if (!area || !tgt) return;
    const sx = area.width / 2;
    const sy = area.height / 2 + 20;
    const tx = tgt.left + tgt.width / 2 - area.left;
    const ty = tgt.top + tgt.height / 2 - area.top;
    const n = randInt(7, 11);
    const batch: FlyCoin[] = Array.from({ length: n }).map((_, i) => {
      const a = rand(0, Math.PI * 2);
      const d = rand(34, 84);
      return {
        id: Date.now() + i,
        bx: Math.cos(a) * d,
        by: Math.sin(a) * d - 10,
        tx: tx - sx,
        ty: ty - sy,
        delay: i * 0.03,
      };
    });
    setCoins((c) => [...c, ...batch]);
    batch.forEach((cn_, i) => {
      window.setTimeout(() => {
        setTotal((t) => t + randInt(12, 48));
        setCoins((c) => c.filter((x) => x.id !== cn_.id));
      }, 780 + i * 30);
    });
  };

  return (
    <div ref={areaRef} className="absolute inset-0 overflow-hidden select-none">
      {/* HUD counter */}
      <div
        ref={targetRef}
        className="absolute top-2.5 right-3 z-10 flex items-center gap-1.5 rounded-md border border-amb/50 bg-panel px-2.5 py-1.5"
      >
        <Coins className="h-3.5 w-3.5 text-amb" />
        <motion.span className="font-mono text-[11px] font-bold text-amb tabular-nums">{shown}</motion.span>
      </div>

      {/* loot source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-3">
        <motion.button
          type="button"
          onClick={burst}
          whileTap={{ scale: 0.9 }}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl border-2 border-amb bg-panel2 shadow-[0_0_26px_rgba(255,180,58,0.3)]"
        >
          <Coins className="h-7 w-7 text-amb" />
        </motion.button>
      </div>

      {/* flying coins */}
      {coins.map((c) => (
        <motion.span
          key={c.id}
          className="pointer-events-none absolute z-20 block h-3 w-3 rounded-full border border-amb bg-[#ffd75e]"
          style={{ left: "50%", top: "calc(50% + 20px)", marginLeft: -6, marginTop: -6 }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={{
            x: [0, c.bx, c.tx],
            y: [0, c.by, c.ty],
            scale: [0.4, 1.15, 0.5],
            opacity: [1, 1, 0.9],
          }}
          transition={{ duration: 0.78, times: [0, 0.36, 1], ease: ["easeOut", "easeIn"], delay: c.delay }}
        />
      ))}
      <StageNote>взрыв → магнит в HUD → тик счётчика</StageNote>
    </div>
  );
}
