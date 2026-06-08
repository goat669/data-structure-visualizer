"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALGORITHMS, AlgorithmInfo, ArrayBar, SortStep } from "@/lib/algorithms/types";
import {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
} from "@/lib/algorithms/sorting";
import { linearSearchSteps, binarySearchSteps } from "@/lib/algorithms/searching";

import AlgoInfoPanel from "./AlgoInfoPanel";
import ArrayGenerator from "./ArrayGenerator";
import PlaybackControls from "./PlaybackControls";
import StatsPanel from "./StatsPanel";
import VisualizerBars from "./VisualizerBars";

// ms delay per step at each speed level
const SPEED_MAP: Record<number, number> = { 1: 600, 2: 300, 3: 150, 4: 60, 5: 15 };

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

function generateSortedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => Math.floor(5 + (i / (size - 1)) * 90));
}

function generateReversedArray(size: number): number[] {
  return generateSortedArray(size).reverse();
}

function runAlgo(algoId: string, array: number[], searchTarget: number): SortStep[] {
  switch (algoId) {
    case "bubble":    return bubbleSortSteps(array);
    case "selection": return selectionSortSteps(array);
    case "insertion": return insertionSortSteps(array);
    case "merge":     return mergeSortSteps(array);
    case "quick":     return quickSortSteps(array);
    case "linear":    return linearSearchSteps(array, searchTarget);
    case "binary":    return binarySearchSteps(array, searchTarget);
    default:          return bubbleSortSteps(array);
  }
}

interface VisualizerProps {
  algoId: string;
}

export default function Visualizer({ algoId }: VisualizerProps) {
  const algo = ALGORITHMS.find((a) => a.id === algoId)!;
  const isSearching = algo.category === "searching";

  const [mounted, setMounted] = useState(false);
  const [arraySize, setArraySize] = useState(20);
  const [baseArray, setBaseArray] = useState<number[]>([]);
  const [searchTarget, setSearchTarget] = useState<number>(0);

  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  // Recompute steps when algo or base array changes
  const recompute = useCallback(
    (arr: number[], target: number) => {
      stopPlayback();
      const target_ = target || (arr.length > 0 ? arr[Math.floor(arr.length / 2)] : 0);
      const s = runAlgo(algoId, arr, target_);
      setSteps(s);
      setCurrentStep(0);
    },
    [algoId]
  );

  // Initialize array only on the client to avoid SSR/client hydration mismatch
  useEffect(() => {
    const arr = generateRandomArray(20);
    const target = arr[Math.floor(arr.length / 2)] ?? 0;
    setBaseArray(arr);
    setSearchTarget(target);
    setMounted(true);
    const s = runAlgo(algoId, arr, target);
    setSteps(s);
    setCurrentStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompute when algo changes (after mount)
  useEffect(() => {
    if (!mounted || baseArray.length === 0) return;
    const target = baseArray[Math.floor(baseArray.length / 2)] ?? 0;
    setSearchTarget(target);
    recompute(baseArray, target);
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
    const target = searchTarget || arr[Math.floor(arr.length / 2)] || 0;
    recompute(arr, target);
  }

  function handleSizeChange(size: number) {
    setArraySize(size);
    const arr = generateRandomArray(size);
    applyNewArray(arr);
  }

  function handleSearchTargetChange(v: number) {
    setSearchTarget(v);
    recompute(baseArray, v);
  }

  // Cleanup on unmount
  useEffect(() => () => stopPlayback(), []);

  const currentData = steps[currentStep];
  const bars: ArrayBar[] = currentData?.array ?? baseArray.map((v) => ({ value: v, state: "default" as const }));
  const maxValue = Math.max(...bars.map((b) => b.value), 1);
  const isFinished = currentStep >= steps.length - 1;

  // Render a stable skeleton on the server / before hydration
  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-12 bg-card border border-border rounded-lg" />
        <div className="h-20 bg-card border border-border rounded-lg" />
        <div className="h-72 bg-card border border-border rounded-lg" />
        <div className="h-32 bg-card border border-border rounded-lg" />
        <div className="h-24 bg-card border border-border rounded-lg" />
        <div className="h-40 bg-card border border-border rounded-lg" />
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
          C++ Implementation
        </span>
      </div>

      {/* Info panel */}
      <div className="bg-card border border-border rounded-lg p-4">
        <AlgoInfoPanel algo={algo} />
      </div>

      {/* Visualizer canvas */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Visualization
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {bars.length} elements
          </span>
        </div>
        <div style={{ height: "280px" }}>
          <VisualizerBars bars={bars} maxValue={maxValue} showValues={bars.length <= 40} />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card border border-border rounded-lg p-4">
        <StatsPanel
          comparisons={currentData?.comparisons ?? 0}
          swaps={currentData?.swaps ?? 0}
          currentStep={currentStep}
          totalSteps={steps.length}
          description={currentData?.description ?? ""}
          isSearching={isSearching}
        />
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <PlaybackControls
          isPlaying={isPlaying}
          isFinished={isFinished}
          currentStep={currentStep}
          totalSteps={steps.length}
          speed={speed}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onStepForward={handleStepForward}
          onStepBack={handleStepBack}
          onSpeedChange={handleSpeedChange}
          onSliderChange={handleSliderChange}
        />
      </div>

      {/* Array generator */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Array Generator
          </span>
        </div>
        <ArrayGenerator
          arraySize={arraySize}
          onSizeChange={handleSizeChange}
          onNewRandom={() => {
            const arr = generateRandomArray(arraySize);
            applyNewArray(arr);
          }}
          onNewSorted={() => {
            const arr = generateSortedArray(arraySize);
            applyNewArray(arr);
          }}
          onNewReversed={() => {
            const arr = generateReversedArray(arraySize);
            applyNewArray(arr);
          }}
          onCustomArray={(arr) => {
            setArraySize(arr.length);
            applyNewArray(arr);
          }}
          isSearching={isSearching}
          searchTarget={searchTarget}
          onSearchTargetChange={handleSearchTargetChange}
        />
      </div>
    </div>
  );
}
