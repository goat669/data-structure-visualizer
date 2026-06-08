"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SortStep } from "@/lib/algorithms/types";
import { runVectorAlgo } from "@/lib/algorithms/vector";
import PlaybackControls from "./PlaybackControls";
import StatsPanel from "./StatsPanel";

interface VectorVisualizerProps {
  algoId: string;
}

export default function VectorVisualizer({ algoId }: VectorVisualizerProps) {
  const [mounted, setMounted] = useState(false);
  const [operation, setOperation] = useState<"insert" | "delete">("insert");
  const [values, setValues] = useState<number[]>([10, 20, 30, 40, 50]);
  const [position, setPosition] = useState(2);
  const [value, setValue] = useState(99);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const recompute = useCallback(() => {
    stopPlayback();
    const s = runVectorAlgo(algoId, values, operation, position, value);
    setSteps(s);
    setCurrentStep(0);
  }, [algoId, values, operation, position, value]);

  const stopPlayback = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    
    const delay = 2000 / (speed * 2);
    timerRef.current = setTimeout(() => {
      if (currentStep >= steps.length - 1) {
        stopPlayback();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  // Draw vector with colorful visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted || steps.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const step = steps[currentStep];
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#f8f9fa");
    gradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = 45;
    const barHeight = 130;
    const gap = 12;
    const startX = 60;
    const startY = 160;

    // Color palette
    const colorMap: Record<string, string> = {
      sorted: "#10b981",
      comparing: "#f59e0b",
      swapping: "#ef4444",
      default: "#3b82f6",
    };

    step.array.forEach((element, index) => {
      const x = startX + index * (barWidth + gap);
      const y = startY;
      const height = (element.value / 50) * barHeight;
      const color = colorMap[element.state as keyof typeof colorMap] || colorMap.default;

      // Shadow effect
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;

      // Draw bar with gradient
      const barGradient = ctx.createLinearGradient(x, y - height, x, y);
      barGradient.addColorStop(0, color);
      barGradient.addColorStop(1, color + "dd");
      ctx.fillStyle = barGradient;
      ctx.fillRect(x, y - height, barWidth, height);

      // Border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y - height, barWidth, height);

      // Draw value with better styling
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 13px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(String(element.value), x + barWidth / 2, y + 8);

      // Draw index
      ctx.fillStyle = "#6b7280";
      ctx.font = "bold 11px Arial";
      ctx.fillText(`[${index}]`, x + barWidth / 2, y + 25);
    });

    // Draw description with background
    ctx.fillStyle = "rgba(31, 41, 55, 0.05)";
    ctx.fillRect(30, 10, 300, 30);
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(step.description, 40, 18);
  }, [mounted, steps, currentStep]);

  if (!mounted) return null;

  const isFinished = currentStep >= steps.length - 1;
  const currentStepData = steps[currentStep];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-6">
      {/* Operation Buttons */}
      <div className="flex gap-1 bg-card border border-border rounded-lg p-2">
        {(["insert", "delete"] as const).map((op) => (
          <button
            key={op}
            onClick={() => {
              setOperation(op);
              setCurrentStep(0);
            }}
            className={`px-3 py-1 rounded text-sm font-mono transition-colors capitalize ${
              operation === op
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-border"
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={250}
        className="border border-border rounded-lg bg-white"
      />

      {/* Info Panel */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Operation</span>
        <p className="text-sm text-foreground capitalize">
          {operation} at position {position} {operation === "insert" ? `with value ${value}` : ""}
        </p>
        {currentStepData && (
          <p className="text-xs text-muted-foreground">{currentStepData.description}</p>
        )}
      </div>

      {/* Configuration */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 max-h-80 overflow-y-auto">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Configure</span>
        
        {/* Array values */}
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-1">Array values</label>
          <input
            type="text"
            value={values.join(", ")}
            onChange={(e) => {
              const vals = e.target.value.split(",").map((v) => parseInt(v.trim())).filter((v) => !isNaN(v));
              setValues(vals.length > 0 ? vals : []);
            }}
            placeholder="e.g., 10, 20, 30, 40, 50"
            className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono"
          />
        </div>

        {/* Position slider */}
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-1">
            Position (0-{values.length}): {position}
          </label>
          <input
            type="range"
            min="0"
            max={Math.max(0, values.length)}
            value={position}
            onChange={(e) => setPosition(parseInt(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Insert value */}
        {operation === "insert" && (
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Insert value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm font-mono"
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

      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        isFinished={isFinished}
        onPlay={() => setIsPlaying(true)}
        onPause={() => stopPlayback()}
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

      {/* Stats */}
      <StatsPanel
        comparisons={currentStepData?.comparisons || 0}
        swaps={currentStepData?.swaps || 0}
        currentStep={currentStep}
        totalSteps={steps.length}
        description={currentStepData?.description || ""}
      />
    </div>
  );
}
