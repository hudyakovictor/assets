import { useState, type ComponentType } from "react";
import { MotionConfig, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Gamepad2, Hand, Moon, Radio, Smartphone, Zap } from "lucide-react";
import AssetCard from "./components/AssetCard";
import { CATEGORIES, TOTAL } from "./data/assets";
import { cn } from "./utils/cn";

/* demos */
import { SheetDemo, TabBarDemo, ToastsDemo, TopBarDemo } from "./demos/chrome";
import { EvidenceDemo, HypothesisDemo, InvalidationDemo, WorkspaceDemo } from "./demos/decision";
import { ChartDemo } from "./demos/chart";
import { InsightDemo, RewardDemo, ScoreDemo } from "./demos/reveal";
import { BlindTransitionDemo, PostLossDemo, SessionStartDemo } from "./demos/scenes";
import { HubDemo } from "./demos/hub";
import { StoreDemo } from "./demos/store";
import { LeaderboardDemo, MissionsDemo, ReferralDemo } from "./demos/social";
import { EnergyDemo, HapticsDemo, SkeletonDemo, SoundDemo, StatesDemo } from "./demos/system";

const DEMOS: Record<string, ComponentType> = {
  topbar: TopBarDemo,
  tabbar: TabBarDemo,
  toasts: ToastsDemo,
  sheet: SheetDemo,
  hub: HubDemo,
  blind: BlindTransitionDemo,
  session: SessionStartDemo,
  postloss: PostLossDemo,
  workspace: WorkspaceDemo,
  hypothesis: HypothesisDemo,
  invalidation: InvalidationDemo,
  evidence: EvidenceDemo,
  chart: ChartDemo,
  score: ScoreDemo,
  insight: InsightDemo,
  leaderboard: LeaderboardDemo,
  reward: RewardDemo,
  store: StoreDemo,
  energy: EnergyDemo,
  missions: MissionsDemo,
  referral: ReferralDemo,
  skeleton: SkeletonDemo,
  states: StatesDemo,
  haptics: HapticsDemo,
  sound: SoundDemo,
};

const TICKER = CATEGORIES.flatMap((c) => c.items.map((a) => `${a.id} · ${a.name}`));

export default function App() {
  const [rm, setRm] = useState(false);
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const heroX = useTransform(sx, (v) => v * 26);
  const heroX2 = useTransform(sx, (v) => v * -18);

  const toggleRm = () => {
    const next = !rm;
    setRm(next);
    document.documentElement.classList.toggle("rm", next);
  };

  return (
    <MotionConfig reducedMotion={rm ? "always" : "never"}>
      <div className="relative min-h-screen">
        {/* backdrop */}
        <div className="gridlines pointer-events-none fixed inset-0 -z-10" />
        <div className="noise pointer-events-none fixed inset-0 z-50" />

        {/* ================= header ================= */}
        <header className="sticky top-0 z-40 border-b border-line bg-void/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid size-8 -rotate-3 place-items-center border-2 border-black bg-acid font-display text-sm text-black shadow-[2px_2px_0_#000]">
                S/A
              </span>
              <span className="hidden font-display text-sm uppercase tracking-widest sm:block">
                Signal Arena <span className="text-ink/30">· asset catalog</span>
              </span>
            </a>

            <nav className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.map((c) => (
                <a
                  key={c.id}
                  href={`#cat-${c.id}`}
                  className="whitespace-nowrap rounded-full border border-transparent px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/45 transition-colors hover:border-line hover:text-acid"
                >
                  {c.name}
                  <span className="ml-1 text-ink/25">{c.items.length}</span>
                </a>
              ))}
            </nav>

            <button
              onClick={toggleRm}
              title="Reduced-motion fallback — как в проде для пользователей с системным reduce-motion"
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors",
                rm ? "border-amber bg-amber/15 text-amber" : "border-line text-ink/50 hover:text-ink"
              )}
            >
              <Moon className="size-3" />
              {rm ? "RM: ON" : "RM: OFF"}
            </button>
          </div>
        </header>

        {/* ================= hero ================= */}
        <section
          id="top"
          className="relative overflow-hidden px-4 pt-10 md:pt-16"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
          }}
        >
          {/* top strip */}
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40">
            <span className="flex items-center gap-1.5">
              <Radio className="size-3.5 text-alarm animate-blink" /> live demos inside
            </span>
            <span className="hidden h-3 w-px bg-line sm:block" />
            <span>telegram mini app · phaser 4 · hybrid dom</span>
            <span className="hidden h-3 w-px bg-line sm:block" />
            <span className="flex items-center gap-1.5">
              <Hand className="size-3.5" /> touch-first · no hover
            </span>
          </div>

          {/* headline */}
          <div className="relative">
            <motion.h1 style={{ x: heroX }} className="font-display leading-[0.88]">
              <span className="block text-[17vw] uppercase tracking-tight text-ink md:text-[9.5rem]">Signal</span>
              <motion.span
                style={{ x: heroX2 }}
                className="text-outline block text-[17vw] uppercase tracking-tight md:text-[9.5rem]"
              >
                Arena
              </motion.span>
            </motion.h1>
            <div className="sticker absolute right-[4%] top-[38%] rotate-6 md:text-sm">ui asset catalog</div>
            <div className="sticker sticker-red absolute left-[2%] top-[62%] hidden -rotate-6 md:inline-flex">
              sealed in punk
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-[15px] leading-relaxed text-ink/60">
              Библиотека интерфейсных блоков для decision-тренажёра Signal Arena. Каждый ассет —
              полноценный компонент с логикой, машиной состояний, жестами и переходами.{" "}
              <span className="text-ink">Никаких скриншотов — всё ниже нажимается, свайпается и жужжит.</span>
            </p>
            <div className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-line bg-line font-mono text-center">
              {[
                [String(TOTAL), "blocks"],
                ["6", "systems"],
                ["60", "fps"],
                ["0", "hover"],
              ].map(([v, k]) => (
                <div key={k} className="bg-coal px-4 py-3">
                  <div className="font-display text-2xl text-acid">{v}</div>
                  <div className="text-[8px] uppercase tracking-[0.25em] text-ink/40">{k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ticker */}
          <div className="relative mt-10 overflow-hidden border-y border-line bg-coal/60 py-2.5">
            <div className="animate-marquee flex w-max gap-6 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="flex items-center gap-6">
                  <span className={i % 2 ? "text-ink/50" : "text-acid/80"}>{t}</span>
                  <Zap className="size-3 text-ink/25" />
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-6 font-mono text-[9px] uppercase tracking-[0.35em] text-ink/35">
            <ArrowDown className="size-3.5 animate-floaty" /> листай — всё живое
          </div>
        </section>

        {/* ================= sections ================= */}
        <main className="mx-auto max-w-7xl px-4 pb-16">
          {CATEGORIES.map((cat, ci) => (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24 pt-14">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5"
              >
                <div>
                  <div className="mb-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/35">
                    <span className="text-acid">0{ci + 1}</span>
                    <span className="h-px w-10 bg-line" />
                    <span>system</span>
                  </div>
                  <h2 className="font-display text-5xl uppercase leading-none tracking-wide md:text-6xl">
                    {cat.name}
                  </h2>
                </div>
                <div className="flex max-w-md flex-col items-start gap-2 md:items-end">
                  <span className="sticker sticker-ghost rotate-1">{cat.items.length} blocks</span>
                  <p className="text-[13px] leading-relaxed text-ink/50 md:text-right">{cat.desc}</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {cat.items.map((asset) => {
                  const Demo = DEMOS[asset.demoId];
                  return (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      wide={!!asset.wide}
                      demo={Demo ? <Demo /> : null}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </main>

        {/* ================= footer ================= */}
        <footer className="relative overflow-hidden border-t border-line">
          <div className="halftone absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4 py-14">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="font-display text-5xl uppercase leading-[0.9] md:text-7xl">
                  Seal
                  <br />
                  <span className="text-outline">everything.</span>
                </div>
                <p className="mt-4 max-w-md font-mono text-[11px] leading-relaxed text-ink/45">
                  Каталог собран как production-спека: каждый блок описан, прототипирован и готов к
                  переносу в Phaser-сцену или DOM-оверлей. Волатильность бренда — в крови, а не в motion.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line font-mono text-[10px]">
                {[
                  [<Gamepad2 key="g" className="size-4" />, "phaser 4 scenes"],
                  [<Smartphone key="s" className="size-4" />, "tg mini app ready"],
                  [<Zap key="z" className="size-4" />, "60fps mid-android"],
                  [<Hand key="h" className="size-4" />, "touch ≥ 44px"],
                ].map(([icon, label], i) => (
                  <div key={i} className="flex items-center gap-2 bg-coal px-4 py-3 uppercase tracking-wider text-ink/55">
                    <span className="text-acid">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 font-mono text-[9px] uppercase tracking-[0.3em] text-ink/30">
              <span>signal arena · asset catalog · vol.01</span>
              <span>docs → /brand · /motion-spec · /interaction-system</span>
              <span className="text-acid/60">class of 2026</span>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
