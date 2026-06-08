"use client";

interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  currentStep: number;
  totalSteps: number;
  description: string;
  isSearching?: boolean;
}

export default function StatsPanel({
  comparisons,
  swaps,
  currentStep,
  totalSteps,
  description,
  isSearching = false,
}: StatsPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Stats row */}
      <div className="flex items-center gap-4 flex-wrap">
      <Stat label="Comparisons" value={comparisons} color="#c8843a" />
      {!isSearching && <Stat label="Swaps" value={swaps} color="#e05252" />}
      <Stat label="Step" value={`${currentStep} / ${totalSteps}`} color="#666" />
        <div className="ml-auto">
          <ProgressBar current={currentStep} total={totalSteps} />
        </div>
      </div>

      {/* Description */}
      <div className="h-7 flex items-center">
        <p className="text-xs font-mono text-primary leading-relaxed truncate">
          <span className="text-muted-foreground mr-2">&gt;</span>
          {description || "Press play to start visualization"}
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {!isSearching ? (
          <>
            <LegendItem bg="#1e1e1e" border="#333" label="Default" />
            <LegendItem bg="#c8843acc" border="#c8843a" label="Comparing" />
            <LegendItem bg="#e05252cc" border="#e05252" label="Swapping" />
            <LegendItem bg="#a855f7cc" border="#a855f7" label="Pivot" />
            <LegendItem bg="#4ade80cc" border="#4ade80" label="Sorted" />
          </>
        ) : (
          <>
            <LegendItem bg="#1e1e1e" border="#333" label="Default" />
            <LegendItem bg="#c8843acc" border="#c8843a" label="Checking" />
            <LegendItem bg="#1a1a1a" border="#2a2a2a" label="Eliminated" />
            <LegendItem bg="#a855f7cc" border="#a855f7" label="Mid Point" />
            <LegendItem bg="#4ade80" border="#4ade80" label="Found" />
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-lg font-mono font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / (total - 1)) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-7 tabular-nums">{pct}%</span>
    </div>
  );
}

function LegendItem({ bg, border, label }: { bg: string; border: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-3 h-3 rounded-sm"
        style={{ background: bg, border: `1px solid ${border}` }}
      />
      <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
    </div>
  );
}
