import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlarmClock,
  Check,
  ChevronRight,
  Coins,
  Flame,
  Info,
  LayoutGrid,
  ShieldAlert,
  Sparkles,
  Star,
  Swords,
  Trophy,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { buzz, fmt, HAPTIC, useCountUp } from "../lib/fx";
import { cn } from "../utils/cn";

/* stage backdrop shared by chrome demos */
function Backdrop({ title = "ARENA HUB" }: { title?: string }) {
  return (
    <div className="absolute inset-0 gridlines">
      <div className="flex h-full flex-col items-center justify-center gap-2 opacity-40">
        <Swords className="size-8 text-ink/40" />
        <span className="font-display text-xl uppercase tracking-widest text-ink/50">{title}</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/30">
          scene behind chrome
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------- A-01 ---------------------------------- */
export function TopBarDemo() {
  const [stars, setStars] = useState(2847);
  const [deltas, setDeltas] = useState<number[]>([]);
  const shown = useCountUp(stars);

  const grant = () => {
    setStars((s) => s + 150);
    setDeltas((d) => [...d.slice(-2), Date.now()]);
    buzz(HAPTIC.success);
  };

  return (
    <>
      <Backdrop />
      {/* top bar */}
      <div className="absolute inset-x-0 top-8 z-10 px-3">
        <div className="flex items-center gap-2 rounded-2xl border border-ink/12 bg-coal/90 px-3 py-2 backdrop-blur">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl border-2 border-acid bg-black font-display text-sm text-acid">
            SJ
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-bold">SATOSHI_JR</div>
            <div className="flex items-center gap-1 text-orange-400">
              <Flame className="size-3" />
              <span className="font-mono text-[10px] font-bold">7-day streak</span>
            </div>
          </div>
          <div className="relative flex items-center gap-1 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1.5">
            <Star className="size-3.5 fill-amber text-amber" />
            <span className="font-mono text-[12px] font-bold tabular-nums text-amber">
              {fmt(shown)}
            </span>
            <AnimatePresence>
              {deltas.map((d) => (
                <motion.span
                  key={d}
                  initial={{ opacity: 0, y: 4, scale: 0.6 }}
                  animate={{ opacity: 1, y: -18, scale: 1 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute -top-1 right-0 font-mono text-[10px] font-bold text-up"
                  onAnimationComplete={() =>
                    setDeltas((arr) => arr.filter((x) => x !== d))
                  }
                >
                  +150
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* trigger */}
      <div className="absolute inset-x-0 bottom-16 z-10 flex justify-center">
        <button
          onClick={grant}
          className="pressable flex min-h-[44px] items-center gap-2 rounded-full border-2 border-black bg-acid px-5 font-mono text-[11px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_#000]"
        >
          <Sparkles className="size-4" /> Simulate payout
        </button>
      </div>
    </>
  );
}

/* ---------------------------------- A-02 ---------------------------------- */
const TABS = [
  { id: "hub", icon: LayoutGrid, label: "Hub", badge: 0 },
  { id: "chart", icon: TrendingUp, label: "Chart", badge: 0 },
  { id: "rank", icon: Trophy, label: "Rank", badge: 3 },
  { id: "you", icon: User, label: "You", badge: 0 },
];

export function TabBarDemo() {
  const [tab, setTab] = useState("hub");

  return (
    <>
      <Backdrop title={tab.toUpperCase()} />
      <div className="absolute inset-x-0 bottom-0 z-10 pb-3">
        <div className="relative mx-3 flex items-end justify-between rounded-2xl border border-ink/12 bg-coal/95 px-2 pb-2 pt-2 backdrop-blur">
          {TABS.slice(0, 2).map((t) => (
            <TabBtn key={t.id} t={t} active={tab === t.id} onTap={setTab} />
          ))}
          {/* center arena action */}
          <div className="relative -top-4 px-1">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => buzz(HAPTIC.medium)}
              className="animate-pulse-ring grid size-14 place-items-center rounded-2xl border-2 border-black bg-alarm shadow-[4px_4px_0_#000]"
            >
              <Swords className="size-6 text-white" />
            </motion.button>
            <div className="mt-1 text-center font-mono text-[8px] font-bold uppercase tracking-wider text-alarm">
              Arena
            </div>
          </div>
          {TABS.slice(2).map((t) => (
            <TabBtn key={t.id} t={t} active={tab === t.id} onTap={setTab} />
          ))}
        </div>
      </div>
    </>
  );
}

function TabBtn({
  t,
  active,
  onTap,
}: {
  t: (typeof TABS)[number];
  active: boolean;
  onTap: (id: string) => void;
}) {
  return (
    <button
      onClick={() => {
        onTap(t.id);
        buzz(HAPTIC.light);
      }}
      className="relative flex w-14 flex-col items-center gap-0.5 py-1.5"
    >
      {active && (
        <motion.span
          layoutId="tabpill"
          className="absolute inset-0 rounded-xl bg-acid/15 border border-acid/40"
          transition={{ type: "spring", stiffness: 520, damping: 34 }}
        />
      )}
      <span className="relative">
        <motion.span
          animate={active ? { scale: [1, 0.82, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="block"
        >
          <t.icon className={cn("size-5", active ? "text-acid" : "text-ink/45")} />
        </motion.span>
        {!!t.badge && (
          <motion.span
            key={t.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 18 }}
            className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-alarm font-mono text-[8px] font-bold text-white"
          >
            {t.badge}
          </motion.span>
        )}
      </span>
      <span
        className={cn(
          "font-mono text-[8px] font-bold uppercase tracking-wider",
          active ? "text-acid" : "text-ink/40"
        )}
      >
        {t.label}
      </span>
    </button>
  );
}

/* ---------------------------------- A-03 ---------------------------------- */
type ToastKind = "success" | "error" | "info" | "achieve";
interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  msg: string;
}

const TOAST_STYLE: Record<ToastKind, { icon: typeof Check; cls: string }> = {
  success: { icon: Check, cls: "border-up/60 text-up" },
  error: { icon: X, cls: "border-alarm/70 text-alarm" },
  info: { icon: Info, cls: "border-cyanic/60 text-cyanic" },
  achieve: { icon: AlarmClock, cls: "border-amber/60 text-amber" },
};

export function ToastsDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (kind: ToastKind) => {
    const presets: Record<ToastKind, [string, string]> = {
      success: ["SIGNAL SAVED", "Hypothesis sealed to journal"],
      error: ["NETWORK DROPPED", "Chart data stale — retrying"],
      info: ["NEW SCENARIO", "Blind #043 unlocks in 02:14"],
      achieve: ["COLD BLOOD", "3 sealed trades, zero tilt"],
    };
    const [title, msg] = presets[kind];
    const id = Date.now();
    setToasts((t) => [...t.slice(-2), { id, kind, title, msg }]);
    buzz(kind === "error" ? HAPTIC.error : HAPTIC.success);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  return (
    <>
      <Backdrop />
      <div className="absolute inset-x-2 top-9 z-10 space-y-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const S = TOAST_STYLE[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 480, damping: 32 }}
                className={cn(
                  "relative overflow-hidden rounded-xl border-l-4 border border-ink/12 bg-coal/95 px-3 py-2.5 backdrop-blur",
                  S.cls
                )}
              >
                <div className="flex items-start gap-2.5">
                  <S.icon className="mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-display text-[13px] uppercase tracking-wide text-ink">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-ink/55">{t.msg}</div>
                  </div>
                </div>
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 3.2, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-current opacity-60"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-0 bottom-16 z-10 flex flex-wrap justify-center gap-1.5 px-4">
        {(["success", "error", "info", "achieve"] as ToastKind[]).map((k) => (
          <button
            key={k}
            onClick={() => push(k)}
            className="pressable min-h-[40px] rounded-lg border border-ink/20 bg-panel px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/80"
          >
            {k}
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------------------------------- A-04 ---------------------------------- */
export function SheetDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Backdrop />
      <div className="absolute inset-x-0 bottom-16 z-10 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="pressable flex min-h-[44px] items-center gap-2 rounded-full border-2 border-black bg-acid px-5 font-mono text-[11px] font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_#000]"
        >
          Open rules <ChevronRight className="size-4" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 z-20 bg-black/60"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "8%" }}
              exit={{ y: "105%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.55 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 550) setOpen(false);
              }}
              className="absolute inset-x-0 bottom-0 z-30 touch-none rounded-t-3xl border-t-2 border-acid bg-coal px-5 pb-10 pt-3"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/25" />
              <div className="mb-1 flex items-center justify-between">
                <span className="font-display text-lg uppercase tracking-wide">Blind #042</span>
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-9 place-items-center rounded-full border border-ink/15 text-ink/60"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
                drag down to dismiss
              </div>
              <ul className="mt-4 space-y-2.5 text-[12px] text-ink/70">
                {[
                  "Будущее скрыто за штриховкой — доступно только прошлое.",
                  "Гипотеза запечатывается один раз. Отмены нет.",
                  "Инвалидация обязательна: без неё SEAL не активен.",
                  "Результат раскрывается после 6 свечей будущего.",
                ].map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-alarm" />
                    {r}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setOpen(false);
                  buzz(HAPTIC.medium);
                }}
                className="pressable mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-alarm py-3.5 font-mono text-[12px] font-bold uppercase tracking-wider text-white shadow-[3px_3px_0_#000]"
              >
                <Coins className="size-4" /> Enter for 1 energy
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
