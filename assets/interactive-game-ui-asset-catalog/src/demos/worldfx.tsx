import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationControls } from 'framer-motion';
import { CloudRain, CloudLightning, Droplets, Flame, Snowflake, Sparkles } from 'lucide-react';

/* ============ AF-31 DEPTH FIELD — parallax layers ============ */
export function DemoParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 46, damping: 16 });
  const sy = useSpring(my, { stiffness: 46, damping: 16 });
  const l1x = useTransform(sx, (v) => v * 5);
  const l2x = useTransform(sx, (v) => v * 13);
  const l3x = useTransform(sx, (v) => v * 26);
  const l4x = useTransform(sx, (v) => v * 46);
  const l4y = useTransform(sy, (v) => v * 6);
  const stars = useMemo(() => Array.from({ length: 18 }, () => ({ x: Math.random() * 100, y: Math.random() * 46, s: 1 + Math.random() * 1.6, d: Math.random() * 3 })), []);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      className="absolute inset-0 cursor-move overflow-hidden"
    >
      {/* sky */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0B0E24 0%, #1A1230 52%, #2A1230 78%, #0A0B12 100%)' }} />
      {stars.map((s, i) => (
        <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2 + s.d, repeat: Infinity, delay: s.d }} className="absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }} />
      ))}
      {/* sun */}
      <motion.span style={{ x: l1x }} className="absolute left-[64%] top-[18%] size-10 rounded-full bg-gradient-to-br from-amb to-red/70" >
        <span className="absolute inset-0 rounded-full bg-amb/40 blur-lg" />
      </motion.span>
      {/* far mountains */}
      <motion.div style={{ x: l1x }} className="absolute inset-x-[-60px] bottom-0 h-[68%]">
        <svg viewBox="0 0 500 160" preserveAspectRatio="none" className="size-full">
          <polygon points="0,160 70,60 130,110 210,30 290,105 360,55 430,120 500,70 500,160" fill="#141A38" />
        </svg>
      </motion.div>
      {/* mid hills */}
      <motion.div style={{ x: l2x }} className="absolute inset-x-[-80px] bottom-0 h-[50%]">
        <svg viewBox="0 0 500 120" preserveAspectRatio="none" className="size-full">
          <path d="M0,120 C60,70 110,40 180,72 C250,104 300,40 380,66 C440,86 470,60 500,72 L500,120 Z" fill="#0E1226" />
        </svg>
      </motion.div>
      {/* trees */}
      <motion.div style={{ x: l3x }} className="absolute inset-x-[-90px] bottom-0 h-[34%]">
        <svg viewBox="0 0 500 90" preserveAspectRatio="none" className="size-full">
          {Array.from({ length: 9 }, (_, i) => (
            <polygon key={i} points={`${i * 62 + 10},90 ${i * 62 + 30},${20 + (i % 3) * 10} ${i * 62 + 50},90`} fill="#080B18" />
          ))}
        </svg>
      </motion.div>
      {/* fog */}
      <motion.div style={{ x: l3x }} className="absolute inset-x-[-40px] bottom-[12%] h-10 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent blur-md" />
      {/* foreground */}
      <motion.div style={{ x: l4x, y: l4y }} className="absolute inset-x-[-100px] bottom-0 h-[16%] bg-gradient-to-t from-[#05060C] via-[#070910] to-transparent" />
      <div className="pointer-events-none absolute left-2.5 top-2.5 font-mono text-[8px] tracking-[0.22em] text-white/40">
        SECTOR: VALLEY OF GLASS<br />
        <span className="text-mint/80">PARALLAX ×5 PLANES</span>
      </div>
    </div>
  );
}

/* ============ AF-32 IMPACT FRAME — hitstop + shake + chroma ============ */
export function DemoImpact() {
  const stage = useAnimationControls();
  const rival = useAnimationControls();
  const [flash, setFlash] = useState(0);
  const [sparks, setSparks] = useState<{ id: number; a: number; d: number }[]>([]);
  const [dmg, setDmg] = useState<number | null>(null);
  const busy = useRef(false);
  const [hits, setHits] = useState(0);

  const strike = async () => {
    if (busy.current) return;
    busy.current = true;
    setHits((h) => h + 1);
    setFlash((f) => f + 1);
    setDmg(1800 + Math.round(Math.random() * 900));
    const id = Date.now();
    setSparks(Array.from({ length: 10 }, (_, i) => ({ id: id + i, a: (i / 10) * Math.PI * 2 + Math.random(), d: 30 + Math.random() * 46 })));
    stage.start({ x: [0, -9, 8, -5, 3, 0], y: [0, 5, -4, 2, 0] }, {});
    // slow-mo knockback, then snap back
    await rival.start({ x: 54, rotate: 9, scale: 0.94 }, {});
    await rival.start({ x: 0, rotate: 0, scale: 1 }, { type: 'spring', stiffness: 200, damping: 14, delay: 0.22 });
    setTimeout(() => setSparks([]), 500);
    setTimeout(() => setDmg(null), 820);
    busy.current = false;
  };

  return (
    <motion.div animate={stage} transition={{ duration: 0.45 }} className="absolute inset-0">
      {/* arena floor line */}
      <span className="absolute bottom-[72px] left-[8%] right-[8%] h-px bg-white/10" />
      {/* flash */}
      {flash > 0 && <motion.span key={flash} initial={{ opacity: 0.7 }} animate={{ opacity: 0 }} transition={{ duration: 0.22 }} className="pointer-events-none absolute inset-0 z-20 bg-white" />}
      {/* hero */}
      <div className="absolute bottom-[74px] left-[16%]">
        <motion.div whileTap={{ scale: 0.9 }} className="relative size-12">
          <span className="absolute inset-0 rotate-45 rounded-md border-2 border-volt bg-volt/15 shadow-[0_0_20px_rgba(200,255,49,0.35)]" />
          <span className="absolute inset-3 rotate-45 rounded-sm bg-volt/60" />
        </motion.div>
        <div className="mt-1.5 text-center font-mono text-[7px] tracking-[0.2em] text-volt">VEX</div>
      </div>
      {/* rival */}
      <motion.div animate={rival} className="absolute bottom-[74px] right-[16%]">
        <div className="relative size-12">
          <span className="absolute inset-0 rounded-full border-2 border-red bg-red/15 shadow-[0_0_20px_rgba(255,91,110,0.3)]" />
          <span className="absolute inset-3 rounded-full bg-red/60" />
          {/* chroma ghosts during flash */}
          {flash > 0 && <motion.span key={`c${flash}`} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 rounded-full border border-cy" style={{ transform: 'translate(5px,-2px)', mixBlendMode: 'screen' }} />}
          {flash > 0 && <motion.span key={`d${flash}`} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 rounded-full border border-amb" style={{ transform: 'translate(-5px,2px)', mixBlendMode: 'screen' }} />}
        </div>
        <div className="mt-1.5 text-center font-mono text-[7px] tracking-[0.2em] text-red">HUSK-9</div>
      </motion.div>
      {/* sparks */}
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: Math.cos(s.a) * s.d, y: Math.sin(s.a) * s.d, scale: 0.2 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute bottom-[98px] right-[22%] z-10 h-0.5 w-3 rounded-full bg-amb"
          style={{ rotate: (s.a * 180) / Math.PI, boxShadow: '0 0 8px rgba(255,194,75,0.9)' }}
        />
      ))}
      {/* dmg number */}
      {dmg && (
        <motion.div initial={{ opacity: 0, y: 8, scale: 1.6 }} animate={{ opacity: [0, 1, 1, 0], y: -40, scale: 1 }} transition={{ duration: 0.8 }} className="absolute bottom-[112px] right-[18%] z-10 font-display text-lg font-900 text-amb" style={{ textShadow: '0 0 16px rgba(255,194,75,0.8)' }}>
          {dmg.toLocaleString()}
        </motion.div>
      )}
      {/* strike button */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
        <motion.button whileTap={{ scale: 0.9 }} onClick={strike} className="rounded-md border border-volt/60 bg-volt/15 px-6 py-2 font-mono text-[9px] tracking-[0.26em] text-volt transition-colors hover:bg-volt/25">
          STRIKE
        </motion.button>
        <div className="mt-1 font-mono text-[7px] tracking-[0.24em] text-white/30">HITSTOP 90MS · SHAKE ×6 · HITS {hits}</div>
      </div>
    </motion.div>
  );
}

/* ============ AF-33 MICROCLIMATE — canvas rain synth ============ */
type RainMode = 'DRIZZLE' | 'RAIN' | 'STORM';

export function DemoRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<RainMode>('RAIN');

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const parent = c.parentElement!;
    let W = 0, H = 0, raf = 0;
    let flash = 0;
    const cfg = { DRIZZLE: { n: 60, w: 0.5, sp: 7 }, RAIN: { n: 150, w: 1.4, sp: 12 }, STORM: { n: 260, w: 3.4, sp: 17 } }[mode];
    const drops = Array.from({ length: cfg.n }, () => ({ x: Math.random() * 600, y: Math.random() * 400, l: 7 + Math.random() * 12, s: cfg.sp * (0.7 + Math.random() * 0.6) }));
    const splashes: { x: number; r: number; a: number }[] = [];
    const resize = () => { W = c.width = parent.clientWidth; H = c.height = parent.clientHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      if (mode === 'STORM' && Math.random() < 0.009) flash = 1;
      if (flash > 0.02) {
        ctx.fillStyle = `rgba(170,195,255,${flash * 0.24})`;
        ctx.fillRect(0, 0, W, H);
        if (flash > 0.5) {
          ctx.strokeStyle = `rgba(220,235,255,${flash})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          let bx = W * 0.3 + Math.random() * W * 0.4, by = 0;
          ctx.moveTo(bx, by);
          while (by < H * 0.7) { bx += (Math.random() - 0.5) * 26; by += 12 + Math.random() * 16; ctx.lineTo(bx, by); }
          ctx.stroke();
        }
        flash *= 0.88;
      }
      ctx.strokeStyle = 'rgba(150,195,255,0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - cfg.w * 1.8, d.y + d.l);
        d.x += cfg.w;
        d.y += d.s;
        if (d.y > H - 6) {
          if (Math.random() < 0.35) splashes.push({ x: d.x, r: 1, a: 0.55 });
          d.y = -12;
          d.x = Math.random() * (W + 80) - 40;
        }
        if (d.x > W + 30) d.x = -30;
      }
      ctx.stroke();
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.strokeStyle = `rgba(150,195,255,${s.a})`;
        ctx.beginPath();
        ctx.ellipse(s.x, H - 4, s.r * 2.6, s.r * 0.9, 0, 0, Math.PI * 2);
        ctx.stroke();
        s.r += 0.55;
        s.a -= 0.035;
        if (s.a <= 0) splashes.splice(i, 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [mode]);

  const MODES: { m: RainMode; icon: typeof Droplets }[] = [
    { m: 'DRIZZLE', icon: Droplets },
    { m: 'RAIN', icon: CloudRain },
    { m: 'STORM', icon: CloudLightning },
  ];

  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #070A14 0%, #0A0E1C 70%, #060810 100%)' }}>
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute left-2.5 top-2.5 flex gap-1">
        {MODES.map(({ m, icon: Icon }) => (
          <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-1 rounded border px-2 py-1 font-mono text-[8px] tracking-[0.14em] transition-colors ${mode === m ? 'border-cy/60 bg-cy/15 text-cy' : 'border-line bg-black/50 text-white/40'}`}>
            <Icon size={9} /> {m}
          </button>
        ))}
      </div>
      <div className="absolute bottom-2.5 left-2.5 font-mono text-[8px] tracking-[0.22em] text-cy/50">ATMOS FEED · SECTOR RAIN 84%</div>
    </div>
  );
}

/* ============ AF-34 EMBER DRIFT — ambient particle field ============ */
type EmberMode = 'EMBER' | 'FIREFLY' | 'SNOW';

export function DemoEmber() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<EmberMode>('EMBER');
  const pointer = useRef({ x: -999, y: -999 });
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const parent = c.parentElement!;
    let W = 0, H = 0, raf = 0;
    const resize = () => { W = c.width = parent.clientWidth; H = c.height = parent.clientHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    const ps = Array.from({ length: 46 }, () => ({
      x: Math.random() * 400, y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.3, vy: 0,
      l: Math.random() * Math.PI * 2,
      r: 1 + Math.random() * 2.2,
      hue: 20 + Math.random() * 30,
    }));
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      const m = modeRef.current;
      if (m !== 'SNOW') ctx.globalCompositeOperation = 'lighter';
      else ctx.globalCompositeOperation = 'source-over';
      for (const p of ps) {
        p.l += 0.02;
        const sway = Math.sin(p.l) * 0.24;
        if (m === 'EMBER') { p.vy = -0.35 - p.r * 0.12; }
        else if (m === 'FIREFLY') { p.vy = Math.sin(p.l * 0.7) * 0.2; }
        else { p.vy = 0.35 + p.r * 0.1; }
        // pointer repel
        const dx = p.x - pointer.current.x, dy = p.y - pointer.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 46 && dist > 0.01) {
          p.x += (dx / dist) * 1.6;
          p.y += (dy / dist) * 1.6;
        }
        p.x += p.vx + sway * (m === 'SNOW' ? 0.7 : 0.4);
        p.y += p.vy;
        if (p.y < -12) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.y > H + 12) { p.y = -10; p.x = Math.random() * W; }
        if (p.x < -12) p.x = W + 10;
        if (p.x > W + 12) p.x = -10;
        let fill: string;
        if (m === 'EMBER') fill = `hsla(${p.hue}, 100%, ${58 + Math.sin(p.l * 3) * 10}%, ${0.5 + Math.sin(p.l * 2) * 0.28})`;
        else if (m === 'FIREFLY') fill = `hsla(85, 100%, 72%, ${0.25 + Math.max(0, Math.sin(p.l * 2.4)) * 0.6})`;
        else fill = `rgba(230,240,255,${0.5 + Math.sin(p.l * 2) * 0.2})`;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (m === 'SNOW' ? 0.8 : 1), 0, Math.PI * 2);
        ctx.fill();
        if (m !== 'SNOW') {
          ctx.fillStyle = fill.replace(/[\d.]+\)$/, '0.08)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const MODES: { m: EmberMode; icon: typeof Flame }[] = [
    { m: 'EMBER', icon: Flame },
    { m: 'FIREFLY', icon: Sparkles },
    { m: 'SNOW', icon: Snowflake },
  ];

  return (
    <div
      ref={wrapRef}
      onPointerMove={(e) => {
        const r = wrapRef.current!.getBoundingClientRect();
        pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onPointerLeave={() => (pointer.current = { x: -999, y: -999 })}
      className="absolute inset-0"
      style={{ background: 'radial-gradient(120% 100% at 50% 100%, #160B08 0%, #08070D 60%)' }}
    >
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute left-2.5 top-2.5 flex gap-1">
        {MODES.map(({ m, icon: Icon }) => (
          <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-1 rounded border px-2 py-1 font-mono text-[8px] tracking-[0.14em] transition-colors ${mode === m ? 'border-amb/60 bg-amb/15 text-amb' : 'border-line bg-black/50 text-white/40'}`}>
            <Icon size={9} /> {m}
          </button>
        ))}
      </div>
      <div className="absolute bottom-2.5 left-2.5 font-mono text-[8px] tracking-[0.22em] text-white/35">AMBIENT FIELD · REACTS TO TOUCH</div>
    </div>
  );
}
