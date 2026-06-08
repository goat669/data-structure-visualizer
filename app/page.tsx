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
  if (algo.category === "tree" || algo.category === "binary-tree") {
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
      <main className="flex-1 overflow-y-auto min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 z-10"
          style={{ background: "oklch(0.115 0 0)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded transition-colors hover:bg-secondary"
            aria-label="Open algorithm menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <rect y="2.5"  width="16" height="1.5" rx="0.75" />
              <rect y="7.25" width="16" height="1.5" rx="0.75" />
              <rect y="12"   width="12" height="1.5" rx="0.75" />
            </svg>
          </button>
          <span className="text-sm font-mono font-bold text-foreground">DSA Visualizer</span>
        </header>

        {/* Visualizer card */}
        <div className="flex-1 p-4 md:p-6">
          <div
            className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden"
            style={{ border: "1px solid oklch(1 0 0 / 7%)" }}
          >
            <div className="p-5">
              <VisualizerRouter algoId={selectedAlgo} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
