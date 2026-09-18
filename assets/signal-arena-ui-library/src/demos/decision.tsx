import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Fingerprint,
  Lock,
  PenLine,
  RotateCcw,
  Stamp,
  Timer,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { buzz, HAPTIC } from "../lib/fx";
import { cn } from "../utils/cn";

/* ---------------------------------- C-01 ---------------------------------- */
type Phase = "compose" | "sealing" | "sealed";

export function WorkspaceDemo() {
  const [bias, setBias] = useState<"long" | "short" | null>(null);
  const [conv, setConv] = useState(0);
  const [phase, setPhase] = useState<Phase>("compose");

  useEffect(() => {
    if (phase !== "sealing") return;
    const t = setTimeout(() => {
      setPhase("sealed");
      buzz(HAPTIC.seal);
    }, 1400);
    return () => clearTimeout(t);
  }, [phase]);

  const reset = () => {
    setPhase("compose");
    setBias(null);
    setConv(0);
  };

  const ready = bias && conv > 0;

  return (
    <div className="flex h-full flex-col">
      {/* market strip */}
      <div className="mt-9 flex items-center justify-between border-b border-line px-4 pb-2 pt-2">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">BTC-PERP · 1H</div>
          <div className="font-mono text-lg font-bold text-up">64,120.5</div>
        </div>
        <div
          className={cn(
            "rounded border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest transition-colors",
            phase === "sealed"
              ? "border-alarm/60 bg-alarm/10 text-alarm"
              : ready
                ? "border-acid/50 bg-acid/10 text-acid"
                : "border-line text-ink/40"
          )}
        >
          {phase === "sealed" ? "● sealed" : ready ? "● armed" : "○ drafting"}
        </div>
      </div>

      {/* fake chart zone */}
      <div className="relative flex-1 gridlines">
        <svg viewBox="0 0 318 200" className="absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="none">
          <polyline
            points="0,150 30,140 60,155 90,120 120,128 150,100 180,112 210,84 240,95 270,70 300,80 318,60"
            fill="none"
            stroke="#31e58c"
            strokeWidth="2"
          />
          <line x1="240" y1="0" x2="240" y2="200" stroke="#c9ff2e" strokeDasharray="4 4" strokeWidth="1.5" />
        </svg>
        <div className="hatch absolute right-0 top-0 h-full w-[22%] bg-alarm/5" />
        <div className="absolute right-2 top-2 font-mono text-[8px] uppercase tracking-widest text-alarm/70">
          future — classified
        </div>

        {/* sealing ring */}
        <AnimatePresence>
          {phase === "sealing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 grid place-items-center bg-black/70"
            >
              <div className="relative size-28">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-acid"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
                  className="absolute inset-3 rounded-full border border-ink/25"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <Fingerprint className="size-8 text-acid" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* sealed stamp */}
        <AnimatePresence>
          {phase === "sealed" && (
            <motion.div
              initial={{ scale: 3, opacity: 0, rotate: 8 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="border-4 border-alarm px-5 py-2 font-display text-4xl uppercase tracking-widest text-alarm shadow-[0_0_40px_rgba(255,51,85,0.35)]">
                sealed
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* workspace panel */}
      <div className={cn("border-t border-line bg-coal px-4 pb-8 pt-3 transition-opacity", phase === "sealed" && "pointer-events-none opacity-40")}>
        <div className="mb-3 grid grid-cols-2 gap-2">
          {(["long", "short"] as const).map((b) => (
            <button
              key={b}
              onClick={() => {
                setBias(b);
                buzz(HAPTIC.light);
              }}
              className={cn(
                "pressable flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 font-display text-lg uppercase tracking-wider transition-colors",
                bias === b
                  ? b === "long"
                    ? "border-up bg-up/15 text-up"
                    : "border-down bg-down/15 text-down"
                  : "border-ink/15 text-ink/50"
              )}
            >
              {b === "long" ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
              {b}
            </button>
          ))}
        </div>
        <div className="mb-3 flex items-center justify-between gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">conviction</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => {
                setConv(n);
                buzz(HAPTIC.tick);
              }}
              className={cn(
                "h-8 flex-1 rounded border transition-all",
                n <= conv ? "border-acid bg-acid" : "border-ink/15 bg-transparent"
              )}
            />
          ))}
        </div>
        {phase !== "sealed" ? (
          <button
            disabled={!ready || phase === "sealing"}
            onClick={() => setPhase("sealing")}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 font-display text-xl uppercase tracking-widest transition-all",
              ready
                ? "border-black bg-alarm text-white shadow-[4px_4px_0_#000] pressable"
                : "cursor-not-allowed border-ink/10 text-ink/25"
            )}
          >
            <Lock className="size-5" />
            {phase === "sealing" ? "sealing…" : "seal hypothesis"}
          </button>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2.5 font-mono text-[10px] text-ink/60">
              <Timer className="size-3.5 text-amber" /> reveal in 6 candles
            </div>
            <button
              onClick={reset}
              className="pressable pointer-events-auto flex items-center gap-1.5 rounded-lg border border-acid/50 px-3 py-2.5 font-mono text-[10px] font-bold uppercase text-acid opacity-100"
              style={{ pointerEvents: "auto" }}
            >
              <RotateCcw className="size-3.5" /> re-draft
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- C-02 ---------------------------------- */
const LAST = 64120;
const ASSETS = ["BTC-PERP", "ETH-PERP", "SOL-PERP"];
const DIRS = ["PUMP ▲", "DUMP ▼"];
const TARGETS = [63800, 64400, 65200];
const WINDOWS = ["4 candles", "6 candles", "9 candles"];

function Chip({ label, onTap, danger }: { label: string; onTap: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onTap}
      className={cn(
        "pressable inline-flex min-h-[32px] items-center rounded-lg border px-2 font-mono text-[12px] font-bold",
        danger ? "border-alarm/70 bg-alarm/15 text-alarm" : "border-acid/50 bg-acid/10 text-acid"
      )}
    >
      {label}
    </button>
  );
}

export function HypothesisDemo() {
  const [a, setA] = useState(0);
  const [d, setD] = useState(0);
  const [t, setT] = useState(1);
  const [w, setW] = useState(1);
  const [sealed, setSealed] = useState(false);
  const [shake, setShake] = useState(0);

  const pump = d === 0;
  const invalid = pump ? TARGETS[t] <= LAST : TARGETS[t] >= LAST;

  const trySeal = () => {
    if (invalid) {
      setShake((s) => s + 1);
      buzz(HAPTIC.error);
      return;
    }
    buzz(HAPTIC.seal);
    setSealed(true);
  };

  return (
    <div className="flex h-full flex-col justify-center px-5">
      <div style={{ perspective: 900 }}>
        <motion.div
          animate={{ rotateY: sealed ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* front */}
          <div
            key={shake}
            className={cn(
              "rounded-2xl border border-ink/15 bg-coal p-4 shadow-[6px_6px_0_rgba(0,0,0,0.6)]",
              shake > 0 && "animate-shake"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">
                build the call
              </span>
              <span className="font-mono text-[10px] text-ink/50">
                last <span className="text-up font-bold">{LAST.toLocaleString()}</span>
              </span>
            </div>
            <p className="text-[15px] leading-[2.3] text-ink/85">
              <Chip label={ASSETS[a]} onTap={() => setA((a + 1) % ASSETS.length)} /> will{" "}
              <Chip
                label={DIRS[d]}
                danger={d === 1}
                onTap={() => setD((d + 1) % DIRS.length)}
              />{" "}
              past{" "}
              <Chip
                label={TARGETS[t].toLocaleString()}
                danger={invalid}
                onTap={() => setT((t + 1) % TARGETS.length)}
              />{" "}
              within <Chip label={WINDOWS[w]} onTap={() => setW((w + 1) % WINDOWS.length)} />.
            </p>

            <AnimatePresence>
              {invalid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-alarm/50 bg-alarm/10 px-2.5 py-2 text-[11px] text-alarm">
                    <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
                    {pump ? "Цель уже пробита — это не прогноз, это констатация." : "Цель выше текущей — для шорта это лонг."}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={trySeal}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3.5 font-display text-base uppercase tracking-widest pressable",
                invalid
                  ? "border-ink/10 text-ink/30"
                  : "border-black bg-acid text-black shadow-[3px_3px_0_#000]"
              )}
            >
              <Stamp className="size-4.5" /> seal it
            </button>
          </div>

          {/* back */}
          <div
            className="absolute inset-0 grid place-items-center rounded-2xl border-2 border-alarm bg-coal"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="-rotate-12 border-4 border-alarm px-4 py-1.5 font-display text-3xl uppercase tracking-widest text-alarm">
              sealed
            </div>
          </div>
        </motion.div>
      </div>

      {sealed && (
        <button
          onClick={() => setSealed(false)}
          className="mx-auto mt-5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/40 pressable"
        >
          <RotateCcw className="size-3" /> new hypothesis
        </button>
      )}
    </div>
  );
}

/* ---------------------------------- C-03 ---------------------------------- */
export function InvalidationDemo() {
  const [bias, setBias] = useState<"long" | "short" | null>(null);
  const [text, setText] = useState("");
  const [state, setState] = useState<"draft" | "error" | "ok">("draft");
  const [shake, setShake] = useState(0);

  const chips = ["Funding flips against me", "HTF structure breaks", "OI cliff dive", "DXY rips +1%"];

  const submit = () => {
    if (text.trim().length < 12) {
      setState("error");
      setShake((s) => s + 1);
      buzz(HAPTIC.error);
      return;
    }
    setState("ok");
    buzz(HAPTIC.success);
  };

  return (
    <div className="flex h-full flex-col px-5 pt-16">
      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">step 1 — bias</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(["long", "short"] as const).map((b) => (
          <button
            key={b}
            onClick={() => {
              setBias(b);
              setState("draft");
              buzz(HAPTIC.light);
            }}
            className={cn(
              "pressable flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border-2 font-display text-sm uppercase tracking-wider",
              bias === b
                ? b === "long"
                  ? "border-up bg-up/15 text-up"
                  : "border-down bg-down/15 text-down"
                : "border-ink/15 text-ink/45"
            )}
          >
            {b === "long" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            {b}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {bias && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="overflow-hidden"
          >
            <div key={shake} className={cn("pt-4", shake > 0 && state === "error" && "animate-shake")}>
              <div className="flex items-center justify-between">
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">
                  step 2 — what kills this?
                </div>
                {state === "ok" && <CheckCheck className="size-4 text-up" />}
              </div>
              <textarea
                value={text}
                disabled={state === "ok"}
                onChange={(e) => {
                  setText(e.target.value);
                  setState("draft");
                }}
                placeholder="If price does X, I'm wrong…"
                rows={3}
                className={cn(
                  "mt-2 w-full resize-none rounded-xl border bg-black/60 px-3 py-2.5 text-[13px] text-ink placeholder:text-ink/25 focus:outline-none transition-colors",
                  state === "error" ? "border-alarm/70" : state === "ok" ? "border-up/60" : "border-ink/20 focus:border-acid/60"
                )}
              />
              <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-ink/35">
                <span>{state === "error" ? "минимум 12 символов честности" : "обязательно для seal"}</span>
                <span className={text.trim().length >= 12 ? "text-up" : ""}>{text.trim().length}/120</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setText((t) => (t ? t + "; " : "") + c.toLowerCase());
                      setState("draft");
                    }}
                    className="pressable rounded-full border border-line bg-panel px-2.5 py-1.5 font-mono text-[9px] text-ink/60"
                  >
                    + {c}
                  </button>
                ))}
              </div>
              <button
                onClick={submit}
                className={cn(
                  "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 font-mono text-[11px] font-bold uppercase tracking-widest pressable",
                  state === "ok"
                    ? "border-up bg-up/15 text-up"
                    : "border-black bg-alarm text-white shadow-[3px_3px_0_#000]"
                )}
              >
                {state === "ok" ? (
                  <>
                    <Check className="size-4" /> invalidation sealed
                  </>
                ) : (
                  <>
                    <PenLine className="size-4" /> commit invalidation
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!bias && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-ink/15 px-3 py-3 font-mono text-[10px] text-ink/35">
          <TriangleAlert className="size-4 shrink-0" />
          Секция инвалидации откроется после выбора направления
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- C-04 ---------------------------------- */
const EVIDENCE = [
  { k: "FUNDING", v: "+0.084% / 8h", verdict: "BEARISH", cls: "text-down border-down/50", note: "Лонги перегреты, толпа платит за удержание." },
  { k: "OPEN INTEREST", v: "+12% / 24h", verdict: "BULLISH", cls: "text-up border-up/50", note: "Позиции наращиваются вместе с ценой." },
  { k: "WHALE FLOW", v: "320 BTC in", verdict: "BULLISH", cls: "text-up border-up/50", note: "Крупный вход на спот со снятием с биржи." },
  { k: "SOCIAL HEAT", v: "ATH mentions", verdict: "NOISE", cls: "text-amber border-amber/50", note: "Все уже обсудили. Сигнал = 0." },
];

export function EvidenceDemo() {
  const [order, setOrder] = useState(EVIDENCE.map((_, i) => i));
  const [seen, setSeen] = useState(1);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 160], [-14, 14]);
  const done = seen >= EVIDENCE.length;

  const cycle = () => {
    setOrder((o) => [...o.slice(1), o[0]]);
    setSeen((s) => Math.min(EVIDENCE.length, s + 1));
    buzz(HAPTIC.light);
  };

  return (
    <div className="flex h-full flex-col px-6 pt-14">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">dossier #042</span>
        <span className={cn("font-mono text-[10px] font-bold", done ? "text-acid" : "text-ink/50")}>
          {done ? "STUDIED ✓" : `${seen}/${EVIDENCE.length}`}
        </span>
      </div>

      <div className="relative mt-4 h-[300px]">
        {order
          .slice(0, 3)
          .map((cardIdx, slot) => {
            const c = EVIDENCE[cardIdx];
            const isTop = slot === 0;
            return (
              <motion.div
                key={cardIdx}
                className="absolute inset-x-0 rounded-2xl border border-ink/15 bg-coal p-5 shadow-[5px_5px_0_rgba(0,0,0,0.6)]"
                style={isTop ? { x, rotate, zIndex: 10 } : { zIndex: 10 - slot }}
                animate={
                  isTop
                    ? { scale: 1, y: 0, opacity: 1 }
                    : { scale: 1 - slot * 0.05, y: slot * 14, opacity: 1 - slot * 0.25 }
                }
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 500) cycle();
                }}
                whileDrag={{ cursor: "grabbing" }}
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">{c.k}</div>
                <div className="mt-2 font-display text-3xl uppercase tracking-wide text-ink">{c.v}</div>
                <div className={cn("mt-2 inline-flex rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold", c.cls)}>
                  {c.verdict}
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-ink/55">{c.note}</p>
                {isTop && !done && (
                  <div className="pointer-events-none absolute inset-x-0 -bottom-8 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-ink/30">
                    ← swipe →
                  </div>
                )}
              </motion.div>
            );
          })
          .reverse()}

        {done && (
          <motion.div
            initial={{ scale: 2.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: -10 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 border-4 border-acid bg-black/60 px-5 py-2 font-display text-3xl uppercase tracking-widest text-acid"
          >
            studied
          </motion.div>
        )}
      </div>

      <button
        onClick={() => {
          setOrder(EVIDENCE.map((_, i) => i));
          setSeen(0);
        }}
        className="mx-auto mt-auto mb-10 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/40 pressable"
      >
        <RotateCcw className="size-3" /> shuffle dossier
      </button>
    </div>
  );
}
