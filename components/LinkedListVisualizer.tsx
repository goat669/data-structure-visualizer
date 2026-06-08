"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { LinkedListStep } from "@/lib/algorithms/llTypes";
import {
  singlyInsert, singlyDelete, singlySearch, singlyReverse,
  doublyInsert, doublyDelete, doublySearch, doublyReverse,
  circularInsert, circularDelete, circularSearch, circularReverse,
} from "@/lib/algorithms/linkedlist";

type LLType = "singly" | "doubly" | "circular";
type Operation = "insert" | "delete" | "search" | "reverse";

interface LinkedListVisualizerProps {
  llType: LLType;
  operation: Operation;
}

export default function LinkedListVisualizer({
  llType,
  operation,
}: LinkedListVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Configuration
  const [listSize, setListSize] = useState(8);
  const [position, setPosition] = useState(2);
  const [insertValue, setInsertValue] = useState(20);
  const [searchValue, setSearchValue] = useState(15);
  const [customValues, setCustomValues] = useState<string>("10,20,30,40,50,60,70,80,90,100");
  const [useCustom, setUseCustom] = useState(false);

  // Generate initial random values or parse custom values
  const generateValues = useCallback((): number[] => {
    if (useCustom && customValues.trim()) {
      return customValues
        .split(",")
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v))
        .slice(0, 30);
    }
    return Array.from({ length: listSize }, () =>
      Math.floor(Math.random() * 100) + 1
    );
  }, [listSize, useCustom, customValues]);

  // Run algorithm
  const runAlgorithm = useCallback(() => {
    const values = generateValues();
    let newSteps: LinkedListStep[] = [];

    if (llType === "singly") {
      if (operation === "insert") newSteps = singlyInsert(values, position, insertValue);
      else if (operation === "delete") newSteps = singlyDelete(values, position);
      else if (operation === "search") newSteps = singlySearch(values, searchValue);
      else if (operation === "reverse") newSteps = singlyReverse(values);
    } else if (llType === "doubly") {
      if (operation === "insert") newSteps = doublyInsert(values, position, insertValue);
      else if (operation === "delete") newSteps = doublyDelete(values, position);
      else if (operation === "search") newSteps = doublySearch(values, searchValue);
      else if (operation === "reverse") newSteps = doublyReverse(values);
    } else if (llType === "circular") {
      if (operation === "insert") newSteps = circularInsert(values, position, insertValue);
      else if (operation === "delete") newSteps = circularDelete(values, position);
      else if (operation === "search") newSteps = circularSearch(values, searchValue);
      else if (operation === "reverse") newSteps = circularReverse(values);
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [llType, operation, listSize, position, insertValue, searchValue, generateValues]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 800 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length, speed]);

  // Draw canvas
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted || steps.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const step = steps[currentStep];

    // Background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transformation for panning
    ctx.save();
    ctx.translate(offsetX, offsetY);

    const nodeRadius = 35;
    const nodeSpacing = 80;

    // Draw nodes with pointers
    step.nodes.forEach((node, idx) => {
      // State colors
      const colors: Record<string, string> = {
        default: "#e5e7eb",
        comparing: "#fbbf24",
        visited: "#a78bfa",
        highlight: "#60a5fa",
        found: "#34d399",
        sorted: "#10b981",
      };

      const color = colors[node.state] || colors.default;

      // Draw node circle
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = "transparent";
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw value inside node
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(node.value), node.x, node.y);

      // Draw pointer labels
      ctx.fillStyle = "#6b7280";
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      if (idx === 0) ctx.fillText("HEAD", node.x, node.y - nodeRadius - 8);
      if (idx === step.nodes.length - 1 && llType !== "singly") {
        ctx.fillText("TAIL", node.x, node.y - nodeRadius - 8);
      }
    });

    // Draw arrows between nodes
    for (let i = 0; i < step.nodes.length - 1; i++) {
      const from = step.nodes[i];
      const to = step.nodes[i + 1];

      // Forward arrow (blue)
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
      ctx.lineTo(to.x - nodeRadius - 12 * Math.cos(angle - Math.PI / 6), to.y - 12 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - nodeRadius - 12 * Math.cos(angle + Math.PI / 6), to.y - 12 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }

    // Draw backward arrows for doubly
    if (llType === "doubly") {
      for (let i = step.nodes.length - 1; i > 0; i--) {
        const from = step.nodes[i];
        const to = step.nodes[i - 1];

        ctx.strokeStyle = "#ec4899";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(from.x - nodeRadius - 5, from.y + 15);
        ctx.lineTo(to.x + nodeRadius + 5, to.y + 15);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw circular arrow
    // Draw circular loop (tail -> head)
    if (llType === "circular" && step.nodes.length > 1) {
      const lastNode = step.nodes[step.nodes.length - 1];
      const firstNode = step.nodes[0];

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      // Start from bottom right of last node
      ctx.moveTo(lastNode.x + nodeRadius + 5, lastNode.y + 5);
      
      // Create smooth curve going down then back to head
      const bottomY = lastNode.y + 80;
      const controlX1 = lastNode.x + 100;
      const controlX2 = firstNode.x - 100;
      
      // Bezier curve: starts at tail, goes down and curves around to head from below
      ctx.bezierCurveTo(
        controlX1, lastNode.y + 30,  // First control point (right side, slight down)
        controlX1, bottomY,            // Second control point (right side, at bottom)
        (lastNode.x + firstNode.x) / 2, bottomY  // Middle point at bottom
      );
      
      ctx.bezierCurveTo(
        controlX2, bottomY,            // Control point (left side, at bottom)
        controlX2, firstNode.y + 30,  // Control point (left side, moving up)
        firstNode.x, firstNode.y + nodeRadius + 12  // End point at head bottom
      );
      
      ctx.stroke();

      // Arrow head pointing upward into HEAD node
      const endX = firstNode.x;
      const endY = firstNode.y + nodeRadius + 12;
      const arrowSize = 10;
      
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowSize * 0.866, endY - arrowSize * 0.5);  // Left point
      ctx.lineTo(endX + arrowSize * 0.866, endY - arrowSize * 0.5);  // Right point
      ctx.closePath();
      ctx.fill();
    }

    // Draw description
    ctx.fillStyle = "rgba(31, 41, 55, 0.08)";
    ctx.fillRect(20, 10, 600, 50);
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(step.description, 30, 18);
    ctx.font = "12px Arial";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(step.detail, 30, 38);

    ctx.restore();
  }, [mounted, steps, currentStep, llType, offsetX, offsetY]);

  // Mouse handlers for panning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
      canvas.style.cursor = "grab";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setOffsetX(e.clientX - dragStart.x);
      setOffsetY(e.clientY - dragStart.y);
      canvas.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      canvas.style.cursor = "grab";
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setOffsetY(offsetY + e.deltaY);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [isDragging, dragStart, offsetX, offsetY]);

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      {/* Configuration */}
      <div className="bg-gradient-to-r from-card to-card/50 border border-border/50 rounded-xl p-5 space-y-4 shadow-lg">
        <h3 className="text-sm font-mono font-bold uppercase text-foreground tracking-wider">
          {llType.toUpperCase()} - {operation.toUpperCase()}
        </h3>

        {/* Node Builder */}
        <div className="border-b border-border pb-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setUseCustom(false)}
              className={`px-3 py-1 text-xs font-mono rounded ${
                !useCustom
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border text-foreground"
              }`}
            >
              Random
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`px-3 py-1 text-xs font-mono rounded ${
                useCustom
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border text-foreground"
              }`}
            >
              Custom Values
            </button>
          </div>
          {useCustom && (
            <div>
              <label className="text-xs font-mono text-muted-foreground">Nodes (comma-separated)</label>
              <input
                type="text"
                value={customValues}
                onChange={(e) => setCustomValues(e.target.value)}
                placeholder="10,20,30,40,50"
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm font-mono mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {customValues.split(",").filter(v => v.trim()).length} node(s)
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono text-muted-foreground">List Size</label>
            <input
              type="range"
              min="3"
              max="15"
              value={listSize}
              onChange={(e) => setListSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-foreground mt-1">{listSize} nodes</div>
          </div>

          {operation === "insert" && (
            <>
              <div>
                <label className="text-xs font-mono text-muted-foreground">Position</label>
                <input
                  type="range"
                  min="0"
                  max={listSize}
                  value={position}
                  onChange={(e) => setPosition(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-foreground mt-1">Pos: {position}</div>
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground">Value to Insert</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={insertValue}
                  onChange={(e) => setInsertValue(parseInt(e.target.value))}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                />
              </div>
            </>
          )}

          {operation === "delete" && (
            <div>
              <label className="text-xs font-mono text-muted-foreground">Position to Delete</label>
              <input
                type="range"
                min="0"
                max={Math.max(0, listSize - 1)}
                value={position}
                onChange={(e) => setPosition(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-foreground mt-1">Pos: {position}</div>
            </div>
          )}

          {operation === "search" && (
            <div>
              <label className="text-xs font-mono text-muted-foreground">Search Value</label>
              <input
                type="number"
                min="1"
                max="100"
                value={searchValue}
                onChange={(e) => setSearchValue(parseInt(e.target.value))}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
              />
            </div>
          )}
        </div>

        <button
          onClick={runAlgorithm}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-mono hover:bg-primary/90"
        >
          Run Algorithm
        </button>
      </div>

      {/* Canvas Visualization */}
      {steps.length > 0 && (
        <>
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-border/50 overflow-hidden shadow-2xl hover:shadow-xl transition-shadow duration-300">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full"
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            />
          </div>

          {/* Stats and Controls */}
          <div className="space-y-3">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-card border border-border rounded p-2">
                <div className="text-muted-foreground">STEP</div>
                <div className="font-mono font-bold text-primary">{currentStep + 1} / {steps.length}</div>
              </div>
              <div className="bg-card border border-border rounded p-2">
                <div className="text-muted-foreground">COMPARISONS</div>
                <div className="font-mono font-bold">{steps[currentStep]?.comparisons}</div>
              </div>
              <div className="bg-card border border-border rounded p-2">
                <div className="text-muted-foreground">OPERATIONS</div>
                <div className="font-mono font-bold">{steps[currentStep]?.operations}</div>
              </div>
              <div className="bg-card border border-border rounded p-2">
                <div className="text-muted-foreground">SPEED</div>
                <div className="font-mono font-bold">{speed}x</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
                className="px-3 py-2 bg-card border border-border rounded hover:bg-background"
                title="Reset"
              >
                ⟲
              </button>
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="px-3 py-2 bg-card border border-border rounded hover:bg-background"
                title="Previous"
              >
                ❮
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-2 rounded font-bold ${
                  isPlaying
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-3 py-2 bg-card border border-border rounded hover:bg-background"
                title="Next"
              >
                ❯
              </button>

              <div className="flex-1" />

              {/* Speed control */}
              <div className="flex items-center gap-1">
                {[0.5, 1, 2, 4, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 text-xs rounded ${
                      speed === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border hover:bg-background"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
