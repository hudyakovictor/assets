/* ============================================================
   MOTION 99 · demos-b.js — Модуль 3 (Transform UI) + Модуль 4 (Переходы 2026)
   ============================================================ */
(() => {
"use strict";
const { $, $$, clamp, lerp, rand, Spring, ticker, fitCanvas, onResize, reduced } = window.M99;
const EASE_OUT = "cubic-bezier(.16,1,.3,1)";
const wait = ms => new Promise(r => setTimeout(r, ms));
const anim = (el, kf, opt) => el.animate(kf, opt).finished.catch(() => {});

/* ================= 3.1 FLIP ================= */
DEMOS["d-flip"] = root => {
  const overlay = $("#flipOverlay", root), scrim = $("#flipScrim", root), detail = $("#flipDetail", root);
  const cards = $$(".flip-card", root);
  const DATA = [
    ["🪐", "Nebula OS", "Детальный экран, в который морфила карточка. Обрати внимание: фон затемняется с blur, контент входит стаггером снизу, а закрытие проигрывает FLIP назад — элемент возвращается ровно в свою ячейку."],
    ["🌊", "Liquid Nav", "Та же техника shared-element: навигация «помнит», из какой кнопки выросла. Пространственная непрерывность — главный закон Transform UI."],
    ["⚡", "Volt Engine", "FLIP анимирует только transform и opacity: никакой перестройки layout в кадре, значит стабильные 120 FPS даже на средних устройствах."],
    ["🎛", "Haptic Lab", "В нативных приложениях этот морфинг называется shared element transition; в вебе 2026 его частично автоматизирует View Transitions API."],
    ["🔮", "Glass Kit", "Заметь: пока контейнер летит, его содержимое кросс-фейдится — текст карточки гаснет в первой трети, текст панели рождается в последней."],
    ["🛸", "Orbit UI", "Закрытие проигрывает путь обратно — пользователь никогда не теряет контекст. Это и есть «дорогое» ощущение интерфейса."]
  ];
  const fdItems = [$("#fdIco", root), $("#fdTitle", root), $("#fdText", root), $(".fd-stats", root), $("#fdClose", root)];
  fdItems.forEach((el, i) => { el.classList.add("fd-item"); el.style.setProperty("--d", i); });

  let openCard = null, busy = false;

  function placeFinal(){
    detail.style.width = `min(520px, ${root.clientWidth - 36}px)`;
    detail.style.left = "50%"; detail.style.top = "50%";
  }
  function open(card){
    if (busy || openCard) return; busy = true; openCard = card;
    const i = +card.dataset.flip;
    $("#fdIco", root).textContent = DATA[i][0];
    $("#fdTitle", root).textContent = DATA[i][1];
    $("#fdText", root).textContent = DATA[i][2];
    placeFinal();
    const first = card.getBoundingClientRect();
    overlay.classList.add("open"); detail.style.visibility = "visible";
    const last = detail.getBoundingClientRect();
    const sx = first.width / last.width, sy = first.height / last.height;
    const dx = first.left + first.width / 2 - (last.left + last.width / 2);
    const dy = first.top + first.height / 2 - (last.top + last.height / 2);
    card.classList.add("morphing");
    if (reduced()){
      detail.style.transform = "translate(-50%,-50%)";
      detail.classList.add("open"); busy = false; return;
    }
    const a = detail.animate([
      { transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${sx},${sy})` },
      { transform: "translate(-50%,-50%) scale(1,1)" }
    ], { duration: 560, easing: EASE_OUT });
    detail.style.transform = "translate(-50%,-50%)";
    requestAnimationFrame(() => detail.classList.add("open"));
    a.onfinish = () => busy = false;
    setTimeout(() => busy = false, 600);
  }
  function close(){
    if (busy || !openCard) return; busy = true;
    detail.classList.remove("open");
    const first = openCard.getBoundingClientRect();
    const last = detail.getBoundingClientRect();
    const sx = first.width / last.width, sy = first.height / last.height;
    const dx = first.left + first.width / 2 - (last.left + last.width / 2);
    const dy = first.top + first.height / 2 - (last.top + last.height / 2);
    const fin = () => {
      overlay.classList.remove("open"); detail.style.visibility = "hidden";
      openCard.classList.remove("morphing"); openCard = null; busy = false;
    };
    if (reduced()){ fin(); return; }
    const a = detail.animate([
      { transform: "translate(-50%,-50%) scale(1,1)" },
      { transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${sx},${sy})` }
    ], { duration: 460, easing: "cubic-bezier(.5,0,.2,1)" });
    a.onfinish = fin; setTimeout(fin, 520);
  }
  cards.forEach(c => c.addEventListener("click", () => open(c)));
  scrim.addEventListener("click", close);
  $("#fdClose", root).addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  detail.style.visibility = "hidden";
};

/* ================= 3.2 CONTAINER TRANSFORM ================= */
DEMOS["d-container"] = root => {
  const panel = $("#ctPanel", root), fab = $("#ctFab", root), content = $("#ctContent", root);
  root.appendChild(fab); fab.style.right = "22px"; fab.style.bottom = "22px";
  let open = false, busy = false;

  function collapsedStyle(){
    const w = panel.offsetWidth || 340, s = 58 / w;
    panel.style.transformOrigin = "bottom right";
    panel.style.transform = `translate(-29px,-29px) scale(${s})`;
    panel.style.borderRadius = (30 / s) + "px";
    panel.style.pointerEvents = "none";
    content.style.opacity = 0;
  }
  collapsedStyle();

  function setOpen(to){
    if (busy || to === open) return; busy = true; open = to;
    const dur = reduced() ? 160 : (to ? 480 : 420);
    if (to){
      panel.style.pointerEvents = "auto";
      fab.animate([{ transform: "scale(1) rotate(0)", opacity: 1 }, { transform: "scale(.3) rotate(140deg)", opacity: 0 }],
        { duration: dur * .6, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
      const a = panel.animate([
        { transform: panel.style.transform, borderRadius: panel.style.borderRadius },
        { transform: "translate(0,0) scale(1)", borderRadius: "26px" }
      ], { duration: dur, easing: "cubic-bezier(.2,0,0,1)" });
      panel.style.transform = "none"; panel.style.borderRadius = "26px";
      content.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
        { duration: dur * .6, delay: dur * .45, easing: EASE_OUT, fill: "backwards" });
      content.style.opacity = 1;
      a.onfinish = () => busy = false; setTimeout(() => busy = false, dur + 40);
    } else {
      content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur * .35, easing: "ease-in", fill: "forwards" })
        .onfinish = () => content.style.opacity = 0;
      const w = panel.offsetWidth || 340, s = 58 / w;
      const a = panel.animate([
        { transform: "none", borderRadius: "26px" },
        { transform: `translate(-29px,-29px) scale(${s})`, borderRadius: (30 / s) + "px" }
      ], { duration: dur, easing: "cubic-bezier(.2,0,0,1)" });
      fab.animate([{ transform: "scale(.3) rotate(140deg)", opacity: 0 }, { transform: "scale(1) rotate(0)", opacity: 1 }],
        { duration: dur * .7, delay: dur * .3, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" });
      a.onfinish = () => { collapsedStyle(); busy = false; };
      setTimeout(() => { if (busy){ collapsedStyle(); busy = false; } }, dur + 60);
    }
  }
  fab.addEventListener("click", () => setOpen(true));
  $("#ctCancel", root).addEventListener("click", () => setOpen(false));
  root.addEventListener("pointerdown", e => { if (open && !panel.contains(e.target) && e.target !== fab) setOpen(false); });
};

/* ================= 3.3 GOOEY TAB BAR ================= */
DEMOS["d-tabbar"] = root => {
  const blob = $("#tabBlob", root), ghost = $("#tabGhost", root);
  const icons = $$(".tab-ico", root);
  const sp = new Spring({ k: 340, c: 24 }); const gh = new Spring({ k: 190, c: 17 });
  let running = false, idx = 0;

  const posOf = i => { const el = icons[i]; return el.offsetLeft + el.offsetWidth / 2 - 32; };
  function place(x, gx){
    const v = Math.abs(sp.v);
    const stx = 1 + Math.min(v * .00085, .36), sty = 1 / stx;
    blob.style.transform = `translateX(${x}px) scaleX(${stx}) scaleY(${sty})`;
    ghost.style.transform = `translateX(${gx}px) scale(.92)`;
  }
  function jumpTo(i, animate = true){
    idx = i;
    icons.forEach((el, j) => {
      el.classList.toggle("active", j === i);
      if (j === i && animate){ el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
    });
    sp.target = posOf(i);
    if (!animate){ sp.x = gh.x = gh.target = sp.target; place(sp.x, gh.x); return; }
    gh.target = sp.target;
    if (!running) start();
  }
  const tick = dt => {
    sp.step(dt); gh.step(dt);
    place(sp.x, gh.x);
    if (sp.settled && gh.settled){ sp.x = sp.target; gh.x = gh.target; place(sp.x, gh.x); stop(); }
  };
  function start(){ running = true; ticker.add(tick); }
  function stop(){ running = false; ticker.remove(tick); }
  icons.forEach((el, i) => el.addEventListener("click", () => { if (i !== idx) jumpTo(i); }));
  requestAnimationFrame(() => jumpTo(0, false));
  return { pause: stop, resume: () => { if (running) start(); } };
};

/* ================= 3.4 STAGGER ================= */
DEMOS["d-stagger"] = root => {
  const grid = $("#staggerGrid", root);
  const N = 12, COLS = 4;
  const tiles = [];
  for (let i = 0; i < N; i++){
    const t = document.createElement("div"); t.className = "st-tile hidden"; t.textContent = i + 1;
    grid.appendChild(t); tiles.push(t);
  }
  let pattern = "linear", timers = [];
  $$("#stPattern .chip", root).forEach(ch => ch.addEventListener("click", () => {
    $$("#stPattern .chip", root).forEach(c => c.classList.remove("active"));
    ch.classList.add("active"); pattern = ch.dataset.p;
  }));
  $("#stDelay", root).addEventListener("input", e => $("#stDelayV", root).textContent = e.target.value + "мс");

  function order(){
    const o = tiles.map((_, i) => i);
    if (pattern === "linear") return o.map(i => i);
    if (pattern === "center") return o.map(i => Math.round(Math.abs(i - (N - 1) / 2)));
    if (pattern === "diag") return o.map(i => Math.floor(i / COLS) + (i % COLS));
    const sh = o.slice(); for (let i = sh.length - 1; i > 0; i--){ const j = (Math.random() * (i + 1)) | 0; [sh[i], sh[j]] = [sh[j], sh[i]]; }
    return sh;
  }
  function play(show){
    timers.forEach(clearTimeout); timers = [];
    const step = +$("#stDelay", root).value * (show || reduced() ? 1 : .6);
    const ord = order(), max = Math.max(...ord);
    tiles.forEach((t, i) => {
      const d = (show ? ord[i] : max - ord[i]) * step;
      timers.push(setTimeout(() => t.classList.toggle("hidden", !show), d));
    });
  }
  $("#stIn", root).addEventListener("click", () => play(true));
  $("#stOut", root).addEventListener("click", () => play(false));
  setTimeout(() => play(true), 450);
};

/* ================= 4.1 TRANSITION LAB (PHONE) ================= */
DEMOS["d-phone"] = root => {
  const screenEl = $("#phoneScreen", root);
  const A = $("#screenA", root), B = $("#screenB", root);
  const liq = $("#liquidCanvas", root), blinds = $("#fxBlinds", root);
  const curtain = $("#fxCurtain", root), glitch = $("#fxGlitch", root);
  const hint = $("#trHint", root);
  let type = "iris", busy = false, cur = "A";
  const HINTS = {
    iris: "iris · clip-path из точки тапа",
    liquid: "liquid · метаболлы накрывают и обнажают",
    blinds: "blinds · ломти со стаггером",
    glitch: "glitch · RGB-разрывы и джиттер",
    curtain: "curtain · штора с backdrop-blur"
  };
  for (let i = 0; i < 8; i++) blinds.appendChild(document.createElement("i"));
  for (let i = 0; i < 7; i++) glitch.appendChild(document.createElement("i"));
  $$("#trType .chip", root).forEach(ch => ch.addEventListener("click", () => {
    $$("#trType .chip", root).forEach(c => c.classList.remove("active"));
    ch.classList.add("active"); type = ch.dataset.tr; hint.textContent = HINTS[type];
  }));

  const incoming = () => (cur === "A" ? B : A);
  const outgoing = () => (cur === "A" ? A : B);
  function swap(){ incoming().classList.add("on"); outgoing().classList.remove("on"); cur = cur === "A" ? "B" : "A"; }

  async function iris(){
    const inc = incoming(), out = outgoing();
    inc.style.zIndex = 2; inc.classList.add("on");
    if (reduced()){ await anim(inc, [{ opacity: 0 }, { opacity: 1 }], { duration: 150 }); }
    else {
      await Promise.all([
        anim(inc, [{ clipPath: "circle(0% at 50% 42%)" }, { clipPath: "circle(150% at 50% 42%)" }], { duration: 640, easing: "cubic-bezier(.62,0,.2,1)" }),
        anim(out, [{ transform: "scale(1)", filter: "brightness(1)" }, { transform: "scale(.93)", filter: "brightness(.55)" }], { duration: 640, easing: EASE_OUT })
      ]);
    }
    out.classList.remove("on"); out.style.transform = ""; out.style.filter = "";
    inc.style.clipPath = ""; inc.style.zIndex = ""; cur = cur === "A" ? "B" : "A";
  }
  async function liquid(){
    const { ctx, w, h } = fitCanvas(liq);
    liq.style.opacity = 1;
    const blobs = [];
    const cols = 5, rows = 8;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++){
      blobs.push({ x: (i + .5) / cols * w + rand(-14, 14), y: (j + .5) / rows * h + rand(-14, 14),
        d: rand(0, .3), hue: Math.random() < .5 ? 190 : 262 });
    }
    const R = Math.hypot(w, h) / 2.6;
    const dur = reduced() ? 300 : 950;
    let swapped = false; const t0 = performance.now();
    await new Promise(res => {
      const f = now => {
        const t = clamp((now - t0) / dur, 0, 1);
        ctx.clearRect(0, 0, w, h);
        ctx.filter = "blur(5px)";
        blobs.forEach(b => {
          let k;
          if (t < .5){ k = clamp((t * 2 - b.d) / (1 - b.d), 0, 1); k = 1 - Math.pow(1 - k, 3); }
          else { k = clamp((1 - t) * 2 - b.d * .8, 0, 1); k = 1 - Math.pow(1 - k, 2); }
          const r = R * .62 * k;
          if (r > 1){
            const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
            g.addColorStop(0, `hsla(${b.hue},85%,62%,1)`); g.addColorStop(1, `hsla(${b.hue},85%,52%,1)`);
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 7); ctx.fill();
          }
        });
        ctx.filter = "none";
        if (t >= .5 && !swapped){ swapped = true; swap(); }
        t < 1 ? requestAnimationFrame(f) : res();
      };
      requestAnimationFrame(f);
    });
    liq.style.opacity = 0; ctx.clearRect(0, 0, w, h);
  }
  async function doBlinds(){
    const sl = $$("i", blinds);
    if (reduced()){ await anim(screenEl, [{ opacity: .2 }, { opacity: 1 }], { duration: 160 }); swap(); return; }
    sl.forEach((s, i) => { s.style.transformOrigin = "left"; s.style.transform = "scaleX(0)"; });
    sl.forEach((s, i) => anim(s, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: 300, delay: i * 52, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }));
    await wait(300 + sl.length * 52 - 120); swap();
    await wait(140);
    sl.forEach((s, i) => { s.style.transformOrigin = "right"; });
    sl.forEach((s, i) => anim(s, [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: 300, delay: (sl.length - 1 - i) * 44, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }));
    await wait(340 + sl.length * 44);
    sl.forEach(s => { s.style.transform = "scaleX(0)"; s.style.transformOrigin = "left"; });
  }
  async function doGlitch(){
    const sl = $$("i", glitch);
    glitch.style.opacity = 1;
    if (reduced()){ swap(); glitch.style.opacity = 0; return; }
    let swapped = false;
    for (let k = 0; k < 9; k++){
      sl.forEach(s => {
        s.style.transform = `translateX(${rand(-40, 40)}px)`;
        s.style.background = `hsla(${rand(180, 320)},80%,${rand(8, 22)}%,${rand(.75, 1)})`;
        s.style.boxShadow = k % 2 ? `${rand(-8,8)}px 0 rgba(255,0,80,.5), ${rand(-8,8)}px 0 rgba(0,255,255,.5)` : "none";
      });
      screenEl.style.filter = `hue-rotate(${rand(-60, 60)}deg) saturate(${rand(1.4, 3)})`;
      if (k === 4 && !swapped){ swapped = true; swap(); }
      await wait(46);
    }
    sl.forEach(s => { s.style.transform = "none"; s.style.boxShadow = "none"; });
    screenEl.style.filter = "";
    await anim(glitch, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 });
    glitch.style.opacity = 0;
  }
  async function doCurtain(){
    curtain.style.opacity = 1;
    if (reduced()){ curtain.style.transform = "translateY(0)"; swap(); await wait(120); curtain.style.transform = "translateY(-101%)"; curtain.style.opacity = 0; return; }
    curtain.style.backdropFilter = curtain.style.webkitBackdropFilter = "blur(14px)";
    await anim(curtain, [{ transform: "translateY(-101%)" }, { transform: "translateY(0)" }], { duration: 340, easing: "cubic-bezier(.6,0,.2,1)" });
    swap(); await wait(90);
    await anim(curtain, [{ transform: "translateY(0)" }, { transform: "translateY(101%)" }], { duration: 380, easing: "cubic-bezier(.6,0,.2,1)" });
    curtain.style.transform = "translateY(-101%)"; curtain.style.opacity = 0; curtain.style.backdropFilter = "";
  }

  $("#trPlay", root).addEventListener("click", async () => {
    if (busy) return; busy = true;
    try {
      if (type === "iris") await iris();
      else if (type === "liquid") await liquid();
      else if (type === "blinds") await doBlinds();
      else if (type === "glitch") await doGlitch();
      else await doCurtain();
    } catch(e){}
    busy = false;
  });
};

/* ================= 4.2 MAGNETIC ================= */
DEMOS["d-magnetic"] = root => {
  const btn = $("#magnetBtn", root), text = $(".mb-text", root), card = $("#spotCard", root);
  const fine = matchMedia("(pointer:fine)").matches;
  let cur = null, cx = 0, cy = 0, tx = 0, ty = 0, engaged = false, inside = false, raf = 0;

  if (fine && !reduced()){
    cur = document.createElement("div"); cur.className = "magnet-cursor"; root.appendChild(cur);
  }
  root.addEventListener("pointerenter", () => inside = true);
  root.addEventListener("pointerleave", () => { inside = false; release(); });
  root.addEventListener("pointermove", e => {
    const r = root.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
    if (!cur) return;
    if (!raf) raf = requestAnimationFrame(loop);
    const br = btn.getBoundingClientRect();
    const bcx = br.left + br.width / 2 - r.left, bcy = br.top + br.height / 2 - r.top;
    const d = Math.hypot(tx - bcx, ty - bcy);
    const R_IN = 120, R_OUT = engaged ? 165 : 130;   // гистерезис
    if (d < R_IN) engaged = true;
    if (d > R_OUT) engaged = false;
    if (engaged){
      const f = clamp(1 - d / (R_OUT * 1.6), 0, 1);
      btn.style.transition = "none"; text.style.transition = "none";
      btn.style.transform = `translate(${(tx - bcx) * .32 * f}px, ${(ty - bcy) * .32 * f}px)`;
      text.style.transform = `translate(${(tx - bcx) * .17 * f}px, ${(ty - bcy) * .17 * f}px)`;
      btn.style.setProperty("--gx", ((e.clientX - br.left) / br.width * 100) + "%");
      btn.style.setProperty("--gy", ((e.clientY - br.top) / br.height * 100) + "%");
      cur.classList.add("big");
    } else release(false);
    // spotlight card
    const cr = card.getBoundingClientRect();
    if (e.clientX > cr.left && e.clientX < cr.right && e.clientY > cr.top && e.clientY < cr.bottom){
      const px = (e.clientX - cr.left) / cr.width, py = (e.clientY - cr.top) / cr.height;
      card.style.setProperty("--gx", px * 100 + "%"); card.style.setProperty("--gy", py * 100 + "%");
      card.style.transform = `perspective(600px) rotateX(${(.5 - py) * 7}deg) rotateY(${(px - .5) * 7}deg) translateY(-3px)`;
    }
  });
  function release(full = true){
    engaged = false;
    btn.style.transition = "transform .65s cubic-bezier(.34,1.56,.64,1)";
    text.style.transition = "transform .65s cubic-bezier(.34,1.56,.64,1)";
    btn.style.transform = "none"; text.style.transform = "none";
    if (cur) cur.classList.remove("big");
    if (full) card.style.transform = "";
  }
  function loop(){
    cx = lerp(cx, tx, .22); cy = lerp(cy, ty, .22);
    if (cur) cur.style.transform = `translate(${cx}px,${cy}px)`;
    raf = inside ? requestAnimationFrame(loop) : 0;
  }
  return { pause(){ inside = false; release(); }, resume(){} };
};

/* ================= 4.3 SWIPE PHYSICS ================= */
DEMOS["d-swipe"] = root => {
  const stack = $("#swipeStack", root), readout = $("#swipeReadout", root);
  let cards = $$(".swipe-card", root);
  const depthTf = j => j === 0 ? "none" : `translateY(${Math.min(j, 2) * 14}px) scale(${1 - Math.min(j, 2) * .05})`;
  function restack(animate = true){
    cards.forEach((c, j) => {
      const i = cards.length - 1 - j; // DOM: last = top
      c.style.zIndex = 10 + i * -1 + "";
    });
    const order = [...cards].reverse(); // top first
    order.forEach((c, j) => {
      if (!animate) c.style.transition = "none";
      c.style.transform = depthTf(j); c.style.opacity = j > 2 ? 0 : 1;
      if (!animate) requestAnimationFrame(() => c.style.transition = "");
    });
  }
  const top = () => cards[cards.length - 1];
  restack(false);

  let drag = null;
  stack.addEventListener("pointerdown", e => {
    const c = top(); if (!c || c !== e.target.closest(".swipe-card")) return;
    drag = { c, x0: e.clientX, y0: e.clientY, pts: [{ x: e.clientX, t: performance.now() }], moved: false };
    c.classList.add("dragging"); c.setPointerCapture(e.pointerId); e.preventDefault();
  });
  stack.addEventListener("pointermove", e => {
    if (!drag) return;
    drag.moved = true;
    const w = stack.clientWidth;
    let dx = e.clientX - drag.x0, dy = (e.clientY - drag.y0) * .22;
    const lim = w * .55;
    if (Math.abs(dx) > lim) dx = Math.sign(dx) * (lim + (Math.abs(dx) - lim) * .35); // резина
    drag.dx = dx;
    drag.c.style.transform = `translate(${dx}px,${dy}px) rotate(${clamp(dx * .055, -14, 14)}deg)`;
    const p = clamp(Math.abs(dx) / (w * .4), 0, 1);
    const order = [...cards].reverse();
    order.slice(1, 3).forEach((c2, j) => {
      const base = j + 1;
      c2.style.transform = `translateY(${lerp(base * 14, (base - 1) * 14, p)}px) scale(${lerp(1 - base * .05, 1 - (base - 1) * .05, p)})`;
    });
    drag.pts.push({ x: e.clientX, t: performance.now() });
    if (drag.pts.length > 6) drag.pts.shift();
    readout.textContent = `x: ${dx | 0}px · тяни дальше порога`;
  });
  const release = () => {
    if (!drag) return;
    const { c, pts, dx = 0 } = drag; drag = null;
    c.classList.remove("dragging");
    const w = stack.clientWidth;
    const p0 = pts[0], p1 = pts[pts.length - 1];
    const v = pts.length > 1 ? (p1.x - p0.x) / Math.max(20, p1.t - p0.t) : 0; // px/мс
    readout.textContent = `v: ${v.toFixed(2)} px/мс · x: ${dx | 0}`;
    const dismiss = Math.abs(dx) > w * .4 || Math.abs(v) > .5;
    if (dismiss){
      const dir = Math.sign(dx || v || 1);
      const a = c.animate([
        { transform: c.style.transform || "none", opacity: 1 },
        { transform: `translate(${dir * w * 1.7}px,${rand(-40, 40)}px) rotate(${dir * 26}deg)`, opacity: 0 }
      ], { duration: reduced() ? 180 : 430, easing: "cubic-bezier(.5,0,.75,0)" });
      a.onfinish = () => {
        c.style.opacity = 1; c.style.transform = "";
        stack.prepend(c);                       // ушедшая — в низ стопки
        cards = $$(".swipe-card", root);
        restack(); readout.textContent = dir > 0 ? "→ dismiss (вправо)" : "← dismiss (влево)";
      };
    } else {
      const sp = new Spring({ k: 320, c: 24, x: dx, v: v * 1000, target: 0 });
      const tick = dt => {
        sp.step(dt);
        c.style.transform = `translate(${sp.x}px,0) rotate(${clamp(sp.x * .055, -14, 14)}deg)`;
        if (sp.settled){ ticker.remove(tick); c.style.transform = depthTf(0); readout.textContent = "v: 0.00 px/мс · возврат пружиной"; }
      };
      ticker.add(tick);
      restack();
    }
  };
  stack.addEventListener("pointerup", release);
  stack.addEventListener("pointercancel", release);
  $("#swReset", root).addEventListener("click", () => {
    cards.forEach(c => { c.style.transform = ""; c.style.opacity = 1; });
    cards = $$(".swipe-card", root); restack();
    readout.textContent = "v: 0.00 px/мс · x: 0";
  });
};

/* ================= 4.4 SCROLL STACK ================= */
DEMOS["d-scrollstack"] = root => {
  const sc = $("#ssScroll", root), cards = $$(".ss-card", root);
  let raf = 0;
  function upd(){
    raf = 0;
    const cr = sc.getBoundingClientRect();
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (!next){ c.style.transform = ""; c.style.filter = ""; return; }
      const d = next.getBoundingClientRect().top - cr.top;
      const p = clamp(1 - d / (cr.height * .82), 0, 1);
      c.style.transform = `scale(${1 - p * .09}) translateY(${p * -6}px)`;
      c.style.filter = `brightness(${1 - p * .38})`;
    });
  }
  sc.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  setTimeout(upd, 300);
  return { pause(){}, resume: upd };
};

})();
