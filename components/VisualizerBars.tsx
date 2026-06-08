"use client";

import { ArrayBar } from "@/lib/algorithms/types";

interface VisualizerBarsProps {
  bars: ArrayBar[];
  maxValue: number;
  isPlaying?: boolean;
}

const STATE: Record<
  ArrayBar["state"],
  { bg: string; border: string; label: string; shadow?: string }
> = {
  default:   { bg: "#1c1c1c",   border: "#2e2e2e", label: "#404040"  },
  comparing: { bg: "#c8843acc", border: "#c8843a", label: "#c8843a"  },
  swapping:  { bg: "#e05252cc", border: "#e05252", label: "#e05252"  },
  sorted:    { bg: "#4ade80cc", border: "#4ade80", label: "#4ade80"  },
  pivot:     { bg: "#a855f7cc", border: "#a855f7", label: "#a855f7"  },
  found:     { bg: "#4ade80",   border: "#4ade80", label: "#4ade80", shadow: "0 0 12px #4ade8088" },
  searched:  { bg: "#141414",   border: "#1e1e1e", label: "#282828"  },
};

export default function VisualizerBars({ bars, maxValue, isPlaying = false }: VisualizerBarsProps) {
  const showLabels = bars.length <= 36;
  const showValues = bars.length <= 24;
  const gap = bars.length > 50 ? "1px" : bars.length > 30 ? "2px" : "3px";

  return (
    <div className="w-full h-full flex items-end" style={{ gap }}>
      {bars.map((bar, idx) => {
        const heightPct = Math.max(2, (bar.value / maxValue) * 100);
        const s = STATE[bar.state] || STATE.default;
        const isActive = bar.state !== "default" && bar.state !== "searched";

        return (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center justify-end"
            style={{ height: "100%" }}
          >
            {showLabels && (
              <span
                className="font-mono tabular-nums leading-none mb-[2px] transition-colors duration-100"
                style={{ fontSize: bars.length <= 16 ? "10px" : "8px", color: s.label }}
              >
                {showValues ? bar.value : ""}
              </span>
            )}
            <div
              className="w-full rounded-t-[2px] transition-all duration-[80ms]"
              style={{
                height: `${heightPct}%`,
                background: s.bg,
                borderTop: `1px solid ${s.border}`,
                boxShadow: s.shadow,
                opacity: isPlaying && !isActive ? 0.6 : 1,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
