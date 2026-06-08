"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LinkedListNode, LinkedListStep } from "@/lib/algorithms/types";
import { runLinkedListAlgo } from "@/lib/algorithms/linkedlist";
import PlaybackControls from "./PlaybackControls";
import StatsPanel from "./StatsPanel";

interface LinkedListVisualizerProps {
  algoId: string;
}

export default function LinkedListVisualizer({ algoId }: LinkedListVisualizerProps) {
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<number[]>([5, 12, 3, 8, 15]);
  const [position, setPosition] = useState(1);
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    recompute();
  }, [algoId]);

  const recompute = useCallback(() => {
    stopPlayback();
    const s = runLinkedListAlgo(algoId, values, position);
    setSteps(s);
    setCurrentStep(0);
  }, [algoId, values, position]);

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
    return <div className="animate-pulse space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-20 bg-card rounded-lg" />)}</div>;
  }

  const currentData = steps[currentStep];
  const nodes = currentData?.nodes ?? [];
  const isFinished = currentStep >= steps.length - 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Info Panel */}
      <div className="bg-card border border-border rounded-lg p-4">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Algorithm Info</span>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-foreground">{algoId === "ll-insert" && "Insert a node at a position"}</p>
          <p className="text-sm text-foreground">{algoId === "ll-delete" && "Delete a node at a position"}</p>
          <p className="text-sm text-foreground">{algoId === "ll-reverse" && "Reverse the entire linked list"}</p>
          <p className="text-sm text-foreground">{algoId === "ll-search" && "Search for a value in the list"}</p>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ height: "300px", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "20px" }}>
        <LinkedListCanvas nodes={nodes} />
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
        onPlayPause={handlePlayPause}
        onReset={() => { stopPlayback(); setCurrentStep(0); }}
        onStepBack={() => { stopPlayback(); setCurrentStep(Math.max(0, currentStep - 1)); }}
        onStepForward={() => { stopPlayback(); setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); }}
        currentStep={currentStep}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
        progress={(currentStep / Math.max(1, steps.length - 1)) * 100}
        onProgressChange={(pct) => setCurrentStep(Math.round((pct / 100) * (steps.length - 1)))}
      />

      {/* Input Panel */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Modify List</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={values.join(", ")}
            onChange={(e) => {
              const vals = e.target.value.split(",").map((v) => parseInt(v.trim())).filter((v) => !isNaN(v));
              setValues(vals.length > 0 ? vals : []);
            }}
            placeholder="5, 12, 3, 8, 15"
            className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm font-mono"
          />
          <button onClick={recompute} className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-mono">
            Run
          </button>
        </div>
      </div>
    </div>
  );
}

function LinkedListCanvas({ nodes }: { nodes: LinkedListNode[] }) {
  return (
    <div className="w-full h-full flex items-center gap-8 overflow-x-auto pb-4">
      {nodes.map((node, idx) => {
        const getColor = () => {
          if (node.state === "found") return "#4ade80";
          if (node.state === "current") return "#c8843a";
          if (node.state === "highlight") return "#a855f7";
          if (node.state === "deleted") return "#e05252";
          if (node.state === "inserted") return "#4ade80";
          if (node.state === "visited") return "#666";
          return "#1a1a1a";
        };

        return (
          <div key={idx} className="flex-shrink-0 flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 flex items-center justify-center rounded border-2 text-lg font-bold"
              style={{
                background: getColor(),
                borderColor: getColor(),
                color: node.state === "visited" ? "#888" : "#fff",
              }}
            >
              {node.value}
            </div>
            {idx < nodes.length - 1 && (
              <div className="text-lg text-muted-foreground">→</div>
            )}
            {idx === nodes.length - 1 && (
              <div className="text-sm text-muted-foreground">null</div>
            )}
          </div>
        );
      })}
      {nodes.length === 0 && (
        <div className="text-muted-foreground text-sm">Empty list</div>
      )}
    </div>
  );
}
