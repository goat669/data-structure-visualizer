"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TreeNode, TreeStep } from "@/lib/algorithms/types";
import { runTreeAlgo } from "@/lib/algorithms/trees";
import PlaybackControls from "./PlaybackControls";
import StatsPanel from "./StatsPanel";

interface TreeVisualizerProps {
  algoId: string;
}

export default function TreeVisualizer({ algoId }: TreeVisualizerProps) {
  const [mounted, setMounted] = useState(false);
  const [nodeCount, setNodeCount] = useState(7);
  const [steps, setSteps] = useState<TreeStep[]>([]);
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
    const s = runTreeAlgo(algoId, nodeCount);
    setSteps(s);
    setCurrentStep(0);
  }, [algoId, nodeCount]);

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

    const delayMs = 1000 / (speed || 1);
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
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Tree Traversal</span>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-foreground">{algoId.includes("bfs") && "Level-order traversal using queue"}</p>
          <p className="text-sm text-foreground">{algoId === "tree-dfs-inorder" && "In-order: Left → Root → Right"}</p>
          <p className="text-sm text-foreground">{algoId === "tree-dfs-preorder" && "Pre-order: Root → Left → Right"}</p>
          <p className="text-sm text-foreground">{algoId === "bst-insert" && "Insert value maintaining BST property"}</p>
          <p className="text-sm text-foreground">{algoId === "bst-search" && "Search value in BST"}</p>
          <p className="text-sm text-foreground">{algoId === "avl-insert" && "AVL tree auto-balancing on insert"}</p>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ height: "350px", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "20px" }}>
        <TreeCanvas nodes={nodes} traversalOrder={currentData?.traversalOrder ?? []} />
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

      {/* Node count */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Tree Size</span>
          <span className="text-sm font-mono">{nodeCount} nodes</span>
        </div>
        <input
          type="range"
          min="1"
          max="9"
          value={nodeCount}
          onChange={(e) => setNodeCount(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

function TreeCanvas({ nodes, traversalOrder }: { nodes: TreeNode[]; traversalOrder: number[] }) {
  if (nodes.length === 0) return <div className="text-muted-foreground text-sm">No tree data</div>;

  const minX = Math.min(...nodes.map((n) => n.x));
  const maxX = Math.max(...nodes.map((n) => n.x));
  const minY = Math.min(...nodes.map((n) => n.y));
  const maxY = Math.max(...nodes.map((n) => n.y));
  const padding = 40;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  const getColor = (state: string) => {
    if (state === "found") return "#4ade80";
    if (state === "visited") return "#4ade80";
    if (state === "visiting") return "#c8843a";
    if (state === "current") return "#a855f7";
    if (state === "unbalanced") return "#e05252";
    return "#1a1a1a";
  };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Edges */}
      {nodes.map((node) =>
        node.children.map((childId) => {
          const child = nodes.find((n) => n.id === childId);
          if (!child) return null;
          return (
            <line
              key={`edge-${node.id}-${childId}`}
              x1={node.x - minX + padding}
              y1={node.y - minY + padding}
              x2={child.x - minX + padding}
              y2={child.y - minY + padding}
              stroke="#333"
              strokeWidth="2"
            />
          );
        })
      )}

      {/* Nodes */}
      {nodes.map((node) => (
        <g key={`node-${node.id}`}>
          <circle
            cx={node.x - minX + padding}
            cy={node.y - minY + padding}
            r="24"
            fill={getColor(node.state)}
            opacity={traversalOrder.includes(node.id) ? 1 : 0.6}
          />
          <text
            x={node.x - minX + padding}
            y={node.y - minY + padding}
            textAnchor="middle"
            dy="0.3em"
            fill="#fff"
            fontSize="14"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {node.value}
          </text>
        </g>
      ))}

      {/* Traversal order indicator */}
      {traversalOrder.length > 0 && (
        <text x={10} y={20} fill="#666" fontSize="12" fontFamily="monospace">
          Order: {traversalOrder.map((id) => nodes[id]?.value).join(" → ")}
        </text>
      )}
    </svg>
  );
}
