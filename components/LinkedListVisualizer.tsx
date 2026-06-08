"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LinkedListNode, LinkedListStep } from "@/lib/algorithms/types";
import { runLinkedListAlgo, type LinkedListType } from "@/lib/algorithms/linkedlist";
import PlaybackControls from "./PlaybackControls";
import StatsPanel from "./StatsPanel";

interface LinkedListVisualizerProps {
  algoId: string;
}

export default function LinkedListVisualizer({ algoId }: LinkedListVisualizerProps) {
  const [mounted, setMounted] = useState(false);
  const [llType, setLLType] = useState<LinkedListType>("singly");
  const [values, setValues] = useState<number[]>([5, 12, 3, 8]);
  const [insertValue, setInsertValue] = useState(15);
  const [insertPosition, setInsertPosition] = useState(1);
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    recompute();
  }, [algoId, llType]);

  const recompute = useCallback(() => {
    stopPlayback();
    const s = runLinkedListAlgo(algoId, values, insertValue, insertPosition, llType);
    setSteps(s);
    setCurrentStep(0);
  }, [algoId, values, insertValue, insertPosition, llType]);

  const stopPlayback = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopPlayback();
    } else if (currentStep < steps.length - 1) {
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const delayMs = 800 / (speed || 1);
    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, speed, steps.length]);

  if (!mounted) {
    return <div className="animate-pulse space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-card rounded-lg" />)}</div>;
  }

  const currentData = steps[currentStep];
  const nodes = currentData?.nodes ?? [];
  const isFinished = currentStep >= steps.length - 1;
  const algoName = algoId === "ll-insert" ? "Insert" : algoId === "ll-delete" ? "Delete" : algoId === "ll-reverse" ? "Reverse" : "Search";

  return (
    <div className="flex flex-col gap-4">
      {/* Type Selector */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Linked List Type</span>
        <div className="flex gap-2">
          {(["singly", "doubly", "circular"] as LinkedListType[]).map((type) => (
            <button
              key={type}
              onClick={() => setLLType(type)}
              className={`px-3 py-2 rounded text-sm font-mono transition-all ${
                llType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border text-foreground hover:border-primary"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Operation</span>
        <p className="text-sm text-foreground">
          {algoId === "ll-insert" && "Insert a new node at a specified position in the list"}
          {algoId === "ll-search" && "Search for a value in the list"}
        </p>
        <p className="text-xs text-muted-foreground mt-2">Type: {llType === "singly" ? "Single direction only" : llType === "doubly" ? "Bidirectional pointers" : "Circular (loops back)"}</p>
      </div>

      {/* Canvas */}
      <div style={{ height: "280px", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "20px" }} className="overflow-x-auto">
        <LinkedListCanvas nodes={nodes} type={llType} />
      </div>

      {/* Stats */}
      <StatsPanel
        comparisons={0}
        swaps={0}
        currentStep={currentStep}
        totalSteps={steps.length}
        description={currentData?.description ?? ""}
        isSearching={false}
        isPlaying={isPlaying}
        isFinished={isFinished}
      />

      {/* Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        isFinished={isFinished}
        onPlay={() => setIsPlaying(true)}
        onPause={stopPlayback}
        onReset={() => {
          stopPlayback();
          setCurrentStep(0);
        }}
        onStepBack={() => {
          stopPlayback();
          setCurrentStep(Math.max(0, currentStep - 1));
        }}
        onStepForward={() => {
          stopPlayback();
          setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
        }}
        currentStep={currentStep}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
        onSliderChange={(step) => setCurrentStep(step)}
      />

      {/* Input Panel */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 max-h-80 overflow-y-auto">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Configure</span>
        <div className="space-y-2">
          {/* Array input */}
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">List values</label>
            <input
              type="text"
              value={values.join(", ")}
              onChange={(e) => {
                const vals = e.target.value.split(",").map((v) => parseInt(v.trim())).filter((v) => !isNaN(v));
                setValues(vals.length > 0 ? vals : []);
              }}
              placeholder="e.g., 5, 12, 3, 8"
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono"
            />
          </div>

          {/* Insert value */}
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Insert value</label>
            <input
              type="number"
              value={insertValue}
              onChange={(e) => setInsertValue(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono"
            />
          </div>

          {/* Insert position */}
          {algoId.includes("insert") && (
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1">
                Position (0 to {values.length}): {insertPosition}
              </label>
              <input
                type="range"
                min="0"
                max={values.length}
                value={insertPosition}
                onChange={(e) => setInsertPosition(parseInt(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          )}

          {/* Run button */}
          <button
            onClick={recompute}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-mono hover:bg-primary/90 transition-colors"
          >
            Run Algorithm
          </button>
        </div>
      </div>
    </div>
  );
}

function LinkedListCanvas({ nodes, type }: { nodes: LinkedListNode[]; type: LinkedListType }) {
  const getColor = (state: string) => {
    if (state === "found") return "#4ade80";
    if (state === "current") return "#c8843a";
    if (state === "highlight") return "#a855f7";
    if (state === "deleted") return "#e05252";
    if (state === "inserted") return "#4ade80";
    if (state === "visited") return "#666";
    return "#1a1a1a";
  };

  return (
    <div className="w-full h-full flex items-center gap-4 overflow-x-auto">
      {nodes.map((node, idx) => (
        <div key={idx} className="flex-shrink-0 flex flex-col items-center gap-2">
          {/* Node box */}
          <div
            className="w-14 h-14 flex items-center justify-center rounded border-2 text-sm font-bold transition-all"
            style={{
              background: getColor(node.state),
              borderColor: getColor(node.state),
              color: "#fff",
            }}
          >
            {node.value}
          </div>

          {/* Arrow or links */}
          <div className="text-xs text-muted-foreground">
            {type === "doubly" && idx < nodes.length - 1 && (
              <div className="text-center">⇄</div>
            )}
            {type === "singly" && idx < nodes.length - 1 && (
              <div className="text-center">→</div>
            )}
            {type === "circular" && idx === nodes.length - 1 && (
              <div className="text-center">↻</div>
            )}
          </div>
        </div>
      ))}

      {/* End marker */}
      {nodes.length > 0 && type === "singly" && (
        <div className="flex-shrink-0 text-sm text-muted-foreground font-mono">null</div>
      )}
      {nodes.length > 0 && type === "doubly" && (
        <div className="flex-shrink-0 text-sm text-muted-foreground font-mono">◀ null</div>
      )}
      {nodes.length === 0 && (
        <div className="text-muted-foreground text-sm">Empty list</div>
      )}
    </div>
  );
}
