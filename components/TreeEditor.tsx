"use client";

import { useState } from "react";

interface TreeEditorProps {
  onRunAlgorithm: (customValues: number[]) => void;
}

export default function TreeEditor({
  onRunAlgorithm,
}: TreeEditorProps) {
  const [mode, setMode] = useState<"random" | "custom">("random");
  const [values, setValues] = useState("1,2,3,4,5,6,7");
  const [nodeCount, setNodeCount] = useState(7);
  const [error, setError] = useState("");

  const handleRun = () => {
    setError("");
    
    if (mode === "random") {
      if (nodeCount < 1 || nodeCount > 31) {
        setError("Node count must be between 1 and 31");
        return;
      }
      const randomValues = Array.from({ length: nodeCount }, () => 
        Math.floor(Math.random() * 100) + 1
      );
      onRunAlgorithm(randomValues);
    } else {
      const nums = values
        .split(",")
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v));
      
      if (nums.length === 0) {
        setError("Please enter at least one valid number");
        return;
      }
      if (nums.length > 31) {
        setError("Maximum 31 nodes allowed");
        return;
      }
      onRunAlgorithm(nums);
    }
  };

  return (
    <div className="bg-gradient-to-r from-card to-card/50 border border-border/50 rounded-xl p-5 space-y-4 shadow-lg">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        Tree Builder
      </span>

      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("random")}
          className={`flex-1 px-3 py-2 text-xs font-mono rounded transition-all ${
            mode === "random"
              ? "bg-primary text-primary-foreground"
              : "bg-background border border-border text-foreground hover:border-primary/50"
          }`}
        >
          Random Tree
        </button>
        <button
          onClick={() => setMode("custom")}
          className={`flex-1 px-3 py-2 text-xs font-mono rounded transition-all ${
            mode === "custom"
              ? "bg-primary text-primary-foreground"
              : "bg-background border border-border text-foreground hover:border-primary/50"
          }`}
        >
          Custom Values
        </button>
      </div>

      {/* Random Mode */}
      {mode === "random" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-2">
              Number of Nodes: {nodeCount}
            </label>
            <input
              type="range"
              min="1"
              max="31"
              value={nodeCount}
              onChange={(e) => setNodeCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1 flex justify-between">
              <span>Min: 1</span>
              <span>Max: 31</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Mode */}
      {mode === "custom" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-2">
              Enter node values (comma-separated)
            </label>
            <input
              type="text"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              placeholder="1, 2, 3, 4, 5, 6, 7"
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono focus:border-primary focus:outline-none transition-colors"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {values.split(",").filter(v => v.trim()).length} node(s) - Max 31 nodes
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded border border-destructive/30">
          {error}
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={handleRun}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-mono font-semibold hover:bg-primary/90 active:scale-95 transition-all"
      >
        Build & Run
      </button>
    </div>
  );
}
