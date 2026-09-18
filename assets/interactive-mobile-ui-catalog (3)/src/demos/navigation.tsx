import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Gem,
  Heart,
  Home,
  Package,
  Shield,
  Skull,
  Swords,
  User,
  Zap,
} from "lucide-react";
import { StageNote } from "./shared";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* NAV-01 — HERO CAROUSEL                                              */
/* ------------------------------------------------------------------ */
const HEROES = [
  { name: "ВЭСПЕР", cls: "ШТОРМ-МАГ", img: "img/char-mage.jpg", stat: "AOE / CTRL", c: "#38e1ff" },
  { name: "КАГЭ", cls: "РОНИН", img: "img/char-ronin.jpg", stat: "MELEE / BURST", c: "#ff4655" },
  { name: "БАСТИОН", cls: "АВАНГАРД", img: "img/char-vanguard.jpg", stat: "TANK / SUP", c: "#ffb43a" },
  { name: "ФЛИНТ", cls: "СЛЕДОПЫТ", img: "img/char-warden.jpg", stat: "MARKS / TRAP", c: "#d7ff3e" },
];

export function CarouselDemo() {
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);
  const n = HEROES.length;

  const off = (i: number) => {
    let o = i - active;
    if (o > 2) o -= n;
    if (o < -2) o += n;
    return o;
  };

  const go = (d: number) => {
    if (locked) return;
    setActive((a) => (a + d + n) % n);
  };

  useEffect(() => {
    if (!locked) return;
    const t = window.setTimeout(() => setLocked(false), 1500);
    return () => window.clearTimeout(t);
  }, [locked]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden select-none">
      <div className="pointer-events-none absolute top-2 left-3 font-mono text-[9px] tracking-[0.14em] text-fog/70 uppercase">
        hero select · {active + 1}/{n}
      </div>

      {/* drag layer */}
      <motion.div
        className="absolute inset-x-10 top-8 bottom-24 z-30 cursor-grab touch-none active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.x < -55) go(1);
          else if (info.offset.x > 55) go(-1);
        }}
      />

      <div className="relative flex h-52 items-center justify-center" style={{ perspective: 900 }}>
        {HEROES.map((h, i) => {
          const o = off(i);
          const isActive = o === 0;
          return (
            <motion.div
              key={h.name}
              className="absolute w-36 overflow-hidden rounded-xl border bg-panel2"
              style={{
                borderColor: isActive ? h.c : "var(--color-line2)",
                zIndex: 20 - Math.abs(o),
                boxShadow: isActive ? `0 18px 50px -12px ${h.c}55` : "0 10px 30px rgba(0,0,0,0.5)",
              }}
              animate={{
                x: o * 116,
                scale: 1 - Math.abs(o) * 0.16,
                rotateY: o * -24,
                opacity: Math.abs(o) > 2 ? 0 : 1 - Math.abs(o) * 0.25,
                filter: isActive ? "saturate(1.1)" : "saturate(0.35) brightness(0.7)",
              }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <img src={h.img} alt={h.name} className="h-40 w-full object-cover" draggable={false} />
              <div
                className="flex items-center justify-between px-2.5 py-2"
                style={{ background: "var(--color-panel)" }}
              >
                <span className="font-display text-[11px] font-bold" style={{ color: isActive ? h.c : "var(--color-fog)" }}>
                  {h.name}
                </span>
                <span className="font-mono text-[8px] tracking-widest text-fog">{h.cls}</span>
              </div>
              {locked && isActive && (
                <motion.div
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                  style={{ background: h.c }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* nameplate */}
      <div className="relative z-40 mt-3 flex h-9 items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex items-baseline gap-2"
          >
            <span className="font-display text-lg font-black tracking-wide" style={{ color: HEROES[active].c }}>
              {HEROES[active].name}
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-fog">{HEROES[active].stat}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-40 mt-2 flex items-center gap-3 pb-1">
        <button type="button" onClick={() => go(-1)} className="pointer-events-auto rounded border border-line2 p-1.5 text-fog hover:border-volt hover:text-volt">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {HEROES.map((_, i) => (
            <span
              key={i}
              className={cn("h-1 rounded-full transition-all duration-300", i === active ? "w-5 bg-volt" : "w-1.5 bg-line2")}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} className="pointer-events-auto rounded border border-line2 p-1.5 text-fog hover:border-volt hover:text-volt">
          <ChevronRight className="h-4 w-4" />
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setLocked(true)}
          className={cn(
            "pointer-events-auto ml-2 cursor-pointer rounded border px-4 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em]",
            locked ? "border-volt bg-volt text-ink" : "border-volt/60 text-volt hover:bg-volt hover:text-ink"
          )}
        >
          {locked ? "LOCK-IN ✓".replace(" ✓", "") : "ВЫБРАТЬ"}
        </motion.button>
      </div>
      <StageNote>свайп / стрелки · лок-ин героя</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NAV-02 — RADIAL MENU                                                */
/* ------------------------------------------------------------------ */
const RADIAL_ITEMS = [
  { icon: Heart, label: "ХИЛ", c: "text-blood" },
  { icon: Gem, label: "БАФФ", c: "text-vio" },
  { icon: Zap, label: "УЛЬТА", c: "text-amb" },
  { icon: Shield, label: "ЩИТ", c: "text-cyc" },
  { icon: Skull, label: "ПУГАЧ", c: "text-fog" },
];

export function RadialDemo() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (!picked) return;
    const t = window.setTimeout(() => setPicked(null), 1300);
    return () => window.clearTimeout(t);
  }, [picked]);

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 bg-ink/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {picked && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 rounded border border-volt bg-panel px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-volt"
          >
            {picked}
          </motion.div>
        )}
      </AnimatePresence>

      {/* anchor */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        {/* arc guide */}
        <motion.svg
          viewBox="0 0 220 130"
          className="absolute bottom-0 left-1/2 w-56 -translate-x-1/2"
          animate={{ opacity: open ? 0.5 : 0 }}
        >
          <path d="M 14 118 A 106 106 0 0 1 206 118" fill="none" stroke="var(--color-line2)" strokeDasharray="3 6" />
        </motion.svg>

        {RADIAL_ITEMS.map((it, i) => {
          const a = (-165 + (i * 150) / (RADIAL_ITEMS.length - 1)) * (Math.PI / 180);
          const x = Math.cos(a) * 92;
          const y = Math.sin(a) * 92;
          return (
            <motion.button
              key={it.label}
              type="button"
              className="absolute bottom-2 left-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-line2 bg-panel2"
              style={{ marginLeft: -22, zIndex: 30 }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={
                open
                  ? { x, y, scale: 1, opacity: 1, transition: { type: "spring", stiffness: 480, damping: 24, delay: i * 0.04 } }
                  : { x: 0, y: 0, scale: 0, opacity: 0, transition: { duration: 0.15 } }
              }
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setPicked(`${it.label} АКТИВЕН`);
                setOpen(false);
              }}
            >
              <it.icon className={cn("h-5 w-5", it.c)} />
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          whileTap={{ scale: 0.88 }}
          className={cn(
            "relative z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 transition-colors",
            open ? "border-volt bg-volt text-ink" : "border-line2 bg-panel2 text-snow hover:border-volt"
          )}
        >
          <motion.span animate={{ rotate: open ? 45 : 0 }} className="flex">
            {open ? <Check className="h-6 w-6" /> : <Crosshair className="h-6 w-6" />}
          </motion.span>
        </motion.button>
      </div>
      <StageNote>тап по кнопке · выбор слота дуги</StageNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NAV-03 — TAB BAR                                                    */
/* ------------------------------------------------------------------ */
const TABS = [
  { icon: Home, label: "БАЗА", c: "#38e1ff", note: "постройки и склад", badge: 0 },
  { icon: Swords, label: "АРЕНА", c: "#ff4655", note: "рейтинг 2 430 · S12", badge: 0 },
  { icon: Package, label: "ЛУТ", c: "#ffb43a", note: "3 новых предмета", badge: 3 },
  { icon: User, label: "ПРОФИЛЬ", c: "#d7ff3e", note: "уровень 47", badge: 0 },
];

export function BottomNavDemo() {
  const [tab, setTab] = useState(1);
  const Active = TABS[tab];

  return (
    <div className="absolute inset-0 flex flex-col justify-end overflow-hidden select-none">
      {/* content */}
      <div className="relative flex-1 px-6 pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ x: 34, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -34, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex h-full max-h-36 flex-col justify-between rounded-xl border border-line bg-panel2 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-black" style={{ color: Active.c }}>
                {Active.label}
              </span>
              <Active.icon className="h-5 w-5" style={{ color: Active.c }} />
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-4/5 rounded bg-line" />
              <div className="h-1.5 w-3/5 rounded bg-line" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-fog uppercase">{Active.note}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* tabbar */}
      <div className="relative z-10 m-3 flex items-stretch rounded-xl border border-line2 bg-panel/95 p-1 backdrop-blur">
        {TABS.map((t, i) => {
          const on = i === tab;
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => setTab(i)}
              className="relative flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-lg py-2"
            >
              {on && (
                <motion.span
                  layoutId="tabpill"
                  className="absolute inset-0 rounded-lg border border-volt/40 bg-volt/10"
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
              <span className="relative">
                <motion.span
                  animate={on ? { y: [0, -5, 0], scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                  className="block"
                >
                  <t.icon className="h-4.5 w-4.5" style={{ color: on ? t.c : "var(--color-fog)", width: 18, height: 18 }} />
                </motion.span>
                {t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-blood px-0.5 font-mono text-[8px] font-bold text-ink">
                    {t.badge}
                  </span>
                )}
              </span>
              <span
                className="relative font-mono text-[8px] tracking-[0.2em]"
                style={{ color: on ? t.c : "var(--color-fog)" }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
      <StageNote>пилюля-индикатор на общем layoutId</StageNote>
    </div>
  );
}
