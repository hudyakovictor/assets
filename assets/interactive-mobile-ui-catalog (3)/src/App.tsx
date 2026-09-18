import { useMemo, useState, type CSSProperties } from "react";
import { motion, useScroll } from "framer-motion";
import {
  ArrowRight,
  Gamepad2,
  Hand,
  MousePointerClick,
  Move,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  CATEGORIES,
  ORIGIN_COUNT,
  TOTAL_ASSETS,
  type Asset,
  type Origin,
} from "@/data/catalog";
import { AssetCard, SectionHeader } from "@/components/CatalogUI";
import { cn } from "@/utils/cn";

type OriginFilter = Origin | "all";

const ORIGIN_FILTERS: { k: OriginFilter; label: string }[] = [
  { k: "all", label: "все" },
  { k: "core", label: "база курса" },
  { k: "plus", label: "докручено" },
  { k: "new", label: "новые" },
];

const FLOATERS = [
  { img: "img/char-ronin.jpg", name: "КАГЭ", fr: "-7deg", cls: "top-14 right-[46%] w-36", delay: "0s" },
  { img: "img/char-vanguard.jpg", name: "БАСТИОН", fr: "5deg", cls: "top-40 right-8 w-44", delay: "1.2s" },
  { img: "img/char-mage.jpg", name: "ВЭСПЕР", fr: "-3deg", cls: "bottom-16 right-[34%] w-32", delay: "2s" },
];

export default function App() {
  const { scrollYProgress } = useScroll();
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState<OriginFilter>("all");

  const matches = (a: Asset) => {
    const q = query.trim().toLowerCase();
    const okQ =
      !q ||
      [a.title, a.en, a.id, ...a.tags].join(" ").toLowerCase().includes(q);
    const okO = origin === "all" || a.origin === origin;
    return okQ && okO;
  };

  const visible = useMemo(
    () =>
      CATEGORIES.map((c) => ({ ...c, assets: c.assets.filter(matches) })).filter(
        (c) => c.assets.length > 0
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, origin]
  );

  const visibleCount = visible.reduce((n, c) => n + c.assets.length, 0);

  return (
    <div className="min-h-screen bg-ink text-snow">
      {/* scroll progress */}
      <motion.div
        className="fixed top-0 right-0 left-0 z-[90] h-0.5 origin-left bg-volt"
        style={{ scaleX: scrollYProgress }}
      />
      {/* grain */}
      <div className="bg-noise pointer-events-none fixed inset-0 z-[80] opacity-[0.05]" />

      {/* ============ NAV ============ */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-line/70 bg-ink/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-volt shadow-[0_0_18px_rgba(215,255,62,0.4)]">
              <Gamepad2 className="h-5 w-5 text-ink" strokeWidth={2.4} />
            </span>
            <span className="font-display text-sm font-black tracking-wide">
              FORGE<span className="text-volt">-99</span>
            </span>
            <span className="hidden font-mono text-[8px] tracking-[0.3em] text-fog uppercase sm:block">
              motion ui asset pack
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[9px] tracking-[0.18em] text-fog uppercase md:block">
              курс 40% → пак <span className="text-volt">100%</span>
            </span>
            <a
              href="#catalog"
              className="rounded-md border border-volt/60 px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.2em] text-volt uppercase transition-colors hover:bg-volt hover:text-ink"
            >
              каталог
            </a>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_1fr]">
          {/* left */}
          <div className="px-5 pt-28 pb-16 sm:px-8 lg:pt-36 lg:pb-24">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-volt uppercase">
              <span className="anim-blink h-2 w-2 bg-volt" />
              каталог интерактивных блоков игрового ui
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.2rem,7vw,4.6rem)] leading-[0.98] font-black tracking-tight uppercase">
              Собери игру,
              <br />
              которой дадут
              <br />
              <span className="text-stroke-volt">99/100</span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-relaxed text-fog sm:text-base">
              {TOTAL_ASSETS} живых блоков — управление, HUD, переходы, мета и сок. Курс
              покрывал 40% элементов: здесь собраны все 100%, с докрученными темами и
              категориями, о которых преподаватель забыл. Каждый экземпляр можно{" "}
              <span className="text-snow">трогать, тянуть и зажимать</span> прямо на странице.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="group inline-flex items-center gap-2 rounded-md bg-volt px-6 py-3.5 font-mono text-[11px] font-black tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
              >
                открыть конструктор
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#legend"
                className="inline-flex items-center gap-2 rounded-md border border-line2 px-6 py-3.5 font-mono text-[11px] font-bold tracking-[0.2em] text-fog uppercase transition-colors hover:border-fog hover:text-snow"
              >
                легенда пака
              </a>
            </div>

            <div className="mt-12 grid w-fit grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
              {[
                [String(TOTAL_ASSETS), "блоков"],
                [String(CATEGORIES.length), "категорий"],
                ["4", "типа ввода"],
                ["100%", "покрытие"],
              ].map(([v, l]) => (
                <div key={l} className="bg-panel px-5 py-3.5 sm:px-6">
                  <div className="font-display text-xl font-black text-volt sm:text-2xl">{v}</div>
                  <div className="mt-0.5 font-mono text-[8px] tracking-[0.25em] text-fog uppercase">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right — art panel */}
          <div className="relative hidden overflow-hidden border-l border-line lg:block">
            <img
              src="img/hero-bg.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-ink/30" />
            <div className="bg-scan absolute inset-0" />

            {/* HUD brackets */}
            <span className="absolute top-20 left-5 h-5 w-5 border-t-2 border-l-2 border-volt/70" />
            <span className="absolute right-5 bottom-6 h-5 w-5 border-r-2 border-b-2 border-volt/70" />
            <span className="absolute top-24 left-5 font-mono text-[9px] tracking-[0.22em] text-fog uppercase">
              specimen // hero_units
            </span>

            {FLOATERS.map((f) => (
              <div
                key={f.name}
                className={cn("anim-floaty absolute", f.cls)}
                style={{ "--fr": f.fr, animationDelay: f.delay } as CSSProperties}
              >
                <div className="overflow-hidden rounded-lg border border-line2 shadow-2xl">
                  <img src={f.img} alt={f.name} className="h-36 w-full object-cover" />
                  <div className="flex items-center justify-between bg-panel px-2 py-1.5">
                    <span className="font-display text-[9px] font-bold text-snow">{f.name}</span>
                    <span className="font-mono text-[7px] tracking-[0.2em] text-volt">NAV-01</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ticker */}
        <div className="overflow-hidden border-t border-line bg-panel py-3">
          <div className="anim-marquee flex w-max items-center gap-8">
            {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
              <span
                key={i}
                className="flex items-center gap-8 font-mono text-[10px] tracking-[0.25em] whitespace-nowrap uppercase"
              >
                <span className="text-fog">
                  <span className="text-volt">{c.index}</span> {c.titleRu}
                  <span className="text-fog/50"> / {c.titleEn}</span>
                </span>
                <span className="text-line2">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LEGEND ============ */}
      <section id="legend" className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <span className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase">// как читать пак</span>
          <div className="mt-5 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
            <div className="bg-panel p-6">
              <h3 className="font-display text-xs font-black tracking-wide text-snow uppercase">Происхождение блока</h3>
              <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-fog">
                <li><span className="mr-2 rounded border border-cyc/50 px-1.5 py-0.5 font-mono text-[8px] text-cyc">БАЗА КУРСА</span>разбиралось в архиве курса</li>
                <li><span className="mr-2 rounded border border-amb/50 px-1.5 py-0.5 font-mono text-[8px] text-amb">ДОКРУЧЕНО</span>тема была — блок забыли</li>
                <li><span className="mr-2 rounded border border-volt bg-volt px-1.5 py-0.5 font-mono text-[8px] font-black text-ink">НОВОЕ</span>категории вне программы</li>
              </ul>
            </div>
            <div className="bg-panel p-6">
              <h3 className="font-display text-xs font-black tracking-wide text-snow uppercase">Тип ввода</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { i: MousePointerClick, t: "тап", d: "быстрый клик" },
                  { i: Move, t: "тяни", d: "драг с пружиной" },
                  { i: Hand, t: "держи", d: "холд-зарядка" },
                  { i: Play, t: "авто", d: "играет само" },
                ].map((x) => (
                  <span key={x.t} className="flex items-center gap-1.5 rounded border border-line2 bg-panel2 px-2.5 py-1.5 font-mono text-[9px] tracking-widest text-fog uppercase">
                    <x.i className="h-3.5 w-3.5 text-volt" />
                    {x.t} <span className="text-fog/50 normal-case">· {x.d}</span>
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-fog">
                Ничего статичного: каждый стейдж — рабочий механизм на пружинах, стаггерах и жестах.
              </p>
            </div>
            <div className="bg-panel p-6">
              <h3 className="font-display text-xs font-black tracking-wide text-snow uppercase">Сложность сборки</h3>
              <ul className="mt-3 space-y-2.5 text-[11px] text-fog">
                {[1, 2, 3].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="flex items-end gap-1">
                      {[1, 2, 3].map((i) => (
                        <span key={i} className={cn("w-1.5 rounded-[1px]", i <= t ? "bg-volt" : "bg-line2")} style={{ height: 5 + i * 3 }} />
                      ))}
                    </span>
                    {t === 1 && "собирается за вечер: стейт + 2 анимации"}
                    {t === 2 && "нужны жесты, физика и фазовая машина"}
                    {t === 3 && "полный цикл: несколько состояний и слоёв"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FILTER BAR ============ */}
      <div id="catalog" className="sticky top-14 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2.5 overflow-x-auto px-4 py-3 sm:px-6">
          <label className="flex h-9 shrink-0 items-center gap-2 rounded-md border border-line2 bg-panel px-3 focus-within:border-volt">
            <Search className="h-3.5 w-3.5 text-fog" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="поиск блока…"
              className="w-28 bg-transparent font-mono text-[10px] tracking-wider text-snow outline-none placeholder:text-fog/50 sm:w-40"
            />
          </label>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={`#sec-${c.id}`}
                className="shrink-0 rounded-md border border-line2 px-2.5 py-2 font-mono text-[9px] tracking-[0.14em] whitespace-nowrap text-fog uppercase transition-colors hover:border-volt hover:text-volt"
              >
                <span className="text-volt/70">{c.index}</span> {c.titleRu}
              </a>
            ))}
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-1 rounded-md border border-line2 p-0.5 md:flex">
            {ORIGIN_FILTERS.map((f) => (
              <button
                key={f.k}
                type="button"
                onClick={() => setOrigin(f.k)}
                className={cn(
                  "cursor-pointer rounded px-2.5 py-1.5 font-mono text-[8px] tracking-[0.14em] uppercase transition-colors",
                  origin === f.k ? "bg-volt font-black text-ink" : "text-fog hover:text-snow"
                )}
              >
                {f.label}
                {f.k !== "all" && <span className="ml-1 opacity-60">{ORIGIN_COUNT(f.k as Origin)}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============ SECTIONS ============ */}
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line2 py-24 text-center">
            <span className="font-display text-lg font-black text-fog uppercase">Ничего не найдено</span>
            <p className="max-w-xs text-xs text-fog">
              Запрос «{query}» не попал ни в один блок. Сбрось фильтры — в паке {TOTAL_ASSETS} позиций.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOrigin("all");
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-volt/60 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] text-volt uppercase hover:bg-volt hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" /> сбросить
            </button>
          </div>
        )}

        {query || origin !== "all" ? (
          <div className="mb-8 font-mono text-[10px] tracking-[0.2em] text-fog uppercase">
            найдено: <span className="text-volt">{visibleCount}</span> / {TOTAL_ASSETS}
          </div>
        ) : null}

        <div className="space-y-16">
          {visible.map((cat) => (
            <section key={cat.id} className="space-y-6">
              <SectionHeader cat={cat} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cat.assets.map((a, i) => (
                  <AssetCard key={a.id} asset={a} order={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-volt uppercase">// конструктор собран</span>
              <h2 className="mt-4 font-display text-3xl leading-tight font-black uppercase sm:text-5xl">
                Бери блоки —<br />
                <span className="text-stroke">собирай игры</span>
              </h2>
              <p className="mt-4 max-w-md text-sm text-fog">
                Управление задаёт чувствительность, HUD — читаемость, переходы — бесшовность,
                а фидбек с метой — возвращаемость. Собери из этого пака свою игру на 99/100.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-2 font-mono text-[9px] tracking-[0.18em] text-fog uppercase">
              {CATEGORIES.map((c) => (
                <a key={c.id} href={`#sec-${c.id}`} className="transition-colors hover:text-volt">
                  <span className="text-volt/60">{c.index}</span> {c.titleEn.toLowerCase()}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[8px] tracking-[0.22em] text-fog/60 uppercase">
            <span className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-volt">
                <Gamepad2 className="h-2.5 w-2.5 text-ink" />
              </span>
              FORGE-99 · motion ui asset pack
            </span>
            <span>архив курса = 40% · докручено до 100% · {TOTAL_ASSETS} блоков · 2026</span>
            <span>built with springs, staggers &amp; hit-stop</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
