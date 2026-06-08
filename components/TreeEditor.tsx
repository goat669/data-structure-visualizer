"use client";

import { useState } from "react";

interface TreeEditorProps {
  nodeCount: number;
  onNodeCountChange: (count: number) => void;
  onRunAlgorithm: () => void;
}

export default function TreeEditor({
  nodeCount,
  onNodeCountChange,
  onRunAlgorithm,
}: TreeEditorProps) {
  const [customValues, setCustomValues] = useState(false);
  const [values, setValues] = useState("1,2,3,4,5,6,7");

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        Tree Configuration
      </span>

      {/* Preset size or custom */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCustomValues(false)}
            className={`flex-1 px-3 py-2 rounded text-sm font-mono transition-all ${
              !customValues
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border text-foreground hover:border-primary"
            }`}
          >
            Preset Size
          </button>
          <button
            onClick={() => setCustomValues(true)}
            className={`flex-1 px-3 py-2 rounded text-sm font-mono transition-all ${
              customValues
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border text-foreground hover:border-primary"
            }`}
          >
            Custom Values
          </button>
        </div>
      </div>

      {/* Preset size slider */}
      {!customValues && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-muted-foreground">
              Number of nodes
            </label>
            <span className="text-sm font-mono text-primary">{nodeCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="9"
            value={nodeCount}
            onChange={(e) => onNodeCountChange(parseInt(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      )}

      {/* Custom values input */}
      {customValues && (
        <div className="space-y-2">
          <label className="text-xs font-mono text-muted-foreground block">
            Node values (comma-separated)
          </label>
          <input
            type="text"
            value={values}
            onChange={(e) => setValues(e.target.value)}
            placeholder="1, 2, 3, 4, 5"
            className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Will create tree with {values.split(",").filter(v => v.trim()).length} nodes
          </p>
        </div>
      )}

      {/* Run button */}
      <button
        onClick={onRunAlgorithm}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-mono hover:bg-primary/90 transition-colors"
      >
        Run Algorithm
      </button>
    </div>
  );
}
