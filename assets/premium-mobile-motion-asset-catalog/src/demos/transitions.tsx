import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import type { AssetDef } from '../lib/core';
import { useWipe, useCycle } from '../lib/core';

const STARS: [number, number][] = [[14, 22], [28, 12], [40, 30], [55, 16], [66, 26], [78, 12], [88, 30], [35, 40], [60, 42]];
const TILES = Array.from({ length: 70 }, (_, i) => ((i * 37) % 9) * 55 + ((i * 53) % 7) * 18);

function Scene({ i }: { i: number }) {
  if (i % 2 === 0) {
    return (
      <div className="absolute inset-0 bg-[#0d2830]">
        <div className="absolute left-6 top-5 h-9 w-9 rounded-full bg-[#ffd76a] shadow-[0_0_34px_8px_rgba(255,215,106,.4)]" />
        <div className="absolute -left-[8%] -right-[8%] bottom-0 h-[64%] bg-[#0a1e24]" style={{ clipPath: 'polygon(0 100%,0 46%,16% 14%,33% 50%,50% 10%,68% 46%,84% 20%,100% 54%,100% 100%)' }} />
        <div className="absolute -left-[8%] -right-[8%] bottom-0 h-[36%] bg-[#07151a]" style={{ clipPath: 'polygon(0 100%,0 40%,22% 8%,42% 44%,64% 12%,84% 46%,100% 26%,100% 100%)' }} />
        <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-teal-100/60">LVL 01 // MOSS CAVERNS</div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-[#171029]">
      <Moon className="absolute right-6 top-5 h-7 w-7 text-indigo-200" />
      {STARS.map(([x, y], j) => (
        <div key={j} className="absolute h-1 w-1 rounded-full bg-white/70" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
      <div className="absolute -left-[8%] -right-[8%] bottom-0 h-[52%] bg-[#100a20]" style={{ clipPath: 'polygon(0 100%,0 55%,14% 20%,30% 58%,48% 24%,66% 60%,82% 30%,100% 62%,100% 100%)' }} />
      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-fuchsia-100/60">LVL 02 // NEON RUINS</div>
    </div>
  );
}

function Shell({ scene, children }: { scene: number; children?: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Scene i={scene} />
      {children}
    </div>
  );
}

function IrisWipe() {
  const { k, scene } = useWipe(430, 2600);
  return <Shell scene={scene}><div key={k} className="tr-iris" /></Shell>;
}

function GlitchCut() {
  const { k, scene } = useWipe(180, 2200);
  return (
    <Shell scene={scene}>
      <div key={k} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 tr-ga"><Scene i={scene} /></div>
        <div className="absolute inset-0 tr-gb"><Scene i={scene} /></div>
        <div className="tr-gbar" />
      </div>
    </Shell>
  );
}

function LiquidMorph() {
  const { k, scene } = useWipe(430, 2600);
  return <Shell scene={scene}><div key={k} className="tr-liquid" /></Shell>;
}

function PixelDissolve() {
  const { k, scene } = useWipe(700, 3000);
  return (
    <Shell scene={scene}>
      <div key={k} className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: 'repeat(10,1fr)', gridTemplateRows: 'repeat(7,1fr)' }}>
        {TILES.map((n, i) => (<div key={i} className="tr-px" style={{ animationDelay: `${n}ms` }} />))}
      </div>
    </Shell>
  );
}

function SpeedRush() {
  const { k, scene } = useWipe(200, 2000);
  return (
    <Shell scene={scene}>
      <div key={k} className="pointer-events-none absolute inset-0">
        <div className="tr-rush" /><div className="tr-flash" />
      </div>
    </Shell>
  );
}

function PortalWarp() {
  const { k, scene } = useWipe(430, 2400);
  return (
    <Shell scene={scene}>
      <div key={k} className="pointer-events-none absolute inset-0">
        {[0, 1, 2, 3].map((i) => (<div key={i} className="tr-ring" style={{ animationDelay: `${i * 70}ms` }} />))}
        <div className="tr-flash" style={{ animationDelay: '120ms' }} />
      </div>
    </Shell>
  );
}

function Flip3D() {
  const k = useCycle(2400);
  const [ci, setCi] = useState(0);
  useEffect(() => {
    if (k === 0) return;
    const t = setTimeout(() => setCi((c) => c + 1), 300);
    return () => clearTimeout(t);
  }, [k]);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: '900px' }}>
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" animate={{ rotateY: k * 180 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
        <div className="absolute inset-0 [backface-visibility:hidden]"><Scene i={ci} /></div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"><Scene i={ci} /></div>
      </motion.div>
    </div>
  );
}

function WhipPan() {
  const { k, scene } = useWipe(0, 2000);
  const dir = scene % 2 === 0 ? 1 : -1;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        key={k}
        className="absolute inset-0"
        initial={{ x: `${dir * 110}%`, filter: 'blur(7px)' }}
        animate={{ x: '0%', filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.72, 0, 0.18, 1] }}
      >
        <Scene i={scene} />
      </motion.div>
      <div key={`s${k}`} className="pointer-events-none absolute inset-0 tr-whip" />
    </div>
  );
}

const css = `
.tr-iris{position:absolute;left:50%;top:50%;width:190%;aspect-ratio:1;border-radius:50%;background:#05050a;pointer-events:none;animation:trIris 1.05s cubic-bezier(.65,0,.35,1) forwards}
@keyframes trIris{0%{transform:translate(-50%,-50%) scale(0)}42%,58%{transform:translate(-50%,-50%) scale(1)}100%{transform:translate(-50%,-50%) scale(0)}}
.tr-ga,.tr-gb{opacity:0;pointer-events:none}
.tr-ga{animation:trGa .55s steps(8) forwards;filter:saturate(3) hue-rotate(80deg)}
.tr-gb{animation:trGb .55s steps(8) forwards;filter:saturate(3) hue-rotate(-80deg)}
@keyframes trGa{0%{opacity:1;transform:translateX(-8px);clip-path:inset(0 0 58% 0)}25%{transform:translateX(7px);clip-path:inset(38% 0 8% 0)}50%{transform:translateX(-5px);clip-path:inset(68% 0 0 0)}75%{transform:translateX(4px);clip-path:inset(12% 0 44% 0)}100%{opacity:0;transform:none;clip-path:inset(0 0 0 0)}}
@keyframes trGb{0%{opacity:1;transform:translateX(8px);clip-path:inset(52% 0 0 0)}25%{transform:translateX(-6px);clip-path:inset(6% 0 62% 0)}50%{transform:translateX(5px);clip-path:inset(30% 0 26% 0)}75%{transform:translateX(-4px);clip-path:inset(58% 0 8% 0)}100%{opacity:0;transform:none;clip-path:inset(0 0 0 0)}}
.tr-gbar{position:absolute;left:0;right:0;height:14%;background:rgba(255,255,255,.7);mix-blend-mode:overlay;opacity:0;animation:trGbar .5s steps(5) forwards;pointer-events:none}
@keyframes trGbar{0%{opacity:.85;top:-14%}100%{opacity:0;top:96%}}
.tr-liquid{position:absolute;top:-30%;bottom:-30%;left:0;width:85%;background:#05050a;pointer-events:none;animation:trLiq 1.05s cubic-bezier(.7,0,.25,1) forwards;border-radius:58% 42% 55% 45%/46% 52% 48% 54%}
@keyframes trLiq{0%{transform:translateX(-135%) skewX(-14deg);border-radius:58% 42% 55% 45%/46% 52% 48% 54%}50%{transform:translateX(15%) skewX(0deg);border-radius:45% 55% 40% 60%/55% 45% 55% 45%}100%{transform:translateX(240%) skewX(14deg);border-radius:50% 50% 58% 42%/42% 58% 46% 54%}}
.tr-px{background:#05050a;transform:scale(0);animation:trPx 1.15s steps(2) forwards}
@keyframes trPx{0%{transform:scale(0)}28%{transform:scale(1.03)}55%{transform:scale(1.03)}82%{transform:scale(0)}100%{transform:scale(0)}}
.tr-rush{position:absolute;inset:-45%;background:repeating-conic-gradient(from 0deg,rgba(220,250,255,.9) 0deg 2deg,transparent 2deg 10deg);-webkit-mask-image:radial-gradient(circle,transparent 16%,#000 48%);mask-image:radial-gradient(circle,transparent 16%,#000 48%);opacity:0;animation:trRush .8s cubic-bezier(.2,.7,.3,1) forwards;pointer-events:none}
@keyframes trRush{0%{opacity:0;transform:scale(.55) rotate(0)}15%{opacity:.95}100%{opacity:0;transform:scale(1.55) rotate(16deg)}}
.tr-flash{position:absolute;inset:0;background:#fff;opacity:0;animation:trFlash .5s ease-out forwards;pointer-events:none}
@keyframes trFlash{0%{opacity:0}22%{opacity:.85}100%{opacity:0}}
.tr-ring{position:absolute;left:50%;top:50%;width:130%;aspect-ratio:1;border:3px solid rgba(34,211,238,.85);border-radius:9999px;box-shadow:0 0 24px rgba(34,211,238,.5),inset 0 0 24px rgba(34,211,238,.3);transform:translate(-50%,-50%) scale(0);animation:trRing .95s cubic-bezier(.2,.8,.2,1) forwards;pointer-events:none}
@keyframes trRing{0%{transform:translate(-50%,-50%) scale(0);opacity:1}90%{opacity:.9}100%{transform:translate(-50%,-50%) scale(1.45);opacity:0}}
.tr-whip{background:rgba(255,255,255,.5);mix-blend-mode:overlay;opacity:0;animation:trWhip .45s ease-out forwards}
@keyframes trWhip{0%{opacity:0;transform:skewX(-18deg) translateX(-10%)}30%{opacity:.6}100%{opacity:0;transform:skewX(-18deg) translateX(30%)}}
`;

function Style() { return <style>{css}</style>; }

export const assets: AssetDef[] = [
  { id: 'iris-wipe', name: 'Iris Wipe', cat: 'transitions', origin: 'ARCHIVE', trigger: 'AUTO', duration: '1.05s', easing: 'circ.inOut', tags: ['wipe', 'mask', 'scene-swap'], desc: 'Full-screen circular iris that swallows the stage and opens on the next level. The classic cartoon cut, tuned for 60fps.', Component: () => (<><Style /><IrisWipe /></>) },
  { id: 'glitch-cut', name: 'Glitch Cut', cat: 'transitions', origin: 'ARCHIVE', trigger: 'AUTO', duration: '0.55s', easing: 'steps(8)', tags: ['rgb-split', 'digital', 'cyber'], desc: 'Frame-perfect digital cut: RGB channel shear, slice displacement and an overlay scan bar. Cyberpunk worlds demand it.', Component: () => (<><Style /><GlitchCut /></>) },
  { id: 'liquid-morph', name: 'Liquid Morph', cat: 'transitions', origin: 'EXPANSION', trigger: 'AUTO', duration: '1.00s', easing: 'power3.inOut', tags: ['blob', 'organic', 'sweep'], desc: 'Organic border-radius blob sweep with skew compensation. Soft world-hops between shop, loadout and battle.', Component: () => (<><Style /><LiquidMorph /></>) },
  { id: 'pixel-dissolve', name: 'Pixel Dissolve', cat: 'transitions', origin: 'ARCHIVE', trigger: 'AUTO', duration: '0.90s', easing: 'steps(2) + stagger', tags: ['mosaic', 'retro', '8-bit'], desc: 'Staggered 10×7 mosaic dissolve with hard steps() timing. 8-bit deaths, respawns and stage-outs.', Component: () => (<><Style /><PixelDissolve /></>) },
  { id: 'speedline-rush', name: 'Speedline Rush', cat: 'transitions', origin: 'EXPANSION', trigger: 'AUTO', duration: '0.80s', easing: 'expo.out', tags: ['streaks', 'velocity', 'flash'], desc: 'Radial manga speedlines masked around the focal point plus a white flash. Hyper cuts and boss intros.', Component: () => (<><Style /><SpeedRush /></>) },
  { id: 'portal-warp', name: 'Portal Warp', cat: 'transitions', origin: 'EXPANSION', trigger: 'AUTO', duration: '0.95s', easing: 'back.out(1.6)', tags: ['rings', 'dimension', 'warp'], desc: 'Concentric warp rings peel reality open with delayed glow shells. Realm-to-realm travel in one beat.', Component: () => (<><Style /><PortalWarp /></>) },
  { id: 'flip-3d', name: 'Card Flip 3D', cat: 'transitions', origin: 'EXPANSION', trigger: 'AUTO', duration: '0.85s', easing: 'spring 3D', tags: ['3d', 'perspective', 'card'], desc: 'Perspective rotateY flip mapping scene A onto scene B with backface culling. Menus love it, levels tolerate it.', Component: () => (<><Style /><Flip3D /></>) },
  { id: 'whip-pan', name: 'Whip Pan', cat: 'transitions', origin: 'ARCHIVE', trigger: 'AUTO', duration: '0.50s', easing: 'power4.out', tags: ['pan', 'blur', 'velocity'], desc: 'Motion-blurred whip pan with alternating travel direction per swap and a skewed light streak.', Component: () => (<><Style /><WhipPan /></>) },
];
