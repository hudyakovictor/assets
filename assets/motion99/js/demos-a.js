/* ============================================================
   MOTION 99 · demos-a.js — Модуль 1 (Game Feel) + Модуль 2 (Juice)
   ============================================================ */
(() => {
"use strict";
const { $, $$, clamp, lerp, rand, noise1, bez, Spring, ticker, fitCanvas, onResize, reduced } = window.M99;

/* ================= 1.1 EASING LAB ================= */
DEMOS["d-easing"] = root => {
  const svg = $("#easeCurve", root), path = $("#easePath", root);
  const h1 = $("#easeHandle1", root), h2 = $("#easeHandle2", root);
  const c1 = $("#easeP1", root), c2 = $("#easeP2", root), head = $("#easeHead", root);
  const dotC = $(".lane-dot.custom", root), dotL = $(".lane-dot.linear", root);
  const ghostTrack = $("#ghostTrack", root);
  const durIn = $("#easeDur", root), durV = $("#easeDurV", root);

  const p1 = { x: 16, y: 0 }, p2 = { x: 30, y: 0 }; // svg-координаты (y вниз)
  let ease = bez(.16, 1, .3, 1), raf = null;

  function draw(){
    path.setAttribute("d", `M0,100 C ${p1.x},${p1.y} ${p2.x},${p2.y} 100,0`);
    h1.setAttribute("x1", 0); h1.setAttribute("y1", 100); h1.setAttribute("x2", p1.x); h1.setAttribute("y2", p1.y);
    h2.setAttribute("x1", 100); h2.setAttribute("y1", 0); h2.setAttribute("x2", p2.x); h2.setAttribute("y2", p2.y);
    c1.setAttribute("cx", p1.x); c1.setAttribute("cy", p1.y);
    c2.setAttribute("cx", p2.x); c2.setAttribute("cy", p2.y);
    ease = bez(p1.x / 100, (100 - p1.y) / 100, p2.x / 100, (100 - p2.y) / 100);
  }
  draw();

  /* перетаскивание контрольных точек */
  let dragPt = null;
  const toLocal = e => {
    const r = svg.getBoundingClientRect();
    return {
      x: clamp((e.clientX - r.left) / r.width * 116 - 8, 0, 100),
      y: clamp((e.clientY - r.top) / r.height * 116 - 8, -38, 138)
    };
  };
  [[c1, p1], [c2, p2]].forEach(([el, pt]) => {
    el.addEventListener("pointerdown", e => { dragPt = pt; el.setPointerCapture(e.pointerId); e.preventDefault(); });
    el.addEventListener("pointermove", e => { if (dragPt === pt){ Object.assign(pt, toLocal(e)); draw(); } });
    el.addEventListener("pointerup", () => dragPt = null);
  });

  /* пресеты */
  $$("#easePresets .chip", root).forEach(ch => ch.addEventListener("click", () => {
    $$("#easePresets .chip", root).forEach(c => c.classList.remove("active"));
    ch.classList.add("active");
    const [x1, y1, x2, y2] = ch.dataset.ease.split(",").map(Number);
    Object.assign(p1, { x: x1 * 100, y: 100 - y1 * 100 });
    Object.assign(p2, { x: x2 * 100, y: 100 - y2 * 100 });
    draw(); play();
  }));

  durIn.addEventListener("input", () => durV.textContent = durIn.value + "мс");

  function play(){
    cancelAnimationFrame(raf);
    const dur = reduced() ? 300 : +durIn.value;
    const track = dotC.parentElement, W = track.clientWidth - 32;
    ghostTrack.innerHTML = "";
    const N = 15;
    for (let i = 0; i < N; i++){
      const g = document.createElement("span"); g.className = "ghost-dot";
      g.style.left = (6 + ease(i / (N - 1)) * W) + "px";
      ghostTrack.appendChild(g);
    }
    head.classList.add("on");
    const t0 = performance.now();
    const tick = t => {
      const p = clamp((t - t0) / dur, 0, 1), y = ease(p);
      dotC.style.transform = `translate(${y * W}px,-50%)`;
      dotL.style.transform = `translate(${p * W}px,-50%)`;
      head.setAttribute("cx", p * 100); head.setAttribute("cy", 100 - y * 100);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    dotC.style.transform = `translate(0,-50%)`; dotL.style.transform = `translate(0,-50%)`;
    raf = requestAnimationFrame(tick);
  }
  $("#easePlay", root).addEventListener("click", play);
  setTimeout(play, 400);
};

/* ================= 1.2 SQUASH & STRETCH ================= */
DEMOS["d-squash"] = root => {
  const cv = $("#squashCanvas", root);
  let { ctx, w, h } = fitCanvas(cv);
  const floorY = () => h - 26;
  const ball = { x: w / 2, y: h * .3, vx: 70, vy: 0, r: 22, d: 0, dv: 0 };
  const ripples = [], dust = [];

  const G = () => +$("#sqGrav", root).value, B = () => +$("#sqBounce", root).value,
        S = () => +$("#sqSquash", root).value, VOL = () => $("#sqVolume", root).checked,
        RIP = () => $("#sqRipple", root).checked;
  [["sqGrav","sqGravV",v=>v],["sqBounce","sqBounceV",v=>v],["sqSquash","sqSquashV",v=>v]]
    .forEach(([a,b,f])=>{ const el=$("#"+a,root); el.addEventListener("input",()=>$("#"+b,root).textContent=f(el.value)); });

  cv.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect();
    ball.x = clamp(e.clientX - r.left, ball.r, w - ball.r);
    ball.y = clamp(e.clientY - r.top, ball.r, floorY() - ball.r);
    ball.vy = -560; ball.vx = rand(-90, 90); ball.dv = -6;
  });

  function frame(dt){
    const g = G(), sq = reduced() ? S() * .4 : S();
    ball.vy += g * dt; ball.y += ball.vy * dt; ball.x += ball.vx * dt;
    if (ball.x < ball.r){ ball.x = ball.r; ball.vx = Math.abs(ball.vx) * .92; }
    if (ball.x > w - ball.r){ ball.x = w - ball.r; ball.vx = -Math.abs(ball.vx) * .92; }

    /* полётный stretch по скорости */
    const stretch = -clamp(Math.abs(ball.vy) / 1500, 0, .2) * sq;
    const dTarget = stretch;
    const a = (-340 * (ball.d - dTarget) - 16 * ball.dv);
    ball.dv += a * dt; ball.d += ball.dv * dt;

    if (ball.y + ball.r >= floorY() && ball.vy > 0){
      const impact = clamp(ball.vy / 900, 0, .5) * sq;
      ball.d += impact + .06; ball.dv += impact * 6;
      ball.y = floorY() - ball.r; ball.vy = -ball.vy * B();
      if (Math.abs(ball.vy) < 60) ball.vy = -60 * B();
      if (RIP()){
        ripples.push({ x: ball.x, t: 0, s: impact });
        for (let i = 0; i < 7; i++)
          dust.push({ x: ball.x + rand(-14, 14), y: floorY() - 2, vx: rand(-130, 130), vy: rand(-110, -25), t: 0, life: rand(.3, .6) });
      }
    }
    ripples.forEach(rp => rp.t += dt * 2.4);
    for (let i = ripples.length - 1; i >= 0; i--) if (ripples[i].t > 1) ripples.splice(i, 1);
    dust.forEach(p => { p.t += dt; p.vy += 320 * dt; p.x += p.vx * dt; p.y += p.vy * dt; });
    for (let i = dust.length - 1; i >= 0; i--) if (dust[i].t > dust[i].life) dust.splice(i, 1);

    /* ---- рендер ---- */
    ctx.clearRect(0, 0, w, h);
    const fy = floorY();
    const fg = ctx.createLinearGradient(0, fy, 0, h);
    fg.addColorStop(0, "rgba(255,255,255,.1)"); fg.addColorStop(1, "transparent");
    ctx.fillStyle = fg; ctx.fillRect(0, fy, w, h - fy);
    ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(w, fy); ctx.stroke();

    ripples.forEach(rp => {
      ctx.strokeStyle = `rgba(94,234,212,${(1 - rp.t) * .55})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(rp.x, fy, rp.t * (50 + rp.s * 60), rp.t * 9, 0, 0, 7); ctx.stroke();
    });
    dust.forEach(p => {
      ctx.fillStyle = `rgba(200,220,255,${(1 - p.t / p.life) * .5})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 7); ctx.fill();
    });

    const heightK = clamp((fy - ball.y) / h, 0, 1);
    ctx.fillStyle = `rgba(0,0,0,${.4 * (1 - heightK * .7)})`;
    ctx.beginPath(); ctx.ellipse(ball.x, fy + 3, ball.r * (1.1 - heightK * .4), 5, 0, 0, 7); ctx.fill();

    const d = clamp(ball.d, -.35, .45);
    const sy = 1 - d * .85, sx = VOL() ? 1 / sy : 1 + d * .5;
    ctx.save();
    ctx.translate(ball.x, ball.y + (sy < 1 ? ball.r * (1 - sy) : 0));
    ctx.scale(sx, sy);
    const gr = ctx.createRadialGradient(-8, -10, 3, 0, 0, ball.r);
    gr.addColorStop(0, "rgba(160,250,235,.98)"); gr.addColorStop(.45, "#2dd4bf"); gr.addColorStop(1, "#7c3aed");
    ctx.shadowColor = "rgba(56,189,248,.65)"; ctx.shadowBlur = 22;
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, ball.r, 0, 7); ctx.fill();
    ctx.restore();
  }
  const tick = dt => frame(clamp(dt, 0, .032));
  const off = ticker.add(tick);
  const rz = () => { const r = cv.getBoundingClientRect(); if (r.width < 20) return; ({ ctx, w, h } = fitCanvas(cv)); };
  onResize(rz);
  return { pause: () => ticker.remove(tick), resume: () => { rz(); ticker.add(tick); } };
};

/* ================= 1.3 ANTICIPATION ================= */
DEMOS["d-anticipate"] = root => {
  const dry = $("#apDry", root), rich = $("#apRich", root), dust = $("#apDust", root);
  $("#apBtnDry", root).addEventListener("click", () => {
    dry.getAnimations().forEach(a => a.cancel());
    dry.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(-112px)", offset: .5 }, { transform: "translateY(0)" }],
      { duration: reduced() ? 300 : 660, easing: "cubic-bezier(.45,0,.55,1)" });
  });
  $("#apBtnRich", root).addEventListener("click", () => {
    rich.getAnimations().forEach(a => a.cancel());
    if (reduced()){
      rich.animate([{ opacity: 1 }, { opacity: .4 }, { opacity: 1 }], { duration: 260 });
      return;
    }
    rich.animate([
      { transform: "translateY(0) scale(1,1)", offset: 0, easing: "cubic-bezier(.3,0,.6,1)" },
      { transform: "translateY(9px) scale(1.24,.76)", offset: .13, easing: "cubic-bezier(.2,0,.35,1)" },
      { transform: "translateY(-16px) scale(.87,1.15)", offset: .23 },
      { transform: "translateY(-134px) scale(.93,1.07)", offset: .56, easing: "cubic-bezier(.42,0,.75,1)" },
      { transform: "translateY(0) scale(1.27,.73)", offset: .77, easing: "cubic-bezier(.2,.9,.3,1)" },
      { transform: "translateY(0) scale(.94,1.06)", offset: .87 },
      { transform: "translateY(0) scale(1,1)", offset: 1 }
    ], { duration: 980 });
    dust.getAnimations().forEach(a => a.cancel());
    dust.animate([
      { opacity: 0, transform: "translateX(-50%) scale(.4)" },
      { opacity: .9, offset: .3, transform: "translateX(-50%) scale(1.1)" },
      { opacity: 0, transform: "translateX(-50%) scale(1.8)" }
    ], { duration: 460, delay: 700, easing: "cubic-bezier(.16,1,.3,1)" });
  });
};

/* ================= 1.4 SPRING PHYSICS ================= */
DEMOS["d-spring"] = root => {
  const stage = $("#springStage", root), puck = $("#springPuck", root);
  const anchor = $("#springAnchor", root), graph = $("#springGraph", root);
  const readout = $("#springReadout", root);
  let g = fitCanvas(graph);
  const sx = new Spring(), sy = new Spring();
  let tx = 0, ty = 0, dragging = false, active = false, samples = [], lastPts = [];

  const K = () => +$("#spK", root).value, C = () => +$("#spC", root).value, M = () => +$("#spM", root).value;
  const upd = () => {
    [sx, sy].forEach(s => { s.k = K(); s.c = C(); s.m = M(); });
    const z = sx.zeta;
    readout.textContent = `ζ = ${z.toFixed(2)} · ${z < .98 ? "недемпфированная (желе)" : z <= 1.02 ? "критическая (эталон)" : "передемпфированная (вязкая)"}`;
    $("#spKV", root).textContent = K(); $("#spCV", root).textContent = C(); $("#spMV", root).textContent = (+M()).toFixed(1);
  };
  ["spK", "spC", "spM"].forEach(id => $("#" + id, root).addEventListener("input", upd));
  upd();
  $$("[data-sp]", root).forEach(ch => ch.addEventListener("click", () => {
    const [k, c, m] = ch.dataset.sp.split(",").map(Number);
    $("#spK", root).value = k; $("#spC", root).value = c; $("#spM", root).value = m; upd();
    sx.v += 420; sy.v -= 260; active = true; // дёргаем, чтобы увидеть характер
  }));

  const center = () => { const r = stage.getBoundingClientRect(); return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, r }; };
  puck.addEventListener("pointerdown", e => {
    dragging = true; active = false; puck.setPointerCapture(e.pointerId);
    const { cx, cy } = center();
    puck._ox = e.clientX - (cx + sx.x);
    puck._oy = e.clientY - (cy + sy.x);
    lastPts = [{ x: sx.x, y: sy.x, t: performance.now() }];
    e.preventDefault(); e.stopPropagation();
  });
  puck.addEventListener("pointermove", e => {
    if (!dragging) return;
    const { cx, cy, r } = center();
    sx.x = clamp(e.clientX - puck._ox - cx, -r.width / 2 + 40, r.width / 2 - 40);
    sy.x = clamp(e.clientY - puck._oy - cy, -r.height / 2 + 30, r.height / 2 - 60);
    lastPts.push({ x: sx.x, y: sy.x, t: performance.now() });
    if (lastPts.length > 6) lastPts.shift();
    render();
  });
  const endDrag = () => {
    if (!dragging) return; dragging = false;
    const p0 = lastPts[0], p1 = lastPts[lastPts.length - 1], dtm = Math.max(16, p1.t - p0.t) / 1000;
    sx.v = (p1.x - p0.x) / dtm; sy.v = (p1.y - p0.y) / dtm;   // velocity handoff!
    sx.target = tx; sy.target = ty; active = true;
  };
  puck.addEventListener("pointerup", endDrag);
  puck.addEventListener("pointercancel", endDrag);

  stage.addEventListener("pointerdown", e => {
    if (e.target === puck) return;
    const r = stage.getBoundingClientRect();
    tx = e.clientX - (r.left + r.width / 2); ty = e.clientY - (r.top + r.height / 2);
    anchor.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
    active = true;
  });

  function render(){ puck.style.transform = `translate(${sx.x}px, ${sy.x}px)`; }
  function drawGraph(){
    const { ctx, w, h } = g;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    if (samples.length < 2) return;
    ctx.strokeStyle = "#2dd4bf"; ctx.lineWidth = 1.6; ctx.shadowColor = "rgba(45,212,191,.7)"; ctx.shadowBlur = 6;
    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = i / (samples.length - 1) * w, y = h / 2 - clamp(s, -h / 2 + 4, h / 2 - 4);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke(); ctx.shadowBlur = 0;
  }
  const tick = dt => {
    if (active && !dragging){
      sx.step(dt); sy.step(dt);
      if (sx.settled && sy.settled){ sx.x = tx; sy.x = ty; sx.v = sy.v = 0; active = false; }
      render();
    }
    if (dragging || active){ samples.push(sx.x - tx); if (samples.length > 220) samples.shift(); drawGraph(); }
  };
  const off = ticker.add(tick);
  const rz = () => { if (graph.getBoundingClientRect().width < 20) return; g = fitCanvas(graph); drawGraph(); };
  onResize(rz);
  // приветственный толчок
  setTimeout(() => { sx.v = 380; sy.v = -220; active = true; }, 500);
  return { pause: () => ticker.remove(tick), resume: () => { rz(); ticker.add(tick); } };
};

/* ================= 2.1 SCREEN SHAKE ================= */
DEMOS["d-shake"] = root => {
  const scene = $("#shakeScene", root), world = $("#shakeWorld", root);
  const fill = $("#traumaFill", root), gun = $("#swGun", root), target = $("#swTarget", root);
  let trauma = 0, t = 0, dirVec = { x: 1, y: -1 }, dirPunch = 0, type = "perlin";

  const AMT = () => reduced() ? +$("#shAmount", root).value * .25 : +$("#shAmount", root).value;
  const DEC = () => +$("#shDecay", root).value;
  $("#shAmount", root).addEventListener("input", e => $("#shAmountV", root).textContent = (+e.target.value).toFixed(2));
  $("#shDecay", root).addEventListener("input", e => $("#shDecayV", root).textContent = (+e.target.value).toFixed(1) + "/с");
  $$("#shType .chip", root).forEach(ch => ch.addEventListener("click", () => {
    $$("#shType .chip", root).forEach(c => c.classList.remove("active"));
    ch.classList.add("active"); type = ch.dataset.t;
  }));

  function addTrauma(a, dir){
    trauma = clamp(trauma + a, 0, 1);
    if (dir){ const l = Math.hypot(dir.x, dir.y) || 1; dirVec = { x: dir.x / l, y: dir.y / l }; dirPunch = 1; }
    target.getAnimations().forEach(x => x.cancel());
    target.animate([{ transform: "scale(1)" }, { transform: "scale(1.2)", offset: .25 }, { transform: "scale(.96)", offset: .55 }, { transform: "scale(1)" }],
      { duration: 320, easing: "cubic-bezier(.34,1.56,.64,1)" });
    gun.animate([{ filter: "brightness(2.4) drop-shadow(0 0 12px #7dd3fc)" }, { filter: "none" }], { duration: 220 });
  }
  $("#shFire", root).addEventListener("click", () => {
    const r = scene.getBoundingClientRect();
    addTrauma(AMT(), { x: .5, y: -.4 });
  });
  scene.addEventListener("pointerdown", e => {
    const r = scene.getBoundingClientRect();
    const gx = r.width * .18, gy = r.height * .78;
    addTrauma(AMT() * .85, { x: e.clientX - r.left - gx, y: e.clientY - r.top - gy });
  });

  const tick = dt => {
    t += dt;
    trauma = Math.max(0, trauma - DEC() * dt);
    dirPunch *= Math.exp(-6 * dt);
    const amp = trauma * trauma;
    let ox = 0, oy = 0;
    if (type === "perlin"){ ox = noise1(t * 17) * 26 * amp; oy = noise1(t * 17 + 91) * 26 * amp; }
    else if (type === "random"){ ox = (Math.random() * 2 - 1) * 28 * amp; oy = (Math.random() * 2 - 1) * 28 * amp; }
    else {
      const osc = Math.sin(t * 52) * dirPunch * 34 * amp;
      ox = -dirVec.x * osc + noise1(t * 15) * 8 * amp;
      oy = -dirVec.y * osc + noise1(t * 15 + 40) * 8 * amp;
    }
    const rot = $("#shRot", root).checked ? noise1(t * 13 + 7) * 2.6 * amp : 0;
    const sc = 1 + ($("#shZoom", root).checked ? amp * .035 * (0.7 + 0.3 * noise1(t * 21 + 31)) : 0);
    world.style.transform = `translate(${ox}px,${oy}px) rotate(${rot}deg) scale(${sc})`;
    fill.style.width = (trauma * 100) + "%";
  };
  const off = ticker.add(tick);
  return { pause: () => ticker.remove(tick), resume: () => ticker.add(tick) };
};

/* ================= 2.2 HIT-STOP ================= */
DEMOS["d-hitstop"] = root => {
  const cv = $("#hitstopCanvas", root), flash = $("#hsFlash", root), label = $("#hsLabel", root);
  let { ctx, w, h } = fitCanvas(cv);
  const block = { x: 0, y: 0, w: 64, h: 64, alive: true, respawn: 0 };
  const bullet = { x: -99, y: 0, vx: 620, alive: false, trail: [] };
  const parts = [];
  let timeScale = 1, stopTimer = 0, slowTimer = 0, trauma = 0, t = 0;

  const layout = () => { block.x = w * .68; block.y = h / 2 - 32; };
  layout();
  const juice = () => $("#hsJuice", root).checked && !reduced();
  const stopMs = () => +$("#hsStop", root).value;
  $("#hsStop", root).addEventListener("input", e => $("#hsStopV", root).textContent = e.target.value + "мс");

  function fire(){
    if (bullet.alive) return;
    bullet.x = 36; bullet.y = h / 2; bullet.alive = true; bullet.trail = [];
  }
  $("#hsFire", root).addEventListener("click", fire);
  $("#hsReset", root).addEventListener("click", reset);
  function reset(){
    block.alive = true; block.respawn = 0; bullet.alive = false; parts.length = 0;
    timeScale = 1; stopTimer = slowTimer = trauma = 0;
  }

  function burst(x, y, n){
    for (let i = 0; i < n; i++){
      const a = rand(0, Math.PI * 2), s = rand(70, 480);
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: 0, life: rand(.3, .8), hue: [168, 197, 265, 48][i % 4] });
    }
  }

  const tick = dtr => {
    dtr = clamp(dtr, 0, .033); t += dtr;
    if (stopTimer > 0){ stopTimer -= dtr; timeScale = 0; if (stopTimer <= 0 && juice()) { slowTimer = .28; timeScale = .25; } else if (stopTimer <= 0) timeScale = 1; }
    else if (slowTimer > 0){ slowTimer -= dtr; timeScale = .25; if (slowTimer <= 0) timeScale = 1; }
    const dt = dtr * timeScale;

    if (bullet.alive){
      bullet.trail.push({ x: bullet.x, y: bullet.y }); if (bullet.trail.length > 9) bullet.trail.shift();
      bullet.x += bullet.vx * dt;
      if (block.alive && bullet.x + 7 >= block.x && bullet.x < block.x + block.w && Math.abs(bullet.y - (block.y + 32)) < 46){
        const hx = block.x, hy = block.y + 32;
        block.alive = false;
        if (juice()){
          timeScale = 0; stopTimer = stopMs() / 1000; trauma = 1;
          burst(hx, hy, 36);
          flash.animate([{ opacity: .85 }, { opacity: 0 }], { duration: 150, easing: "ease-out" });
        } else burst(hx, hy, 4);
        block.respawn = 1.1;
        if (!juice()) bullet.alive = false; else { bullet.vx *= .4; }
      }
      if (bullet.x > w + 40) bullet.alive = false;
    }
    if (!block.alive){ block.respawn -= dtr; if (block.respawn <= 0) block.alive = true; }

    trauma = Math.max(0, trauma - 2.2 * dtr);
    parts.forEach(p => { p.t += dt; p.vy += 500 * dt; p.vx *= Math.exp(-1.4 * dt); p.vy *= Math.exp(-1.4 * dt); p.x += p.vx * dt; p.y += p.vy * dt; });
    for (let i = parts.length - 1; i >= 0; i--) if (parts[i].t > parts[i].life) parts.splice(i, 1);

    /* --- render --- */
    const amp = trauma * trauma;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(noise1(t * 20) * 10 * amp, noise1(t * 20 + 55) * 10 * amp);
    // блок
    if (block.alive){
      ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.strokeStyle = "rgba(94,234,212,.6)"; ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(45,212,191,.4)"; ctx.shadowBlur = 14;
      rr(ctx, block.x, block.y, block.w, block.h, 14); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.font = "600 11px system-ui"; ctx.textAlign = "center";
      ctx.fillText("ЦЕЛЬ", block.x + 32, block.y + 36);
    }
    // пуля + трейл
    if (bullet.alive){
      bullet.trail.forEach((p, i) => {
        ctx.fillStyle = `rgba(125,211,252,${i / bullet.trail.length * .35})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 5 * (i / bullet.trail.length) + 1, 0, 7); ctx.fill();
      });
      ctx.fillStyle = "#e0f2fe"; ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(bullet.x, bullet.y, 6.5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    // частицы (аддитивно)
    ctx.globalCompositeOperation = "lighter";
    parts.forEach(p => {
      const a = 1 - p.t / p.life;
      ctx.fillStyle = `hsla(${p.hue},95%,68%,${a})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.4 * a + .6, 0, 7); ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    label.textContent = stopTimer > 0 ? "⏸ HIT-STOP — мир замер, эффекты живут" :
      slowTimer > 0 ? `timeScale: 0.25× slow-mo` : `timeScale: ${timeScale.toFixed(2)}×`;
  };
  function rr(c, x, y, w2, h2, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w2, y, x + w2, y + h2, r); c.arcTo(x + w2, y + h2, x, y + h2, r); c.arcTo(x, y + h2, x, y, r); c.arcTo(x, y, x + w2, y, r); c.closePath(); }
  const off = ticker.add(tick);
  const rz = () => { if (cv.getBoundingClientRect().width < 20) return; ({ ctx, w, h } = fitCanvas(cv)); layout(); };
  onResize(rz);
  return { pause: () => ticker.remove(tick), resume: () => { rz(); ticker.add(tick); } };
};

/* ================= 2.3 PARTICLES ================= */
DEMOS["d-particles"] = root => {
  const cv = $("#partCanvas", root);
  let { ctx, w, h } = fitCanvas(cv);
  const P = [];
  const HUES = [168, 190, 265, 330, 48];
  [["ptCount","ptCountV"],["ptGrav","ptGravV"],["ptDrag","ptDragV"]].forEach(([a,b])=>{
    const el = $("#" + a, root); el.addEventListener("input", () => $("#" + b, root).textContent = el.value);
  });
  function burst(x, y){
    const n = +$("#ptCount", root).value;
    for (let i = 0; i < n && P.length < 900; i++){
      const a = rand(0, Math.PI * 2), s = rand(60, 480) * (Math.random() < .1 ? 2.4 : 1);
      P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, t: 0, life: rand(.4, 1.2),
        size: rand(1.2, 4.4) * (Math.random() < .1 ? 2.6 : 1), hue: HUES[(Math.random() * HUES.length) | 0] + rand(-12, 12), seed: rand(0, 9) });
    }
  }
  cv.parentElement.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect(); burst(e.clientX - r.left, e.clientY - r.top);
  });
  let t = 0;
  const tick = dt => {
    dt = clamp(dt, 0, .033); t += dt;
    const gr = +$("#ptGrav", root).value, dr = +$("#ptDrag", root).value;
    const add = $("#ptAdd", root).checked, trail = $("#ptTrail", root).checked, spark = $("#ptSpark", root).checked;
    if (trail){ ctx.fillStyle = "rgba(5,8,18,.24)"; ctx.fillRect(0, 0, w, h); }
    else ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = add ? "lighter" : "source-over";
    for (let i = P.length - 1; i >= 0; i--){
      const p = P[i];
      p.t += dt; if (p.t > p.life){ P.splice(i, 1); continue; }
      p.vy += gr * dt; const k = Math.exp(-dr * dt); p.vx *= k; p.vy *= k;
      p.x += p.vx * dt; p.y += p.vy * dt;
      let a = 1 - p.t / p.life;
      if (spark) a *= .55 + .45 * Math.sin(t * 34 + p.seed * 10);
      ctx.fillStyle = `hsla(${p.hue},95%,66%,${clamp(a, 0, 1)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (.4 + a * .6), 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  };
  const off = ticker.add(tick);
  const rz = () => { if (cv.getBoundingClientRect().width < 20) return; ({ ctx, w, h } = fitCanvas(cv)); };
  onResize(rz);
  setTimeout(() => burst(w / 2, h / 2), 300);
  return { pause: () => ticker.remove(tick), resume: () => { rz(); ticker.add(tick); } };
};

/* ================= 2.4 COMBO ================= */
DEMOS["d-combo"] = root => {
  const num = $("#comboNum", root), ring = $("#comboRing", root), title = $("#comboTitle", root);
  const stage = $("#comboStage", root);
  const MILE = { 3: "СОЧНО!", 5: "КРУТО!", 10: "🔥 FIRE!!", 15: "НЕУДЕРЖИМО!", 25: "⚡ GODLIKE ⚡" };
  let combo = 0, timer = null;

  function reset(){
    combo = 0; num.textContent = "0";
    num.animate([{ transform: "scale(1)" }, { transform: "scale(.6)", opacity: .3, offset: .5 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" });
    num.style.filter = ""; title.classList.remove("show");
    ring.style.borderColor = "";
  }
  $("#comboHit", root).addEventListener("click", () => {
    combo++;
    clearTimeout(timer); timer = setTimeout(reset, 2000);
    num.textContent = combo;
    num.getAnimations().forEach(a => a.cancel());
    num.animate([{ transform: `scale(${1.4 - Math.min(combo, 20) * .008})` }, { transform: "scale(1)" }],
      { duration: 460, easing: "cubic-bezier(.34,1.56,.64,1)" });
    const hue = Math.min(combo * 7, 200);
    num.style.filter = `hue-rotate(-${hue * .35}deg) drop-shadow(0 0 ${16 + Math.min(combo * 2, 34)}px rgba(244,114,182,${Math.min(.2 + combo * .03, .75)}))`;
    ring.style.borderColor = `hsl(${168 - hue * .5},90%,65%)`;
    ring.classList.remove("pop"); void ring.offsetWidth; ring.classList.add("pop");

    const f = document.createElement("span"); f.className = "combo-float"; f.textContent = "+1";
    f.style.left = `calc(50% + ${rand(-46, 46)}px)`; f.style.top = "44%";
    stage.appendChild(f); setTimeout(() => f.remove(), 820);

    if (MILE[combo]){
      title.textContent = MILE[combo];
      title.classList.remove("show"); void title.offsetWidth; title.classList.add("show");
      stage.classList.remove("shiver"); void stage.offsetWidth; stage.classList.add("shiver");
      if (navigator.vibrate) navigator.vibrate(18);
    }
  });
};

})();
