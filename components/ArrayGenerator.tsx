"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface ArrayGeneratorProps {
  arraySize: number;
  onSizeChange: (size: number) => void;
  onNewRandom: () => void;
  onNewSorted: () => void;
  onNewReversed: () => void;
  onCustomArray: (arr: number[]) => void;
  isSearching?: boolean;
  searchTarget?: number;
  onSearchTargetChange?: (v: number) => void;
}

export default function ArrayGenerator({
  arraySize,
  onSizeChange,
  onNewRandom,
  onNewSorted,
  onNewReversed,
  onCustomArray,
  isSearching = false,
  searchTarget,
  onSearchTargetChange,
}: ArrayGeneratorProps) {
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState("");

  function handleCustomSubmit() {
    setCustomError("");
    const nums = customInput
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    if (nums.some(isNaN)) {
      setCustomError("Enter only numbers separated by spaces or commas.");
      return;
    }
    if (nums.length < 2 || nums.length > 80) {
      setCustomError("Enter between 2 and 80 numbers.");
      return;
    }
    onCustomArray(nums);
    setCustomInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        Array Generator
      </span>

      {/* Size slider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono shrink-0 w-16 tabular-nums" style={{ color: "#555" }}>
          Size: <span className="text-foreground font-bold">{arraySize}</span>
        </span>
        <Slider
          min={5}
          max={80}
          step={1}
          value={[arraySize]}
          onValueChange={([v]) => onSizeChange(v)}
          className="flex-1"
          aria-label="Array size"
        />
        <span className="text-[10px] font-mono w-5 shrink-0 text-right" style={{ color: "#444" }}>80</span>
      </div>

      {/* Preset buttons + custom input */}
      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            { label: "Random",   onClick: onNewRandom   },
            { label: "Sorted",   onClick: onNewSorted   },
            { label: "Reversed", onClick: onNewReversed },
          ] as const
        ).map(({ label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="h-7 px-3 rounded text-[11px] font-mono transition-all"
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,222,128,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#888";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
            }}
          >
            {label}
          </button>
        ))}

        {/* Custom array input */}
        <div className="flex items-center gap-1.5 flex-1 min-w-52">
          <input
            type="text"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              setCustomError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
            placeholder="e.g. 5, 3, 8, 1, 4"
            className="flex-1 h-7 px-2.5 rounded text-[11px] font-mono focus:outline-none"
            style={{
              background: "#111",
              border: "1px solid #222",
              color: "#ccc",
            }}
            aria-label="Custom array values"
          />
          <button
            onClick={handleCustomSubmit}
            className="h-7 px-3 rounded text-[11px] font-mono transition-all shrink-0"
            style={{
              background: "rgba(74,222,128,0.12)",
              border: "1px solid rgba(74,222,128,0.3)",
              color: "#4ade80",
            }}
          >
            Use
          </button>
        </div>
      </div>

      {customError && (
        <p className="text-[10px] font-mono" style={{ color: "#e05252" }}>{customError}</p>
      )}

      {/* Search target */}
      {isSearching && onSearchTargetChange && (
        <div className="flex items-center gap-3 pt-2 border-t border-border flex-wrap">
          <span className="text-[10px] font-mono shrink-0" style={{ color: "#555" }}>
            Search target
          </span>
          <input
            type="number"
            value={searchTarget ?? ""}
            onChange={(e) => onSearchTargetChange(Number(e.target.value))}
            className="w-20 h-7 px-2.5 rounded text-[11px] font-mono focus:outline-none"
            style={{
              background: "#111",
              border: "1px solid #222",
              color: "#ccc",
            }}
            aria-label="Search target value"
          />
          <span className="text-[10px] font-mono" style={{ color: "#404040" }}>
            For binary search, use a value that exists in the array.
          </span>
        </div>
      )}
    </div>
  );
}
