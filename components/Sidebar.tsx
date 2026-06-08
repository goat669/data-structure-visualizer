"use client";

import { useState } from "react";
import { ALGORITHMS, AlgorithmCategory, AlgorithmInfo } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedAlgo: string;
  onSelect: (id: string) => void;
}

// ─── Category metadata ────────────────────────────────────────────────────────

const CATEGORIES: { id: AlgorithmCategory; label: string; color: string; icon: string }[] = [
  { id: "sorting",     label: "Sorting",     color: "#c8843a", icon: "sort"   },
  { id: "searching",   label: "Searching",   color: "#60a5fa", icon: "search" },
  { id: "graph",       label: "Graph",       color: "#a855f7", icon: "graph"  },
  { id: "linked-list", label: "Linked List", color: "#ec4899", icon: "link"   },
  { id: "stack",       label: "Stack",       color: "#4ade80", icon: "stack"  },
  { id: "queue",       label: "Queue",       color: "#06b6d4", icon: "queue"  },
  { id: "tree",        label: "Tree",        color: "#f59e0b", icon: "tree"   },
  { id: "binary-tree", label: "Binary Tree", color: "#8b5cf6", icon: "bst"    },
  { id: "vector",      label: "Vector",      color: "#14b8a6", icon: "vector" },
];

function complexityColor(worst: string): string {
  if (["O(1)", "O(log n)", "O(n log n)", "O(V+E)", "O((V+E) log V)"].includes(worst)) return "#4ade80";
  if (worst === "O(n)") return "#60a5fa";
  return "#e05252";
}

// ─── Category icon ─────────────────────────────────────────────────────────────

function CategoryIcon({ type, color }: { type: string; color: string }) {
  if (type === "sort") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="0" y="8" width="4"  height="3" rx="0.5" fill={color} opacity="0.8" />
      <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill={color} opacity="0.9" />
      <rect x="8" y="2" width="4"  height="9" rx="0.5" fill={color} />
    </svg>
  );
  if (type === "search") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="5" cy="5" r="3.5" stroke={color} strokeWidth="1.5" />
      <line x1="7.8" y1="7.8" x2="11" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  if (type === "graph") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="2"  cy="6"  r="1.5" fill={color} />
      <circle cx="10" cy="2"  r="1.5" fill={color} />
      <circle cx="10" cy="10" r="1.5" fill={color} />
      <circle cx="6"  cy="6"  r="1.5" fill={color} opacity="0.7" />
      <line x1="3.5" y1="6"  x2="4.5" y2="6"  stroke={color} strokeWidth="1" opacity="0.8" />
      <line x1="7.5" y1="6"  x2="8.5" y2="3"  stroke={color} strokeWidth="1" opacity="0.8" />
      <line x1="7.5" y1="6"  x2="8.5" y2="9"  stroke={color} strokeWidth="1" opacity="0.8" />
      <line x1="3.5" y1="5.5" x2="8.5" y2="2.5" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  );
  if (type === "link") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="3" cy="3" r="1.5" fill={color} />
      <circle cx="9" cy="3" r="1.5" fill={color} />
      <circle cx="6" cy="9" r="1.5" fill={color} />
      <line x1="4.2" y1="3.8" x2="4.8" y2="8.2" stroke={color} strokeWidth="1" opacity="0.8" />
      <line x1="7.8" y1="3.8" x2="7.2" y2="8.2" stroke={color} strokeWidth="1" opacity="0.8" />
    </svg>
  );
  if (type === "stack") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="1" y="1.5" width="10" height="2.5" rx="0.8" fill={color} />
      <rect x="1" y="5"   width="10" height="2.5" rx="0.8" fill={color} opacity="0.7" />
      <rect x="1" y="8.5" width="10" height="2.5" rx="0.8" fill={color} opacity="0.4" />
    </svg>
  );
  if (type === "queue") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="1.5" y="1" width="2.5" height="10" rx="0.8" fill={color} />
      <rect x="5"   y="1" width="2.5" height="10" rx="0.8" fill={color} opacity="0.7" />
      <rect x="8.5" y="1" width="2.5" height="10" rx="0.8" fill={color} opacity="0.4" />
    </svg>
  );
  if (type === "tree") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="1.5" r="1" fill={color} />
      <circle cx="2.5" cy="6" r="1" fill={color} opacity="0.8" />
      <circle cx="9.5" cy="6" r="1" fill={color} opacity="0.8" />
      <circle cx="6" cy="10.5" r="0.8" fill={color} opacity="0.6" />
      <line x1="6" y1="2.5" x2="2.5" y2="5" stroke={color} strokeWidth="1" opacity="0.7" />
      <line x1="6" y1="2.5" x2="9.5" y2="5" stroke={color} strokeWidth="1" opacity="0.7" />
      <line x1="6" y1="7" x2="6" y2="9.7" stroke={color} strokeWidth="1" opacity="0.7" />
    </svg>
  );
  if (type === "bst") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="2" r="1" fill={color} />
      <circle cx="3" cy="6" r="0.9" fill={color} opacity="0.9" />
      <circle cx="9" cy="6" r="0.9" fill={color} opacity="0.9" />
      <circle cx="1.5" cy="10" r="0.7" fill={color} opacity="0.7" />
      <circle cx="4.5" cy="10" r="0.7" fill={color} opacity="0.7" />
      <circle cx="7.5" cy="10" r="0.7" fill={color} opacity="0.7" />
      <circle cx="10.5" cy="10" r="0.7" fill={color} opacity="0.7" />
      <line x1="5.7" y1="2.8" x2="3.3" y2="5.2" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="6.3" y1="2.8" x2="8.7" y2="5.2" stroke={color} strokeWidth="1" opacity="0.6" />
    </svg>
  );
  if (type === "vector") return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="1" y="2" width="2" height="8" rx="0.4" fill={color} />
      <rect x="4.5" y="1" width="2" height="9" rx="0.4" fill={color} opacity="0.8" />
      <rect x="8" y="3" width="2" height="7" rx="0.4" fill={color} opacity="0.6" />
    </svg>
  );
  // fallback
  return <div className="w-3 h-3 rounded bg-current opacity-50" />;
}

// ─── Group by category ────────────────────────────────────────────────────────

const GROUPS = CATEGORIES.reduce<Record<string, AlgorithmInfo[]>>((acc, cat) => {
  acc[cat.id] = ALGORITHMS.filter((a) => a.category === cat.id);
  return acc;
}, {});

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({ selectedAlgo, onSelect }: SidebarProps) {
  const selectedAlgoObj = ALGORITHMS.find((a) => a.id === selectedAlgo);
  const defaultOpen = selectedAlgoObj?.category ?? "sorting";
  const [openCategory, setOpenCategory] = useState<string>(defaultOpen);

  function toggleCategory(id: string) {
    setOpenCategory((prev) => (prev === id ? "" : id));
  }

  return (
    <aside className="w-60 shrink-0 bg-sidebar border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ background: "oklch(0.72 0.20 142 / 18%)", border: "1px solid oklch(0.72 0.20 142 / 30%)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <rect x="1"   y="8"  width="2.5" height="5"  rx="0.6" fill="#4ade80" opacity="0.6" />
            <rect x="4.5" y="5"  width="2.5" height="8"  rx="0.6" fill="#4ade80" opacity="0.8" />
            <rect x="8"   y="2"  width="2.5" height="11" rx="0.6" fill="#4ade80" />
            <rect x="11.5" y="6" width="1"   height="7"  rx="0.4" fill="#4ade80" opacity="0.4" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-mono font-bold text-foreground leading-none tracking-tight">DSA Visualizer</p>
          <p className="text-[10px] text-muted-foreground font-mono leading-none mt-0.5">C++ Algorithms</p>
        </div>
      </div>

      {/* Algorithm list */}
      <nav className="flex-1 overflow-y-auto py-2 px-2" aria-label="Algorithm selection">
        {CATEGORIES.map((cat) => {
          const algos    = GROUPS[cat.id] ?? [];
          const isOpen   = openCategory === cat.id;
          const hasSelected = algos.some((a) => a.id === selectedAlgo);

          return (
            <div key={cat.id} className="mb-1">
              {/* Category header / toggle */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-left transition-colors hover:bg-secondary"
                aria-expanded={isOpen}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                  style={{
                    background: `${cat.color}18`,
                    border: `1px solid ${cat.color}35`,
                  }}
                >
                  <CategoryIcon type={cat.icon} color={cat.color} />
                </div>
                <span
                  className="flex-1 text-[12px] font-mono font-semibold"
                  style={{ color: hasSelected ? cat.color : "#aaa" }}
                >
                  {cat.label}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/40 tabular-nums">{algos.length}</span>
                <svg
                  width="10" height="10" viewBox="0 0 10 10"
                  className="transition-transform duration-200 shrink-0"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#555" }}
                  fill="currentColor" aria-hidden
                >
                  <path d="M1 3 L5 7 L9 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </button>

              {/* Algorithm list */}
              {isOpen && (
                <ul className="mt-0.5 space-y-0.5 pl-3 pr-1">
                  {algos.map((algo) => {
                    const isSelected = selectedAlgo === algo.id;
                    const dot = complexityColor(algo.timeComplexity.worst);
                    return (
                      <li key={algo.id}>
                        <button
                          onClick={() => onSelect(algo.id)}
                          className={cn(
                            "w-full text-left px-2.5 py-1.5 rounded text-[12px] font-mono transition-all",
                            "flex items-center justify-between gap-2 group",
                            isSelected
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                          )}
                          style={
                            isSelected
                              ? {
                                  background: `${cat.color}14`,
                                  border: `1px solid ${cat.color}28`,
                                  color: cat.color,
                                }
                              : {}
                          }
                          aria-current={isSelected ? "page" : undefined}
                        >
                          <span className="truncate">{algo.name}</span>
                          <span
                            className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded-sm tabular-nums"
                            style={{
                              color:      dot,
                              background: `${dot}18`,
                              border:     `1px solid ${dot}35`,
                            }}
                          >
                            {algo.timeComplexity.worst}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-[10px] font-mono text-muted-foreground">Step-by-step visualization</p>
        </div>
      </div>
    </aside>
  );
}
