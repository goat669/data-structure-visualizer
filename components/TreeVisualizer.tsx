"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TreeNode, TreeStep } from "@/lib/algorithms/types";
import { runTreeAlgo } from "@/lib/algorithms/trees";
import PlaybackControls from "./PlaybackControls";
import StatsPanel from "./StatsPanel";
import TreeEditor from "./TreeEditor";

interface TreeVisualizerProps {
  algoId: string;
}

export default function TreeVisualizer({ algoId }: TreeVisualizerProps) {
  const [mounted, setMounted] = useState(false);
  const [nodeCount, setNodeCount] = useState(7);
  const [customValues, setCustomValues] = useState<number[] | null>(null);
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setMounted(true);
    recompute();
  }, [algoId]);

  const recompute = useCallback(() => {
    stopPlayback();
    const s = runTreeAlgo(algoId, nodeCount, customValues || undefined);
    setSteps(s);
    setCurrentStep(0);
  }, [algoId, nodeCount, customValues]);

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
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Tree Operation</span>
        <p className="text-sm text-foreground">
          {algoId === "tree-bfs" && "Level-order traversal using a queue (BFS)"}
          {algoId === "tree-dfs-inorder" && "In-Order: Visit Left → Root → Right (sorted output for BST)"}
          {algoId === "tree-dfs-preorder" && "Pre-Order: Visit Root → Left → Right (copy tree structure)"}
          {algoId === "tree-dfs-postorder" && "Post-Order: Visit Left → Right → Root (delete tree safely)"}
          {algoId === "bst-insert" && "Insert value maintaining BST property (left < parent < right)"}
          {algoId === "bst-search" && "Search for value in BST with efficient pruning"}
          {algoId === "avl-insert" && "AVL tree insert with automatic rebalancing via rotations"}
        </p>
      </div>

      {/* Canvas */}
      <div 
        style={{ 
          height: "360px", 
          background: "#0a0a0a", 
          border: "1px solid #1a1a1a", 
          borderRadius: "6px", 
          overflow: "auto",
          position: "relative"
        }}
        onMouseDown={(e) => {
          setIsDragging(true);
          setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
        }}
        onMouseMove={(e) => {
          if (!isDragging) return;
          setOffsetX(e.clientX - dragStart.x);
          setOffsetY(e.clientY - dragStart.y);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onWheel={(e) => {
          e.preventDefault();
          setOffsetY(offsetY + e.deltaY);
        }}
      >
        <div style={{ padding: "20px", transform: `translate(${offsetX}px, ${offsetY}px)` }}>
          <TreeCanvas 
            nodes={nodes} 
            traversalOrder={currentData?.traversalOrder ?? []}
            offsetX={offsetX}
            offsetY={offsetY}
            isDragging={isDragging}
          />
        </div>
      </div>

      {/* Traversal Order */}
      {currentData?.traversalOrder && currentData.traversalOrder.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-3">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">Traversal Order</span>
          <p className="text-sm font-mono mt-1">
            {currentData.traversalOrder.map((id) => nodes[id]?.value || "?").join(" → ")}
          </p>
        </div>
      )}

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

      {/* Editor */}
      <TreeEditor
        onRunAlgorithm={(customVals) => {
          setCustomValues(customVals);
          const s = runTreeAlgo(algoId, customVals.length, customVals);
          setSteps(s);
          setCurrentStep(0);
        }}
      />
    </div>
  );
}

function TreeCanvas({ 
  nodes, 
  traversalOrder,
  offsetX = 0,
  offsetY = 0,
  onMouseDown,
  isDragging,
}: { 
  nodes: TreeNode[]; 
  traversalOrder: number[];
  offsetX?: number;
  offsetY?: number;
  onMouseDown?: (e: React.MouseEvent<SVGSVGElement>) => void;
  isDragging?: boolean;
}) {
  if (nodes.length === 0) return <div className="text-muted-foreground text-sm">No tree data</div>;

  const minX = Math.min(...nodes.map((n) => n.x));
  const maxX = Math.max(...nodes.map((n) => n.x));
  const minY = Math.min(...nodes.map((n) => n.y));
  const maxY = Math.max(...nodes.map((n) => n.y));
  const padding = 50;
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
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-full" 
      preserveAspectRatio="xMidYMid meet"
      onMouseDown={onMouseDown}
      style={{ 
        cursor: isDragging ? "grabbing" : "grab",
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
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
              strokeDasharray={traversalOrder.includes(childId) ? "0" : "4"}
            />
          );
        })
      )}

      {/* Nodes */}
      {nodes.map((node) => {
        const isInOrder = traversalOrder.includes(node.id);
        const orderIndex = traversalOrder.indexOf(node.id) + 1;

        return (
          <g key={`node-${node.id}`}>
            <circle
              cx={node.x - minX + padding}
              cy={node.y - minY + padding}
              r="26"
              fill={getColor(node.state)}
              opacity={isInOrder ? 1 : 0.5}
              style={{ transition: "all 0.2s" }}
            />
            <text
              x={node.x - minX + padding}
              y={node.y - minY + padding}
              textAnchor="middle"
              dy="0.35em"
              fill="#fff"
              fontSize="16"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {node.value}
            </text>
            {isInOrder && orderIndex > 0 && (
              <text
                x={node.x - minX + padding + 16}
                y={node.y - minY + padding - 16}
                textAnchor="middle"
                fill="#4ade80"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
                style={{ background: "#0a0a0a", padding: "2px 4px" }}
              >
                {orderIndex}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
