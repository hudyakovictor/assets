import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Coins,
  Crown,
  Flag,
  Flame,
  Gem,
  Lock,
  Minus,
  Package,
  Star,
  Trophy,
} from "lucide-react";
import { Btn, StageNote, randInt } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* PRG-01 — BATTLE PASS                                                */
/* ------------------------------------------------------------------ */
const TIERS = Array.from({ length: 12 }).map((_, i) => ({
  t: i + 1,
  icon: [Coins, Gem, Package, Star, Coins, Crown][i % 6],
  big: (i + 1) % 4 === 0,
}));

export function PassDemo() {
  const [available, setAvailable] = useState(3);
  const [claimed, setClaimed] = useState<Set<number>>(new Set());
  const [burstAt, setBurstAt] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const claim = (t: number) => {
    setClaimed((c) => new Set(c).add(t));
    setBurstAt(t);
    window.setTimeout(() => setBurstAt(null), 700);
  };

  useEffect(() => {
    const el = trackRef.current?.querySelector<HTMLElement>("[data-current='1']");
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [available, claimed]);

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 overflow-hidden select-none">
      <div className="mx-5 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-fog uppercase">
        <span>сезон 12 · неон-осадки</span>
        <span className="text-volt">забрано {claimed.size}</span>
      </div>
      <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory items-end gap-2.5 overflow-x-auto px-6 pb-1">
        {TIERS.map((tier) => {
          const isClaimed = claimed.has(tier.t);
          const isAvail = tier.t <= available && !isClaimed;
          const locked = tier.t > available;
          return (
            <div key={tier.t} data-current={isAvail ? 1 : undefined} className="flex w-16 shrink-0 snap-center flex-col items-center gap-1.5">
              <motion.button
                type="button"
                disabled={!isAvail}
                onClick={() => claim(tier.t)}
                whileTap={isAvail ? { scale: 0.88 } : undefined}
                className={cn(
                  "relative flex h-16 w-16 flex-col items-center justify-center rounded-xl border-2 transition-colors",
                  isClaimed
                    ? "border-line bg-panel text-volt"
                    : isAvail
                      ? "cursor-pointer border-volt bg-volt/10 shadow-[0_0_18px_rgba(215,255,62,0.25)]"
                      : "border-line bg-panel2 text-line2",
                  tier.big && "h-20"
                )}
              >
                {isClaimed ? (
                  <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
                    <Check className="h-5 w-5" />
                  </motion.span>
                ) : locked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <tier.icon className={cn("h-5 w-5", tier.big ? "text-amb" : "text-volt")} />
                )}
                {/* claim confetti */}
                {burstAt === tier.t &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className={cn("absolute h-1 w-1", i % 2 ? "bg-volt" : "bg-amb")}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos((i / 8) * Math.PI * 2) * 34,
                        y: Math.sin((i / 8) * Math.PI * 2) * 34 - 8,
                        opacity: 0,
                        rotate: 180,
                      }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                    />
                  ))}
                {isAvail && (
                  <motion.span
                    className="absolute inset-0 rounded-xl border-2 border-volt"
                    animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                )}
              </motion.button>
              <span className={cn("font-mono text-[8px] tracking-widest", isClaimed ? "text-volt" : "text-fog")}>
                T{tier.t}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mx-6 h-1 overflow-hidden rounded bg-line">
        <motion.div className="h-full bg-volt" animate={{ width: `${(claimed.size / 12) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-2 pt-1">
        <Btn tone="ghost" onClick={() => setAvailable((a) => Math.min(12, a + 1))}>
          + тир (xp)
        </Btn>
        <Btn tone="ghost" onClick={() => { setAvailable(3); setClaimed(new Set()); }}>
          сброс
        </Btn>
      </div>
      <StageNote>забирай подсвеченные тиры</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PRG-02 — DAILY LOGIN                                                */
/* ------------------------------------------------------------------ */
const DAYS = [
  { r: "×100", icon: Coins },
  { r: "ГЕМ", icon: Gem },
  { r: "×250", icon: Coins },
  { r: "СУНДУК", icon: Package },
  { r: "×400", icon: Coins },
  { r: "ЗВЕЗДА", icon: Star },
  { r: "ВЕНЕЦ", icon: Crown },
];

export function DailyDemo() {
  const [day, setDay] = useState(2); // 0-based "today"
  const claimToday = () => {
    if (day < 7) setDay((d) => d + 1);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden px-5 select-none">
      <div className="pointer-events-none absolute top-2 left-3 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] text-fog uppercase">
        <Flame className="h-3.5 w-3.5 text-amb" /> стрик: <span className="text-amb">{Math.min(day, 7)} дн.</span>
      </div>

      <div className="grid w-full max-w-sm grid-cols-4 gap-2 pt-3">
        {DAYS.slice(0, 4).map((d, i) => (
          <DayCell key={i} i={i} d={d} day={day} claim={claimToday} />
        ))}
      </div>
      <div className="grid w-full max-w-sm grid-cols-3 gap-2">
        {DAYS.slice(4).map((d, i) => (
          <DayCell key={i + 4} i={i + 4} d={d} day={day} claim={claimToday} big={i + 4 === 6} />
        ))}
      </div>
      {day >= 7 ? (
        <Btn tone="amber" onClick={() => setDay(0)}>
          <Calendar className="h-3.5 w-3.5" /> новая неделя
        </Btn>
      ) : (
        <span className="font-mono text-[8px] tracking-[0.25em] text-fog uppercase">тапни пульсирующую ячейку</span>
      )}
      <StageNote>день 7 — усиленная награда</StageNote>
    </div>
  );
}

function DayCell({
  i,
  d,
  day,
  claim,
  big,
}: {
  i: number;
  d: { r: string; icon: typeof Coins };
  day: number;
  claim: () => void;
  big?: boolean;
}) {
  const claimed = i < day;
  const today = i === day;
  return (
    <motion.button
      type="button"
      disabled={!today}
      onClick={claim}
      whileTap={today ? { scale: 0.9, rotateY: 12 } : undefined}
      className={cn(
        "relative flex h-16 flex-col items-center justify-center gap-0.5 rounded-lg border-2 transition-colors",
        claimed && "border-line bg-panel opacity-50",
        today && "cursor-pointer border-volt bg-volt/10",
        !claimed && !today && "border-line bg-panel2",
        big && !claimed && "border-amb/60"
      )}
    >
      {today && (
        <motion.span
          className="absolute inset-0 rounded-lg border-2 border-volt"
          animate={{ opacity: [0.7, 0, 0.7], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
      <d.icon className={cn("h-5 w-5", big ? "text-amb" : today ? "text-volt" : "text-fog")} />
      <span className="font-mono text-[8px] font-bold tracking-widest text-snow">{d.r}</span>
      <span className="font-mono text-[7px] tracking-[0.2em] text-fog">ДЕНЬ {i + 1}</span>
      {claimed && (
        <motion.span
          initial={{ scale: 0, rotate: -24 }}
          animate={{ scale: 1, rotate: -12 }}
          className="absolute -top-1.5 -right-1.5 rounded border border-volt bg-ink px-1 font-mono text-[6px] font-bold tracking-widest text-volt"
        >
          OK
        </motion.span>
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* PRG-03 — LEADERBOARD                                                */
/* ------------------------------------------------------------------ */
interface Row {
  n: string;
  p: number;
  you?: boolean;
}
const START_ROWS: Row[] = [
  { n: "VEX_9", p: 2890 },
  { n: "KIRA", p: 2740 },
  { n: "DOOM", p: 2510 },
  { n: "ТЫ", p: 2430, you: true },
  { n: "R4ZOR", p: 2290 },
  { n: "MIRA", p: 2180 },
];
const MEDALS = ["#ffd75e", "#c9d1e0", "#e39a5f"];

export function BoardDemo() {
  const [rows, setRows] = useState(START_ROWS);
  const [prev, setPrev] = useState<Map<string, number>>(new Map(START_ROWS.map((r, i) => [r.n, i])));

  const simulate = () => {
    setPrev(new Map(rows.map((r, i) => [r.n, i])));
    setRows((rs) =>
      [...rs]
        .map((r) => ({ ...r, p: Math.max(1500, r.p + randInt(-160, 260) + (r.you ? 60 : 0)) }))
        .sort((a, b) => b.p - a.p)
    );
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 overflow-hidden px-5 select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.16em] text-fog uppercase">
        <Trophy className="mr-1 inline h-3 w-3 text-amb" /> сезонный рейтинг
      </div>
      <div className="w-full max-w-sm space-y-1 pt-3">
        <AnimatePresence initial={false}>
          {rows.map((r, i) => {
            const before = prev.get(r.n) ?? i;
            const delta = before - i;
            return (
              <motion.div
                layout
                key={r.n}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5",
                  r.you ? "border-volt bg-volt/10" : "border-line bg-panel2",
                  i < 3 && !r.you && "border-line2"
                )}
              >
                <span
                  className={cn("w-6 font-display text-sm font-black", i < 3 ? "" : "text-fog")}
                  style={i < 3 ? { color: MEDALS[i] } : undefined}
                >
                  {i + 1}
                </span>
                <span
                  className="flex h-6 w-6 items-center justify-center rounded font-mono text-[9px] font-bold text-ink"
                  style={{ background: r.you ? "var(--color-volt)" : `hsl(${(r.n.charCodeAt(0) * 37) % 360} 45% 60%)` }}
                >
                  {r.n[0]}
                </span>
                <span className={cn("font-mono text-[10px] font-bold tracking-wider", r.you ? "text-volt" : "text-snow")}>
                  {r.n}
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  {delta > 0 ? (
                    <ChevronUp className="h-3.5 w-3.5 text-volt" />
                  ) : delta < 0 ? (
                    <ChevronDown className="h-3.5 w-3.5 text-blood" />
                  ) : (
                    <Minus className="h-3 w-3 text-line2" />
                  )}
                  <span className="w-12 text-right font-mono text-[10px] text-fog tabular-nums">{r.p}</span>
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <Btn onClick={simulate} className="mt-0.5">
        симулировать матч
      </Btn>
      <StageNote>строки сами перестраиваются · «твоя» подсвечена</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PRG-04 — QUEST CARD                                                 */
/* ------------------------------------------------------------------ */
const OBJECTIVES = [
  { t: "Убить крипов", need: 10 },
  { t: "Собрать руны", need: 5 },
  { t: "Выиграть рейд", need: 1 },
];

export function QuestDemo() {
  const [prog, setProg] = useState([0, 0, 0]);
  const [claimed, setClaimed] = useState(false);
  const done = prog.every((p, i) => p >= OBJECTIVES[i].need);
  const total = prog.reduce((a, p, i) => a + Math.min(p / OBJECTIVES[i].need, 1), 0) / 3;

  const farm = () => {
    if (done) return;
    setProg((pr) => {
      const next = [...pr];
      const open = next.map((p, i) => (p < OBJECTIVES[i].need ? i : -1)).filter((i) => i >= 0);
      if (open.length === 0) return pr;
      const i = open[randInt(0, open.length - 1)];
      next[i] = Math.min(OBJECTIVES[i].need, next[i] + randInt(1, 3));
      return next;
    });
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-5 select-none">
      <motion.div
        className={cn("relative w-full max-w-xs rounded-xl border-2 bg-panel2 p-4 transition-colors", done ? "border-volt" : "border-line")}
        animate={done && !claimed ? { boxShadow: ["0 0 0px rgba(215,255,62,0)", "0 0 28px rgba(215,255,62,0.35)", "0 0 0px rgba(215,255,62,0)"] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.25em] text-fog uppercase">
              <Flag className="h-3 w-3 text-cyc" /> дейли · арена
            </span>
            <span className="mt-1 block font-display text-sm font-black text-snow">ЗАЧИСТКА СЕКТОРА 7</span>
          </div>
          <span className="rounded border border-amb/60 px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-widest text-amb">
            +750 XP
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {OBJECTIVES.map((o, i) => {
            const fin = prog[i] >= o.need;
            return (
              <div key={o.t} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                    fin ? "border-volt bg-volt text-ink" : "border-line2"
                  )}
                >
                  {fin && <Check className="h-3 w-3" />}
                </span>
                <span className={cn("w-24 truncate text-[10px]", fin ? "text-fog line-through" : "text-snow")}>{o.t}</span>
                <div className="flex flex-1 gap-0.5">
                  {Array.from({ length: Math.min(o.need, 10) }).map((_, s) => (
                    <motion.span
                      key={s}
                      className={cn("h-1.5 flex-1 rounded-[1px]", s < prog[i] * (Math.min(o.need, 10) / o.need) ? "bg-cyc" : "bg-line")}
                      layout
                    />
                  ))}
                </div>
                <span className="w-8 text-right font-mono text-[9px] text-fog tabular-nums">
                  {prog[i]}/{o.need}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded bg-line">
          <motion.div className="h-full bg-volt" animate={{ width: `${total * 100}%` }} />
        </div>

        <div className="mt-3 flex gap-2">
          {claimed ? (
            <span className="flex-1 rounded border border-volt bg-volt/10 py-2 text-center font-mono text-[10px] font-bold tracking-[0.2em] text-volt">
              НАГРАДА ЗАБРАНА
            </span>
          ) : done ? (
            <Btn onClick={() => setClaimed(true)} className="flex-1">
              забрать награду
            </Btn>
          ) : (
            <Btn tone="cyan" onClick={farm} className="flex-1">
              фармить
            </Btn>
          )}
          <Btn
            tone="ghost"
            onClick={() => {
              setProg([0, 0, 0]);
              setClaimed(false);
            }}
          >
            сброс
          </Btn>
        </div>

        <AnimatePresence>
          {done && (
            <motion.span
              initial={{ scale: 2.2, opacity: 0, rotate: -18 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="pointer-events-none absolute top-2 right-14 rounded border-2 border-volt px-2 py-0.5 font-mono text-[9px] font-black tracking-[0.2em] text-volt"
            >
              ГОТОВО
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <StageNote>сегменты целей · штамп завершения</StageNote>
    </div>
  );
}
