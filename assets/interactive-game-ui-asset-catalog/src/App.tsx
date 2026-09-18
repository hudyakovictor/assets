import { useMemo, useState } from 'react';
import { Nav, Hero, Footer } from './components/chrome';
import { CategorySection, AssetCard } from './components/AssetCard';
import { CATEGORIES, ASSETS } from './data/assets';
import type { CategoryId } from './lib/types';

export default function App() {
  const [filter, setFilter] = useState<'all' | CategoryId>('all');

  const visible = useMemo(
    () => CATEGORIES.filter((c) => filter === 'all' || c.id === filter),
    [filter]
  );
  const shown = useMemo(
    () => (filter === 'all' ? ASSETS.length : ASSETS.filter((a) => a.category === filter).length),
    [filter]
  );

  const stats = [
    { k: String(ASSETS.length), l: 'MOTION SYSTEMS' },
    { k: '06', l: 'CATEGORIES' },
    { k: '100%', l: 'SPEC COVERAGE' },
    { k: '60%', l: 'NEW EXTENSIONS' },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-ink font-body text-white">
      <Nav cats={CATEGORIES} />
      <Hero stats={stats} />

      {/* filter rail */}
      <div className="sticky top-12 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar md:px-8">
          <button
            onClick={() => setFilter('all')}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[9px] tracking-[0.2em] transition-all ${
              filter === 'all' ? 'border-volt bg-volt text-black' : 'border-line text-white/50 hover:border-white/30 hover:text-white'
            }`}
          >
            ALL UNITS
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(filter === c.id ? 'all' : c.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[9px] tracking-[0.2em] transition-all ${
                filter === c.id ? 'text-black' : 'border-line text-white/50 hover:border-white/30 hover:text-white'
              }`}
              style={filter === c.id ? { background: c.color, borderColor: c.color } : undefined}
            >
              <span className="size-1 rounded-full" style={{ background: filter === c.id ? '#000' : c.color }} />
              {c.label}
            </button>
          ))}
          <span className="ml-auto hidden shrink-0 font-mono text-[9px] tracking-[0.24em] text-white/30 md:block">
            SHOWING {String(shown).padStart(2, '0')} / {ASSETS.length}
          </span>
        </div>
      </div>

      <main>
        {visible.map((cat) => {
          const items = ASSETS.filter((a) => a.category === cat.id);
          return (
            <CategorySection key={cat.id} cat={cat} count={items.length}>
              {items.map((a, i) => (
                <AssetCard key={a.id} asset={a} cat={cat} index={i} />
              ))}
            </CategorySection>
          );
        })}
      </main>

      <Footer cats={CATEGORIES} totalUnits={ASSETS.length} />
    </div>
  );
}
