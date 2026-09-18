import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES, catOf } from './lib/core';
import type { AssetDef, Origin } from './lib/core';
import { assets as transitions } from './demos/transitions';
import { assets as gamefeel } from './demos/gamefeel';
import { assets as particles } from './demos/particlesfx';
import { assets as hud } from './demos/hud';
import { assets as rewards } from './demos/rewards';
import { assets as textfx } from './demos/textfx';
import { assets as touch } from './demos/touch';
import { assets as menu } from './demos/menu';
import { assets as camera } from './demos/camera';
import { Nav, Hero, Marquee, SectionHead, Footer } from './components/Chrome';
import { AssetCard } from './components/AssetCard';
import { Inspector } from './components/Inspector';

const ASSETS: AssetDef[] = [...transitions, ...gamefeel, ...particles, ...hud, ...rewards, ...textfx, ...touch, ...menu, ...camera];

const ORIGINS: { id: Origin | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'ALL' },
  { id: 'ARCHIVE', label: 'CORE·40%' },
  { id: 'EXPANSION', label: 'NEW·60%' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [origin, setOrigin] = useState<Origin | 'ALL'>('ALL');
  const [open, setOpen] = useState<AssetDef | null>(null);

  const filtered = useMemo(() => ASSETS.filter((a) => {
    if (cat !== 'all' && a.cat !== cat) return false;
    if (origin !== 'ALL' && a.origin !== origin) return false;
    if (query) {
      const q = query.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q)) || catOf(a.cat).label.toLowerCase().includes(q);
    }
    return true;
  }), [query, cat, origin]);

  const archiveN = useMemo(() => ASSETS.filter((a) => a.origin === 'ARCHIVE').length, []);

  const minis = useMemo(() => ['screen-shake', 'glitch-type', 'prize-wheel'].map((id) => {
    const a = ASSETS.find((x) => x.id === id)!;
    return { name: a.name, color: catOf(a.cat).color, node: <a.Component /> };
  }), []);

  const random = () => setOpen(ASSETS[Math.floor(Math.random() * ASSETS.length)]);

  return (
    <div className="relative min-h-screen bg-void text-ink">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="dotgrid absolute inset-0 opacity-30" />
        <div className="absolute -top-40 left-[-10%] h-[480px] w-[480px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,211,238,.07), transparent 65%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(251,191,36,.06), transparent 65%)' }} />
      </div>
      <div className="grain" />
      <Nav query={query} setQuery={setQuery} onRandom={random} />
      <main className="relative z-10">
        <Hero total={ASSETS.length} archive={archiveN} minis={minis} onRandom={random} />
        <Marquee items={['IRIS WIPE', 'HIT STOP', 'COIN FOUNTAIN', 'GHOST BAR', 'RARITY REVEAL', 'GLITCH TYPE', 'MAGNETIC', 'ZOOM PUNCH', 'SLOW-MO', 'PRIZE WHEEL']} />
        <div id="vault" className="sticky top-14 z-40 border-b border-white/8 bg-void/85 backdrop-blur-lg">
          <div className="mx-auto flex max-w-[1500px] items-center gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            <FilterPill active={cat === 'all'} onClick={() => setCat('all')} label="ALL" count={ASSETS.length} color="#ffffff" />
            {CATEGORIES.map((c) => (
              <FilterPill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} label={c.label.toUpperCase()} count={ASSETS.filter((a) => a.cat === c.id).length} color={c.color} icon={c.icon} />
            ))}
            <div className="mx-2 h-5 w-px shrink-0 bg-white/10" />
            {ORIGINS.map((o) => (
              <button
                key={o.id}
                onClick={() => setOrigin(o.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.15em] transition-colors ${origin === o.id ? 'border-amber-300/60 bg-amber-400/10 text-amber-300' : 'border-white/10 text-white/40 hover:text-white/70'}`}
              >{o.label}</button>
            ))}
            <span className="ml-auto shrink-0 pl-3 font-mono text-[9px] tracking-[0.2em] text-white/30">{filtered.length}/{ASSETS.length}</span>
          </div>
        </div>
        <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6">
          {filtered.length === 0 && (
            <div className="py-24 text-center font-mono text-[11px] tracking-[0.3em] text-white/30">NO ASSETS MATCH — CLEAR FILTERS</div>
          )}
          {CATEGORIES.map((c, ci) => {
            const list = filtered.filter((a) => a.cat === c.id);
            if (!list.length) return null;
            return (
              <section key={c.id} className="mb-16 scroll-mt-28">
                <SectionHead index={ci} cat={c} count={list.length} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {list.map((a, i) => (<AssetCard key={a.id} asset={a} index={i} onOpen={setOpen} />))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
      <AnimatePresence>
        {open && <Inspector asset={open} all={ASSETS} onClose={() => setOpen(null)} onSwap={setOpen} />}
      </AnimatePresence>
    </div>
  );
}

function FilterPill({ active, onClick, label, count, color, icon: Icon }: {
  active: boolean; onClick: () => void; label: string; count: number; color: string; icon?: LucideIcon;
}) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.12em] transition-all"
      style={active ? { borderColor: color, color, background: `${color}14` } : { borderColor: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.45)' }}
    >
      {Icon && <Icon className="h-3 w-3" />}{label}<span className="opacity-60">{count}</span>
    </button>
  );
}
