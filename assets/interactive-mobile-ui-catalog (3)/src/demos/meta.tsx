import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bomb,
  Coins,
  Crown,
  Flame,
  Gem,
  Lock,
  Package,
  Shield,
  Star,
  Swords,
  Target,
  Timer,
  User,
  Zap,
} from "lucide-react";
import { Btn, StageNote, pick, polar, randInt } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* MET-01 — RARITY CARD                                                */
/* ------------------------------------------------------------------ */
const RARITIES = [
  { k: "ОБЫЧНЫЙ", c: "#9aa4b2", glow: 0, weight: 40 },
  { k: "РЕДКИЙ", c: "#38e1ff", glow: 12, weight: 28 },
  { k: "ЭПИЧЕСКИЙ", c: "#a78bff", glow: 20, weight: 18 },
  { k: "ЛЕГЕНДАРНЫЙ", c: "#ffb43a", glow: 30, weight: 11 },
  { k: "МИФИЧЕСКИЙ", c: "#ff4655", glow: 40, weight: 3 },
];
const WEAPON_NAMES = ["КЛИНОК РАЗЛОМА", "ЗУБ ГИДРЫ", "ШИПАСТЫЙ АРГУМЕНТ", "ПЕПЕЛЬНЫЙ ЛУК", "МАЛЫЙ ХАОС"];

export function RarityDemo() {
  const [roll, setRoll] = useState(0);
  const [rare, setRare] = useState(RARITIES[2]);
  const [name, setName] = useState(WEAPON_NAMES[0]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const doRoll = () => {
    const bag = RARITIES.flatMap((r) => Array(r.weight).fill(r)) as typeof RARITIES;
    setRare(pick(bag));
    setName(pick(WEAPON_NAMES));
    setRoll((r) => r + 1);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-8 overflow-hidden select-none" style={{ perspective: 800 }}>
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        тир: {rare.k}
      </div>
      <motion.div
        key={roll}
        className="relative w-40 overflow-hidden rounded-xl border-2 bg-panel2"
        style={{
          borderColor: rare.c,
          boxShadow: `0 0 ${rare.glow}px ${rare.c}66, inset 0 0 18px ${rare.c}22`,
        }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          setTilt({ x: -py * 10, y: px * 12 });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* shine stripe */}
        <div
          key={`s${roll}`}
          className="anim-shine pointer-events-none absolute top-[-30%] left-0 z-10 h-[160%] w-10"
          style={{ background: "rgba(255,255,255,0.14)" }}
        />
        <div className="flex items-center justify-between px-3 pt-3">
          <span className="font-mono text-[8px] font-bold tracking-[0.2em]" style={{ color: rare.c }}>
            {rare.k}
          </span>
          <Star className="h-3 w-3" style={{ color: rare.c }} fill={rare.glow > 12 ? rare.c : "none"} />
        </div>
        <div className="flex h-28 items-center justify-center">
          <motion.div
            key={`i${roll}`}
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
          >
            <Swords className="h-12 w-12" style={{ color: rare.c }} />
          </motion.div>
        </div>
        <div className="border-t border-line px-3 py-2.5" style={{ background: "var(--color-panel)" }}>
          <div className="font-display text-[11px] font-bold text-snow">{name}</div>
          <div className="mt-1 space-y-1">
            {[
              ["УРН", randInt(40, 96)],
              ["СКР", randInt(20, 80)],
            ].map(([k, v]) => (
              <div key={k as string} className="flex items-center gap-1.5">
                <span className="w-7 font-mono text-[7px] text-fog">{k}</span>
                <div className="h-1 flex-1 rounded bg-line">
                  <motion.div
                    key={`${k}${roll}`}
                    className="h-full rounded"
                    style={{ background: rare.c }}
                    initial={{ width: 0 }}
                    animate={{ width: `${v}%` }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="flex flex-col items-center gap-3">
        <div className="font-mono text-[9px] leading-relaxed tracking-[0.12em] text-fog uppercase">
          <div><i className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: "#9aa4b2" }} /> 40%</div>
          <div><i className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: "#38e1ff" }} /> 28%</div>
          <div><i className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: "#a78bff" }} /> 18%</div>
          <div><i className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: "#ffb43a" }} /> 11%</div>
          <div><i className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: "#ff4655" }} /> 3%</div>
        </div>
        <Btn onClick={doRoll} className="px-6">
          ролл
        </Btn>
      </div>
      <StageNote>шансы как в гача · тилт за курсором</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MET-02 — SKILL TREE                                                 */
/* ------------------------------------------------------------------ */
const NODES = [
  { id: "core", x: 50, y: 84, cost: 0, icon: Zap, label: "ЯДРО", deps: [] as string[] },
  { id: "p1", x: 20, y: 62, cost: 1, icon: Swords, label: "КЛИНКИ", deps: ["core"] },
  { id: "p2", x: 50, y: 58, cost: 1, icon: Shield, label: "ЩИТ", deps: ["core"] },
  { id: "p3", x: 80, y: 62, cost: 1, icon: Target, label: "ПРИЦЕЛ", deps: ["core"] },
  { id: "t1", x: 20, y: 34, cost: 2, icon: Flame, label: "ИГНИТ", deps: ["p1"] },
  { id: "t2", x: 50, y: 30, cost: 2, icon: Timer, label: "ХРОНО", deps: ["p2"] },
  { id: "t3", x: 80, y: 34, cost: 2, icon: Bomb, label: "БУМ", deps: ["p3"] },
  { id: "cap", x: 50, y: 8, cost: 3, icon: Crown, label: "АПОГЕЙ", deps: ["t1", "t2", "t3"] },
];
const EDGES: [string, string][] = [
  ["core", "p1"],
  ["core", "p2"],
  ["core", "p3"],
  ["p1", "t1"],
  ["p2", "t2"],
  ["p3", "t3"],
  ["t1", "cap"],
  ["t2", "cap"],
  ["t3", "cap"],
];

export function TreeDemo() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set(["core"]));
  const [points, setPoints] = useState(7);
  const [last, setLast] = useState<string | null>(null);
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  const tryUnlock = (id: string) => {
    const n = byId[id];
    if (unlocked.has(id) || points < n.cost) return;
    if (!n.deps.every((d) => unlocked.has(d))) return;
    const u = new Set(unlocked);
    u.add(id);
    setUnlocked(u);
    setPoints((p) => p - n.cost);
    setLast(id);
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <div className="pointer-events-none absolute top-2 left-3 z-20 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        очки: <span className="text-volt">{points}</span>
      </div>
      <div className="absolute top-2 right-3 z-20">
        <Btn
          tone="ghost"
          onClick={() => {
            setUnlocked(new Set(["core"]));
            setPoints(7);
          }}
        >
          сброс
        </Btn>
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {EDGES.map(([a, b]) => {
          const A = byId[a];
          const B = byId[b];
          const both = unlocked.has(a) && unlocked.has(b);
          const half = unlocked.has(a);
          return (
            <line
              key={`${a}${b}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={both ? "var(--color-volt)" : half ? "var(--color-amb)" : "var(--color-line)"}
              strokeWidth={both ? 0.9 : 0.5}
              strokeDasharray={both ? "0" : "2 2"}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke 0.3s" }}
            />
          );
        })}
      </svg>

      {NODES.map((n) => {
        const isOpen = unlocked.has(n.id);
        const avail = !isOpen && n.deps.every((d) => unlocked.has(d)) && points >= n.cost;
        const locked = !isOpen && !avail;
        return (
          <div key={n.id} className="absolute z-10" style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)" }}>
            <motion.button
              type="button"
              onClick={() => tryUnlock(n.id)}
              whileTap={avail ? { scale: 0.85 } : undefined}
              animate={last === n.id ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors",
                isOpen
                  ? "border-volt bg-volt text-ink shadow-[0_0_20px_rgba(215,255,62,0.4)]"
                  : avail
                    ? "cursor-pointer border-amb bg-panel2 text-amb"
                    : "cursor-not-allowed border-line bg-panel text-line2"
              )}
            >
              {avail && (
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-amb"
                  animate={{ opacity: [0.7, 0, 0.7], scale: [1, 1.35, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
              )}
              {locked ? <Lock className="h-4 w-4" /> : <n.icon className="h-5 w-5" />}
            </motion.button>
            <div className="mt-1 text-center font-mono text-[7px] tracking-[0.18em] whitespace-nowrap" style={{ color: isOpen ? "var(--color-volt)" : "var(--color-fog)" }}>
              {n.label}
              {!isOpen && <span className="text-amb"> ·{n.cost}</span>}
            </div>
          </div>
        );
      })}
      <StageNote>тратить очки только по связям</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MET-03 — UPGRADE COMPARE                                            */
/* ------------------------------------------------------------------ */
const BASE_STATS = [
  { k: "АТК", v: 46 },
  { k: "СКР", v: 30 },
  { k: "КРТ", v: 18 },
  { k: "ЗЩТ", v: 38 },
];
const DELTAS = [
  [8, 6, 4, 6],
  [12, 8, 6, 9],
  [9, 12, 8, 7],
  [14, 10, 12, 11],
  [16, 14, 10, 12],
];

export function UpgradeDemo() {
  const [lvl, setLvl] = useState(0);
  const [coins, setCoins] = useState(4800);
  const cur = BASE_STATS.map((s, i) => s.v + DELTAS.slice(0, lvl).reduce((a, d) => a + d[i], 0));
  const maxed = lvl >= 5;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        золото: <span className="text-amb">{coins}</span>
      </div>
      <div className="pointer-events-none absolute top-2 right-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={cn("h-1.5 w-3", i < lvl ? "bg-volt" : "bg-line")} />
        ))}
      </div>

      <div className="w-full max-w-xs space-y-2.5 pt-4">
        {BASE_STATS.map((s, i) => {
          const next = maxed ? 0 : DELTAS[lvl][i];
          return (
            <div key={s.k} className="flex items-center gap-2">
              <span className="w-8 font-mono text-[9px] tracking-widest text-fog">{s.k}</span>
              <div className="relative h-2.5 flex-1 overflow-hidden rounded bg-line">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded bg-cyc"
                  animate={{ width: `${cur[i] - (lvl > 0 ? DELTAS[lvl - 1][i] : 0)}%` }}
                />
                <motion.div
                  className="absolute inset-y-0 rounded bg-volt"
                  style={{ left: `${cur[i] - (lvl > 0 ? DELTAS[lvl - 1][i] : 0)}%` }}
                  animate={{ width: lvl > 0 ? `${DELTAS[lvl - 1][i]}%` : "0%" }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
                />
              </div>
              <span className="w-7 text-right font-mono text-[10px] font-bold text-snow">{cur[i]}</span>
              <AnimatePresence mode="wait">
                {lvl > 0 && (
                  <motion.span
                    key={lvl}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-6 font-mono text-[9px] font-bold text-volt"
                  >
                    +{next === 0 ? DELTAS[lvl - 1][i] : next}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 pt-1">
        <Btn
          disabled={maxed || coins < 1200}
          onClick={() => {
            setLvl((l) => Math.min(5, l + 1));
            setCoins((c) => Math.max(0, c - 1200));
          }}
        >
          {maxed ? "MAX LV" : "апгрейд · 1200"}
        </Btn>
        <Btn
          tone="ghost"
          onClick={() => {
            setLvl(0);
            setCoins(4800);
          }}
        >
          сброс
        </Btn>
      </div>
      <StageNote>volt-сегмент — свежий прирост</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MET-04 — LOOT CHEST                                                 */
/* ------------------------------------------------------------------ */
const LOOT_POOL = [
  { icon: Gem, name: "ИСКРА ДУШИ", c: "#a78bff" },
  { icon: Swords, name: "КЛИНОК ПСА", c: "#ff4655" },
  { icon: Coins, name: "×900 ЗОЛОТА", c: "#ffb43a" },
  { icon: Shield, name: "ЭГИДА МК-II", c: "#38e1ff" },
  { icon: Crown, name: "ВЕНЕЦ БУРИ", c: "#ffb43a" },
  { icon: Zap, name: "СЕРДЦЕ МОЛНИИ", c: "#d7ff3e" },
];

export function ChestDemo() {
  const [phase, setPhase] = useState<"idle" | "shake" | "open">("idle");
  const [loot, setLoot] = useState<typeof LOOT_POOL>([]);
  const [opened, setOpened] = useState(0);

  const open = () => {
    if (phase !== "idle") return;
    setPhase("shake");
    window.setTimeout(() => {
      setLoot([...LOOT_POOL].sort(() => Math.random() - 0.5).slice(0, 3));
      setPhase("open");
      setOpened((o) => o + 1);
    }, 650);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        вскрыто: {opened}
      </div>

      <div className="relative flex h-44 items-center justify-center">
        <AnimatePresence mode="wait">
          {phase !== "open" ? (
            <motion.button
              key="chest"
              type="button"
              onClick={open}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.18 } }}
              animate={
                phase === "shake"
                  ? { x: [0, -7, 7, -6, 6, -3, 0], rotate: [0, -3, 3, -2, 2, 0, 0] }
                  : { scale: [1, 1.04, 1] }
              }
              transition={phase === "shake" ? { duration: 0.6 } : { duration: 1.6, repeat: Infinity }}
              whileTap={{ scale: 0.94 }}
              className="relative z-10 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-amb bg-panel2 shadow-[0_0_30px_rgba(255,180,58,0.25)]"
            >
              <Package className="h-10 w-10 text-amb" />
              <span className="mt-1 font-mono text-[8px] tracking-[0.25em] text-amb">ОТКРЫТЬ</span>
            </motion.button>
          ) : (
            <motion.div key="raysloot" className="relative flex items-center justify-center">
              {/* rays */}
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <motion.span
                  key={a}
                  className="absolute h-24 w-1.5 origin-bottom"
                  style={{ rotate: a + 90, background: "rgba(255,180,58,0.25)" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                />
              ))}
              <motion.span
                className="absolute h-40 w-40 rounded-full"
                style={{ boxShadow: "0 0 60px rgba(255,180,58,0.35)" }}
                initial={{ opacity: 1, scale: 0.3 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.7 }}
              />
              {/* loot fan */}
              <div className="relative z-10 flex items-end gap-2">
                {loot.map((l, i) => (
                  <motion.div
                    key={`${opened}-${i}`}
                    className="flex w-20 flex-col items-center gap-1.5 rounded-xl border-2 bg-panel p-2.5"
                    style={{ borderColor: l.c }}
                    initial={{ y: 30, scale: 0.4, opacity: 0, rotate: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1, rotate: (i - 1) * 7 }}
                    transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.12 + i * 0.09 }}
                  >
                    <l.icon className="h-7 w-7" style={{ color: l.c }} />
                    <span className="text-center font-mono text-[7px] leading-tight tracking-widest" style={{ color: l.c }}>
                      {l.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase === "open" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Btn tone="ghost" onClick={() => setPhase("idle")} className="mt-2">
            ещё один
          </Btn>
        </motion.div>
      )}
      <StageNote>антиципация 650 мс → вспышка → веер</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MET-05 — SPIN WHEEL                                                 */
/* ------------------------------------------------------------------ */
const SLICES = [
  { icon: Coins, label: "×50", c: "#ffb43a" },
  { icon: Gem, label: "ГЕМ", c: "#a78bff" },
  { icon: Package, label: "ЛУТ", c: "#38e1ff" },
  { icon: Star, label: "500XP", c: "#8a92a6" },
  { icon: Coins, label: "×500", c: "#ffb43a" },
  { icon: User, label: "СКИН", c: "#38e1ff" },
  { icon: Crown, label: "ДЖЕКПОТ", c: "#ff4655" },
  { icon: Star, label: "150XP", c: "#8a92a6" },
];

export function WheelDemo() {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);
  const rotRef = useRef(0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(null);
    const target = randInt(0, 7);
    const sliceCenter = target * 45 + 22.5;
    const next = rotRef.current + 360 * 5 + (360 - sliceCenter) - (rotRef.current % 360);
    rotRef.current = next;
    setRot(next);
    window.setTimeout(() => {
      setWin(SLICES[target].label);
      setSpinning(false);
    }, 4300);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6 overflow-hidden select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        {spinning ? "spinning…" : win ? `выигрыш: ${win}` : "готов"}
      </div>
      <div className="relative">
        {/* pointer */}
        <div
          className="absolute -top-1.5 left-1/2 z-20 h-0 w-0 -translate-x-1/2 border-t-[14px] border-r-[7px] border-l-[7px] border-t-volt border-r-transparent border-l-transparent"
        />
        <motion.div
          animate={{ rotate: rot }}
          transition={{ duration: 4.2, ease: [0.12, 0.8, 0.16, 1] }}
          className="relative h-44 w-44"
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {SLICES.map((s, i) => {
              const a0 = i * 45 - 90;
              const a1 = a0 + 45;
              const p0 = polar(100, 100, 96, a0);
              const p1 = polar(100, 100, 96, a1);
              const mid = a0 + 22.5;
              const lp = polar(100, 100, 62, mid);
              return (
                <g key={i}>
                  <path
                    d={`M 100 100 L ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A 96 96 0 0 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Z`}
                    fill={i === 6 ? "rgba(255,70,85,0.16)" : i % 2 === 0 ? "var(--color-panel2)" : "rgba(255,255,255,0.04)"}
                    stroke="var(--color-line2)"
                    strokeWidth="1"
                  />
                  <g transform={`translate(${lp.x} ${lp.y}) rotate(${mid + 90})`}>
                    <s.icon width={15} height={15} x={-7.5} y={-7.5} color={s.c} />
                  </g>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="20" fill="var(--color-ink)" stroke="var(--color-line2)" strokeWidth="2" />
            <circle cx="100" cy="100" r="4" fill="var(--color-volt)" />
          </svg>
        </motion.div>
        {win && !spinning && (
          <motion.div
            initial={{ scale: 2.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
            className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 rounded border border-amb bg-ink px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.18em] whitespace-nowrap text-amb"
          >
            + {win}
          </motion.div>
        )}
      </div>
      <Btn onClick={spin} disabled={spinning} className="px-6 py-3">
        {spinning ? "…" : "крутить"}
      </Btn>
      <StageNote>5 оборотов · посадка на центр сектора</StageNote>
    </div>
  );
}

/* keep tree edges typable in older ts without losing tuple shape */
void EDGES;
