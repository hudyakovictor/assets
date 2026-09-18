/* ============================================================
   MOTION 99 · demos-c.js — Модуль 5 (Секреты топ-10%) + Хранилище
   ============================================================ */
(() => {
"use strict";
const { $, $$, clamp, lerp, rand, Spring, ticker, fitCanvas, onResize, reduced } = window.M99;
const EASE_OUT = "cubic-bezier(.16,1,.3,1)";

/* ================= 5.1 FRAME BUDGET ================= */
DEMOS["d-budget"] = root => {
  let hz = 120; const SCALE = 20; // мс на всю полосу
  const segs = { js: $("#bbJs", root), style: $("#bbStyle", root), paint: $("#bbPaint", root), comp: $("#bbComp", root) };
  const limit = $("#bbLimit", root), verdict = $("#budgetVerdict", root);
  $$("#budgetHz .chip", root).forEach(ch => ch.addEventListener("click", () => {
    $$("#budgetHz .chip", root).forEach(c => c.classList.remove("active"));
    ch.classList.add("active"); hz = +ch.dataset.hz; upd();
  }));
  const ids = [["bgJs", "bgJsV", "js"], ["bgStyle", "bgStyleV", "style"], ["bgPaint", "bgPaintV", "paint"], ["bgComp", "bgCompV", "comp"]];
  ids.forEach(([a, b]) => {
    const el = $("#" + a, root);
    el.addEventListener("input", () => { $("#" + b, root).textContent = (+el.value).toFixed(1) + "мс"; upd(); });
  });
  function upd(){
    const budget = 1000 / hz;
    const vals = ids.map(([a]) => +$("#" + a, root).value);
    vals.forEach((v, i) => segs[ids[i][2]].style.width = (v / SCALE * 100) + "%");
    limit.style.left = `calc(${budget / SCALE * 100}% )`;
    limit.querySelector("span").textContent = `лимит ${budget.toFixed(1)}мс @${hz}Гц`;
    const total = vals.reduce((s, v) => s + v, 0);
    if (total <= budget){
      verdict.className = "budget-verdict ok";
      verdict.textContent = `Кадр в бюджете ✓ · занято ${total.toFixed(1)}мс · запас ${(budget - total).toFixed(1)}мс`;
    } else {
      verdict.className = "budget-verdict bad";
      verdict.textContent = `✗ Мимо бюджета на ${(total - budget).toFixed(1)}мс → дроп до ~${Math.max(1, Math.floor(1000 / total))} fps`;
      verdict.style.animation = "none"; void verdict.offsetWidth; verdict.style.animation = "";
    }
  }
  upd();
};

/* ================= 5.2 COMPOSITOR RACE ================= */
DEMOS["d-compositor"] = root => {
  const graph = $("#fpsGraph", root), fpsNow = $("#fpsNow", root), frameMs = $("#frameMs", root);
  const trackA = $("#compTrackA", root);
  let g = fitCanvas(graph), samples = [], loadOn = false, loadEls = [];

  function setTrackW(){
    $$(".comp-track", root).forEach(t => {
      const el = t.querySelector(".comp-box-el");
      if (el) el.style.setProperty("--track-w", (t.clientWidth - 40) + "px");
    });
  }
  setTrackW(); onResize(() => { setTrackW(); if (graph.getBoundingClientRect().width > 20){ g = fitCanvas(graph); } });

  $("#compLoad", root).addEventListener("click", e => {
    loadOn = !loadOn;
    e.target.textContent = loadOn ? "✓ Нагрузка включена — сними" : "⚠ Нагрузить main thread";
    e.target.classList.toggle("btn-primary", loadOn);
    if (loadOn){
      for (let i = 0; i < 14; i++){
        const b = document.createElement("div");
        b.className = "comp-box layout-box";
        b.style.top = (4 + (i % 4) * 10) + "px";
        b.style.animationDelay = (-i * .16) + "s";
        b.style.opacity = .8;
        trackA.appendChild(b); loadEls.push(b);
      }
    } else { loadEls.forEach(b => b.remove()); loadEls = []; }
  });

  const tick = dt => {
    if (loadOn){ const end = performance.now() + 4; while (performance.now() < end); } // честный busy-wait
    samples.push(dt * 1000); if (samples.length > 150) samples.shift();
    const { ctx, w, h } = g;
    ctx.clearRect(0, 0, w, h);
    const bw = w / 150;
    samples.forEach((ms, i) => {
      const bh = clamp(ms / 34, 0, 1) * (h - 6);
      ctx.fillStyle = ms > 20 ? "rgba(244,63,94,.85)" : ms > 12 ? "rgba(251,191,36,.8)" : "rgba(45,212,191,.75)";
      ctx.fillRect(i * bw, h - bh - 3, Math.max(1, bw - 1), bh);
    });
    ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.setLineDash([3, 4]);
    const y8 = h - clamp(8.3 / 34, 0, 1) * (h - 6) - 3;
    ctx.beginPath(); ctx.moveTo(0, y8); ctx.lineTo(w, y8); ctx.stroke(); ctx.setLineDash([]);
    const avg = samples.slice(-40).reduce((s, v) => s + v, 0) / Math.min(40, samples.length);
    fpsNow.textContent = Math.round(1000 / avg);
    frameMs.textContent = avg.toFixed(1) + " мс/кадр";
  };
  ticker.add(tick);
  return { pause: () => ticker.remove(tick), resume: () => { setTrackW(); ticker.add(tick); } };
};

/* ================= 5.3 HAPTIC SCORE ================= */
DEMOS["d-haptics"] = root => {
  const puck = $("#hpPuck", root), slot = $("#hpSlot", root);
  const events = $$(".hp-event", root), vibChk = $("#hpVib", root);
  const EVENTS = [
    { t: 30, vib: 10, i: 0 }, { t: 340, vib: 16, i: 1 }, { t: 600, vib: 30, i: 2 }, { t: 900, vib: 8, i: 3 }
  ];
  let running = false;
  $("#hpPlay", root).addEventListener("click", () => { if (!running) play(); });

  function pulse(x){
    const p = document.createElement("div"); p.className = "hp-pulse";
    p.style.left = (puck.offsetLeft + x) + "px";
    root.querySelector(".hp-track").appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
  function play(){
    running = true;
    events.forEach(e => e.classList.remove("fire"));
    puck.style.transform = "translateX(0)";
    const dx = (slot.offsetLeft + slot.offsetWidth / 2) - (puck.offsetLeft + puck.offsetWidth / 2);
    const sp = new Spring({ k: 150, c: 15, m: 1, x: 0, target: reduced() ? 0 : dx });
    if (reduced()){ sp.x = dx; }
    const t0 = performance.now(); let ei = 0;
    const tick = () => {
      const el = performance.now() - t0;
      if (!reduced()) sp.step(1 / 60);
      puck.style.transform = `translateX(${sp.x}px)`;
      while (ei < EVENTS.length && el >= EVENTS[ei].t){
        const ev = EVENTS[ei++];
        if (!reduced()){
          events[ev.i].classList.add("fire");
          setTimeout(() => events[ev.i].classList.remove("fire"), 300);
          pulse(sp.x);
          if (vibChk.checked && navigator.vibrate) navigator.vibrate(ev.vib);
        }
      }
      if (el > 1200 && (sp.settled || reduced() || el > 2200)){
        ticker.remove(tick); running = false;
        puck.style.transform = `translateX(${dx}px)`;
      }
    };
    ticker.add(tick);
  }
};

/* ================= 5.4 GHOSTING ================= */
DEMOS["d-ghost"] = root => {
  const cv = $("#ghostCanvas", root);
  let { ctx, w, h } = fitCanvas(cv);
  let t = 0; const hist = [];
  [["ghCount", "ghCountV", v => v], ["ghSpeed", "ghSpeedV", v => v + "×"]].forEach(([a, b, f]) => {
    const el = $("#" + a, root);
    el.addEventListener("input", () => $("#" + b, root).textContent = f(el.value));
  });
  const tick = dt => {
    const spd = +$("#ghSpeed", root).value;
    t += dt * spd;
    const x = w / 2 + (w / 2 - 46) * Math.sin(t * 1.15);
    const y = h / 2 + (h / 2 - 46) * Math.sin(t * 1.85 + 1.3);
    hist.push({ x, y }); if (hist.length > 80) hist.shift();
    ctx.clearRect(0, 0, w, h);
    const on = $("#ghOn", root).checked && !reduced(), n = +$("#ghCount", root).value;
    if (on){
      for (let k = n; k >= 1; k--){
        const i = hist.length - 1 - k * 3; if (i < 0) continue;
        const p = hist[i], a = .32 * (1 - k / (n + 1));
        ctx.fillStyle = `rgba(139,92,246,${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 15 * (1 - k * .05), 0, 7); ctx.fill();
      }
    }
    const gr = ctx.createRadialGradient(x - 5, y - 6, 2, x, y, 16);
    gr.addColorStop(0, "rgba(160,250,235,.98)"); gr.addColorStop(.5, "#2dd4bf"); gr.addColorStop(1, "#7c3aed");
    ctx.shadowColor = "rgba(56,189,248,.8)"; ctx.shadowBlur = 20;
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  };
  ticker.add(tick);
  const rz = () => { if (cv.getBoundingClientRect().width < 20) return; ({ ctx, w, h } = fitCanvas(cv)); };
  onResize(rz);
  return { pause: () => ticker.remove(tick), resume: () => { rz(); ticker.add(tick); } };
};

/* ================= VAULT · v-magnet ================= */
DEMOS["v-magnet"] = root => {
  const btn = $("#vMagnet", root), label = $(".vm-label", root), pad = btn.closest(".vi-pad");
  if (!matchMedia("(pointer:fine)").matches || reduced()) return;
  let engaged = false;
  pad.addEventListener("pointermove", e => {
    const r = btn.getBoundingClientRect();
    const bcx = r.left + r.width / 2, bcy = r.top + r.height / 2;
    const d = Math.hypot(e.clientX - bcx, e.clientY - bcy);
    const R = engaged ? 150 : 110;
    if (d < 110) engaged = true;
    if (d > R){ release(); return; }
    const f = clamp(1 - d / 190, 0, 1);
    btn.style.transition = "none"; label.style.transition = "none";
    btn.style.transform = `translate(${(e.clientX - bcx) * .35 * f}px,${(e.clientY - bcy) * .35 * f}px)`;
    label.style.transform = `translate(${(e.clientX - bcx) * .18 * f}px,${(e.clientY - bcy) * .18 * f}px)`;
    const br = btn.getBoundingClientRect();
    btn.style.setProperty("--x", (e.clientX - br.left) + "px");
    btn.style.setProperty("--y", (e.clientY - br.top) + "px");
  });
  pad.addEventListener("pointerleave", release);
  function release(){
    engaged = false;
    btn.style.transition = "transform .6s cubic-bezier(.34,1.56,.64,1)";
    label.style.transition = "transform .6s cubic-bezier(.34,1.56,.64,1)";
    btn.style.transform = "none"; label.style.transform = "none";
  }
};

/* ================= VAULT · v-ripple ================= */
DEMOS["v-ripple"] = root => {
  const btn = $("#vRipple", root);
  btn.addEventListener("pointerdown", e => {
    const r = btn.getBoundingClientRect();
    const s = document.createElement("span"); s.className = "ripple";
    s.style.left = (e.clientX - r.left) + "px"; s.style.top = (e.clientY - r.top) + "px";
    btn.appendChild(s); setTimeout(() => s.remove(), 700);
  });
};

/* ================= VAULT · v-odometer ================= */
DEMOS["v-odometer"] = root => {
  const odo = $("#vOdo", root);
  let value = 9940;
  function buildDigits(str){
    odo.innerHTML = "";
    [...str].forEach((ch, i) => {
      const dig = document.createElement("div"); dig.className = "odo-digit";
      const col = document.createElement("div"); col.className = "odo-col";
      for (let d = 0; d <= 9; d++){ const s = document.createElement("span"); s.textContent = d; col.appendChild(s); }
      col.style.transitionDelay = `${(str.length - 1 - i) * 45}ms`;
      col.dataset.d = ch;
      dig.appendChild(col); odo.appendChild(dig);
    });
  }
  function setCols(str, instant){
    [...str].forEach((ch, i) => {
      const col = odo.children[i] && odo.children[i].firstChild;
      if (!col) return;
      if (instant) col.style.transition = "none";
      col.style.transform = `translateY(-${ch * 10}%)`;
      if (instant) requestAnimationFrame(() => col.style.transition = "");
    });
  }
  buildDigits(String(value)); setCols(String(value), true);
  $("#vOdoBtn", root).addEventListener("click", () => {
    const oldStr = String(value);
    const grew = value + 60 > 99999;
    value = grew ? 9940 : value + 60;
    const newStr = String(value);
    if (newStr.length !== oldStr.length){
      buildDigits(newStr);
      // новые разряды стартуют со старого значения (или нуля) и въезжают
      const shift = newStr.length - oldStr.length;
      [...newStr].forEach((ch, i) => {
        const col = odo.children[i].firstChild;
        const oldD = i - shift >= 0 ? oldStr[i - shift] : "0";
        col.style.transition = "none";
        col.style.transform = `translateY(-${oldD * 10}%)`;
        odo.children[i].animate([{ transform: "scaleY(0)", opacity: 0 }, { transform: "scaleY(1)", opacity: 1 }],
          { duration: 420, easing: "cubic-bezier(.34,1.56,.64,1)" });
      });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        [...newStr].forEach((ch, i) => {
          const col = odo.children[i].firstChild;
          col.style.transition = "";
          col.style.transform = `translateY(-${ch * 10}%)`;
        });
      }));
    } else {
      setCols(newStr, false); // барабаны крутятся с Transition
    }
  });
};

/* ================= VAULT · v-ring ================= */
DEMOS["v-ring"] = root => {
  const fg = $("#rgFg", root), tip = $("#rgTip", root), num = $("#ringNum", root);
  let p = 0;
  $("#ringBtn", root).addEventListener("click", () => {
    const to = p < .5 ? 1 : 0; const from = p; p = to;
    fg.style.strokeDashoffset = 314 * (1 - to);
    tip.style.transform = `rotate(${to * 360}deg)`;
    tip.classList.toggle("on", to > 0);
    const t0 = performance.now(), dur = reduced() ? 200 : 1400;
    const ease = M99.bez(.16, 1, .3, 1);
    const tick = t => {
      const k = clamp((t - t0) / dur, 0, 1);
      num.textContent = Math.round(lerp(from, to, ease(k)) * 100) + "%";
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
};

/* ================= VAULT · v-pull ================= */
DEMOS["v-pull"] = root => {
  const box = $("#vPull", root), spin = $("#vpSpin", root), content = $("#vpContent", root);
  let startY = 0, pulling = false, resisted = 0, loading = false;
  const R = v => `translateY(${v}px)`; /* CSS-свойство translate:-50% уже центрирует */
  box.addEventListener("pointerdown", e => {
    if (loading) return;
    pulling = true; startY = e.clientY; resisted = 0;
    content.style.transition = "none"; spin.style.transition = "none";
    box.setPointerCapture(e.pointerId);
  });
  box.addEventListener("pointermove", e => {
    if (!pulling) return;
    const dy = Math.max(0, e.clientY - startY);
    resisted = dy * .45 * (1 - Math.min(dy, 300) / 700);
    content.style.transform = `translateY(${resisted}px)`;
    spin.style.opacity = clamp(resisted / 30, 0, 1);
    spin.style.transform = `translate(-50%, ${resisted * .85}px) scale(${.4 + clamp(resisted / 70, 0, 1) * .6}) rotate(${resisted * 1.7}deg)`;
  });
  const endPull = () => {
    if (!pulling) return; pulling = false;
    if (resisted > 62){
      loading = true;
      content.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)";
      spin.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)";
      content.style.transform = "translateY(52px)";
      spin.style.transform = R(52) + " scale(1)";
      const spinAnim = spin.animate([{ transform: R(52) + " scale(1) rotate(0)" }, { transform: R(52) + " scale(1) rotate(360deg)" }],
        { duration: 900, iterations: Infinity, easing: "linear" });
      setTimeout(() => {
        spinAnim.cancel();
        content.style.transition = "transform .55s cubic-bezier(.34,1.4,.5,1)";
        spin.style.transition = "transform .4s ease-in, opacity .3s";
        content.style.transform = "translateY(0)";
        spin.style.transform = R(-34) + " scale(.4)"; spin.style.opacity = 0;
        const ok = document.createElement("div");
        ok.textContent = "✓ обновлено";
        ok.style.cssText = "position:absolute;left:50%;bottom:10px;translate:-50% 0;font-size:11px;font-weight:700;color:#7ff0dd;background:rgba(45,212,191,.12);border:1px solid rgba(45,212,191,.4);padding:5px 12px;border-radius:14px";
        box.appendChild(ok);
        ok.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none", offset: .25 }, { opacity: 0, transform: "translateY(-6px)" }],
          { duration: 1500, easing: "ease-out" }).onfinish = () => ok.remove();
        loading = false;
      }, 1200);
    } else {
      content.style.transition = "transform .55s cubic-bezier(.34,1.56,.64,1)";
      spin.style.transition = "transform .45s cubic-bezier(.34,1.56,.64,1), opacity .3s";
      content.style.transform = "translateY(0)";
      spin.style.transform = R(-34) + " scale(.4)"; spin.style.opacity = 0;
    }
  };
  box.addEventListener("pointerup", endPull);
  box.addEventListener("pointercancel", endPull);
};

/* ================= VAULT · v-tilt ================= */
DEMOS["v-tilt"] = root => {
  const card = $("#vTilt", root), glare = $(".vt-glare", card), ico = $(".vt-ico", card);
  if (reduced()) return;
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    card.style.transition = "none";
    card.style.transform = `perspective(700px) rotateX(${(.5 - py) * 14}deg) rotateY(${(px - .5) * 14}deg) scale(1.03)`;
    glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.3), transparent 55%)`;
    ico.style.transform = `translateZ(34px) translate(${(px - .5) * 14}px, ${(py - .5) * 14}px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transition = "";
    card.style.transform = ""; ico.style.transform = "";
  });
};

/* ================= VAULT · v-toast ================= */
DEMOS["v-toast"] = root => {
  const wrap = $("#vToasts", root);
  const MSGS = ["🏆 Ачивка разблокирована", "⚡ Комбо ×12 — огонь!", "💎 Новый скин получен", "🎯 Миссия выполнена", "✦ Level up!"];
  let n = 0;
  function restack(){
    [...wrap.children].forEach((t, j) => { // j=0 — самый новый (внизу)
      t.style.transform = j ? `scale(${1 - j * .05}) translateY(${j * 2}px)` : "";
      t.style.filter = j ? `blur(${j * 1.2}px) brightness(${1 - j * .12})` : "";
      t.style.zIndex = 100 - j;
    });
  }
  function spawn(){
    if (wrap.children.length >= 4) dismiss(wrap.lastElementChild, true);
    const t = document.createElement("div"); t.className = "v-toast";
    t.innerHTML = `${MSGS[n++ % MSGS.length]}<u></u>`;
    wrap.prepend(t); restack();
    if (!reduced()){
      t.animate([
        { transform: "translateY(42px) scale(.8)", opacity: 0, filter: "blur(6px)" },
        { transform: "translateY(-5px) scale(1.03)", opacity: 1, filter: "blur(0)", offset: .7 },
        { transform: "none", opacity: 1 }
      ], { duration: 540, easing: "cubic-bezier(.2,.9,.3,1)" });
    }
    setTimeout(() => dismiss(t), 2800);
  }
  function dismiss(t, instant){
    if (!t || t._gone) return; t._gone = true;
    const fin = () => { t.remove(); restack(); };
    if (instant || reduced()) return fin();
    t.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(22px) scale(.85)", filter: "blur(5px)" }],
      { duration: 380, easing: "cubic-bezier(.5,0,.75,0)" }).onfinish = fin;
    setTimeout(fin, 420);
  }
  $("#vToastBtn", root).addEventListener("click", spawn);
};

/* ================= VAULT · v-burger ================= */
DEMOS["v-burger"] = root => {
  const b = $("#vBurger", root);
  b.addEventListener("click", () => {
    b.classList.toggle("open");
    if (navigator.vibrate) navigator.vibrate(8);
  });
};

/* ================= VAULT · v-radial ================= */
DEMOS["v-radial"] = root => {
  const rad = $("#vRadial", root), core = $(".vr-core", rad);
  $$(".vr-item", rad).forEach((it, i) => it.style.setProperty("--i", i));
  core.addEventListener("click", e => {
    e.stopPropagation();
    rad.classList.toggle("open");
    if (navigator.vibrate) navigator.vibrate(rad.classList.contains("open") ? [8, 30, 12] : 8);
  });
  root.addEventListener("pointerdown", e => { if (!rad.contains(e.target)) rad.classList.remove("open"); });
};

/* ================= VAULT · v-rubber ================= */
DEMOS["v-rubber"] = root => {
  const box = $("#vRubber", root), track = $(".vr-track", box), fill = $("#vrFill", root), knob = $("#vrKnob", root);
  let val = .5, drag = false, lastX = 0, lastT = 0, vel = 0;
  const W = () => track.clientWidth;
  function render(v){
    const c = clamp(v, 0, 1);
    fill.style.width = c * 100 + "%";
    knob.style.left = c * 100 + "%";
    const stx = 1 + clamp(Math.abs(vel) * .00025, 0, .28) * (drag ? 1 : 0), sty = 1 / stx;
    knob.style.transform = `scale(${stx},${sty})`;
  }
  render(val);
  track.parentElement.addEventListener("pointerdown", e => {
    drag = true; box.setPointerCapture(e.pointerId);
    const r = track.getBoundingClientRect();
    move(e, r); lastT = performance.now(); lastX = e.clientX; vel = 0;
    e.preventDefault();
  });
  function move(e, r0){
    const r = r0 || track.getBoundingClientRect();
    let raw = (e.clientX - r.left) / r.width;
    if (raw < 0 || raw > 1){ // резина за краями
      const over = raw < 0 ? raw : raw - 1;
      raw = clamp(raw, 0, 1) + Math.sign(over) * .22 * (1 - Math.exp(-Math.abs(over) * 3.2));
    }
    const now = performance.now(), dt = Math.max(8, now - lastT);
    vel = (e.clientX - lastX) / dt * 16; lastX = e.clientX; lastT = now;
    val = raw; render(val);
  }
  box.addEventListener("pointermove", e => { if (drag) move(e); });
  const up = () => {
    if (!drag) return; drag = false;
    const target = clamp(val, 0, 1);
    const sp = new Spring({ k: 520, c: 19, x: val, v: vel * 3, target });
    const tick = dt => {
      sp.step(dt); val = sp.x; render(val);
      if (sp.settled){ val = target; render(val); knob.style.transform = ""; ticker.remove(tick); }
    };
    ticker.add(tick);
  };
  box.addEventListener("pointerup", up);
  box.addEventListener("pointercancel", up);
};

/* ================= VAULT · v-text ================= */
DEMOS["v-text"] = root => {
  const h = $("#vText", root);
  function build(){
    const text = h.dataset.text || h.textContent;
    h.innerHTML = "";
    let i = 0;
    [...text].forEach(ch => {
      const s = document.createElement("span");
      if (ch === " "){ s.innerHTML = "&nbsp;"; s.style.width = ".32em"; }
      else { s.className = "char"; s.textContent = ch; s.style.setProperty("--i", i++); }
      h.appendChild(s);
    });
  }
  build();
  $("#vTextBtn", root).addEventListener("click", build);
};

})();
