import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Ghost, Target, Trophy } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { useCycle, RI } from '../lib/core';

/* ---------------- 01 Screen Shake ---------------- */
function ScreenShake() {
  const k = useCycle(2200);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div key={k} className="absolute inset-0 gf-shake">
        <div className="absolute inset-0 dotgrid opacity-40" />
        <div className="absolute bottom-8 left-0 right-0 h-px bg-white/20" />
        <div className="absolute bottom-8 left-[16%] h-7 w-7 -translate-y-full rounded-md bg-[#4ade80]" />
        <div className="absolute bottom-8 right-[16%] h-9 w-9 -translate-y-full rounded-md bg-[#fb7185]" />
        <div className="gf-imp absolute left-1/2 top-[34%] -translate-x-1/2 font-display text-[24px] font-extrabold tracking-wider text-white/90">IMPACT</div>
      </div>
      <div key={`f${k}`} className="pointer-events-none absolute inset-0 gf-hitflash" />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-rose-100/60">TRMA 0.8 // DECAY 0.55s</div>
    </div>
  );
}

/* ---------------- 02 Hit Stop ---------------- */
function HitStop() {
  const ctl = useAnimationControls();
  const stage = useAnimationControls();
  const [nums, setNums] = useState<{ id: number; val: number }[]>([]);
  const fire = () => {
    const id = Date.now();
    const val = RI(34, 68);
    setNums((n) => [...n.slice(-4), { id, val }]);
    setTimeout(() => setNums((n) => n.filter((x) => x.id !== id)), 720);
    stage.start({ x: [0, -5, 4, -2, 0], transition: { duration: 0.3, delay: 0.12 } });
    ctl.start({
      scale: [1, 1.28, 1.28, 0.92, 1],
      x: [0, 0, 0, 18, 0],
      filter: ['brightness(1)', 'brightness(3.5)', 'brightness(3.5)', 'brightness(1)', 'brightness(1)'],
      transition: { duration: 0.46, times: [0, 0.06, 0.32, 0.62, 1], ease: 'easeOut' },
    });
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={fire}>
      <motion.div animate={stage} className="absolute inset-0 flex items-center justify-center">
        <motion.div animate={ctl} className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-300/40 bg-rose-500/15">
          <Ghost className="h-8 w-8 text-rose-200" />
        </motion.div>
        {nums.map((n) => (
          <motion.span
            key={n.id}
            initial={{ y: 6, opacity: 1, scale: 1.3 }}
            animate={{ y: -40, opacity: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute top-[30%] font-display text-[15px] font-bold text-amber-300"
          >-{n.val}</motion.span>
        ))}
      </motion.div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-rose-100/60">FREEZE 110ms → RELEASE</div>
      <div className="absolute right-3 top-2.5 font-mono text-[9px] tracking-[0.2em] text-white/40">TAP THE TARGET</div>
    </div>
  );
}

/* ---------------- 03 Squash & Stretch ---------------- */
function Squash() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="gf-blob absolute bottom-9 left-1/2 h-14 w-14 rounded-[28%] bg-[#fb7185] shadow-[inset_-6px_-8px_0_rgba(0,0,0,.18)]" />
      <div className="gf-shadow absolute bottom-[30px] left-1/2 h-2.5 w-16 rounded-full bg-black/60" />
      <div className="absolute bottom-8 left-[10%] right-[10%] h-px bg-white/20" />
      <div className="absolute left-3 top-2.5 font-mono text-[9px] tracking-[0.25em] text-rose-100/60">SQUASH.EXE — LOOP 1.55s</div>
    </div>
  );
}

/* ---------------- 04 Damage Flash ---------------- */
function DamageFlash() {
  const [hp, setHp] = useState(100);
  const [fx, setFx] = useState(0);
  const hit = () => {
    if (hp <= 0) return;
    setHp((h) => {
      const n = Math.max(0, h - RI(16, 26));
      if (n === 0) setTimeout(() => setHp(100), 900);
      return n;
    });
    setFx((f) => f + 1);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={hit}>
      <div className="absolute left-1/2 top-6 w-[62%] -translate-x-1/2">
        <div className="mb-1 flex justify-between font-mono text-[9px] tracking-[0.2em] text-white/50"><span>UNIT_07</span><span>{hp}/100</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,.7)]" animate={{ width: `${hp}%` }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div key={fx} className="gf-spr flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-400/15">
          <Target className="h-7 w-7 text-cyan-200" />
        </div>
      </div>
      <div key={`v${fx}`} className="gf-vign" />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-rose-100/60">RIM VIGNETTE + WHITE FLASH</div>
    </div>
  );
}

/* ---------------- 05 Knockback ---------------- */
function Knockback() {
  const ctl = useAnimationControls();
  const [dust, setDust] = useState(0);
  const fire = () => {
    setDust((d) => d + 1);
    ctl.start({
      x: [0, 94, 0],
      y: [0, -40, 0],
      rotate: [0, 26, 0],
      transition: { duration: 0.62, times: [0, 0.36, 1], ease: ['easeOut', 'backOut'] },
    });
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={fire}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div animate={ctl} className="flex h-14 w-14 items-center justify-center rounded-xl border border-amber-300/40 bg-amber-400/15">
          <Target className="h-7 w-7 text-amber-200" />
        </motion.div>
      </div>
      {dust > 0 && (
        <div key={dust} className="pointer-events-none absolute inset-0">
          {[-16, 0, 16].map((dx, i) => (<div key={i} className="gf-dust" style={{ ['--dx' as string]: `${dx}px`, animationDelay: `${i * 45}ms` }} />))}
        </div>
      )}
      <div className="absolute bottom-8 left-[14%] right-[14%] h-px bg-white/20" />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-amber-100/60">ARC + SPIN + OVERSHOOT</div>
    </div>
  );
}

/* ---------------- 06 Chromatic Pulse ---------------- */
function ChromaPulse() {
  const k = useCycle(2400);
  const Core = ({ cls }: { cls: string }) => (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${cls}`}>
      <Trophy className="h-10 w-10" />
      <div className="font-display text-[18px] font-extrabold tracking-widest">CHROMA</div>
    </div>
  );
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div key={k} className="absolute inset-0 gf-beat">
        <Core cls="text-amber-300" />
      </div>
      <div key={`a${k}`} className="absolute inset-0 gf-cA"><Core cls="text-rose-500/70" /></div>
      <div key={`b${k}`} className="absolute inset-0 gf-cB"><Core cls="text-cyan-400/70" /></div>
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">BEAT SYNC 120BPM</div>
    </div>
  );
}

/* ---------------- 07 Slow-Mo Bubble ---------------- */
function SlowMo() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [slow, setSlow] = useState(false);
  const S = useRef({ scale: 1, target: 1, inView: true, shards: Array.from({ length: 7 }, (_, i) => ({ x: 0.12 + i * 0.13, y: Math.random(), vy: 0.1 + Math.random() * 0.16, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 2.4, size: 7 + Math.random() * 8 })) });

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let raf = 0; let last = performance.now();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { const r = cv.getBoundingClientRect(); cv.width = r.width * dpr; cv.height = r.height * dpr; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = new IntersectionObserver((es) => { S.current.inView = es[0].isIntersecting; }); io.observe(cv);
    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(50, t - last); last = t;
      if (document.hidden || !S.current.inView) return;
      const s = S.current;
      s.scale += (s.target - s.scale) * Math.min(1, dt / 120);
      const w = cv.width / dpr, h = cv.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const sh of s.shards) {
        sh.y += (sh.vy * s.scale * dt) / 600;
        sh.rot += (sh.vr * s.scale * dt) / 1000;
        if (sh.y > 1.12) { sh.y = -0.12; sh.x = 0.08 + Math.random() * 0.84; }
        ctx.save();
        ctx.translate(sh.x * w, sh.y * h);
        ctx.rotate(sh.rot);
        ctx.fillStyle = 'rgba(224,231,255,.85)';
        const z = sh.size;
        ctx.beginPath(); ctx.moveTo(0, -z); ctx.lineTo(z * 0.8, z * 0.7); ctx.lineTo(-z * 0.8, z * 0.7); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  const drop = () => {
    if (slow) return;
    setSlow(true);
    S.current.target = 0.16;
    setTimeout(() => { S.current.target = 1; setSlow(false); }, 1500);
  };
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={drop}>
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className={`absolute inset-0 transition-opacity duration-300 ${slow ? 'opacity-100' : 'opacity-0'}`} style={{ boxShadow: 'inset 0 0 60px 20px rgba(96,165,250,.28)' }} />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-blue-100/60">TAP → TIME ×0.16 (1.5s)</div>
      <div className={`absolute right-3 top-2.5 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] transition-colors ${slow ? 'border-blue-300/60 text-blue-200' : 'border-white/15 text-white/40'}`}>{slow ? '×0.16' : '×1.00'}</div>
    </div>
  );
}

/* ---------------- 08 Combo Pop ---------------- */
function ComboPop() {
  const [combo, setCombo] = useState(0);
  const [pts, setPts] = useState<{ id: number; x: number; y: number }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tier = combo >= 20 ? '#fb7185' : combo >= 10 ? '#fbbf24' : combo >= 4 ? '#22d3ee' : '#ffffff';
  const tap = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setCombo((c) => c + 1);
    setPts((p) => [...p.slice(-7), { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setPts((p) => p.filter((x) => x.id !== id)), 650);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCombo(0), 1600);
  };
  const C = 2 * Math.PI * 30;
  return (
    <div className="absolute inset-0 cursor-pointer overflow-hidden" onPointerDown={tap}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[104px] w-[104px] items-center justify-center">
          {combo > 0 && (
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 104 104">
              <circle cx="52" cy="52" r="30" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="3" />
              <motion.circle key={combo} cx="52" cy="52" r="30" fill="none" stroke={tier} strokeWidth="3" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: C }} transition={{ duration: 1.6, ease: 'linear' }} />
            </svg>
          )}
          {combo > 0 ? (
            <motion.div key={combo} initial={{ scale: 1.65 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 16 }} className="text-center">
              <div className="font-display text-[30px] font-extrabold leading-none" style={{ color: tier }}>{combo}</div>
              <div className="mt-1 font-mono text-[8px] tracking-[0.3em] text-white/50">COMBO</div>
            </motion.div>
          ) : (
            <div className="text-center font-mono text-[9px] tracking-[0.3em] text-white/35">TAP FAST</div>
          )}
        </div>
      </div>
      {pts.map((p) => (
        <motion.span key={p.id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -34 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="pointer-events-none absolute font-mono text-[10px] font-bold text-white/80" style={{ left: p.x, top: p.y }}>+1</motion.span>
      ))}
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-white/50">WINDOW 1.6s // TIERS 4–10–20</div>
    </div>
  );
}

const css = `
.gf-shake{animation:gfShake .55s cubic-bezier(.36,.07,.19,.97) both}
@keyframes gfShake{10%,90%{transform:translate(-2px,1px)}20%,80%{transform:translate(4px,-2px) rotate(-.4deg)}30%,50%,70%{transform:translate(-7px,3px) rotate(.5deg)}40%,60%{transform:translate(7px,-3px)}100%{transform:none}}
.gf-hitflash{background:rgba(251,113,133,.28);animation:gfFlasho .5s ease-out forwards}
@keyframes gfFlasho{0%{opacity:0}12%{opacity:1}100%{opacity:0}}
.gf-imp{animation:gfImp .6s cubic-bezier(.2,1,.3,1) both}
@keyframes gfImp{0%{transform:translate(-50%,0) scale(2.2);opacity:0}18%{opacity:1}45%{transform:translate(-50%,0) scale(.95)}60%{transform:translate(-50%,0) scale(1.06)}100%{transform:translate(-50%,0) scale(1)}}
.gf-blob{transform-origin:50% 100%;animation:gfBlob 1.55s cubic-bezier(.34,.8,.36,1) infinite}
@keyframes gfBlob{0%{transform:translate(-50%,-46px) scale(.9,1.12)}42%{transform:translate(-50%,0) scale(1,1)}50%{transform:translate(-50%,0) scale(1.5,.5)}64%{transform:translate(-50%,-4px) scale(.86,1.16)}82%,100%{transform:translate(-50%,-46px) scale(.9,1.12)}}
.gf-shadow{transform-origin:center;animation:gfShadow 1.55s cubic-bezier(.34,.8,.36,1) infinite}
@keyframes gfShadow{0%,82%,100%{transform:translateX(-50%) scaleX(.5);opacity:.25}46%{transform:translateX(-50%) scaleX(.9);opacity:.5}50%{transform:translateX(-50%) scaleX(1.2);opacity:.6}64%{transform:translateX(-50%) scaleX(.95);opacity:.5}}
.gf-spr{animation:gfSpr .38s ease-out both}
@keyframes gfSpr{0%{filter:brightness(4);transform:translateX(-5px) rotate(-5deg)}100%{filter:brightness(1);transform:none}}
.gf-vign{position:absolute;inset:0;box-shadow:inset 0 0 70px 26px rgba(244,63,94,.5);opacity:0;animation:gfVign .55s ease-out forwards;pointer-events:none}
@keyframes gfVign{0%{opacity:0}18%{opacity:1}100%{opacity:0}}
.gf-dust{position:absolute;bottom:33%;left:50%;height:9px;width:9px;border-radius:50%;background:rgba(255,255,255,.4);animation:gfDust .5s ease-out forwards}
@keyframes gfDust{0%{opacity:.9;transform:translate(-50%,0) scale(.4)}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),-16px) scale(1.7)}}
.gf-beat{animation:gfBeat .55s ease-out}
@keyframes gfBeat{0%{transform:scale(1)}25%{transform:scale(1.07)}100%{transform:scale(1)}}
.gf-cA{animation:gfCa .55s ease-out both;pointer-events:none}
@keyframes gfCa{0%{opacity:0}18%{opacity:.9;transform:translate(-7px,2px)}100%{opacity:0;transform:none}}
.gf-cB{animation:gfCb .55s ease-out both;pointer-events:none}
@keyframes gfCb{0%{opacity:0}18%{opacity:.9;transform:translate(7px,-2px)}100%{opacity:0;transform:none}}
`;

function Style() { return <style>{css}</style>; }

export const assets: AssetDef[] = [
  { id: 'screen-shake', name: 'Screen Shake', cat: 'gamefeel', origin: 'ARCHIVE', trigger: 'AUTO', duration: '0.55s', easing: 'trauma² decay', tags: ['impact', 'camera', 'rotational'], desc: 'Trauma-based camera shake with translational + rotational micro-jitter. The cheapest way to make damage expensive.', Component: () => (<><Style /><ScreenShake /></>) },
  { id: 'hit-stop', name: 'Hit Stop', cat: 'gamefeel', origin: 'EXPANSION', trigger: 'TAP', duration: '0.46s', easing: 'hold → release', tags: ['freeze', 'impact', 'melee'], desc: '110ms freeze on contact, then elastic release with sprite overbright. Every melee hit in fighting games does this.', Component: () => (<><Style /><HitStop /></>) },
  { id: 'squash-stretch', name: 'Squash & Stretch', cat: 'gamefeel', origin: 'ARCHIVE', trigger: 'AUTO', duration: '1.55s', easing: 'sine loop', tags: ['anticipation', 'blob', 'landing'], desc: 'Classic landing cycle with anticipation stretch and synced contact shadow. Disney rule #1, game rule #0.', Component: () => (<><Style /><Squash /></>) },
  { id: 'damage-flash', name: 'Damage Flash', cat: 'gamefeel', origin: 'ARCHIVE', trigger: 'TAP', duration: '0.55s', easing: 'expo.out', tags: ['vignette', 'hp', 'hit-react'], desc: 'Red rim vignette plus white-hot sprite brightness flash on hit, wired into a live HP spring.', Component: () => (<><Style /><DamageFlash /></>) },
  { id: 'knockback', name: 'Knockback Arc', cat: 'gamefeel', origin: 'EXPANSION', trigger: 'TAP', duration: '0.62s', easing: 'back.out return', tags: ['recoil', 'arc', 'dust'], desc: 'Knockback arc with spin, dust kick at contact point and an overshoot recovery on landing.', Component: () => (<><Style /><Knockback /></>) },
  { id: 'chroma-pulse', name: 'Chromatic Pulse', cat: 'gamefeel', origin: 'EXPANSION', trigger: 'AUTO', duration: '0.55s / beat', easing: 'beat map', tags: ['rgb', 'aberration', 'music'], desc: 'Chromatic aberration split pulsing to a 120bpm beat map with a 7% scale punch.', Component: () => (<><Style /><ChromaPulse /></>) },
  { id: 'slow-mo', name: 'Slow-Mo Bubble', cat: 'gamefeel', origin: 'EXPANSION', trigger: 'TAP', duration: '1.50s', easing: 'lerp 120ms', tags: ['time-scale', 'dilation'], desc: 'Time-dilation bubble: the shard storm eases to ×0.16 and recovers. Tap the stage to warp time.', Component: () => (<><Style /><SlowMo /></>) },
  { id: 'combo-pop', name: 'Combo Counter', cat: 'gamefeel', origin: 'ARCHIVE', trigger: 'TAP', duration: '1.60s window', easing: 'spring(420,16)', tags: ['counter', 'tiers', 'decay ring'], desc: 'Combo counter with decay ring, tiered color thresholds (4/10/20) and spring pop per hit.', Component: () => (<><Style /><ComboPop /></>) },
];
