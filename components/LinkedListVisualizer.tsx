"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ALGORITHMS, SortStep } from "@/lib/algorithms/types";
import {
  singleLinkedListInsert,
  singleLinkedListDelete,
  singleLinkedListSearch,
  doublyLinkedListInsert,
  circularLinkedListInsert,
} from "@/lib/algorithms/linkedlist";
import AlgoInfoPanel from "./AlgoInfoPanel";
import PlaybackControls from "./PlaybackControls";
import StatsPanel from "./StatsPanel";
import VisualizerBars from "./VisualizerBars";

const SPEED_MAP: Record<number, number> = { 1: 600, 2: 300, 3: 150, 4: 60, 5: 15 };

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

interface LinkedListVisualizerProps {
  algoId: string;
}

export default function LinkedListVisualizer({ algoId }: LinkedListVisualizerProps) {
  const algo = ALGORITHMS.find((a) => a.id === algoId)!;

  const [mounted, setMounted] = useState(false);
  const [arraySize, setArraySize] = useState(7);
  const [baseArray, setBaseArray] = useState<number[]>([]);
  const [position, setPosition] = useState(0);
  const [searchTarget, setSearchTarget] = useState(0);

  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  // Run algorithm based on ID
  const runAlgo = useCallback((arr: number[], algoId: string, pos: number, target: number): SortStep[] => {
    if (algoId.includes("sll-insert")) return singleLinkedListInsert(arr, pos, target);
    if (algoId.includes("sll-delete")) return singleLinkedListDelete(arr, pos);
    if (algoId.includes("sll-find")) return singleLinkedListSearch(arr, target);
    if (algoId.includes("dll-insert")) return doublyLinkedListInsert(arr, pos, target);
    if (algoId.includes("cll-insert")) return circularLinkedListInsert(arr, pos, target);
    return singleLinkedListInsert(arr, pos, target);
  }, []);

  const recompute = useCallback(
    (arr: number[], pos: number, target: number) => {
      stopPlayback();
      const s = runAlgo(arr, algoId, pos, target);
      setSteps(s);
      setCurrentStep(0);
    },
    [algoId, runAlgo]
  );

  useEffect(() => {
    const arr = generateRandomArray(arraySize);
    const target = arr[Math.floor(arr.length / 2)] ?? 0;
    setBaseArray(arr);
    setSearchTarget(target);
    setPosition(Math.floor(arr.length / 2));
    setMounted(true);
    const s = runAlgo(arr, algoId, Math.floor(arr.length / 2), target);
    setSteps(s);
    setCurrentStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted || baseArray.length === 0) return;
    recompute(baseArray, position, searchTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId]);

  function stopPlayback() {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function startPlayback(fromStep: number, fromSteps: SortStep[], spd: number) {
    isPlayingRef.current = true;
    setIsPlaying(true);

    let step = fromStep;

    function tick() {
      if (!isPlayingRef.current) return;
      if (step >= fromSteps.length - 1) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentStep(fromSteps.length - 1);
        return;
      }
      step++;
      setCurrentStep(step);
      timerRef.current = setTimeout(tick, SPEED_MAP[spd]);
    }

    timerRef.current = setTimeout(tick, SPEED_MAP[spd]);
  }

  function handlePlay() {
    if (currentStep >= steps.length - 1) return;
    startPlayback(currentStep, steps, speed);
  }

  function handlePause() {
    stopPlayback();
  }

  function handleReset() {
    stopPlayback();
    setCurrentStep(0);
  }

  function handleStepForward() {
    stopPlayback();
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function handleStepBack() {
    stopPlayback();
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  function handleSpeedChange(v: number) {
    setSpeed(v);
    if (isPlaying) {
      stopPlayback();
      startPlayback(currentStep, steps, v);
    }
  }

  function handleSliderChange(step: number) {
    stopPlayback();
    setCurrentStep(step);
  }

  function applyNewArray(arr: number[]) {
    setBaseArray(arr);
    recompute(arr, position, searchTarget);
  }

  function handleSizeChange(size: number) {
    setArraySize(size);
    const arr = generateRandomArray(size);
    applyNewArray(arr);
  }

  function handlePositionChange(pos: number) {
    setPosition(pos);
    recompute(baseArray, pos, searchTarget);
  }

  function handleTargetChange(target: number) {
    setSearchTarget(target);
    recompute(baseArray, position, target);
  }

  useEffect(() => () => stopPlayback(), []);

  const currentData = steps[currentStep];
  const bars = currentData?.array ?? baseArray.map((v) => ({ value: v, state: "default" as const }));
  const maxValue = Math.max(...bars.map((b) => b.value), 1);
  const isFinished = currentStep >= steps.length - 1;

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-12 bg-card border border-border rounded-lg" />
        <div className="h-20 bg-card border border-border rounded-lg" />
        <div className="h-72 bg-card border border-border rounded-lg" />
        <div className="h-32 bg-card border border-border rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">{algo.name}</h1>
          <span className="text-[10px] font-mono text-muted-foreground capitalize">{algo.category}</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
          Linked List
        </span>
      </div>

      {/* Info panel */}
      <div className="bg-card border border-border rounded-lg p-4">
        <AlgoInfoPanel algo={algo} />
      </div>

      {/* Configuration */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Configuration
        </span>

        {/* Array size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-muted-foreground">List size</label>
            <span className="text-sm font-mono text-primary">{arraySize}</span>
          </div>
          <input
            type="range"
            min="3"
            max="15"
            value={arraySize}
            onChange={(e) => handleSizeChange(parseInt(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Position (for insert/delete) */}
        {(algoId.includes("insert") || algoId.includes("delete")) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-muted-foreground">Position</label>
              <span className="text-sm font-mono text-primary">{position}</span>
            </div>
            <input
              type="range"
              min="0"
              max={baseArray.length}
              value={position}
              onChange={(e) => handlePositionChange(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        )}

        {/* Search/Insert target */}
        {(algoId.includes("find") || algoId.includes("insert")) && (
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground block">
              {algoId.includes("find") ? "Search for" : "Insert value"}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={searchTarget}
              onChange={(e) => handleTargetChange(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono"
            />
          </div>
        )}

        {/* Run button */}
        <button
          onClick={() => recompute(baseArray, position, searchTarget)}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-mono hover:bg-primary/90 transition-colors"
        >
          Run Algorithm
        </button>
      </div>

      {/* Visualizer */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Visualization
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {bars.length} nodes
          </span>
        </div>
        <div
          style={{ height: "200px", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "12px 8px 8px" }}
        >
          <VisualizerBars bars={bars} maxValue={maxValue} isPlaying={isPlaying} />
        </div>
      </div>

      {/* Description */}
      {currentData && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground font-mono">{currentData.description}</p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-card border border-border rounded-lg p-4">
        <StatsPanel
          comparisons={currentData?.comparisons ?? 0}
          swaps={currentData?.swaps ?? 0}
          currentStep={currentStep}
          totalSteps={steps.length}
          description={currentData?.description || ""}
        />
      </div>

      {/* Playback controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        isFinished={isFinished}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepBack={handleStepBack}
        onStepForward={handleStepForward}
        currentStep={currentStep}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        onSliderChange={handleSliderChange}
      />
    </div>
  );
}
