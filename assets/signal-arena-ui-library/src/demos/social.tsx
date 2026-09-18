import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ClipboardCopy,
  Coins,
  Gift,
  Loader2,
  Medal,
  RotateCcw,
  Send,
  Share2,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { buzz, fmt, HAPTIC, useCountUp, useInterval } from "../lib/fx";
import { cn } from "../utils/cn";

/* ---------------------------------- D-04 ---------------------------------- */
interface Row {
  id: number;
  name: string;
  score: number;
  you?: boolean;
}

const BASE: Row[] = [
  { id: 1, name: "LIQUIDATOR", score: 9420 },
  { id: 2, name: "permabull_eth", score: 8810 },
  { id: 3, name: "NOFOMO", score: 8330 },
  { id: 4, name: "YOU_KNOW_WHO", score: 7950 },
  { id: 5, name: "YOU", score: 7610, you: true },
  { id: 6, name: "rekt_ralph", score: 7480 },
  { id: 7, name: "satoshigirl", score: 7020 },
  { id: 8, name: "dca_andy", score: 6650 },
];

export function LeaderboardDemo() {
  const [rows, setRows] = useState<Row[]>(BASE);
  const prevOrder = useRef<number[]>(BASE.map((r) => r.id));
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });

  useInterval(
    () => {
      setRows((rs) => {
        prevOrder.current = rs.map((r) => r.id);
        return [...rs]
          .map((r) => ({ ...r, score: r.score + ((Math.random() * 260) | 0) }))
          .sort((a, b) => b.score - a.score);
      });
    },
    2400,
    inView
  );

  return (
    <div ref={rootRef} className="flex h-full flex-col px-4 pt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">
          <span className={cn("size-1.5 rounded-full", inView ? "bg-up animate-blink" : "bg-ink/30")} />
          {inView ? "live" : "paused offscreen"}
        </div>
        <div className="flex rounded-full border border-line p-0.5">
          {["friends", "global"].map((m, i) => (
            <button
              key={m}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase",
                i === 1 ? "bg-acid text-black" : "text-ink/40"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout className="mt-3 space-y-1.5">
        <AnimatePresence initial={false}>
          {rows.map((r, i) => {
            const prev = prevOrder.current.indexOf(r.id);
            const delta = prev - i;
            return (
              <motion.li
                layout
                key={r.id}
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5",
                  r.you ? "border-acid bg-acid/10 shadow-[3px_3px_0_rgba(0,0,0,0.6)]" : "border-line bg-coal"
                )}
              >
                <span className={cn("w-6 text-center font-display text-base", i < 3 ? "text-amber" : "text-ink/35")}>
                  {i < 3 ? <Medal className="mx-auto size-4" /> : i + 1}
                </span>
                <span className={cn("flex-1 truncate text-[12px] font-bold", r.you && "text-acid")}>
                  {r.name}
                  {r.you && <span className="ml-1.5 rounded-sm bg-acid px-1 font-mono text-[8px] text-black">YOU</span>}
                </span>
                <AnimatePresence mode="popLayout">
                  {delta !== 0 && (
                    <motion.span
                      key={`${r.id}-${i}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn("flex items-center font-mono text-[9px] font-bold", delta > 0 ? "text-up" : "text-down")}
                    >
                      {delta > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {Math.abs(delta)}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="font-mono text-[11px] font-bold tabular-nums text-ink/70">{fmt(r.score)}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

/* ---------------------------------- E-05 ---------------------------------- */
const PALETTE = ["#c9ff2e", "#ff3355", "#4bd9ff", "#ffc24b", "#b58cff"];

export function ReferralDemo() {
  const [copied, setCopied] = useState(false);
  const [friends, setFriends] = useState(3);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("https://t.me/signal_arena_bot/arena?startapp=ref_8X2K");
    } catch {
      /* clipboard blocked — still show feedback in demo */
    }
    setCopied(true);
    buzz(HAPTIC.light);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="flex h-full flex-col px-4 pt-12">
      <div className="sticker -rotate-1 w-fit">smuggle the signal</div>
      <div className="mt-3 font-display text-2xl uppercase leading-tight">
        Bring degens,
        <br />
        get <span className="text-acid">paid.</span>
      </div>

      {/* link field */}
      <div className="mt-4 flex items-stretch overflow-hidden rounded-xl border border-line bg-black/50">
        <div className="flex min-w-0 flex-1 items-center truncate px-3 font-mono text-[10px] text-ink/50">
          t.me/signal_arena…ref_8X2K
        </div>
        <button
          onClick={copy}
          className={cn(
            "pressable flex min-h-[44px] items-center gap-1.5 border-l-2 border-black px-3 font-mono text-[10px] font-bold uppercase transition-colors",
            copied ? "bg-up text-black" : "bg-acid text-black"
          )}
        >
          {copied ? <Check className="size-3.5" /> : <ClipboardCopy className="size-3.5" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>

      {/* progress */}
      <div className="mt-4 rounded-2xl border border-line bg-coal p-3.5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink/40">
          <span>recruits</span>
          <span className={cn("font-bold", friends >= 5 ? "text-up" : "text-amber")}>{friends}/5</span>
        </div>
        <div className="mt-2.5 flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="-ml-2 first:ml-0">
              {i < friends ? (
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="grid size-9 place-items-center rounded-full border-2 border-black font-display text-xs text-black"
                  style={{ background: PALETTE[i] }}
                >
                  {["KD", "RV", "MZ", "JP", "TT"][i]}
                </motion.div>
              ) : (
                <div className="grid size-9 place-items-center rounded-full border-2 border-dashed border-ink/20 text-ink/25">
                  <UserPlus className="size-4" />
                </div>
              )}
            </div>
          ))}
          <div className="ml-auto">
            {friends < 5 ? (
              <button
                onClick={() => {
                  setFriends((f) => Math.min(5, f + 1));
                  buzz(HAPTIC.success);
                }}
                className="pressable rounded-full border border-acid/50 px-3.5 py-2 font-mono text-[9px] font-bold uppercase text-acid"
              >
                + invite lands
              </button>
            ) : (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 rounded-full border border-up/60 bg-up/10 px-3 py-2 font-mono text-[9px] font-bold uppercase text-up"
              >
                <Gift className="size-3.5" /> +50 stars ready
              </motion.span>
            )}
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className={cn("h-full rounded-full", friends >= 5 ? "bg-up" : "bg-amber")}
            animate={{ scaleX: friends / 5 }}
            style={{ originX: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={() => buzz(HAPTIC.light)} className="pressable flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#54a9eb] font-mono text-[10px] font-bold uppercase text-white shadow-[3px_3px_0_#000]">
          <Send className="size-4" /> tg share
        </button>
        <button onClick={() => buzz(HAPTIC.light)} className="pressable flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-line bg-panel font-mono text-[10px] font-bold uppercase text-ink/70">
          <Share2 className="size-4" /> story
        </button>
      </div>

      <div className="mt-auto mb-10 flex items-center justify-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.25em] text-ink/30">
        <Users className="size-3" /> startapp=ref_8X2K tracked on open
      </div>
    </div>
  );
}

/* ---------------------------------- E-04 ---------------------------------- */
interface Mission {
  id: number;
  title: string;
  desc: string;
  prog: number;
  max: number;
  reward: number;
}

const MISSIONS: Mission[] = [
  { id: 1, title: "Seal 3 hypotheses", desc: "Blind или Daily. Без отмен — ты ж помнишь.", prog: 2, max: 3, reward: 30 },
  { id: 2, title: "Study 5 dossiers", desc: "Пролистай улики перед входом.", prog: 5, max: 5, reward: 20 },
  { id: 3, title: "Invite a degen", desc: "Рефералка — это тоже позиция.", prog: 0, max: 1, reward: 50 },
];

export function MissionsDemo() {
  const [claimed, setClaimed] = useState<number[]>([]);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [stars, setStars] = useState(447);
  const shownStars = useCountUp(stars);

  const claim = (m: Mission) => {
    setClaiming(m.id);
    buzz(HAPTIC.medium);
    setTimeout(() => {
      setClaiming(null);
      setClaimed((c) => [...c, m.id]);
      setStars((s) => s + m.reward);
      buzz(HAPTIC.success);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col px-4 pt-12">
      {/* header */}
      <div className="relative flex items-center justify-between">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">daily missions</div>
          <div id="hud-stars" className="flex items-center gap-1 font-mono text-sm font-bold text-amber">
            <Coins className="size-4" /> {fmt(shownStars)}
          </div>
        </div>
        <span className="rounded border border-line px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-ink/40">
          reset 07:41:00
        </span>

        {/* flying coins */}
        <AnimatePresence>
          {claiming !== null &&
            [0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={{ x: 90, y: 240, scale: 1, opacity: 1 }}
                animate={{ x: -60, y: 0, scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.06, ease: "easeIn" }}
                className="absolute right-2 top-1 z-10"
              >
                <Coins className="size-4 text-amber" />
              </motion.span>
            ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 space-y-2.5">
        <AnimatePresence initial={false}>
          {MISSIONS.filter((m) => !claimed.includes(m.id)).map((m) => {
            const done = m.prog >= m.max;
            const isClaiming = claiming === m.id;
            return (
              <motion.div
                key={m.id}
                layout
                exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0, overflow: "hidden" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "rounded-2xl border p-3.5",
                  done ? "border-acid/60 bg-acid/5" : "border-line bg-coal"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold">{m.title}</div>
                    <div className="mt-0.5 text-[11px] leading-snug text-ink/50">{m.desc}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber/10 border border-amber/40 px-2 py-0.5 font-mono text-[10px] font-bold text-amber">
                    +{m.reward}★
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", done ? "bg-acid" : "bg-amber")}
                      style={{ width: `${(m.prog / m.max) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold tabular-nums text-ink/50">
                    {m.prog}/{m.max}
                  </span>
                  {done && (
                    <button
                      onClick={() => claim(m)}
                      disabled={isClaiming}
                      className="animate-pulse-ring pressable flex min-h-[36px] min-w-[76px] items-center justify-center gap-1 rounded-lg border-2 border-black bg-acid px-3 font-mono text-[10px] font-bold uppercase text-black shadow-[2px_2px_0_#000]"
                    >
                      {isClaiming ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                      claim
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {claimed.length === MISSIONS.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid place-items-center gap-2 rounded-2xl border border-dashed border-up/40 p-6"
          >
            <Check className="size-8 text-up" />
            <div className="font-display text-lg uppercase">all missions cleared</div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink/40">возвращайся после ресета</p>
            <button
              onClick={() => setClaimed([])}
              className="pressable mt-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-acid"
            >
              <RotateCcw className="size-3" /> reset demo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
