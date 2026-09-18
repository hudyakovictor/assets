/* ============================================================
   MOTION 99 · app.js — роутер, жизненный цикл демо, утилиты
   ============================================================ */
(() => {
"use strict";
const M99 = window.M99 = {};
const DEMOS = window.DEMOS = {};
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
M99.$ = $; M99.$$ = $$;

/* ---------- utils ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const rand  = (a, b) => a + Math.random() * (b - a);
M99.clamp = clamp; M99.lerp = lerp; M99.rand = rand;
M99.reduced = () => document.documentElement.dataset.motion === "reduced";

function hash1(n){ const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); }
M99.noise1 = x => { // непрерывный «перлин-подобный» шум -1..1
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return (hash1(i) * (1 - u) + hash1(i + 1) * u) * 2 - 1;
};

M99.bez = (x1, y1, x2, y2) => { // solver кубической кривой Безье
  const cx = u => 3*(1-u)*(1-u)*u*x1 + 3*(1-u)*u*u*x2 + u*u*u;
  const cy = u => 3*(1-u)*(1-u)*u*y1 + 3*(1-u)*u*u*y2 + u*u*u;
  const dx = u => 3*(1-u)*(1-u)*x1 + 6*(1-u)*u*(x2-x1) + 3*u*u*(1-x2);
  return t => {
    if (t <= 0) return 0; if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 6; i++){ const e = cx(u) - t; if (Math.abs(e) < 1e-5) break; const d = dx(u); if (Math.abs(d) < 1e-6) break; u -= e / d; }
    return cy(clamp(u, 0, 1));
  };
};

class Spring {
  constructor(o = {}){ this.k=o.k??260; this.c=o.c??18; this.m=o.m??1; this.x=o.x??0; this.v=o.v??0; this.target=o.target??0; }
  /* полу-неявный Эйлер с фиксированным подшагом — стабилен на 60 и 120 Гц */
  step(dt){
    const n = Math.max(1, Math.ceil(dt / (1/240))), h = dt / n;
    for (let i = 0; i < n; i++){
      const a = (-this.k * (this.x - this.target) - this.c * this.v) / this.m;
      this.v += a * h; this.x += this.v * h;
    }
  }
  get settled(){ return Math.abs(this.x - this.target) < .12 && Math.abs(this.v) < .5; }
  get zeta(){ return this.c / (2 * Math.sqrt(this.k * this.m)); }
}
M99.Spring = Spring;

/* ---------- единый тикер (экономим батарею) ---------- */
M99.ticker = (() => {
  const fns = new Set(); let raf = null, last = 0;
  function frame(t){
    const dt = clamp((t - last) / 1000, 0.0005, 0.05); last = t;
    for (const f of [...fns]) f(dt, t / 1000);
    raf = fns.size ? requestAnimationFrame(frame) : null;
  }
  return {
    add(fn){ fns.add(fn); if (!raf){ last = performance.now(); raf = requestAnimationFrame(frame); } return () => M99.ticker.remove(fn); },
    remove(fn){ fns.delete(fn); }
  };
})();

/* ---------- canvas helpers ---------- */
M99.fitCanvas = cv => {
  const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.max(2, Math.round(r.width * dpr));
  cv.height = Math.max(2, Math.round(r.height * dpr));
  const ctx = cv.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
};
const resizeCbs = [];
M99.onResize = fn => resizeCbs.push(fn);
window.addEventListener("resize", (() => { let t; return () => { clearTimeout(t); t = setTimeout(() => resizeCbs.forEach(f => f()), 140); }; })());

/* ---------- копирование ---------- */
async function copyText(text, btn){
  try { await navigator.clipboard.writeText(text); }
  catch(e){
    const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = 0;
    document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch(_){} ta.remove();
  }
  if (btn){ const old = btn.textContent; btn.textContent = "✓ скопировано"; btn.classList.add("done");
    setTimeout(() => { btn.textContent = old; btn.classList.remove("done"); }, 1400); }
}
M99.copy = copyText;

function dedent(s){
  const lines = s.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  let min = Infinity;
  for (const l of lines) if (l.trim()) min = Math.min(min, l.match(/^\s*/)[0].length);
  return lines.map(l => l.slice(min === Infinity ? 0 : min)).join("\n");
}

/* ============ РОУТЕР ============ */
const pages = $$(".page");
let current = null;
const ctrls = new Map(); // section -> [ctrl]

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
  { threshold: 0.06, rootMargin: "0px 0px -3% 0px" });
$$(".reveal").forEach(el => io.observe(el));

function restartReveals(sec){
  $$(".reveal", sec).forEach((el, i) => {
    el.classList.remove("in");
    el.style.transitionDelay = "";
    io.unobserve(el); io.observe(el);
  });
  // каскад для того, что уже в вьюпорте
  requestAnimationFrame(() => {
    $$(".reveal", sec).slice(0, 14).forEach((el, i) => { el.style.transitionDelay = (i * 45) + "ms"; });
    setTimeout(() => $$(".reveal", sec).forEach(el => el.style.transitionDelay = ""), 1200);
  });
}

function initDemos(sec){
  if (!ctrls.has(sec)) ctrls.set(sec, []);
  const list = ctrls.get(sec);
  $$("[data-demo]", sec).forEach(el => {
    if (el._m99done) return;
    el._m99done = true;
    const fn = DEMOS[el.dataset.demo];
    if (!fn) return;
    try {
      const ctrl = fn(el);
      if (ctrl) list.push(ctrl);
    } catch(err){ console.error("demo", el.dataset.demo, err); }
  });
  // код-сниппеты хранилища
  $$(".btn-code", sec).forEach(btn => {
    if (btn._m99done) return; btn._m99done = true;
    btn.addEventListener("click", () => {
      let wrap = btn.nextElementSibling;
      if (!wrap || !wrap.classList || !wrap.classList.contains("code-wrap")){
        const tpl = btn.parentElement.querySelector("script.snippet");
        if (!tpl) return;
        wrap = document.createElement("div"); wrap.className = "code-wrap";
        const cp = document.createElement("button"); cp.className = "copy-btn"; cp.textContent = "копировать";
        const pre = document.createElement("pre"); pre.textContent = dedent(tpl.textContent);
        cp.addEventListener("click", () => copyText(pre.textContent, cp));
        wrap.append(cp, pre); btn.after(wrap);
      }
      const open = wrap.classList.toggle("open");
      btn.classList.toggle("open", open);
    });
  });
}

function activate(route){
  const next = pages.find(p => p.dataset.route === route) || pages[0];
  if (next === current) return;
  const prev = current; current = next;
  $$(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.nav === next.dataset.route));
  document.body.classList.remove("menu-open");

  const show = () => {
    pages.forEach(p => p.classList.remove("active", "leaving"));
    next.classList.add("active");
    window.scrollTo({ top: 0 });
    restartReveals(next);
    initDemos(next);
    ctrls.forEach((list, sec) => list.forEach(c => { try { sec === next ? c.resume && c.resume() : c.pause && c.pause(); } catch(e){} }));
    if (next.dataset.route === "home") runCounters();
  };
  if (prev && !M99.reduced()){
    prev.classList.remove("active"); prev.classList.add("leaving");
    setTimeout(show, 190);
  } else show();
}

const route = () => (location.hash || "#home").slice(1);
window.addEventListener("hashchange", () => activate(route()));

/* ============ HERO: split title, counters, marquee ============ */
function splitTitle(){
  const h = $("[data-split]"); if (!h || h._split) return; h._split = true;
  let idx = 0;
  const walk = node => {
    [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3){
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "w";
          [...part].forEach(letter => {
            const c = document.createElement("span"); c.className = "c"; c.textContent = letter;
            c.style.setProperty("--i", idx++); w.appendChild(c);
          });
          frag.appendChild(w); frag.appendChild(document.createTextNode(" "));
        });
        ch.replaceWith(frag);
      } else if (ch.nodeName !== "BR") walk(ch);
    });
  };
  walk(h);
}

let countersDone = false;
function runCounters(){
  if (countersDone) return; countersDone = true;
  $$("[data-count]").forEach(el => {
    const target = +el.dataset.count, ease = M99.bez(.16, 1, .3, 1), t0 = performance.now(), dur = 1400;
    const tick = t => {
      const p = clamp((t - t0) / dur, 0, 1);
      el.textContent = Math.round(ease(p) * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function setupMarquee(){
  const tr = $("#marqueeTrack"); if (!tr || tr.children.length > 1) return;
  tr.appendChild(tr.children[0].cloneNode(true));
}

/* ============ motion toggle / menu / spotlight ============ */
function setupChrome(){
  const btn = $("#motionToggle");
  const sysReduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const set = on => {
    document.documentElement.dataset.motion = on ? "reduced" : "full";
    btn.setAttribute("aria-pressed", String(on));
    document.dispatchEvent(new CustomEvent("m99:motion", { detail: { reduced: on } }));
  };
  if (sysReduce) set(true);
  btn.addEventListener("click", () => set(document.documentElement.dataset.motion !== "reduced"));

  const menu = $("#menuBtn");
  menu.addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".nav-link").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  // spotlight на карточках модулей
  $$(".module-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  });

  // SVG-определения (gooey-фильтр) должны быть доступны на всех страницах
  const defs = $("svg.svg-defs"); if (defs) document.body.appendChild(defs);
}

/* ============ boot ============ */
document.addEventListener("DOMContentLoaded", () => {
  splitTitle(); setupMarquee(); setupChrome();
  activate(route());
});
})();
