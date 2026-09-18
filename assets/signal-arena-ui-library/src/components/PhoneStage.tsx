import { ReactNode, useState } from "react";
import { Battery, RotateCcw, Signal, Wifi } from "lucide-react";
import { cn } from "../utils/cn";

/**
 * PhoneStage — вертикальный вьюпорт Telegram Mini App.
 * Все живые демо рендерятся внутри этого фрейма: 9:41 статус-бар,
 * safe-area, home-indicator, кнопка replay для повторного прогона анимаций.
 */
export default function PhoneStage({
  children,
  height = 560,
  label,
  className,
}: {
  children: ReactNode;
  height?: number;
  label?: string;
  className?: string;
}) {
  const [run, setRun] = useState(0);

  return (
    <div className={cn("relative select-none", className)}>
      {/* replay */}
      <button
        onClick={() => setRun((r) => r + 1)}
        title="Прогнать анимацию заново"
        className="pressable absolute -top-3 -right-3 z-30 grid size-9 place-items-center rounded-full border border-line bg-panel text-ink/70 hover:text-acid hover:border-acid/50 transition-colors"
      >
        <RotateCcw className="size-4" />
      </button>

      <div
        className="relative mx-auto w-[318px] overflow-hidden rounded-[30px] border border-ink/15 bg-[#0a0a0e] shadow-[0_0_0_6px_rgba(242,240,232,0.03),0_24px_60px_-20px_rgba(0,0,0,0.9)]"
        style={{ height }}
      >
        {/* status bar / safe-area top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-3 text-[10px] font-mono text-ink/60">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="size-3" />
            <Wifi className="size-3" />
            <Battery className="size-3.5" />
          </div>
        </div>
        {/* capsule */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-4 w-24 -translate-x-1/2 rounded-full bg-black/70 border border-ink/10" />

        <div key={run} className="absolute inset-0">
          {children}
        </div>

        {/* home indicator */}
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-20 h-1 w-24 -translate-x-1/2 rounded-full bg-ink/25" />
        <div className="scanlines pointer-events-none absolute inset-0 z-10 rounded-[30px]" />
      </div>

      {label && (
        <div className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
          {label}
        </div>
      )}
    </div>
  );
}
