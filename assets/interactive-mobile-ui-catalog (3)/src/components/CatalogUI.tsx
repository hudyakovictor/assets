import { motion } from "framer-motion";
import { Hand, MousePointerClick, Move, Play } from "lucide-react";
import type { Asset, Category, Origin } from "@/data/catalog";
import { INTERACT_META, ORIGIN_META } from "@/data/catalog";
import { REGISTRY } from "@/demos/registry";
import { cn } from "@/utils/cn";

const INTERACT_ICONS = { tap: MousePointerClick, drag: Move, hold: Hand, auto: Play };

const ORIGIN_STYLE: Record<Origin, string> = {
  core: "border-cyc/50 text-cyc",
  plus: "border-amb/50 text-amb",
  new: "border-volt bg-volt text-ink font-black",
};

const TIER_LABEL = ["", "простая сборка", "средняя сборка", "сложная сборка"];

export function AssetCard({ asset, order }: { asset: Asset; order: number }) {
  const Demo = REGISTRY[asset.demo];
  const Icon = INTERACT_ICONS[asset.interact];

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: (order % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-line bg-panel transition-all duration-300 hover:border-volt/50 hover:shadow-[0_16px_60px_-20px_rgba(215,255,62,0.22)]",
        asset.wide && "sm:col-span-2"
      )}
    >
      {/* stage */}
      <div className="relative h-[300px] shrink-0 overflow-hidden border-b border-line">
        <div className="stage-dots absolute inset-0 opacity-70" />

        {/* corner brackets */}
        <span className="absolute top-1.5 left-1.5 z-30 h-2.5 w-2.5 border-t-2 border-l-2 border-fog/40 transition-colors group-hover:border-volt" />
        <span className="absolute top-1.5 right-1.5 z-30 h-2.5 w-2.5 border-t-2 border-r-2 border-fog/40 transition-colors group-hover:border-volt" />
        <span className="absolute bottom-1.5 left-1.5 z-30 h-2.5 w-2.5 border-b-2 border-l-2 border-fog/40 transition-colors group-hover:border-volt" />
        <span className="absolute right-1.5 bottom-1.5 z-30 h-2.5 w-2.5 border-r-2 border-b-2 border-fog/40 transition-colors group-hover:border-volt" />

        {/* chrome row */}
        <div className="pointer-events-none absolute top-2.5 right-3 left-3 z-30 flex items-center justify-between">
          <span className="font-mono text-[9px] font-bold tracking-[0.22em] text-volt/80">
            ▸ {asset.id}
          </span>
          <span className="flex items-center gap-1.5 rounded border border-line2 bg-ink/70 px-2 py-0.5 font-mono text-[8px] tracking-[0.18em] text-fog uppercase backdrop-blur">
            <Icon className="h-3 w-3 text-volt" />
            {INTERACT_META[asset.interact]}
          </span>
        </div>

        {/* demo */}
        <div className="absolute inset-0 pt-7 pb-1">{Demo && <Demo />}</div>

        <div className="bg-scan pointer-events-none absolute inset-0 z-20" />
      </div>

      {/* info */}
      <footer className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[13px] leading-tight font-bold text-snow transition-colors group-hover:text-volt">
            {asset.title}
          </h3>
          <span className="shrink-0 font-mono text-[8px] tracking-[0.2em] text-fog/50">{asset.en}</span>
        </div>
        <p className="mt-1.5 flex-1 text-[11px] leading-relaxed text-fog">{asset.desc}</p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className={cn("rounded border px-1.5 py-0.5 font-mono text-[8px] tracking-[0.14em]", ORIGIN_STYLE[asset.origin])} title={ORIGIN_META[asset.origin].note}>
              {ORIGIN_META[asset.origin].label}
            </span>
            {asset.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded border border-line bg-panel2 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] text-fog/80">
                {t}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-end gap-1" title={TIER_LABEL[asset.tier]}>
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn("w-1.5 rounded-[1px]", i <= asset.tier ? "bg-volt" : "bg-line2")}
                style={{ height: 5 + i * 3 }}
              />
            ))}
          </div>
        </div>
      </footer>
    </motion.article>
  );
}

export function SectionHeader({ cat }: { cat: Category }) {
  const core = cat.assets.filter((a) => a.origin === "core").length;
  const plus = cat.assets.filter((a) => a.origin === "plus").length;
  const fresh = cat.assets.filter((a) => a.origin === "new").length;
  const total = cat.assets.length;

  return (
    <div id={`sec-${cat.id}`} className="scroll-mt-36">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-line pb-5">
        <div className="flex items-start gap-4">
          <span className="mt-1 font-mono text-sm font-bold text-volt">[{cat.index}]</span>
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-snow uppercase sm:text-3xl">
              {cat.titleRu}{" "}
              <span className="text-stroke hidden sm:inline">{cat.titleEn}</span>
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-fog sm:text-[13px]">{cat.desc}</p>
          </div>
        </div>

        {/* coverage meter */}
        <div className="flex flex-col items-end gap-1.5">
          <span className="font-mono text-[9px] tracking-[0.2em] text-fog uppercase">
            {total} блоков · покрытие
          </span>
          <div className="flex h-2 w-44 overflow-hidden rounded-sm">
            <span className="bg-cyc" style={{ width: `${(core / total) * 100}%` }} title="база курса" />
            <span className="bg-amb" style={{ width: `${(plus / total) * 100}%` }} title="докручено" />
            <span className="bg-volt" style={{ width: `${(fresh / total) * 100}%` }} title="новое" />
          </div>
          <div className="flex gap-2 font-mono text-[8px] tracking-[0.12em]">
            <span className="text-cyc">КУРС {core}</span>
            <span className="text-amb">ПЛЮС {plus}</span>
            <span className="text-volt">НОВОЕ {fresh}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
