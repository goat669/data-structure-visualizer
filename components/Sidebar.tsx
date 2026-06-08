"use client";

import { ALGORITHMS, AlgorithmInfo } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedAlgo: string;
  onSelect: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  sorting:   "Sorting",
  searching: "Searching",
};

// Group algorithms by category preserving insertion order
const CATEGORY_GROUPS = ALGORITHMS.reduce<Record<string, AlgorithmInfo[]>>((acc, algo) => {
  if (!acc[algo.category]) acc[algo.category] = [];
  acc[algo.category].push(algo);
  return acc;
}, {});

// Complexity badge colours per worst-case string
function complexityDot(worst: string): string {
  if (worst === "O(1)" || worst === "O(log n)" || worst === "O(n log n)") return "#4ade80";
  if (worst === "O(n)")  return "#60a5fa";
  return "#e05252"; // O(n²)
}

export default function Sidebar({ selectedAlgo, onSelect }: SidebarProps) {
  return (
    <aside className="w-58 shrink-0 bg-sidebar border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ background: "oklch(0.72 0.20 142 / 20%)", border: "1px solid oklch(0.72 0.20 142 / 35%)" }}
        >
          {/* Bar chart icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <rect x="1"  y="8"  width="2.5" height="5" rx="0.6" fill="#4ade80" opacity="0.7"/>
            <rect x="4.5" y="5" width="2.5" height="8" rx="0.6" fill="#4ade80" opacity="0.85"/>
            <rect x="8"  y="2"  width="2.5" height="11" rx="0.6" fill="#4ade80"/>
            <rect x="11.5" y="6" width="1" height="7" rx="0.4" fill="#4ade80" opacity="0.5"/>
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-mono font-bold text-foreground leading-none tracking-tight">DSA Visualizer</p>
          <p className="text-[10px] text-muted-foreground font-mono leading-none mt-0.5">C++ Algorithms</p>
        </div>
      </div>

      {/* Algorithm list */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5" aria-label="Algorithm selection">
        {Object.entries(CATEGORY_GROUPS).map(([category, algos]) => (
          <div key={category} className="mb-5 last:mb-0">
            <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.14em] text-muted-foreground/60 px-2 mb-1.5">
              {CATEGORY_LABELS[category]}
            </p>
            <ul className="space-y-0.5">
              {algos.map((algo) => {
                const isSelected = selectedAlgo === algo.id;
                const dot = complexityDot(algo.timeComplexity.worst);
                return (
                  <li key={algo.id}>
                    <button
                      onClick={() => onSelect(algo.id)}
                      className={cn(
                        "w-full text-left px-2.5 py-2 rounded text-[12px] font-mono transition-all",
                        "flex items-center justify-between group gap-2",
                        isSelected
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                      style={
                        isSelected
                          ? {
                              background: "oklch(0.72 0.20 142 / 14%)",
                              border: "1px solid oklch(0.72 0.20 142 / 28%)",
                            }
                          : {}
                      }
                      aria-current={isSelected ? "page" : undefined}
                    >
                      <span className="truncate">{algo.name}</span>
                      {/* Worst-case complexity dot */}
                      <span
                        className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded-sm tabular-nums"
                        style={{
                          color:      dot,
                          background: `${dot}20`,
                          border:     `1px solid ${dot}40`,
                        }}
                      >
                        {algo.timeComplexity.worst}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-[10px] font-mono text-muted-foreground">
            Step-by-step visualization
          </p>
        </div>
      </div>
    </aside>
  );
}
