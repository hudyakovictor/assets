import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Lock, Radio, Sparkles, Swords, Timer, Zap } from "lucide-react";
import { buzz, HAPTIC, useInterval } from "../lib/fx";
import { cn } from "../utils/cn";

const pad = (n: number) => String(n).padStart(2, "0");

export function HubDemo() {
  const [secs, setSecs] = useState(4 * 3600 + 12 * 60 + 33);
  useInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000, true);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  return (
    <div className="flex h-full flex-col px-4 pt-12">
      {/* mini greeting */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">arena hub</div>
          <div className="font-display text-xl uppercase">Pick your poison</div>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-acid/40 bg-acid/10 px-2.5 py-1.5">
          <Zap className="size-3.5 text-acid" />
          <span className="font-mono text-[11px] font-bold text-acid">4/5</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {/* DAILY ARENA — live */}
        <ModeCard
          hot
          tap={() => buzz(HAPTIC.medium)}
          className="border-alarm/60"
          badge={
            <span className="flex items-center gap-1 rounded-sm bg-alarm px-1.5 py-0.5 font-mono text-[8px] font-bold text-white">
              <Radio className="size-2.5 animate-blink" /> LIVE
            </span>
          }
          title="Daily Arena"
          sub="Один сценарий на всех. Результат — в 21:00."
          footer={
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tabular-nums text-alarm">
              <Timer className="size-3.5" />
              {pad(h)}:{pad(m)}:{pad(s)}
            </span>
          }
          icon={<Swords className="size-6 text-alarm" />}
        />

        {/* BLIND SCENARIO */}
        <ModeCard
          tap={() => buzz(HAPTIC.light)}
          badge={<span className="sticker text-[8px] !py-0.5">new</span>}
          title="Blind Scenario"
          sub="Классика: прошлое открыто, будущее за решёткой."
          footer={<span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">cost 1 energy</span>}
          icon={<Sparkles className="size-6 text-acid" />}
        />

        {/* SPEEDRUN — locked */}
        <ModeCard
          locked
          badge={<Lock className="size-4 text-ink/30" />}
          title="Speedrun"
          sub="10 свечей, 10 решений, 60 секунд."
          footer={<span className="font-mono text-[9px] uppercase tracking-widest text-amber">unlock at lvl 5</span>}
          icon={<Flame className="size-6 text-ink/25" />}
        />

        {/* VERSUS — soon */}
        <div className="hatch relative overflow-hidden rounded-2xl border border-line bg-panel/50 p-4 opacity-60">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">
            1v1 versus mode
            <span className="sticker sticker-ghost -rotate-2 text-[8px] !py-0.5">soon™</span>
          </div>
          <div className="mt-2 font-display text-lg uppercase text-ink/40">Duel of convictions</div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  title,
  sub,
  footer,
  icon,
  badge,
  locked,
  hot,
  className,
  tap,
}: {
  title: string;
  sub: string;
  footer: React.ReactNode;
  icon: React.ReactNode;
  badge: React.ReactNode;
  locked?: boolean;
  hot?: boolean;
  className?: string;
  tap?: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: locked ? 1 : 0.97 }}
      onClick={tap}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-coal p-4 text-left shadow-[4px_4px_0_rgba(0,0,0,0.55)] transition-colors",
        className ?? "border-ink/15",
        locked && "pointer-events-none"
      )}
    >
      {/* shine sweep */}
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/6 transition-transform duration-700 group-hover:translate-x-[400%]" />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("grid size-11 place-items-center rounded-xl border", hot ? "border-alarm/50 bg-alarm/10" : "border-line bg-black/40")}>
            {icon}
          </div>
          <div>
            <div className="font-display text-lg uppercase tracking-wide">{title}</div>
            <div className="max-w-[170px] text-[11px] leading-snug text-ink/50">{sub}</div>
          </div>
        </div>
        {badge}
      </div>
      <div className="mt-3 border-t border-line pt-2">{footer}</div>
    </motion.button>
  );
}
