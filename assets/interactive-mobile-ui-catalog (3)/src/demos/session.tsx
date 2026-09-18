import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { Check, Crosshair, Play, Shield, Skull, Users } from "lucide-react";
import { Btn, RingGauge, StageNote, pick } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* MTC-01 — MATCH FOUND                                                */
/* ------------------------------------------------------------------ */
const NICKS = ["VEX_9", "KIRA", "DOOM", "R4ZOR", "MIRA", "GHOST", "NYX", "PULSE"];
type Phase = "search" | "found" | "accepted" | "missed";

export function MatchDemo() {
  const [phase, setPhase] = useState<Phase>("search");
  const [elapsed, setElapsed] = useState(0);
  const [window_, setWindow_] = useState(6);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const to = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => {
    if (phase === "search") {
      setElapsed(0);
      const t0 = Date.now();
      const iv = window.setInterval(() => setElapsed((Date.now() - t0) / 1000), 100);
      to(2600, () => {
        window.clearInterval(iv);
        setPhase("found");
      });
      return () => window.clearInterval(iv);
    }
    if (phase === "found") {
      setWindow_(6);
      const iv = window.setInterval(() => setWindow_((w) => Math.max(0, w - 0.1)), 100);
      to(6200, () => {
        window.clearInterval(iv);
        setPhase("missed");
      });
      return () => window.clearInterval(iv);
    }
    if (phase === "accepted" || phase === "missed") {
      to(1600, () => {
        clear();
        setPhase("search");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const teamA = [pick(NICKS), pick(NICKS), pick(NICKS)];
  const teamB = [pick(NICKS), pick(NICKS), pick(NICKS)];

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        phase: {phase}
      </div>

      <AnimatePresence mode="wait">
        {phase === "search" && (
          <motion.div
            key="search"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyc/40"
                animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyc bg-panel2">
                <Crosshair className="anim-spin-slow h-7 w-7 text-cyc" />
              </div>
            </div>
            <span className="font-display text-sm font-bold tracking-widest text-snow">
              ПОИСК МАТЧА
              <span className="anim-blink">…</span>
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-fog">
              {elapsed.toFixed(1)} c · в очереди 12 847
            </span>
          </motion.div>
        )}

        {(phase === "found" || phase === "accepted" || phase === "missed") && (
          <motion.div
            key="found"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex w-full max-w-md items-stretch justify-center gap-3 px-5">
              {/* teams */}
              {[
                { name: teamA, c: "#38e1ff", side: -1 },
                { name: teamB, c: "#ff4655", side: 1 },
              ].map((t, ti) => (
                <motion.div
                  key={ti}
                  initial={{ x: t.side * 90, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  className="flex-1 space-y-1.5"
                >
                  {t.name.map((n, i) => (
                    <motion.div
                      key={`${n}${i}`}
                      initial={{ opacity: 0, y: t.side * 0 + 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="flex items-center gap-2 rounded border border-line bg-panel2 px-2 py-1.5"
                    >
                      <span className="h-4 w-4 rounded-sm" style={{ background: t.c }} />
                      <span className="font-mono text-[9px] font-bold tracking-wider" style={{ color: ti === 0 ? "#eaf6ff" : "#ffe9eb" }}>
                        {n}
                      </span>
                      <span className="ml-auto font-mono text-[8px] text-fog">LV{40 + i * 3}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ))}

              {/* VS slam */}
              <div className="relative flex items-center justify-center">
                <motion.span
                  initial={{ scale: 3.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.25 }}
                  className="font-display text-2xl font-black text-volt"
                >
                  VS
                </motion.span>
                <motion.span
                  className="absolute h-14 w-14 rounded-full border-2 border-volt"
                  initial={{ scale: 0.3, opacity: 0.9 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                />
              </div>
            </div>

            {phase === "found" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center gap-2">
                <Btn onClick={() => { clear(); setPhase("accepted"); }} className="px-8 py-3">
                  <Check className="h-4 w-4" /> принять · {window_.toFixed(1)}
                </Btn>
                <div className="h-1 w-40 overflow-hidden rounded bg-line">
                  <motion.div className="h-full bg-amb" style={{ width: `${(window_ / 6) * 100}%` }} />
                </div>
              </motion.div>
            )}
            {phase === "accepted" && (
              <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-mono text-[11px] font-bold tracking-[0.25em] text-volt">
                МАТЧ ПРИНЯТ — ЗАГРУЗКА
              </motion.span>
            )}
            {phase === "missed" && (
              <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-mono text-[11px] font-bold tracking-[0.25em] text-blood">
                КТО-ТО НЕ ПРИНЯЛ
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <StageNote>полный цикл: поиск → слэм → аксепт → поиск</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MTC-02 — RESPAWN TIMER                                              */
/* ------------------------------------------------------------------ */
const DUR = 5;

export function RespawnDemo() {
  const [t, setT] = useState(DUR);
  const startRef = useRef(performance.now());

  useAnimationFrame((now) => {
    const left = DUR - ((now - startRef.current) / 1000) % (DUR + 1);
    setT(Math.max(0, left));
  });

  const sec = Math.ceil(t);
  const go = t <= 1;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden select-none">
      <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-blood uppercase">
        <Skull className="h-3.5 w-3.5" /> вы пали · возрождение
      </div>

      <div className="relative">
        <RingGauge size={110} stroke={5} frac={t / DUR} color={go ? "var(--color-volt)" : "var(--color-blood)"}>
          <AnimatePresence mode="wait">
            <motion.span
              key={go ? "go" : sec}
              initial={{ scale: 1.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={cn("font-display text-3xl font-black", go ? "text-volt" : "text-snow")}
            >
              {go ? "GO" : sec}
            </motion.span>
          </AnimatePresence>
        </RingGauge>
        {go && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-volt"
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </div>

      <div className="flex gap-2">
        <Btn tone="ghost" onClick={() => (startRef.current = performance.now() - (DUR - 1) * 1000)}>
          <Play className="h-3 w-3" /> скип
        </Btn>
        <Btn tone="ghost" onClick={() => (startRef.current = performance.now())}>
          заново
        </Btn>
      </div>
      <div className="flex items-center gap-3 font-mono text-[8px] tracking-[0.2em] text-fog uppercase">
        <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> база 2.1 км</span>
        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 2 союзника рядом</span>
      </div>
      <StageNote>кольцо убывает · цифры попом · GO-вспышка</StageNote>
    </div>
  );
}

