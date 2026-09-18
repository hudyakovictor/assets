import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Box, Gamepad2, Layers, Smartphone } from "lucide-react";
import { cn } from "../utils/cn";
import PhoneStage from "./PhoneStage";
import type { Asset } from "../data/assets";

const TABS = [
  { id: "demo", label: "LIVE DEMO", icon: Gamepad2 },
  { id: "spec", label: "СОСТОЯНИЯ", icon: Layers },
  { id: "build", label: "СБОРКА", icon: Box },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AssetCard({
  asset,
  demo,
  wide = false,
}: {
  asset: Asset;
  demo: ReactNode;
  wide?: boolean;
}) {
  const [tab, setTab] = useState<TabId>("demo");

  return (
    <motion.article
      id={asset.id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "hardcard relative flex flex-col overflow-hidden rounded-2xl scroll-mt-28",
        wide && "lg:col-span-2"
      )}
    >
      {/* header */}
      <header className="relative border-b border-line px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-acid">{asset.id}</span>
              <span className="h-px w-6 bg-line" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
                {asset.cat}
              </span>
            </div>
            <h3 className="font-display text-2xl uppercase leading-none tracking-wide text-ink">
              {asset.name}
            </h3>
          </div>
          <div className="sticker sticker-ghost -rotate-2 shrink-0">{asset.tag}</div>
        </div>
        <p className="mt-2.5 text-[13px] leading-relaxed text-ink/55">{asset.tagline}</p>
      </header>

      {/* tabs */}
      <div className="flex items-center gap-1 border-b border-line bg-black/30 px-3 py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors",
              tab === t.id ? "text-black" : "text-ink/50 hover:text-ink"
            )}
          >
            {tab === t.id && (
              <motion.span
                layoutId={`tab-${asset.id}`}
                className="absolute inset-0 rounded-md bg-acid"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <t.icon className="relative z-10 size-3" />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
        <span className="ml-auto hidden font-mono text-[10px] text-ink/30 sm:block">
          60fps · touch ≥44px
        </span>
      </div>

      {/* body */}
      <div className="relative flex-1 bg-[#0a0a0d]">
        {tab === "demo" && (
          <div className="halftone flex min-h-[500px] items-center justify-center px-4 py-8">
            <PhoneStage height={asset.stage ?? 560} label={asset.label}>
              {demo}
            </PhoneStage>
          </div>
        )}

        {tab === "spec" && (
          <div className="px-5 py-6">
            <div className="mb-5">
              <div className="section-cap">Роль в кадре</div>
              <p className="text-[13px] leading-relaxed text-ink/70">{asset.role}</p>
            </div>

            <div className="section-cap">Машина состояний</div>
            <div className="mb-5 space-y-2">
              {asset.states.map((s) => (
                <div key={s.k} className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      "w-24 shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-[10px] font-bold uppercase",
                      s.k === "idle" && "border-line text-ink/50",
                      s.k === "press" && "border-cyanic/40 text-cyanic",
                      s.k === "active" && "border-acid/50 text-acid",
                      s.k === "loading" && "border-amber/50 text-amber",
                      s.k === "error" && "border-alarm/60 text-alarm",
                      s.k === "success" && "border-up/50 text-up",
                      s.k === "disabled" && "border-line text-ink/30"
                    )}
                  >
                    {s.k}
                  </span>
                  <span className="text-[12px] leading-snug text-ink/55">{s.v}</span>
                </div>
              ))}
            </div>

            <div className="section-cap">Интерактив</div>
            <div className="flex flex-wrap gap-1.5">
              {asset.interactions.map((i) => (
                <span
                  key={i}
                  className="rounded-full border border-line bg-panel px-2.5 py-1 font-mono text-[10px] text-ink/60"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === "build" && (
          <div className="px-5 py-6 font-mono text-[11.5px] leading-relaxed">
            {[
              { icon: Gamepad2, k: "PHASER 4", v: asset.phaser, c: "text-acid" },
              { icon: Box, k: "HYBRID DOM", v: asset.dom, c: "text-cyanic" },
              { icon: Smartphone, k: "TG MINI APP", v: asset.tg, c: "text-amber" },
              { icon: Layers, k: "В ИГРЕ", v: asset.usage, c: "text-alarm" },
            ].map((r) => (
              <div key={r.k} className="mb-4 border-l-2 border-line pl-3">
                <div className={cn("mb-1 flex items-center gap-1.5 font-bold tracking-wider", r.c)}>
                  <r.icon className="size-3.5" />
                  {r.k}
                </div>
                <p className="text-ink/60">{r.v}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
