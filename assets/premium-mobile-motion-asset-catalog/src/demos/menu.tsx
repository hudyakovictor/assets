import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Swords, Backpack, ShoppingBag, Settings, ChevronRight, Plus, Coins, Map, Users, Star } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { useCycle, RI } from '../lib/core';

/* ---------------- Stagger List ---------------- */
const MENU = [
  { icon: Play, t: 'PLAY' }, { icon: Swords, t: 'BATTLE PASS' }, { icon: Backpack, t: 'INVENTORY' }, { icon: ShoppingBag, t: 'SHOP' }, { icon: Settings, t: 'SETTINGS' },
];
function StaggerList() {
  const k = useCycle(2800);
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.ul
        key={k}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
        className="w-[185px] rounded-xl border border-white/10 bg-[#0e0e16]/90 p-1.5 shadow-2xl"
      >
        {MENU.map((m) => (
          <motion.li
            key={m.t}
            variants={{ hidden: { x: -26, opacity: 0 }, show: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 240, damping: 20 } } }}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
          >
            <m.icon className="h-3.5 w-3.5 text-teal-300" />
            <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-white/80">{m.t}</span>
            <ChevronRight className="ml-auto h-3 w-3 text-white/20" />
          </motion.li>
        ))}
      </motion.ul>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-teal-100/50">STAGGER 70ms · MOUNT LOOP</div>
    </div>
  );
}

/* ---------------- Tab Spring ---------------- */
const TABS = [
  { icon: Play, t: 'PLAY', sub: 'QUEUE: RANKED' },
  { icon: Swords, t: 'HEROES', sub: 'ROSTER 42' },
  { icon: ShoppingBag, t: 'SHOP', sub: 'DAILY DEALS' },
];
function TabSpring() {
  const [a, setA] = useState(0);
  const k = useCycle(1900);
  const active = a % 3;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden">
      <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
        {TABS.map((t, i) => (
          <button key={t.t} onClick={() => setA(i)} className="relative px-4 py-2">
            {(k + active) % 3 === i && (
              <motion.span layoutId="mn-tab" className="absolute inset-0 rounded-full border border-teal-300/40 bg-teal-300/15" transition={{ type: 'spring', stiffness: 420, damping: 30 }} />
            )}
            <span className={`relative z-10 flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.2em] ${(k + active) % 3 === i ? 'text-teal-200' : 'text-white/40'}`}>
              <t.icon className="h-3 w-3" />{t.t}
            </span>
          </button>
        ))}
      </div>
      <motion.div key={(k + active) % 3} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }} className="font-mono text-[10px] tracking-[0.3em] text-teal-100/60">
        {TABS[(k + active) % 3].sub}
      </motion.div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">LAYOUT PILL · SPRING(420,30)</div>
    </div>
  );
}

/* ---------------- Radial Bloom ---------------- */
const BLOOM = [Coins, Map, Users, Star, Swords];
function RadialBloom() {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative">
        {BLOOM.map((Icon, i) => {
          const ang = (-160 + i * 35) * (Math.PI / 180);
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center rounded-full border border-teal-300/30 bg-[#12121c]"
              animate={open ? { x: Math.cos(ang) * 66, y: Math.sin(ang) * 66, scale: 1, opacity: 1 } : { x: 0, y: 0, scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 19, delay: open ? i * 0.05 : (BLOOM.length - i) * 0.03 }}
            >
              <Icon className="h-3.5 w-3.5 text-teal-200" />
            </motion.div>
          );
        })}
        <motion.button
          onClick={() => setOpen((o) => !o)}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-teal-300 text-black shadow-[0_0_26px_rgba(45,212,191,.5)]"
        >
          <Plus className="h-5 w-5" strokeWidth={2.6} />
        </motion.button>
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">5 ACTIONS · 35° SPREAD</div>
    </div>
  );
}

/* ---------------- Bottom Sheet ---------------- */
function BottomSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <button onClick={() => setOpen(true)} className="rounded-full border border-teal-300/40 bg-teal-300/10 px-4 py-1.5 font-mono text-[9px] font-bold tracking-[0.25em] text-teal-200">OPEN LOADOUT</button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/65" />
            <motion.div
              key="sheet"
              initial={{ y: '112%' }}
              animate={{ y: 0 }}
              exit={{ y: '112%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="absolute inset-x-2 bottom-0 rounded-t-2xl border border-white/10 bg-[#12121c] p-4"
            >
              <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-white/20" />
              <div className="mb-3 font-mono text-[9px] tracking-[0.3em] text-teal-200/70">LOADOUT // SLOT_01</div>
              {[0, 1, 2].map((i) => (
                <div key={i} className="mb-2 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/8" />
                  <div className="flex-1"><div className="mb-1.5 h-1.5 w-3/4 rounded bg-white/12" /><div className="h-1.5 w-1/2 rounded bg-white/8" /></div>
                </div>
              ))}
              <div className="mt-3 rounded-lg bg-teal-300 py-2 text-center font-mono text-[9px] font-bold tracking-[0.25em] text-black">EQUIP</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Spotlight Row ---------------- */
const SPOTS = [
  { icon: Star, t: 'QUESTS', c: '#2dd4bf' },
  { icon: Swords, t: 'ARENA', c: '#fb7185' },
  { icon: ShoppingBag, t: 'SHOP', c: '#fbbf24' },
];
function SpotCard({ icon: Icon, t, c }: { icon: typeof Star; t: string; c: string }) {
  const [pos, setPos] = useState({ x: 50, y: 50, on: false });
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0e0e16] p-3"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true }); }}
      onPointerLeave={() => setPos((p) => ({ ...p, on: false }))}
    >
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-200" style={{ opacity: pos.on ? 1 : 0, background: `radial-gradient(120px at ${pos.x}px ${pos.y}px, ${c}38, transparent 70%)` }} />
      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${c}1e` }}><Icon className="h-4 w-4" style={{ color: c }} /></div>
      <div className="mt-2 font-mono text-[9px] font-bold tracking-[0.2em] text-white/75">{t}</div>
      <div className="mt-1.5 h-1 w-full rounded bg-white/8" />
    </div>
  );
}
function SpotlightRow() {
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden">
      <div className="grid w-full grid-cols-3 gap-2 px-3">
        {SPOTS.map((s) => (<SpotCard key={s.t} icon={s.icon} t={s.t} c={s.c} />))}
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">POINTER-TRACKED 120px SPOT</div>
    </div>
  );
}

/* ---------------- Depth Stack ---------------- */
const DECK = [
  { icon: Play, t: 'CAMPAIGN', c: '#2dd4bf' },
  { icon: Map, t: 'EXPEDITION', c: '#fbbf24' },
  { icon: Users, t: 'CO-OP', c: '#f472b6' },
];
function DepthStack() {
  const k = useCycle(2400);
  return (
    <div className="absolute inset-0 flex justify-center overflow-hidden pt-6">
      <div className="relative h-[140px] w-[190px]">
        {DECK.map((c, i) => {
          const pos = (i - (k % 3) + 3) % 3;
          return (
            <motion.div
              key={i}
              animate={{ y: pos * 14, scale: 1 - pos * 0.07, opacity: 1 - pos * 0.18 }}
              style={{ zIndex: 3 - pos }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="absolute inset-x-0 top-0 rounded-xl border border-white/10 bg-[#0f0f17] p-3 shadow-xl"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${c.c}1e` }}><c.icon className="h-4 w-4" style={{ color: c.c }} /></div>
                <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/80">{c.t}</div>
                <div className="ml-auto font-mono text-[8px] text-white/30">LV{RI(2, 9)}</div>
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded bg-white/8"><div className="h-full rounded" style={{ width: `${62 - pos * 20}%`, background: c.c }} /></div>
            </motion.div>
          );
        })}
      </div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/40">COVERFLOW RE-SLOT · 2.4s</div>
    </div>
  );
}

export const assets: AssetDef[] = [
  { id: 'stagger-list', name: 'Staggered Mount', cat: 'menu', origin: 'ARCHIVE', trigger: 'AUTO', duration: '70ms stagger', easing: 'spring(240,20)', tags: ['cascade', 'list', 'mount'], desc: 'Main-menu mount cascade — five rows entering on staggered springs from the rail.', Component: StaggerList },
  { id: 'tab-spring', name: 'Spring Tab Pill', cat: 'menu', origin: 'ARCHIVE', trigger: 'AUTO', duration: 'per tick', easing: 'spring(420,30)', tags: ['tabs', 'layoutId', 'pill'], desc: 'Layout-animated pill traveling between tabs on a stiff spring, with synced content swap.', Component: TabSpring },
  { id: 'radial-bloom', name: 'Radial Menu Bloom', cat: 'menu', origin: 'EXPANSION', trigger: 'TAP', duration: 'stagger 50ms', easing: 'spring(320,19)', tags: ['fab', 'arc', 'actions'], desc: 'FAB blooms five actions on a 35°-spread arc with staggered springs and a 45° plus-spin.', Component: RadialBloom },
  { id: 'bottom-sheet', name: 'Bottom Sheet', cat: 'menu', origin: 'EXPANSION', trigger: 'TAP', duration: 'spring rise', easing: 'spring(260,28)', tags: ['sheet', 'modal', 'scrim'], desc: 'Mobile-native bottom sheet with sprung rise, dimming scrim and grabber affordance.', Component: BottomSheet },
  { id: 'spotlight-row', name: 'Spotlight Cards', cat: 'menu', origin: 'EXPANSION', trigger: 'HOVER', duration: 'continuous', easing: 'opacity 0.2s', tags: ['hover', 'glow', 'border'], desc: 'Feature cards with a pointer-tracked 120px spotlight washing the border and face.', Component: SpotlightRow },
  { id: 'depth-stack', name: 'Depth Stack', cat: 'menu', origin: 'EXPANSION', trigger: 'AUTO', duration: '2.4s re-slot', easing: 'spring(260,22)', tags: ['deck', 'coverflow', 'z-space'], desc: 'Coverflow deck re-slotting through z-space — front card sinks as the deck advances.', Component: DepthStack },
];
