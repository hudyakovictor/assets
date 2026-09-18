import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  BellRing,
  Check,
  ChevronLeft,
  Gift,
  Hand,
  Joystick,
  Swords,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Btn, StageNote } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* ONB-01 — COACH MARK                                                 */
/* ------------------------------------------------------------------ */
const STEPS = [
  { x: 20, y: 30, w: 84, h: 40, title: "МАГАЗИН", text: "Здесь валюта превращается в силу. Скидки горят." },
  { x: 68, y: 30, w: 104, h: 40, title: "ОТРЯД", text: "Позови друзей — рейды в соло не фармятся." },
  { x: 44, y: 66, w: 120, h: 44, title: "БОЙ!", text: "Когда готов — жми сюда. Удачи, чемпион." },
];

export function CoachDemo() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const s = STEPS[step];

  const next = () => {
    if (step >= STEPS.length - 1) setDone(true);
    else setStep((v) => v + 1);
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* fake HUD targets */}
      <div className="absolute flex h-full w-full flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-panel2 px-3 py-2.5" style={{ width: 84, height: 40 }}>
            <Gift className="h-4 w-4 text-amb" />
            <span className="h-1.5 w-8 rounded bg-line" />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-panel2 px-3 py-2.5" style={{ width: 104, height: 40 }}>
            <Users className="h-4 w-4 text-cyc" />
            <span className="h-1.5 w-10 rounded bg-line" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 rounded-lg border border-blood/60 bg-blood/10 px-4 py-3" style={{ width: 120, height: 44 }}>
            <Swords className="h-4 w-4 text-blood" />
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-blood">В БОЙ</span>
          </div>
        </div>
      </div>

      {/* dim + spotlight */}
      <AnimatePresence>
        {!done && (
          <motion.div
            key={step}
            className="pointer-events-none absolute z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              left: `calc(${s.x}% - 6px)`,
              top: `calc(${s.y}% - 6px)`,
              width: s.w + 12,
              height: s.h + 12,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div
              className="h-full w-full rounded-xl border-2 border-volt"
              style={{ boxShadow: "0 0 0 999px rgba(3,4,7,0.78), 0 0 24px rgba(215,255,62,0.25)" }}
            />
            {/* tap ripple + hand */}
            <motion.span
              className="absolute right-1 bottom-1 h-6 w-6 rounded-full border-2 border-volt"
              animate={{ scale: [0.4, 1.4], opacity: [0.9, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute -right-7 -bottom-6"
              animate={{ y: [0, 6, 0], x: [0, 3, 0] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              <Hand className="h-7 w-7 rotate-[-24deg] text-snow drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* tooltip */}
      <div className="absolute inset-x-4 bottom-3 z-20">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="flex items-center justify-between gap-3 rounded-lg border border-line2 bg-panel p-3"
            >
              <div>
                <span className="font-mono text-[8px] tracking-[0.3em] text-volt">ШАГ {step + 1}/3 · {s.title}</span>
                <p className="mt-0.5 text-[10px] leading-snug text-fog">{s.text}</p>
              </div>
              <Btn onClick={next} className="shrink-0">
                {step === STEPS.length - 1 ? "понял" : "далее"}
              </Btn>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between gap-3 rounded-lg border border-volt/60 bg-panel p-3"
            >
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-volt">ОБУЧЕНИЕ ПРОЙДЕНО</span>
              <Btn tone="ghost" onClick={() => { setStep(0); setDone(false); }}>
                заново
              </Btn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <StageNote>box-shadow: 999px — прорезь в затемнении</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ONB-02 — TUTORIAL FLOW                                              */
/* ------------------------------------------------------------------ */
const TUT = [
  { icon: Joystick, t: "ДВИГАЙСЯ", d: "Левый стик — движение. Пружина вернёт его в центр, отпусти — встанешь.", c: "#38e1ff" },
  { icon: Swords, t: "АТАКУЙ", d: "Правый кластер — способности. Короткие кд спамь, ульту береги.", c: "#ff4655" },
  { icon: Trophy, t: "ПОБЕЖДАЙ", d: "Побеждает не тот, кто жмёт быстрее, а кто жмёт вовремя. GG.", c: "#d7ff3e" },
];

export function TutorialDemo() {
  const [[step, dir], setStep] = useState<[number, number]>([0, 0]);
  const [boom, setBoom] = useState(false);

  const go = (d: number) => {
    const n = step + d;
    if (n >= TUT.length) {
      setBoom(true);
      window.setTimeout(() => {
        setBoom(false);
        setStep([0, -1]);
      }, 1300);
      return;
    }
    if (n < 0) return;
    setStep([n, d]);
  };

  const S = TUT[step];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden px-8 select-none">
      <div className="relative flex h-36 w-full max-w-xs items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ x: dir >= 0 ? 70 : -70, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir >= 0 ? -70 : 70, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl border-2"
              style={{ borderColor: S.c, background: `${S.c}14` }}
            >
              <S.icon className="h-8 w-8" style={{ color: S.c }} />
            </span>
            <span className="font-display text-lg font-black" style={{ color: S.c }}>{S.t}</span>
            <p className="max-w-56 text-[10px] leading-relaxed text-fog">{S.d}</p>
          </motion.div>
        </AnimatePresence>

        {boom && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={`${step}-${i}`}
                className={cn("absolute h-1.5 w-1.5", i % 3 === 0 ? "bg-volt" : i % 3 === 1 ? "bg-cyc" : "bg-amb")}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 14) * Math.PI * 2) * (40 + (i % 4) * 14),
                  y: Math.sin((i / 14) * Math.PI * 2) * (40 + (i % 4) * 14),
                  opacity: 0,
                  rotate: 200,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* dots */}
      <div className="flex items-center gap-1.5">
        {TUT.map((_, i) => (
          <motion.span
            key={i}
            className={cn("h-1.5 rounded-full", i === step ? "bg-volt" : "bg-line2")}
            animate={{ width: i === step ? 18 : 6 }}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Btn tone="ghost" onClick={() => go(-1)} disabled={step === 0}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => go(1)} className="w-32">
          {step === TUT.length - 1 ? "в бой!" : "дальше"} <ArrowRight className="h-3.5 w-3.5" />
        </Btn>
      </div>
      <StageNote>слайд помнит направление</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ONB-03 — PERMISSION PRIMER                                          */
/* ------------------------------------------------------------------ */
export function PermissionDemo() {
  const [stage, setStage] = useState<"primer" | "dialog" | "yes" | "no">("primer");

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-6 select-none">
      <AnimatePresence mode="wait">
        {stage === "primer" && (
          <motion.div
            key="primer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="w-full max-w-56 rounded-xl border border-line2 bg-panel2 p-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amb/60 bg-amb/10">
              <Bell className="h-5 w-5 text-amb" />
            </span>
            <span className="mt-2.5 block font-display text-[13px] font-black text-snow">НЕ ПРОПУСТИ НАГРАДУ</span>
            <p className="mt-1 text-[10px] leading-relaxed text-fog">
              Скажем, когда сундук откроется и рейд начнётся. Без спама — честно.
            </p>
            <div className="mt-3 flex gap-2">
              <Btn onClick={() => setStage("dialog")} className="flex-1">дальше</Btn>
              <Btn tone="ghost" onClick={() => setStage("no")}>позже</Btn>
            </div>
          </motion.div>
        )}

        {stage === "dialog" && (
          <motion.div
            key="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-start justify-center bg-ink/60 pt-10 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ y: -30, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className="w-60 rounded-xl border border-line2 bg-panel p-3.5 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <GamepadMark />
                <span className="font-mono text-[9px] font-bold tracking-wider text-snow">ARENA-99</span>
              </div>
              <p className="mt-2 text-[10px] leading-snug text-fog">
                «ARENA-99» хочет отправлять тебе уведомления
              </p>
              <div className="mt-3 flex overflow-hidden rounded-lg border border-line2">
                <button
                  type="button"
                  onClick={() => setStage("no")}
                  className="flex-1 cursor-pointer border-r border-line2 py-2 font-mono text-[9px] tracking-widest text-fog hover:bg-white/5"
                >
                  НЕ СЕЙЧАС
                </button>
                <button
                  type="button"
                  onClick={() => setStage("yes")}
                  className="flex-1 cursor-pointer py-2 font-mono text-[9px] font-bold tracking-widest text-cyc hover:bg-cyc/10"
                >
                  РАЗРЕШИТЬ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {(stage === "yes" || stage === "no") && (
          <motion.div
            key={stage}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <span
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full border-2",
                stage === "yes" ? "border-volt bg-volt/10 text-volt" : "border-line2 text-fog"
              )}
            >
              {stage === "yes" ? <BellRing className="h-7 w-7" /> : <X className="h-7 w-7" />}
            </span>
            <span className={cn("font-mono text-[10px] font-bold tracking-[0.25em]", stage === "yes" ? "text-volt" : "text-fog")}>
              {stage === "yes" ? "УВЕДОМЛЕНИЯ ВКЛЮЧЕНЫ" : "НАПОМНИМ ПОЗЖЕ"}
            </span>
            {stage === "yes" && (
              <span className="flex items-center gap-1 font-mono text-[8px] tracking-[0.2em] text-fog">
                <Check className="h-3 w-3 text-volt" /> конверсия +112% против холодного запроса
              </span>
            )}
            <Btn tone="ghost" onClick={() => setStage("primer")}>заново</Btn>
          </motion.div>
        )}
      </AnimatePresence>
      <StageNote>своё объяснение → системный диалог</StageNote>
    </div>
  );
}

function GamepadMark() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded bg-volt">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-ink" fill="currentColor">
        <rect x="6" y="11" width="12" height="3" rx="0.5" />
        <rect x="10.5" y="6.5" width="3" height="12" rx="0.5" />
      </svg>
    </span>
  );
}
