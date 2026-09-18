import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  DoorOpen,
  Eye,
  EyeOff,
  ListChecks,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Skull,
  Timer,
  Wind,
} from "lucide-react";
import { buzz, HAPTIC } from "../lib/fx";
import { cn } from "../utils/cn";

/* ---------------------------------- B-01 ---------------------------------- */
export function BlindTransitionDemo() {
  const [phase, setPhase] = useState<"poster" | "closing" | "in">("poster");

  const enter = () => {
    buzz(HAPTIC.heavy);
    setPhase("closing");
    setTimeout(() => setPhase("in"), 2100);
  };

  return (
    <div className="relative h-full overflow-hidden bg-void">
      {/* POSTER */}
      <AnimatePresence>
        {phase === "poster" && (
          <motion.div
            exit={{ opacity: 0 }}
            className="gridlines absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <div className="sticker sticker-red rotate-2">blind scenario</div>
            <div className="mt-4 font-display text-6xl uppercase leading-[0.95]">
              #042
              <br />
              <span className="text-outline">BLIND</span>
            </div>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
              2021.11.08 · seed 0xF3A9 · btc-perp
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-alarm">
              <EyeOff className="size-3.5" /> future redacted at 72%
            </div>
            <button
              onClick={enter}
              className="animate-pulse-ring pressable mt-7 rounded-full border-2 border-black bg-alarm px-8 py-4 font-display text-xl uppercase tracking-widest text-white shadow-[4px_4px_0_#000]"
            >
              enter blind
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVEALED SCENE */}
      <AnimatePresence>
        {phase === "in" && (
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col bg-[#0a0a0e]"
          >
            <div className="mt-12 border-b border-line px-4 pb-2">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-acid">blind #042 — live</div>
              <div className="font-mono text-lg font-bold text-up">64,120.5</div>
            </div>
            <div className="relative flex-1">
              <svg viewBox="0 0 318 220" className="h-full w-full" preserveAspectRatio="none">
                <motion.polyline
                  points="0,170 26,150 52,168 78,130 104,142 130,108 156,120 182,92 208,104 234,80 260,92 286,66 318,74"
                  fill="none"
                  stroke="#31e58c"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.45, ease: "easeInOut" }}
                />
                <line x1="234" y1="0" x2="234" y2="220" stroke="#c9ff2e" strokeWidth="1.5" strokeDasharray="5 4" />
              </svg>
              <div className="hatch absolute right-0 top-0 h-full w-[26%] bg-alarm/5" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute right-2 top-3 flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-alarm"
              >
                <EyeOff className="size-3" /> classified
              </motion.div>
            </div>
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 30 }}
              className="border-t border-line bg-coal px-4 pb-8 pt-3"
            >
              <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">
                <Eye className="size-3.5 text-acid" /> decision workspace armed
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border-2 border-up/50 bg-up/10 py-3 text-center font-display text-base uppercase text-up">long</div>
                <div className="rounded-xl border-2 border-down/50 bg-down/10 py-3 text-center font-display text-base uppercase text-down">short</div>
              </div>
              <button
                onClick={() => setPhase("poster")}
                className="mx-auto mt-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ink/40 pressable"
              >
                <RotateCcw className="size-3" /> restart transition
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CINEMATIC SHUTTERS */}
      <AnimatePresence>
        {phase === "closing" && (
          <>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0 z-20 h-1/2 origin-top bg-black"
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 z-20 h-1/2 origin-bottom bg-black"
            />
            <div className="absolute inset-0 z-30 grid place-items-center">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1] }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                  className="animate-glitch font-mono text-[10px] uppercase tracking-[0.5em] text-acid"
                >
                  decrypting past…
                </motion.div>
                <motion.div
                  initial={{ scale: 2.6, opacity: 0, rotate: 6 }}
                  animate={{ scale: 1, opacity: 1, rotate: -4 }}
                  transition={{ delay: 1.0, type: "spring", stiffness: 420, damping: 19 }}
                  className="mt-3 inline-block border-4 border-alarm px-5 py-2 font-display text-4xl uppercase tracking-widest text-alarm"
                >
                  blind mode
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- B-02 ---------------------------------- */
const SLIDES = [
  {
    k: "manifest",
    title: (
      <>
        You vs.
        <br />
        <span className="text-outline">history.</span>
      </>
    ),
    body: "Signal Arena ставит тебя в реальные исторические сценарии. Будущее скрыто. Решения — настоящие.",
    icon: DoorOpen,
  },
  {
    k: "rules",
    title: (
      <>
        Seal it
        <br />
        or <span className="text-alarm">shut it.</span>
      </>
    ),
    body: "Гипотеза запечатывается один раз — с инвалидацией. Никаких «я же говорил» задним числом.",
    icon: ShieldCheck,
  },
  {
    k: "risk",
    title: (
      <>
        Not financial
        <br />
        <span className="text-amber">advice.</span>
      </>
    ),
    body: "Это тренажёр решений, а не сигнальный канал. Твой тильт — твоя ответственность.",
    icon: ShieldAlert,
  },
];

export function SessionStartDemo() {
  const [idx, setIdx] = useState(0);
  const [signed, setSigned] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [shake, setShake] = useState(0);
  const last = idx === SLIDES.length - 1;

  const go = (n: number) => setIdx((i) => Math.max(0, Math.min(SLIDES.length - 1, i + n)));

  const start = () => {
    if (!signed && last) {
      setShake((s) => s + 1);
      buzz(HAPTIC.error);
      return;
    }
    setAccepted(true);
    buzz(HAPTIC.seal);
    setTimeout(() => {
      setAccepted(false);
      setSigned(false);
      setIdx(0);
    }, 1800);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="mt-11 flex items-center justify-between px-5">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">session 01</span>
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button key={s.k} onClick={() => setIdx(i)} className="p-1">
              <span className={cn("block h-1.5 rounded-full transition-all", i === idx ? "w-5 bg-acid" : "w-1.5 bg-ink/20")} />
            </button>
          ))}
        </div>
      </div>

      <motion.div
        className="flex flex-1 touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) go(1);
          if (info.offset.x > 60) go(-1);
        }}
        animate={{ x: `${-idx * 100}%` }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        style={{ width: "300%" }}
      >
        {SLIDES.map((s) => (
          <div key={s.k} className="flex w-1/3 flex-col justify-center px-7" style={{ width: "33.333%" }}>
            <s.icon className="size-10 text-acid" />
            <div className="mt-4 font-display text-5xl uppercase leading-[0.95]">{s.title}</div>
            <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-ink/60">{s.body}</p>
            {s.k === "risk" && (
              <button
                onClick={() => {
                  setSigned((v) => !v);
                  buzz(HAPTIC.light);
                }}
                className="mt-4 flex min-h-[44px] items-center gap-2.5 text-left"
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded border-2 transition-colors",
                    signed ? "border-acid bg-acid" : "border-ink/30"
                  )}
                >
                  {signed && <Check className="size-4 text-black" />}
                </span>
                <span className="text-[11px] text-ink/70">
                  Я понимаю: это симуляция. Тильт — моя проблема.
                </span>
              </button>
            )}
          </div>
        ))}
      </motion.div>

      <div className="flex items-center justify-between px-5 pb-9">
        <button
          onClick={() => go(-1)}
          disabled={idx === 0}
          className="grid size-11 place-items-center rounded-full border border-ink/15 text-ink/50 disabled:opacity-20 pressable"
        >
          <ArrowLeft className="size-4" />
        </button>
        <motion.button
          key={shake}
          onClick={last ? start : () => go(1)}
          className={cn(
            "pressable flex min-h-[44px] items-center gap-2 rounded-full border-2 border-black px-6 font-mono text-[11px] font-bold uppercase tracking-widest shadow-[3px_3px_0_#000]",
            shake > 0 && "animate-shake",
            last && !signed ? "bg-ink/15 text-ink/40" : "bg-acid text-black"
          )}
        >
          {last ? "sign & start" : "next"} <ArrowRight className="size-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {accepted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 grid place-items-center bg-black/70"
          >
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="border-4 border-acid px-6 py-2 font-display text-4xl uppercase tracking-widest text-acid"
            >
              accepted
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- B-03 ---------------------------------- */
const AUTOPSY = ["Входил без инвалидации", "Размер позиции > плана", "Двигал стоп"];

export function PostLossDemo() {
  const [step, setStep] = useState(0);
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const [done, setDone] = useState(false);
  const [breath, setBreath] = useState("inhale");

  useEffect(() => {
    if (step !== 0) return;
    const id = setInterval(() => setBreath((b) => (b === "inhale" ? "exhale" : "inhale")), 2000);
    return () => clearInterval(id);
  }, [step]);

  const allChecked = checks.every(Boolean);

  return (
    <div className="relative flex h-full flex-col bg-[#0b0507]">
      <div className="halftone pointer-events-none absolute inset-0 opacity-30" />
      {/* header */}
      <div className="mt-11 border-b border-alarm/30 px-5 pb-3">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-alarm">
          <Skull className="size-4" /> post-loss protocol
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-display text-xl uppercase">hurt locker</span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all", step === i ? "w-5 bg-alarm" : "w-1.5 bg-ink/20")} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {step === 0 && (
          <>
            <div className="relative grid size-40 place-items-center">
              <div className="animate-breathe absolute inset-0 rounded-full border-2 border-alarm/60 bg-alarm/10" />
              <div className="absolute inset-6 rounded-full border border-ink/15" />
              <Wind className="size-8 text-alarm" />
            </div>
            <div className="mt-5 font-display text-3xl uppercase tracking-wider text-alarm">{breath}</div>
            <p className="mt-2 max-w-[220px] font-mono text-[10px] leading-relaxed text-ink/50">
              −2.4R зафиксирован. Палец от мыши. Четыре секунды туда, четыре обратно.
            </p>
          </>
        )}

        {step === 1 && (
          <div className="w-full text-left">
            <div className="mb-3 flex items-center gap-2 font-display text-2xl uppercase">
              <ListChecks className="size-6 text-alarm" /> autopsy
            </div>
            <p className="mb-3 font-mono text-[10px] text-ink/50">Признай все, что было. Честность дешевле повторного стопа.</p>
            <div className="space-y-2">
              {AUTOPSY.map((a, i) => (
                <button
                  key={a}
                  onClick={() => {
                    setChecks((c) => c.map((v, j) => (j === i ? !v : v)));
                    buzz(HAPTIC.light);
                  }}
                  className={cn(
                    "pressable flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-3 text-left text-[12px] transition-colors",
                    checks[i] ? "border-alarm/60 bg-alarm/10 text-ink" : "border-ink/15 text-ink/60"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded border-2",
                      checks[i] ? "border-alarm bg-alarm" : "border-ink/25"
                    )}
                  >
                    {checks[i] && <Check className="size-3.5 text-white" />}
                  </span>
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && !done && (
          <>
            <div className="flex items-center gap-2 rounded-full border border-amber/50 bg-amber/10 px-4 py-2">
              <Timer className="size-4 text-amber" />
              <span className="font-mono text-xl font-bold tabular-nums text-amber">20:00</span>
            </div>
            <div className="mt-4 font-display text-2xl uppercase">cooldown locked</div>
            <p className="mt-2 max-w-[230px] text-[12px] leading-relaxed text-ink/55">
              Arena закрыта на 20 минут. Утешение начислено: <span className="font-bold text-amber">+10 Stars</span> за пройденный протокол.
            </p>
          </>
        )}

        {done && (
          <>
            <CheckCircle2 className="size-14 text-up" />
            <div className="mt-3 font-display text-3xl uppercase text-up">protocol clear</div>
            <p className="mt-2 font-mono text-[10px] text-ink/50">Стража записала урок. Журнал обновлён.</p>
          </>
        )}
      </div>

      <div className="flex items-center justify-between px-5 pb-9">
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink/30">step {step + 1} / 3</span>
        <button
          disabled={(step === 1 && !allChecked) || done}
          onClick={() => {
            if (step < 2) {
              setStep(step + 1);
              buzz(HAPTIC.medium);
            } else {
              setDone(true);
              buzz(HAPTIC.success);
              setTimeout(() => {
                setStep(0);
                setChecks([false, false, false]);
                setDone(false);
              }, 1800);
            }
          }}
          className={cn(
            "pressable flex min-h-[44px] items-center gap-2 rounded-full border-2 border-black px-6 font-mono text-[11px] font-bold uppercase tracking-widest shadow-[3px_3px_0_#000]",
            (step === 1 && !allChecked) || done ? "bg-ink/15 text-ink/40" : "bg-alarm text-white"
          )}
        >
          {step === 2 ? "return to hub" : "continue"} <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
