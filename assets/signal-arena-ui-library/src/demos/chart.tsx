import { useEffect, useRef, useState } from "react";
import { Crosshair, Minus, Plus } from "lucide-react";
import { mulberry32 } from "../lib/fx";
import { cn } from "../utils/cn";

interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

function genCandles(seed: number, n = 150): Candle[] {
  const rnd = mulberry32(seed);
  let p = 60000;
  const out: Candle[] = [];
  for (let i = 0; i < n; i++) {
    const regime = Math.sin(i / 22) * 0.6 + (i > n * 0.55 && i < n * 0.72 ? 1.1 : 0);
    const drift = regime * 90;
    const o = p;
    const c = o + drift + (rnd() - 0.5) * 700;
    const h = Math.max(o, c) + rnd() * 260;
    const l = Math.min(o, c) - rnd() * 260;
    out.push({ o, h, l, c, v: 0.25 + rnd() * 0.75 });
    p = c;
  }
  return out;
}

const DECISION_AT = 0.72; // share of candles that are "past"
const panByLast = { current: null as number | null };

export function ChartDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tf, setTf] = useState<"15m" | "1h" | "4h">("1h");
  const candles = useRef<Candle[]>(genCandles(7));
  const view = useRef({ off: 0, w: 6 }); // offset (first visible idx), px per candle
  const cursor = useRef<{ x: number; y: number } | null>(null);
  const reveal = useRef(0);
  const dirty = useRef(true);
  const drag = useRef<{ x: number; off: number } | null>(null);
  const [hud, setHud] = useState<{ price: number; chg: number } | null>(null);

  /* regenerate on timeframe + reveal animation */
  useEffect(() => {
    const seed = tf === "15m" ? 11 : tf === "1h" ? 7 : 23;
    candles.current = genCandles(seed);
    reveal.current = 0;
    cursor.current = null;
    dirty.current = true;

    const d = candles.current;
    const di = Math.floor(d.length * DECISION_AT);
    const lp = d[di - 1].c;
    setHud({ price: lp, chg: ((lp - d[0].o) / d[0].o) * 100 });

    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      reveal.current = 1 - Math.pow(1 - p, 3);
      dirty.current = true;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [tf]);

  /* render loop */
  useEffect(() => {
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!dirty.current) return;
      dirty.current = false;

      const dpr = window.devicePixelRatio || 1;
      const W = cv.clientWidth;
      const H = cv.clientHeight;
      if (cv.width !== W * dpr) {
        cv.width = W * dpr;
        cv.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const data = candles.current;
      const decisionIdx = Math.floor(data.length * DECISION_AT);
      const { off, w } = view.current;
      const padT = 18;
      const chartH = H * 0.72 - padT;
      const volTop = H * 0.78;

      // visible range
      const first = Math.max(0, Math.floor(off));
      const last = Math.min(data.length - 1, Math.ceil(off + W / w));
      let min = Infinity;
      let max = -Infinity;
      for (let i = first; i <= last; i++) {
        min = Math.min(min, data[i].l);
        max = Math.max(max, data[i].h);
      }
      const range = max - min || 1;
      const y = (p: number) => padT + (1 - (p - min) / range) * chartH;
      const x = (i: number) => (i - off) * w;

      // grid
      ctx.strokeStyle = "rgba(242,240,232,0.05)";
      ctx.lineWidth = 1;
      for (let g = 1; g < 4; g++) {
        const gy = padT + (chartH / 4) * g;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      const shown = Math.floor(last * reveal.current) + 1;

      // volume
      for (let i = first; i <= Math.min(last, shown); i++) {
        const up = data[i].c >= data[i].o;
        ctx.fillStyle = up ? "rgba(49,229,140,0.25)" : "rgba(255,77,97,0.25)";
        const vh = data[i].v * (H - volTop - 8);
        ctx.fillRect(x(i) + 1, H - 6 - vh, Math.max(1, w - 2), vh);
      }

      // candles
      for (let i = first; i <= Math.min(last, shown); i++) {
        const c = data[i];
        const up = c.c >= c.o;
        ctx.strokeStyle = up ? "#31e58c" : "#ff4d61";
        ctx.fillStyle = up ? "#31e58c" : "#ff4d61";
        ctx.lineWidth = 1;
        const cx = x(i) + w / 2;
        ctx.beginPath();
        ctx.moveTo(cx, y(c.h));
        ctx.lineTo(cx, y(c.l));
        ctx.stroke();
        const bw = Math.max(2, w - 2.5);
        const yO = y(c.o);
        const yC = y(c.c);
        ctx.fillRect(x(i) + 1.25, Math.min(yO, yC), bw, Math.max(1.5, Math.abs(yO - yC)));
      }

      // decision line + hatched future
      const dx = x(decisionIdx);
      if (dx > 0 && dx < W) {
        ctx.save();
        ctx.fillStyle = "rgba(255,51,85,0.06)";
        ctx.fillRect(dx, 0, W - dx, volTop + 10);
        ctx.strokeStyle = "rgba(255,51,85,0.35)";
        ctx.beginPath();
        for (let hy = -40; hy < H + 40; hy += 9) {
          ctx.moveTo(dx + (hy % 18 === 0 ? 0 : 0), hy);
          ctx.lineTo(W + 20, hy - 40);
        }
        ctx.stroke();
        ctx.restore();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = "#c9ff2e";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(dx, 0);
        ctx.lineTo(dx, H);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#c9ff2e";
        ctx.font = "700 9px 'JetBrains Mono', monospace";
        ctx.fillText("YOU ARE HERE", dx + 5, 14);
      }

      // last price line
      const lastC = data[Math.min(decisionIdx - 1, data.length - 1)];
      if (lastC && reveal.current > 0.3) {
        const ly = y(lastC.c);
        const up = lastC.c >= lastC.o;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = up ? "#31e58c" : "#ff4d61";
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(Math.min(dx, W), ly);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = up ? "#31e58c" : "#ff4d61";
        ctx.fillRect(2, ly - 8, 56, 15);
        ctx.fillStyle = "#000";
        ctx.font = "700 9px 'JetBrains Mono', monospace";
        ctx.fillText(lastC.c.toFixed(1), 5, ly + 3);
      }

      // crosshair
      const cur = cursor.current;
      if (cur) {
        const i = Math.round(cur.x / w + off - 0.5);
        if (i >= 0 && i < data.length && i < decisionIdx) {
          const c = data[i];
          const cx = x(i) + w / 2;
          ctx.strokeStyle = "rgba(242,240,232,0.35)";
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(cx, 0);
          ctx.lineTo(cx, H);
          ctx.moveTo(0, cur.y);
          ctx.lineTo(W, cur.y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = "rgba(13,13,18,0.92)";
          ctx.strokeStyle = "rgba(242,240,232,0.2)";
          const bw2 = 118;
          const bh = 56;
          const bx = Math.min(Math.max(cx - bw2 / 2, 4), W - bw2 - 4);
          ctx.fillRect(bx, cur.y - bh - 14, bw2, bh);
          ctx.strokeRect(bx, cur.y - bh - 14, bw2, bh);
          ctx.fillStyle = "#f2f0e8";
          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillText(`O ${c.o.toFixed(0)}  H ${c.h.toFixed(0)}`, bx + 8, cur.y - bh + 2);
          ctx.fillText(`L ${c.l.toFixed(0)}  C ${c.c.toFixed(0)}`, bx + 8, cur.y - bh + 16);
          ctx.fillStyle = c.c >= c.o ? "#31e58c" : "#ff4d61";
          ctx.fillText(
            `${c.c >= c.o ? "▲" : "▼"} ${(Math.abs(c.c - c.o) / c.o * 100).toFixed(2)}%  VOL ${(c.v * 100).toFixed(0)}`,
            bx + 8,
            cur.y - bh + 30
          );
        }
      }
    };

    const rafId = requestAnimationFrame(draw);
    void rafId;
    return () => cancelAnimationFrame(raf);
  }, []);

  const panBy = (px: number) => {
    view.current.off = Math.max(-4, Math.min(candles.current.length - 8, view.current.off - px / view.current.w));
    dirty.current = true;
  };
  const zoom = (dir: 1 | -1) => {
    view.current.w = Math.max(2.4, Math.min(14, view.current.w * (dir > 0 ? 1.25 : 0.8)));
    dirty.current = true;
  };

  /* auto-scroll to decision zone on load */
  useEffect(() => {
    view.current.off = candles.current.length * DECISION_AT - 160 / 6;
    view.current.w = 6;
    dirty.current = true;
  }, [tf]);

  return (
    <div className="flex h-full flex-col">
      {/* HUD */}
      <div className="mt-9 flex items-center justify-between border-b border-line px-4 pb-2 pt-2">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/40">blind #042 · btc</div>
          <div className={cn("font-mono text-lg font-bold", (hud?.chg ?? 0) >= 0 ? "text-up" : "text-down")}>
            {hud ? `${hud.price.toFixed(1)}  ${hud.chg >= 0 ? "+" : ""}${hud.chg.toFixed(2)}%` : "—"}
          </div>
        </div>
        <div className="flex gap-1">
          {(["15m", "1h", "4h"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={cn(
                "min-h-[32px] min-w-[40px] rounded border px-1 font-mono text-[10px] font-bold transition-colors",
                tf === t ? "border-acid bg-acid/10 text-acid" : "border-line text-ink/40"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* canvas */}
      <div
        ref={wrapRef}
        className="relative flex-1 touch-none"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, off: view.current.off };
          const r = wrapRef.current!.getBoundingClientRect();
          cursor.current = { x: e.clientX - r.left, y: e.clientY - r.top };
          dirty.current = true;
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 6) {
            panBy(dx - (panByLast.current || 0));
            panByLast.current = dx;
            cursor.current = null;
          } else {
            const r = wrapRef.current!.getBoundingClientRect();
            cursor.current = { x: e.clientX - r.left, y: e.clientY - r.top };
          }
          dirty.current = true;
        }}
        onPointerUp={() => {
          drag.current = null;
          panByLast.current = null;
          setTimeout(() => {
            cursor.current = null;
            dirty.current = true;
          }, 1400);
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* zoom controls */}
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <button onClick={() => zoom(1)} className="grid size-9 place-items-center rounded border border-line bg-coal/90 text-ink/70 pressable">
            <Plus className="size-4" />
          </button>
          <button onClick={() => zoom(-1)} className="grid size-9 place-items-center rounded border border-line bg-coal/90 text-ink/70 pressable">
            <Minus className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pb-7 pt-2 font-mono text-[8px] uppercase tracking-[0.3em] text-ink/30">
        <Crosshair className="size-3" /> drag to pan · hold for ohlc · pinch-free zoom
      </div>
    </div>
  );
}
