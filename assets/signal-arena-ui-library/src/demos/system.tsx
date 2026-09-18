import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BatteryCharging,
  Check,
  CloudOff,
  Ghost,
  Loader2,
  Play,
  RefreshCw,
  Signal,
  Square,
  Vibrate,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { buzz, HAPTIC, useInterval } from "../lib/fx";
import { cn } from "../utils/cn";

/* ---------------------------------- F-01 ---------------------------------- */
export function SkeletonDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex h-full flex-col px-4 pt-12">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">leaderboard fetch</span>
        <button
          onClick={() => {
            setLoading((l) => !l);
            buzz(HAPTIC.light);
          }}
          className="pressable rounded-full border border-acid/50 px-3 py-1.5 font-mono text-[9px] font-bold uppercase text-acid"
        >
          {loading ? "resolve →" : "← reload"}
        </button>
      </div>

      <div className="relative mt-4 flex-1">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="sk" exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-2.5">
              <div className="shimmer h-32 rounded-2xl" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="shimmer size-9 rounded-full" style={{ animationDelay: `${i * 0.12}s` }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="shimmer h-2.5 w-3/5 rounded" style={{ animationDelay: `${i * 0.12}s` }} />
                    <div className="shimmer h-2 w-2/5 rounded" style={{ animationDelay: `${i * 0.12 + 0.06}s` }} />
                  </div>
                  <div className="shimmer h-4 w-10 rounded" />
                </div>
              ))}
              <div className="pt-2 text-center font-mono text-[8px] uppercase tracking-[0.3em] text-ink/30">
                same layout · no layout shift
              </div>
            </motion.div>
          ) : (
            <motion.div key="ct" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="space-y-2.5">
              <div className="relative h-32 overflow-hidden rounded-2xl border border-line bg-coal">
                <svg viewBox="0 0 280 110" className="h-full w-full" preserveAspectRatio="none">
                  <polyline points="0,86 30,70 60,80 90,52 120,62 150,40 180,50 210,30 240,42 280,22" fill="none" stroke="#31e58c" strokeWidth="2" />
                </svg>
                <span className="absolute right-2 top-2 font-mono text-[9px] font-bold text-up">+12.4%</span>
              </div>
              {[
                ["LIQUIDATOR", "9,420", "#ffc24b"],
                ["permabull_eth", "8,810", "#c9ff2e"],
                ["NOFOMO", "8,330", "#4bd9ff"],
                ["YOU", "7,610", "#ff3355"],
              ].map(([n, s, c]) => (
                <div key={n} className="flex items-center gap-2.5 rounded-xl border border-line bg-coal px-3 py-2">
                  <span className="grid size-9 place-items-center rounded-full font-display text-xs text-black" style={{ background: c }}>
                    {n.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex-1 truncate text-[12px] font-bold">{n}</span>
                  <span className="font-mono text-[11px] font-bold tabular-nums text-ink/70">{s}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------- F-02 ---------------------------------- */
export function StatesDemo() {
  const [mode, setMode] = useState<"empty" | "error">("empty");
  const [retry, setRetry] = useState<"idle" | "busy" | "ok">("idle");

  const doRetry = () => {
    setRetry("busy");
    buzz(HAPTIC.medium);
    setTimeout(() => {
      setRetry("ok");
      buzz(HAPTIC.success);
      setTimeout(() => {
        setRetry("idle");
        setMode("empty");
      }, 1200);
    }, 1300);
  };

  return (
    <div className="flex h-full flex-col px-4 pt-12">
      <div className="mx-auto flex rounded-full border border-line p-0.5">
        {(["empty", "error"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full px-5 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors",
              mode === m ? (m === "empty" ? "bg-acid text-black" : "bg-alarm text-white") : "text-ink/40"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {mode === "empty" ? (
            <motion.div key="e" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center text-center">
              <svg viewBox="0 0 200 90" className="w-48 opacity-50">
                <motion.polyline
                  points="0,60 25,48 50,56 75,38 100,46 125,28 150,36 175,20 200,26"
                  fill="none"
                  stroke="rgba(242,240,232,0.4)"
                  strokeWidth="2"
                  strokeDasharray="4 5"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <line x1="0" y1="80" x2="200" y2="80" stroke="rgba(242,240,232,0.15)" strokeWidth="1" />
              </svg>
              <Ghost className="mt-1 size-8 text-ink/40" />
              <div className="mt-2 font-display text-xl uppercase">no sealed trades</div>
              <p className="mt-1 max-w-[190px] font-mono text-[10px] leading-relaxed text-ink/40">
                Журнал пуст, как стакан после ликвидации.
              </p>
              <button className="pressable mt-4 rounded-full border-2 border-black bg-acid px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-black shadow-[3px_3px_0_#000]">
                enter first blind
              </button>
            </motion.div>
          ) : (
            <motion.div key="r" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center px-4 text-center">
              <div className="w-full rounded-2xl border-2 border-alarm/60 bg-alarm/5 p-5">
                <CloudOff className="mx-auto size-9 text-alarm" />
                <div className="animate-glitch mt-2 font-display text-2xl uppercase tracking-wider text-alarm">
                  feed dropped
                </div>
                <p className="mt-1 font-mono text-[10px] text-ink/50">
                  ERR_FEED_STALE · hist-api · 503
                </p>
                <button
                  onClick={doRetry}
                  disabled={retry !== "idle"}
                  className={cn(
                    "pressable mx-auto mt-4 flex min-h-[44px] min-w-[150px] items-center justify-center gap-2 rounded-full border-2 border-black px-6 font-mono text-[10px] font-bold uppercase tracking-widest shadow-[3px_3px_0_#000]",
                    retry === "ok" ? "bg-up text-black" : "bg-alarm text-white"
                  )}
                >
                  {retry === "busy" && <Loader2 className="size-4 animate-spin" />}
                  {retry === "ok" && <Check className="size-4" />}
                  {retry === "idle" && <RefreshCw className="size-4" />}
                  {retry === "busy" ? "reconnecting" : retry === "ok" ? "restored" : "retry feed"}
                </button>
              </div>
              <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.25em] text-ink/30">
                авто-retry ×3 · затем этот экран
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------- E-03 ---------------------------------- */
export function EnergyDemo() {
  const [energy, setEnergy] = useState(4);
  const [xp, setXp] = useState(64);
  const [level, setLevel] = useState(3);
  const [burst, setBurst] = useState(0);

  useInterval(
    () => setEnergy((e) => Math.min(5, e + 1)),
    2600,
    energy < 5
  );

  const spend = () => {
    if (energy === 0) {
      buzz(HAPTIC.error);
      return;
    }
    setEnergy((e) => e - 1);
    buzz(HAPTIC.heavy);
  };

  const addXp = () => {
    const next = xp + 30;
    if (next >= 100) {
      setXp(next - 100);
      setLevel((l) => l + 1);
      setBurst((b) => b + 1);
      buzz(HAPTIC.success);
    } else {
      setXp(next);
      buzz(HAPTIC.tick);
    }
  };

  return (
    <div className="flex h-full flex-col justify-center gap-6 px-6">
      {/* energy */}
      <div>
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink/40">
          <span className="flex items-center gap-1.5">
            <Zap className={cn("size-3.5", energy <= 1 ? "text-alarm" : "text-acid")} /> energy
          </span>
          <span className="tabular-nums">{energy}/5 · {energy < 5 ? "реген…" : "полная"}</span>
        </div>
        <div className={cn("flex gap-1.5", energy <= 1 && "animate-pulse")}>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scaleY: i < energy ? 1 : 0.18,
                opacity: i < energy ? 1 : 0.25,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={cn(
                "h-6 flex-1 origin-bottom rounded-sm border",
                i < energy
                  ? energy <= 1
                    ? "border-alarm bg-alarm/70"
                    : "border-acid bg-acid"
                  : "border-ink/15 bg-transparent"
              )}
            />
          ))}
        </div>
        <button
          onClick={spend}
          className={cn(
            "pressable mt-3 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors",
            energy === 0
              ? "border-alarm/60 text-alarm animate-shake"
              : "border-black bg-alarm text-white shadow-[3px_3px_0_#000]"
          )}
        >
          {energy === 0 ? <BatteryCharging className="size-4" /> : <Zap className="size-4" />}
          {energy === 0 ? "out of juice — wait" : "enter scenario −1 ⚡"}
        </button>
      </div>

      {/* xp */}
      <div>
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink/40">
          <span>lvl {level} operator</span>
          <span className="tabular-nums">{xp}/100 xp</span>
        </div>
        <div className="relative h-4 overflow-visible rounded-sm border border-line bg-black/50">
          <motion.div
            animate={{ scaleX: xp / 100 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="h-full origin-left rounded-sm bg-gradient-to-r from-amber to-acid"
          />
          <AnimatePresence>
            {burst > 0 && (
              <motion.div
                key={burst}
                initial={{ opacity: 1, scale: 0.9 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.8 }}
                className="absolute -inset-1 rounded border-2 border-acid"
              />
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {burst > 0 && (
            <motion.div
              key={`t-${burst}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-center font-display text-lg uppercase text-acid"
            >
              level up — speedrun unlocked
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={addXp}
          className="pressable mt-2 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-line bg-panel font-mono text-[10px] font-bold uppercase tracking-widest text-ink/70"
        >
          <Activity className="size-4" /> seal trade +30 xp
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- F-03 ---------------------------------- */
const PATTERNS: { k: string; label: string; seq: number[] }[] = [
  { k: "light", label: "tab switch", seq: HAPTIC.light },
  { k: "medium", label: "sheet open", seq: HAPTIC.medium },
  { k: "heavy", label: "seal press", seq: HAPTIC.heavy },
  { k: "success", label: "win", seq: HAPTIC.success },
  { k: "error", label: "liquidated", seq: HAPTIC.error },
  { k: "seal", label: "SEALED", seq: HAPTIC.seal },
];

export function HapticsDemo() {
  const [last, setLast] = useState<{ k: string; n: number } | null>(null);

  return (
    <div className="flex h-full flex-col justify-center px-5">
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">
        <Vibrate className="size-4 text-acid" /> tactile vocabulary
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {PATTERNS.map((p) => (
          <button
            key={p.k}
            onClick={() => {
              buzz(p.seq);
              setLast({ k: p.k, n: Date.now() });
            }}
            className={cn(
              "pressable flex min-h-[56px] flex-col items-start justify-center rounded-xl border px-3 transition-colors",
              last?.k === p.k ? "border-acid bg-acid/10" : "border-line bg-coal"
            )}
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">{p.k}</span>
            <span className="font-mono text-[9px] text-ink/40">{p.label}</span>
          </button>
        ))}
      </div>

      {/* waveform echo */}
      <div className="mt-5 flex h-10 items-center justify-center gap-1">
        {last ? (
          (function () {
            const seq: number[] | undefined = PATTERNS.find((p) => p.k === last.k)?.seq;
            if (!seq) return null;
            return seq.map((v: number, i: number) => (
              <motion.span
                key={`${last.n}-${i}`}
                initial={{ scaleY: 0.2 }}
                animate={{ scaleY: [0.2, 1, 0.2] }}
                transition={{ duration: v / 60, delay: seq.slice(0, i).reduce((a: number, b: number) => a + b, 0) / 500 }}
                className="h-9 w-2 origin-center rounded-sm bg-acid"
              />
            ));
          })()
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/25">tap a pattern</span>
        )}
      </div>
      <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-[0.25em] leading-relaxed text-ink/30">
        WebApp.HapticFeedback.impactOccurred
        <br />
        fallback: navigator.vibrate
      </p>
    </div>
  );
}

/* ---------------------------------- F-04 ---------------------------------- */
export function SoundDemo() {
  const [on, setOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<{
    ctx: AudioContext;
    an: AnalyserNode;
    osc: OscillatorNode;
    lfo: OscillatorNode;
  } | null>(null);
  const rafRef = useRef(0);

  const draw = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const W = cv.clientWidth;
    const H = cv.clientHeight;
    if (cv.width !== W * dpr) {
      cv.width = W * dpr;
      cv.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const bars = 18;
    const bw = W / bars;
    let data: Uint8Array | null = null;
    if (engine.current) {
      data = new Uint8Array(engine.current.an.frequencyBinCount);
      engine.current.an.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);
    }
    for (let i = 0; i < bars; i++) {
      const v = data ? data[i + 2] / 255 : 0.12 + Math.sin(Date.now() / 900 + i) * 0.04;
      const h = Math.max(3, v * H);
      ctx.fillStyle = on ? (i % 4 === 0 ? "#ff3355" : "#c9ff2e") : "rgba(242,240,232,0.18)";
      ctx.fillRect(i * bw + 1.5, H - h, bw - 3, h);
    }
    rafRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      engine.current?.ctx.close().catch(() => {});
      engine.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    if (!on) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const an = ctx.createAnalyser();
      an.fftSize = 128;
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 55;
      const gain = ctx.createGain();
      gain.gain.value = 0.045;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 2.2;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.035;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(an);
      an.connect(ctx.destination);
      osc.start();
      lfo.start();
      engine.current = { ctx, an, osc, lfo };
      setOn(true);
      buzz(HAPTIC.light);
    } else {
      await engine.current?.ctx.close().catch(() => {});
      engine.current = null;
      setOn(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-center px-6">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">arena feed · audio layer</div>
        {on ? <Volume2 className="size-4 text-acid" /> : <VolumeX className="size-4 text-ink/30" />}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-coal">
        <canvas ref={canvasRef} className="h-32 w-full" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest">
          <Signal className={cn("size-3.5", on ? "text-acid animate-blink" : "text-ink/30")} />
          <span className={on ? "text-acid" : "text-ink/40"}>{on ? "signal detected" : "ether silent"}</span>
        </div>
      </div>

      <button
        onClick={toggle}
        className={cn(
          "pressable mx-auto mt-5 flex min-h-[48px] min-w-[190px] items-center justify-center gap-2 rounded-full border-2 border-black px-7 font-display text-lg uppercase tracking-widest shadow-[4px_4px_0_#000]",
          on ? "bg-alarm text-white" : "bg-acid text-black"
        )}
      >
        {on ? <Square className="size-5" /> : <Play className="size-5" />}
        {on ? "kill signal" : "open the feed"}
      </button>
      <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.25em] leading-relaxed text-ink/30">
        WebAudio unlocks on first gesture
        <br />
        analyserNode → bar heights @ rAF
      </p>
      <div className="mt-4 flex justify-center gap-1" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn("h-6 w-1.5 origin-bottom rounded-sm bg-ink/25", on && "text-acid")}
            style={
              on
                ? { animation: `eqbar ${0.7 + i * 0.13}s ease-in-out infinite`, background: "currentColor", color: "#c9ff2e" }
                : undefined
            }
          />
        ))}
      </div>
      <div className="mt-1 text-center font-mono text-[8px] uppercase tracking-widest text-ink/25">
        css fallback when audio unavailable
      </div>
    </div>
  );
}
