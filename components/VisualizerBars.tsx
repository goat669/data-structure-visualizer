"use client";

import { ArrayBar } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

interface VisualizerBarsProps {
  bars: ArrayBar[];
  maxValue: number;
  showValues?: boolean;
}

// Hard-coded colors so Tailwind tree-shaking & oklch opacity issues don't apply
const STATE_STYLES: Record<ArrayBar["state"], { bg: string; border: string; label: string; shadow?: string }> = {
  default:   { bg: "#1e1e1e",         border: "#333",    label: "#666" },
  comparing: { bg: "#c8843acc",       border: "#c8843a", label: "#c8843a" },
  swapping:  { bg: "#e05252cc",       border: "#e05252", label: "#e05252" },
  sorted:    { bg: "#4ade80cc",       border: "#4ade80", label: "#4ade80" },
  pivot:     { bg: "#a855f7cc",       border: "#a855f7", label: "#a855f7" },
  found:     { bg: "#4ade80",         border: "#4ade80", label: "#4ade80", shadow: "0 0 14px #4ade80aa" },
  searched:  { bg: "#1a1a1a",         border: "#2a2a2a", label: "#333" },
};

export default function VisualizerBars({ bars, maxValue, showValues = true }: VisualizerBarsProps) {
  const showLabels = bars.length <= 40;

  return (
    <div className="w-full h-full flex items-end gap-0.5 px-1">
      {bars.map((bar, idx) => {
        const heightPct = Math.max(2, (bar.value / maxValue) * 100);
        const s = STATE_STYLES[bar.state];
        return (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center justify-end gap-0.5"
            style={{ height: "100%" }}
          >
            {/* Value label on top */}
            {showLabels && showValues && (
              <span
                className="text-[9px] font-mono leading-none tabular-nums transition-colors"
                style={{ color: s.label }}
              >
                {bar.value}
              </span>
            )}
            {/* Bar */}
            <div
              className="w-full rounded-t-sm transition-all duration-100"
              style={{
                height: `${heightPct}%`,
                background: s.bg,
                borderTop: `1px solid ${s.border}`,
                boxShadow: s.shadow,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
