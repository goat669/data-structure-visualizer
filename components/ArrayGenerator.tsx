"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
      setCustomError("Enter only numbers separated by spaces or commas");
      return;
    }
    if (nums.length < 2 || nums.length > 80) {
      setCustomError("Enter between 2 and 80 numbers");
      return;
    }
    onCustomArray(nums);
    setCustomInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Size slider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-16">
          Size: {arraySize}
        </span>
        <Slider
          min={5}
          max={80}
          step={1}
          value={[arraySize]}
          onValueChange={([v]) => onSizeChange(v)}
          className="flex-1"
        />
        <span className="text-[10px] font-mono text-muted-foreground w-5 shrink-0 text-right">80</span>
      </div>

      {/* Generate buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs font-mono border-border hover:border-primary/50 hover:text-primary"
          onClick={onNewRandom}
        >
          Random
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs font-mono border-border hover:border-primary/50 hover:text-primary"
          onClick={onNewSorted}
        >
          Sorted
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs font-mono border-border hover:border-primary/50 hover:text-primary"
          onClick={onNewReversed}
        >
          Reversed
        </Button>

        {/* Custom input */}
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
            className="flex-1 h-7 px-2.5 rounded-md bg-secondary border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <Button
            size="sm"
            className="h-7 text-xs font-mono px-3"
            onClick={handleCustomSubmit}
          >
            Use
          </Button>
        </div>
      </div>

      {customError && (
        <p className="text-[10px] font-mono text-destructive">{customError}</p>
      )}

      {/* Search target input */}
      {isSearching && onSearchTargetChange && (
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">Search target:</span>
          <input
            type="number"
            value={searchTarget ?? ""}
            onChange={(e) => onSearchTargetChange(Number(e.target.value))}
            className="w-20 h-7 px-2.5 rounded-md bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <span className="text-[10px] font-mono text-muted-foreground">(must exist in array for best results)</span>
        </div>
      )}
    </div>
  );
}
