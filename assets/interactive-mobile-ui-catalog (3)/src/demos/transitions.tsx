import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { ArrowRight, Gamepad2, Home, Swords, X } from "lucide-react";
import { Btn, StageNote, randInt } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* TRN-01 — STAGGER WIPE                                               */
/* ------------------------------------------------------------------ */
const SCENES = [
  { label: "АРЕНА", sub: "pvp · 5v5", icon: Swords, bg: "#3a1017", c: "#ff4655" },
  { label: "ШАТРА", sub: "city · safe", icon: Home, bg: "#0d2b30", c: "#38e1ff" },
];

export function WipeDemo() {
  const ctr = useAnimation();
  const [scene, setScene] = useState(0);
  const [busy, setBusy] = useState(false);

  const play = async () => {
    if (busy) return;
    setBusy(true);
    await ctr.start((i: number) => ({
      y: "0%",
      transition: { delay: i * 0.06, duration: 0.4, ease: [0.7, 0, 0.3, 1] },
    }));
    setScene((s) => 1 - s);
    await ctr.start((i: number) => ({
      y: "101%",
      transition: { delay: (4 - i) * 0.06, duration: 0.45, ease: [0.7, 0, 0.3, 1] },
    }));
    await ctr.start({ y: "-101%", transition: { duration: 0 } });
    setBusy(false);
  };

  const S = SCENES[scene];

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* scene */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: S.bg }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-2"
          >
            <S.icon className="h-12 w-12" style={{ color: S.c }} />
            <span className="font-display text-3xl font-black tracking-wide" style={{ color: S.c }}>
              {S.label}
            </span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-snow/50 uppercase">{S.sub}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* strips */}
      <div className="pointer-events-none absolute inset-0 z-10 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            animate={ctr}
            initial={{ y: "-101%" }}
            className="h-full w-1/5 bg-volt"
            style={{ borderRight: "1px solid rgba(6,7,11,0.35)" }}
          />
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
        <Btn onClick={play} disabled={busy}>
          сменить сцену <ArrowRight className="h-3.5 w-3.5" />
        </Btn>
      </div>
      <StageNote>контент подменяется на пике покрытия</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TRN-02 — IRIS CUT                                                   */
/* ------------------------------------------------------------------ */
export function IrisDemo() {
  const [cur, setCur] = useState(0);
  const [flow, setFlow] = useState<{ x: number; y: number } | null>(null);

  const tap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (flow) return;
    const r = e.currentTarget.getBoundingClientRect();
    setFlow({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const A = SCENES[cur];
  const B = SCENES[1 - cur];

  return (
    <div className="absolute inset-0 cursor-crosshair overflow-hidden select-none" onPointerDown={tap}>
      {/* under scene (next) appears during flow */}
      {flow && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: B.bg }}>
          <B.icon className="h-16 w-16" style={{ color: B.c }} />
          <span className="font-display text-4xl font-black" style={{ color: B.c }}>{B.label}</span>
        </div>
      )}
      {/* over scene (current), clipped away */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        style={{ background: A.bg }}
        initial={false}
        animate={
          flow
            ? { clipPath: `circle(0% at ${flow.x}% ${flow.y}%)` }
            : { clipPath: `circle(120% at 50% 50%)` }
        }
        transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
        onAnimationComplete={() => {
          if (flow) {
            setCur((c) => 1 - c);
            setFlow(null);
          }
        }}
      >
        <A.icon className="h-16 w-16" style={{ color: A.c }} />
        <span className="font-display text-4xl font-black" style={{ color: A.c }}>{A.label}</span>
        <span className="font-mono text-[9px] tracking-[0.3em] text-snow/50 uppercase">тапни куда угодно</span>
      </motion.div>

      {/* iris flash ring */}
      {flow && (
        <motion.span
          className="pointer-events-none absolute z-10 h-8 w-8 rounded-full border-2 border-volt"
          style={{ left: `${flow.x}%`, top: `${flow.y}%`, x: "-50%", y: "-50%" }}
          initial={{ scale: 0.4, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
      <StageNote>диафрагма схлопывается в точку тапа</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TRN-03 — SHARED ELEMENT MORPH                                       */
/* ------------------------------------------------------------------ */
const MORPH_CARDS = [
  { name: "ВЭСПЕР", cls: "ШТОРМ-МАГ", img: "img/char-mage.jpg", c: "#38e1ff", d: "Контроль толпы, цепные молнии, ульта «Грозовой фронт»." },
  { name: "КАГЭ", cls: "РОНИН", img: "img/char-ronin.jpg", c: "#ff4655", d: "Ближний взрывной урон, парирование и крит сзади." },
  { name: "БАСТИОН", cls: "АВАНГАРД", img: "img/char-vanguard.jpg", c: "#ffb43a", d: "Танк-якорь: стена, провокация и аура защиты." },
  { name: "ФЛИНТ", cls: "СЛЕДОПЫТ", img: "img/char-warden.jpg", c: "#d7ff3e", d: "Меткий огонь, капканы и метка жертвы." },
];

export function MorphDemo() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div className="pointer-events-none absolute top-2 left-3 z-0 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        roster → detail
      </div>
      <div className="grid h-full grid-cols-2 gap-2.5 p-4 pt-8">
        {MORPH_CARDS.map((c, i) => (
          <motion.button
            key={c.name}
            type="button"
            layoutId={`card-${i}`}
            onClick={() => setOpenIdx(i)}
            className="relative cursor-pointer overflow-hidden rounded-lg border border-line2 bg-panel2 text-left"
            whileHover={{ scale: 1.02 }}
            style={{ visibility: openIdx === i ? "hidden" : "visible" }}
          >
            <motion.img layoutId={`img-${i}`} src={c.img} alt={c.name} className="h-16 w-full object-cover" />
            <div className="px-2 py-1.5">
              <motion.span layoutId={`name-${i}`} className="block font-display text-[10px] font-bold" style={{ color: c.c }}>
                {c.name}
              </motion.span>
              <span className="font-mono text-[7px] tracking-widest text-fog">{c.cls}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openIdx !== null && (
          <motion.div
            className="absolute inset-0 z-20 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIdx(null)}
          >
            <motion.div
              layoutId={`card-${openIdx}`}
              className="absolute inset-x-8 top-1/2 -translate-y-1/2 overflow-hidden rounded-xl border bg-panel2"
              style={{ borderColor: MORPH_CARDS[openIdx].c }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="relative">
                <motion.img
                  layoutId={`img-${openIdx}`}
                  src={MORPH_CARDS[openIdx].img}
                  alt={MORPH_CARDS[openIdx].name}
                  className="h-28 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenIdx(null);
                  }}
                  className="absolute top-2 right-2 cursor-pointer rounded-full border border-line2 bg-ink/70 p-1 text-fog hover:text-snow"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                <motion.span
                  layoutId={`name-${openIdx}`}
                  className="block font-display text-sm font-black"
                  style={{ color: MORPH_CARDS[openIdx].c }}
                >
                  {MORPH_CARDS[openIdx].name}
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                  exit={{ opacity: 0 }}
                  className="mt-1 text-[10px] leading-relaxed text-fog"
                >
                  {MORPH_CARDS[openIdx].d}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.22 } }}
                  exit={{ opacity: 0 }}
                  className="mt-2.5 flex gap-2"
                >
                  {["СИЛ 82", "ЛОВ 64", "РОЛЬ MID"].map((s) => (
                    <span key={s} className="rounded border border-line2 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-fog">
                      {s}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <StageNote>общий layoutId: картинка и имя «переезжают»</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TRN-04 — LOADING SCREEN                                             */
/* ------------------------------------------------------------------ */
const TIPS = [
  "Совет: удерживай Q для усиленного разряда",
  "Совет: криты по спине ×2.5 урона",
  "Совет: радар видит сквозь дым 0.8 с",
  "Совет: дейлики сгорают в полночь по МСК",
  "Совет: Бастион блокирует ульту Кагэ стеной",
];

export function LoadingDemo() {
  const [p, setP] = useState(0);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setP((v) => {
        if (v >= 100) return 100;
        return Math.min(100, v + randInt(2, 8));
      });
    }, 220);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setTip((i) => (i + 1) % TIPS.length), 2100);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (p < 100) return;
    const t = window.setTimeout(() => setP(0), 1700);
    return () => window.clearTimeout(t);
  }, [p]);

  const done = p >= 100;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden select-none">
      <motion.div
        className={cn("flex h-14 w-14 items-center justify-center rounded-2xl border-2", done ? "border-volt" : "border-line2")}
        animate={{ rotate: done ? 0 : 360 }}
        transition={done ? { type: "spring", stiffness: 300, damping: 14 } : { duration: 2.4, repeat: Infinity, ease: "linear" }}
      >
        <Gamepad2 className={cn("h-6 w-6", done ? "text-volt" : "text-fog")} />
      </motion.div>

      {/* segmented bar */}
      <div className="flex w-56 gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-[1px] transition-colors duration-150",
              i < p / 5 ? (done ? "bg-volt" : "bg-cyc") : "bg-line"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={done ? "done" : tip}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={cn("font-mono text-[9px] tracking-[0.2em] uppercase", done ? "text-volt" : "text-fog")}
        >
          {done ? "// СИНХРОНИЗИРОВАНО — ПОГНАЛИ" : TIPS[tip]}
        </motion.span>
      </AnimatePresence>

      {done && (
        <motion.span
          className="pointer-events-none absolute inset-0 bg-volt"
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        />
      )}
      <span className="absolute right-3 bottom-2 font-mono text-xs font-bold text-snow tabular-nums">
        {p}%
      </span>
      <StageNote>цикл: прогресс → флэш → рестарт</StageNote>
    </div>
  );
}
