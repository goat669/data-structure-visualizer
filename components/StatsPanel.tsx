"use client";

interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  currentStep: number;
  totalSteps: number;
  description: string;
  isSearching?: boolean;
  isPlaying?: boolean;
  isFinished?: boolean;
}

const LEGEND_SORT = [
  { bg: "#1c1c1c",   border: "#2e2e2e", label: "Default"   },
  { bg: "#c8843acc", border: "#c8843a", label: "Comparing" },
  { bg: "#e05252cc", border: "#e05252", label: "Swapping"  },
  { bg: "#a855f7cc", border: "#a855f7", label: "Pivot"     },
  { bg: "#4ade80cc", border: "#4ade80", label: "Sorted"    },
];

const LEGEND_SEARCH = [
  { bg: "#1c1c1c",   border: "#2e2e2e", label: "Default"    },
  { bg: "#c8843acc", border: "#c8843a", label: "Checking"   },
  { bg: "#141414",   border: "#1e1e1e", label: "Eliminated" },
  { bg: "#a855f7cc", border: "#a855f7", label: "Mid Point"  },
  { bg: "#4ade80",   border: "#4ade80", label: "Found"      },
];

export default function StatsPanel({
  comparisons,
  swaps,
  currentStep,
  totalSteps,
  description,
  isSearching = false,
  isPlaying = false,
  isFinished = false,
}: StatsPanelProps) {
  const pct = totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 0;
  const legend = isSearching ? LEGEND_SEARCH : LEGEND_SORT;

  return (
    <div className="flex flex-col gap-3">
      {/* Stats row */}
      <div className="flex items-center gap-5 flex-wrap">
        <Stat label="Comparisons" value={comparisons} color="#c8843a" />
        {!isSearching && <Stat label="Swaps" value={swaps} color="#e05252" />}
        <Stat label="Step" value={`${currentStep} / ${Math.max(0, totalSteps - 1)}`} color="#555" />

        {/* Progress bar — right-aligned */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {isFinished && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}
            >
              Done
            </span>
          )}
          {isPlaying && !isFinished && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{ background: "rgba(200,132,58,0.12)", color: "#c8843a", border: "1px solid rgba(200,132,58,0.25)" }}
            >
              Running
            </span>
          )}
          <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: "#1e1e1e" }}>
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${pct}%`,
                background: isFinished ? "#4ade80" : "#4ade80cc",
              }}
            />
          </div>
          <span className="text-[10px] font-mono tabular-nums w-7 text-right" style={{ color: "#555" }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Step description */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded"
        style={{ background: "#111", border: "1px solid #1e1e1e", minHeight: "34px" }}
      >
        <span style={{ color: "#4ade8066", fontSize: "10px", fontFamily: "monospace" }}>{">"}</span>
        <p
          className="text-xs font-mono leading-relaxed truncate transition-all"
          style={{ color: isFinished ? "#4ade80" : "#a0a0a0" }}
        >
          {description || "Press play or step forward to start visualization"}
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {legend.map(({ bg, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: bg, border: `1px solid ${border}` }}
            />
            <span className="text-[10px] font-mono" style={{ color: "#555" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#404040" }}>
        {label}
      </span>
      <span className="text-xl font-mono font-bold tabular-nums leading-none" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
