"use client";

import { useState } from "react";
import { ALGORITHMS } from "@/lib/algorithms/types";
import Sidebar from "@/components/Sidebar";
import Visualizer from "@/components/Visualizer";
import GraphVisualizer from "@/components/GraphVisualizer";
import LinkedListVisualizer from "@/components/LinkedListVisualizer";
import TreeVisualizer from "@/components/TreeVisualizer";
import StackQueueVisualizer from "@/components/StackQueueVisualizer";
import VectorVisualizer from "@/components/VectorVisualizer";

function VisualizerRouter({ algoId }: { algoId: string }) {
  const algo = ALGORITHMS.find((a) => a.id === algoId);
  if (!algo) return null;

  if (algo.category === "graph") {
    return <GraphVisualizer key={algoId} algoId={algoId} />;
  }
  if (algo.category === "linked-list") {
    // Extract type and operation from algoId: "sll-insert" -> ("singly", "insert")
    const parts = algoId.split("-");
    const typeMap: Record<string, "singly" | "doubly" | "circular"> = {
      sll: "singly",
      dll: "doubly",
      cll: "circular",
    };
    const type = typeMap[parts[0]] || "singly";
    const operation = (parts[1] || "insert") as "insert" | "delete" | "search" | "reverse";
    return <LinkedListVisualizer key={algoId} llType={type} operation={operation} />;
  }
  if (algo.category === "tree" || algo.category === "bst") {
    return <TreeVisualizer key={algoId} algoId={algoId} />;
  }
  if (algo.category === "stack" || algo.category === "queue") {
    return <StackQueueVisualizer key={algoId} algoId={algoId} />;
  }
  if (algo.category === "vector") {
    return <VectorVisualizer key={algoId} algoId={algoId} />;
  }
  // sorting + searching
  return <Visualizer key={algoId} algoId={algoId} />;
}

export default function HomePage() {
  const [selectedAlgo, setSelectedAlgo] = useState("bubble");
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-30",
          "md:static md:block md:z-auto",
          "transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <Sidebar
          selectedAlgo={selectedAlgo}
          onSelect={(id) => {
            setSelectedAlgo(id);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0 flex flex-col bg-gradient-to-br from-background via-background to-slate-900">
        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-4 border-b border-border sticky top-0 z-10 backdrop-blur-sm"
          style={{ background: "oklch(0.10 0 0 / 90%)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-primary/10 active:scale-95"
              aria-label="Open algorithm menu"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden className="text-primary">
                <rect y="2.5"  width="16" height="1.5" rx="0.75" />
                <rect y="7.25" width="16" height="1.5" rx="0.75" />
                <rect y="12"   width="12" height="1.5" rx="0.75" />
              </svg>
            </button>
            <div>
              <span className="text-lg font-bold text-foreground">DSA Visualizer</span>
              <p className="text-xs text-muted-foreground">Interactive Learning</p>
            </div>
          </div>
        </header>

        {/* Visualizer card */}
        <div className="flex-1 p-4 md:p-8 py-6 md:py-8">
          <div className="w-full max-w-5xl mx-auto">
            {/* Header section */}
            <div className="mb-6 md:hidden">
              <h1 className="text-2xl font-bold text-foreground mb-1">Algorithm Visualizer</h1>
              <p className="text-sm text-muted-foreground">Step through algorithms and understand how they work</p>
            </div>
            
            {/* Main visualizer with enhanced styling */}
            <div
              className="rounded-xl overflow-hidden backdrop-blur-sm border border-border/50 shadow-xl hover:border-border transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, oklch(0.12 0 0) 0%, oklch(0.14 0 0) 100%)"
              }}
            >
              <div className="p-6 md:p-8">
                <VisualizerRouter algoId={selectedAlgo} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
