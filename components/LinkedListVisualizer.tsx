"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LinkedListStep } from "@/lib/algorithms/types";
import { runLinkedListAlgo } from "@/lib/algorithms/linkedlist";
import PlaybackControls from "./PlaybackControls";
import StatsPanel from "./StatsPanel";

interface LinkedListVisualizerProps {
  algoId: string;
}

export default function LinkedListVisualizer({ algoId }: LinkedListVisualizerProps) {
  const [mounted, setMounted] = useState(false);
  const [llType, setLlType] = useState<"singly" | "doubly" | "circular">("singly");
  const [operation, setOperation] = useState<"insert" | "find" | "delete">("insert");
  const [values, setValues] = useState<number[]>([10, 20, 30, 40, 50]);
  const [position, setPosition] = useState(2);
  const [value, setValue] = useState(99);
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine type and operation from algoId
  useEffect(() => {
    if (algoId.startsWith("sll")) setLlType("singly");
    else if (algoId.startsWith("dll")) setLlType("doubly");
    else if (algoId.startsWith("cll")) setLlType("circular");
    
    if (algoId.includes("insert")) setOperation("insert");
    else if (algoId.includes("find")) setOperation("find");
    else if (algoId.includes("delete")) setOperation("delete");
  }, [algoId]);

  const recompute = useCallback(() => {
    stopPlayback();
    const s = runLinkedListAlgo(algoId, values, operation, position, value, llType);
    setSteps(s);
    setCurrentStep(0);
  }, [algoId, values, operation, position, value, llType]);

  useEffect(() => {
    setMounted(true);
    recompute();
  }, []);

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

  // Draw linked list with colors and pointers
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

    // Color palette for nodes
    const colors: Record<string, string> = {
      inserted: "#10b981",
      highlight: "#f59e0b",
      found: "#3b82f6",
      visited: "#8b5cf6",
      default: "#e5e7eb",
    };

    const nodeRadius = 32;

    // Draw nodes with enhanced styling
    step.nodes.forEach((node, idx) => {
      const color = colors[node.state as keyof typeof colors] || colors.default;
      
      // Node circle with shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = color === colors.default ? "#d1d5db" : color;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Node value text
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(node.value), node.x, node.y);
    });

    // Draw pointer labels
    if (step.nodes.length > 0) {
      ctx.fillStyle = "#6b7280";
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      
      // Head pointer for all types
      ctx.fillText("HEAD", step.nodes[0].x, step.nodes[0].y - nodeRadius - 8);
      
      // Tail pointer for doubly and circular
      if ((llType === "doubly" || llType === "circular") && step.nodes.length > 1) {
        ctx.fillText("TAIL", step.nodes[step.nodes.length - 1].x, step.nodes[step.nodes.length - 1].y - nodeRadius - 8);
      }
    }

    // Draw forward arrows
    for (let i = 0; i < step.nodes.length - 1; i++) {
      const from = step.nodes[i];
      const to = step.nodes[i + 1];
      
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(from.x + nodeRadius + 5, from.y);
      ctx.lineTo(to.x - nodeRadius - 5, to.y);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(to.x - nodeRadius - 5, to.y);
      ctx.lineTo(to.x - nodeRadius - 15 * Math.cos(angle - Math.PI / 6), to.y - 15 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - nodeRadius - 15 * Math.cos(angle + Math.PI / 6), to.y - 15 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }

    // Draw backward arrows for doubly linked list
    if (llType === "doubly") {
      for (let i = step.nodes.length - 1; i > 0; i--) {
        const from = step.nodes[i];
        const to = step.nodes[i - 1];
        
        ctx.strokeStyle = "#ec4899";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(from.x - nodeRadius - 5, from.y);
        ctx.lineTo(to.x + nodeRadius + 5, to.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw circular arrow if circular list
    if (llType === "circular" && step.nodes.length > 1) {
      const lastNode = step.nodes[step.nodes.length - 1];
      const firstNode = step.nodes[0];
      
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const controlX = (lastNode.x + firstNode.x) / 2;
      const controlY = lastNode.y + 80;
      ctx.quadraticCurveTo(controlX, controlY, firstNode.x, firstNode.y - nodeRadius - 10);
      ctx.stroke();

      // Arrow head for circular
      const angle = Math.atan2((firstNode.y - nodeRadius - 10) - controlY, firstNode.x - controlX);
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(firstNode.x, firstNode.y - nodeRadius - 10);
      ctx.lineTo(firstNode.x - 12 * Math.cos(angle - Math.PI / 6), (firstNode.y - nodeRadius - 10) - 12 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(firstNode.x - 12 * Math.cos(angle + Math.PI / 6), (firstNode.y - nodeRadius - 10) - 12 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }
  }, [mounted, steps, currentStep, llType]);

  if (!mounted) return null;

  const isFinished = currentStep >= steps.length - 1;
  const currentStepData = steps[currentStep];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-6">
      {/* Type and Operation Buttons */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 bg-card border border-border rounded-lg p-2">
          {(["singly", "doubly", "circular"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setLlType(type)}
              className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                llType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-border"
              }`}
            >
              {type === "singly" ? "Singly" : type === "doubly" ? "Doubly" : "Circular"}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-card border border-border rounded-lg p-2">
          {(["insert", "find", "delete"] as const).map((op) => (
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
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
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
        
        {/* List values */}
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-1">List values</label>
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

        {/* Find value */}
        {operation === "find" && (
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Search value</label>
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
        comparisons={0}
        swaps={0}
        currentStep={currentStep}
        totalSteps={steps.length}
        description={currentStepData?.description || ""}
      />
    </div>
  );
}
