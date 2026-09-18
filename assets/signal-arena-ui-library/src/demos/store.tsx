import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Crown, Loader2, RotateCcw, ShieldCheck, Sparkles, Star, X } from "lucide-react";
import { buzz, HAPTIC } from "../lib/fx";
import { cn } from "../utils/cn";

type Phase = "idle" | "sheet" | "processing" | "owned";

const PERKS = ["Founder badge навсегда", "+20% к начислению Stars", "Кастомная печать SEAL", "Имя в титрах движка"];

export function StoreDemo() {
  const [phase, setPhase] = useState<Phase>("idle");

  const pay = () => {
    setPhase("processing");
    buzz(HAPTIC.medium);
    setTimeout(() => {
      setPhase("owned");
      buzz(HAPTIC.success);
    }, 1600);
  };

  return (
    <div className="relative flex h-full flex-col px-4 pt-12">
      <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">store · 1 item. forever.</div>

      {/* product card */}
      <div className={cn("relative overflow-hidden rounded-2xl border shadow-[5px_5px_0_rgba(0,0,0,0.6)] transition-colors", phase === "owned" ? "border-up/60" : "border-amber/50")}>
        {/* art */}
        <div className="relative h-28 overflow-hidden bg-[#151009]">
          <div className="hatch-acid absolute inset-0 opacity-20" />
          <Crown className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-amber drop-shadow-[0_0_20px_rgba(255,194,75,0.5)]" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-amber/40"
          />
          <div className="sticker absolute left-3 top-3 -rotate-3 !text-[8px]">limited · 500</div>
          {phase === "owned" && (
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: -10 }}
              className="absolute right-3 top-3 border-4 border-up px-2 py-0.5 font-display text-lg uppercase text-up"
            >
              owned
            </motion.div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl uppercase">Founder pack</span>
            <span className="flex items-center gap-1 rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 font-mono text-[12px] font-bold text-amber">
              <Star className="size-3.5 fill-amber" /> 1 499
            </span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[12px] text-ink/65">
                <Sparkles className="size-3.5 shrink-0 text-amber" /> {p}
              </li>
            ))}
          </ul>
          <button
            disabled={phase !== "idle"}
            onClick={() => setPhase("sheet")}
            className={cn(
              "mt-4 w-full rounded-xl border-2 border-black py-3.5 font-display text-lg uppercase tracking-widest pressable",
              phase === "owned"
                ? "border-up/60 bg-up/10 text-up"
                : "bg-amber text-black shadow-[4px_4px_0_#000] disabled:opacity-90"
            )}
          >
            {phase === "owned" ? "in your pocket" : "buy founder pack"}
          </button>
        </div>
      </div>

      {phase === "owned" && (
        <button
          onClick={() => setPhase("idle")}
          className="mx-auto mt-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ink/40 pressable"
        >
          <RotateCcw className="size-3" /> reset demo flow
        </button>
      )}

      {/* invoice sheet */}
      <AnimatePresence>
        {(phase === "sheet" || phase === "processing") && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => phase === "sheet" && setPhase("idle")}
              className="absolute inset-0 z-20 bg-black/60"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "110%" }}
              transition={{ type: "spring", stiffness: 360, damping: 38 }}
              className="absolute inset-x-0 bottom-0 z-30 rounded-t-3xl border-t-2 border-amber bg-coal px-5 pb-10 pt-3"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/25" />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">telegram invoice</span>
                <button onClick={() => setPhase("idle")} disabled={phase === "processing"} className="grid size-8 place-items-center rounded-full border border-line text-ink/50">
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-black/40 p-3">
                <div className="flex items-center gap-2.5">
                  <Crown className="size-5 text-amber" />
                  <div>
                    <div className="text-[13px] font-bold">Founder Pack</div>
                    <div className="font-mono text-[9px] text-ink/40">signal_arena · digital goods</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-mono text-[14px] font-bold text-amber">
                  <Star className="size-4 fill-amber" /> 1 499
                </div>
              </div>
              <button
                onClick={pay}
                disabled={phase === "processing"}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#54a9eb] py-4 font-mono text-[12px] font-bold uppercase tracking-widest text-white shadow-[4px_4px_0_#000] pressable disabled:opacity-80"
              >
                {phase === "processing" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> confirming on-chain…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" /> pay 1 499 stars
                  </>
                )}
              </button>
              <div className="mt-2.5 flex items-center justify-center gap-1 font-mono text-[8px] uppercase tracking-widest text-ink/30">
                <BadgeCheck className="size-3" /> idempotent · webhook verified
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
