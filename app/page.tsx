"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Visualizer from "@/components/Visualizer";

export default function HomePage() {
  const [selectedAlgo, setSelectedAlgo] = useState("bubble");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 md:static md:block md:z-auto
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
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
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-sidebar sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            aria-label="Open menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect y="3" width="16" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="7.25" width="16" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="11.5" width="16" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>
          <span className="text-sm font-mono font-bold text-foreground">DSA Visualizer</span>
        </div>

        <div className="p-5 max-w-5xl">
          <Visualizer key={selectedAlgo} algoId={selectedAlgo} />
        </div>
      </main>
    </div>
  );
}
