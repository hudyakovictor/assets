import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Coins, Gem, Minus, Package, Plus, RefreshCw, Tag, Timer } from "lucide-react";
import { Btn, StageNote, randInt } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* ECO-01 — STORE TILE                                                 */
/* ------------------------------------------------------------------ */
export function StoreDemo() {
  const [left, setLeft] = useState(299);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = window.setInterval(() => setLeft((v) => (v <= 0 ? 299 : v - 1)), 1000);
    return () => window.clearInterval(t);
  }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-5 overflow-hidden select-none" style={{ perspective: 700 }}>
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.16em] text-fog/70 uppercase">
        витрина · оффер недели
      </div>

      {/* hero tile */}
      <motion.div
        className="relative w-40 overflow-hidden rounded-xl border-2 border-amb/70 bg-panel2"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({
            x: -(((e.clientY - r.top) / r.height) - 0.5) * 10,
            y: (((e.clientX - r.left) / r.width) - 0.5) * 12,
          });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
      >
        {/* looping shine */}
        <div className="anim-shine pointer-events-none absolute top-[-30%] left-0 z-10 h-[160%] w-8 bg-white/10" />

        <div className="relative flex h-24 items-center justify-center bg-panel">
          <Package className="h-12 w-12 text-amb" />
          <motion.span
            animate={{ rotate: [-10, -4, -10] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute top-2 right-2 flex items-center gap-1 rounded bg-blood px-1.5 py-0.5 font-mono text-[9px] font-black text-ink"
          >
            <Tag className="h-2.5 w-2.5" /> -50%
          </motion.span>
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded border border-line2 bg-ink/70 px-1.5 py-0.5 font-mono text-[8px] text-amb">
            <Timer className="h-2.5 w-2.5" /> {mm}:{ss}
          </span>
        </div>
        <div className="border-t border-line p-2.5">
          <span className="font-display text-[11px] font-bold text-snow">НАБОР ТЕНЕЙ</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-[10px] text-fog line-through">1 299</span>
            <span className="font-mono text-sm font-black text-volt">649</span>
            <span className="font-mono text-[8px] text-fog">кр.</span>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            className="mt-2 w-full cursor-pointer rounded-md bg-volt py-1.5 font-mono text-[9px] font-black tracking-[0.2em] text-ink"
          >
            В КОРЗИНУ
          </motion.button>
        </div>
      </motion.div>

      {/* compact rows */}
      <div className="flex w-44 flex-col gap-2">
        {[
          { icon: Gem, n: "КУЛОН БУРИ", p: "129", c: "#a78bff" },
          { icon: Coins, n: "×100 ЗОЛОТА", p: "59", c: "#ffb43a" },
          { icon: Package, n: "ДЕЙЛИ-ЯЩИК", p: "0", c: "#38e1ff" },
        ].map((o, i) => (
          <motion.div
            key={o.n}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2 rounded-lg border border-line bg-panel2 p-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded border" style={{ borderColor: o.c, background: `${o.c}12` }}>
              <o.icon className="h-4 w-4" style={{ color: o.c }} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-[8px] font-bold tracking-wider text-snow">{o.n}</span>
              <span className="font-mono text-[8px] text-fog">{o.p === "0" ? "БЕСПЛАТНО" : `${o.p} кр.`}</span>
            </span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              className={cn(
                "cursor-pointer rounded px-2 py-1 font-mono text-[8px] font-black",
                o.p === "0" ? "bg-volt text-ink" : "border border-line2 text-snow hover:border-volt"
              )}
            >
              {o.p === "0" ? "ЗАБРАТЬ" : "КУПИТЬ"}
            </motion.button>
          </motion.div>
        ))}
      </div>
      <StageNote>блик-проточка каждые ~3 с · тилт за курсором</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ECO-02 — CURRENCY ODOMETER                                          */
/* ------------------------------------------------------------------ */
export function CurrencyDemo() {
  const [value, setValue] = useState(12850);
  const [delta, setDelta] = useState<{ id: number; v: number } | null>(null);

  const add = (v: number) => {
    setValue((x) => Math.max(0, x + v));
    const id = Date.now();
    setDelta({ id, v });
    window.setTimeout(() => setDelta((d) => (d?.id === id ? null : d)), 900);
  };

  const digits = String(value).padStart(6, " ").split("");

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden select-none">
      <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.3em] text-fog uppercase">
        <Coins className="h-3.5 w-3.5 text-amb" /> золото счёта
      </span>

      <div className="relative flex items-center gap-[3px]">
        {digits.map((d, i) => (
          <div
            key={i}
            className={cn(
              "h-[1.1em] overflow-hidden rounded border font-display text-3xl leading-none font-black",
              d === " " ? "w-2 border-transparent" : "w-[0.72em] border-line bg-panel2 text-center"
            )}
          >
            {d !== " " && (
              <motion.div
                animate={{ y: `-${Number(d)}em` }}
                transition={{ type: "spring", stiffness: 140, damping: 21, delay: (digits.length - i) * 0.03 }}
              >
                {Array.from({ length: 10 }).map((_, n) => (
                  <div key={n} className={cn("flex h-[1.1em] items-center justify-center", i > 2 ? "text-amb" : "text-snow")}>
                    {n}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}

        <AnimatePresence>
          {delta && (
            <motion.span
              key={delta.id}
              initial={{ opacity: 0, y: 6, scale: 0.7 }}
              animate={{ opacity: 1, y: -18, scale: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute -top-3 right-0 font-mono text-xs font-black",
                delta.v > 0 ? "text-volt" : "text-blood"
              )}
            >
              {delta.v > 0 ? "+" : ""}
              {delta.v}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <Btn tone="amber" onClick={() => add(100)}>
          <Plus className="h-3 w-3" /> 100
        </Btn>
        <Btn tone="amber" onClick={() => add(1000)}>
          <Plus className="h-3 w-3" /> 1к
        </Btn>
        <Btn tone="red" onClick={() => add(-randInt(200, 900))}>
          <Minus className="h-3 w-3" /> списать
        </Btn>
      </div>
      <StageNote>каскад пружин по разрядам</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ECO-03 — PURCHASE MORPH                                             */
/* ------------------------------------------------------------------ */
type BuyPhase = "idle" | "work" | "done";

export function PurchaseDemo() {
  const [phase, setPhase] = useState<BuyPhase>("idle");

  const buy = () => {
    if (phase !== "idle") return;
    setPhase("work");
    window.setTimeout(() => setPhase("done"), 1500);
    window.setTimeout(() => setPhase("idle"), 3300);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden select-none">
      <span className="font-mono text-[9px] tracking-[0.3em] text-fog uppercase">микро-чекаут в 3 состояния</span>

      <motion.button
        type="button"
        onClick={buy}
        animate={{
          width: phase === "work" ? 56 : 208,
          borderRadius: phase === "work" ? 28 : 10,
          backgroundColor: phase === "done" ? "#35d07f" : "#d7ff3e",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 27 }}
        className="flex h-12 cursor-pointer items-center justify-center overflow-hidden text-ink"
        whileTap={phase === "idle" ? { scale: 0.94 } : undefined}
      >
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-mono text-[10px] font-black tracking-[0.2em] whitespace-nowrap"
            >
              ОФОРМИТЬ · 649 КР.
            </motion.span>
          )}
          {phase === "work" && (
            <motion.span
              key="work"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <RefreshCw className="anim-spin-fast h-5 w-5" />
            </motion.span>
          )}
          {phase === "done" && (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-1.5 font-mono text-[10px] font-black tracking-[0.2em] whitespace-nowrap"
            >
              <Check className="h-4 w-4" strokeWidth={3.5} /> ОПЛАЧЕНО
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* receipt line */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded border border-line bg-panel2 px-4 py-2 font-mono text-[9px] tracking-[0.14em] text-fog"
          >
            #TRX-{randInt(10000, 99999)} · НАБОР ТЕНЕЙ · 649 КР. · <span className="text-volt">OK</span>
          </motion.div>
        )}
      </AnimatePresence>
      <StageNote>ширина и радиус меняет один spring</StageNote>
    </div>
  );
}
