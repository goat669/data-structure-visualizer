"use client";

import { ALGORITHMS, AlgorithmInfo } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  selectedAlgo: string;
  onSelect: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  sorting: "Sorting",
  searching: "Searching",
};

const categoryGroups = ALGORITHMS.reduce<Record<string, AlgorithmInfo[]>>((acc, algo) => {
  if (!acc[algo.category]) acc[algo.category] = [];
  acc[algo.category].push(algo);
  return acc;
}, {});

export default function Sidebar({ selectedAlgo, onSelect }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 bg-sidebar border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary-foreground">
              <rect x="1" y="7" width="2" height="6" fill="currentColor" rx="1"/>
              <rect x="4" y="4" width="2" height="9" fill="currentColor" rx="1"/>
              <rect x="7" y="2" width="2" height="11" fill="currentColor" rx="1"/>
              <rect x="10" y="5" width="2" height="8" fill="currentColor" rx="1"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-mono font-bold text-foreground leading-tight">DSA</p>
            <p className="text-[10px] text-muted-foreground font-mono leading-tight">Visualizer</p>
          </div>
        </div>
      </div>

      {/* Algorithm list */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {Object.entries(categoryGroups).map(([category, algos]) => (
          <div key={category} className="mb-5">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
              {categoryLabels[category]}
            </p>
            <ul className="space-y-0.5">
              {algos.map((algo) => (
                <li key={algo.id}>
                  <button
                    onClick={() => onSelect(algo.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-md text-sm font-mono transition-all",
                      "flex items-center justify-between group",
                      selectedAlgo === algo.id
                        ? "bg-neon-dim text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <span>{algo.name}</span>
                    {selectedAlgo === algo.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
          Visualize algorithms<br />step by step in C++ style
        </p>
      </div>
    </aside>
  );
}
