"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALGORITHMS, GraphNode, GraphEdge, GraphStep } from "@/lib/algorithms/types";
import { bfsSteps, dfsSteps, dijkstraSteps, topoSortSteps, primSteps, makeDefaultGraph, makeDAG, layoutNodes } from "@/lib/algorithms/graph";
import AlgoInfoPanel from "./AlgoInfoPanel";
import PlaybackControls from "./PlaybackControls";
import GraphEditor, { GraphConfig } from "./GraphEditor";

// ─── Colour palette ───────────────────────────────────────────────────────────

const NODE_COLORS: Record<GraphNode["state"], { fill: string; stroke: string; text: string }> = {
  default:  { fill: "#1c1c1c", stroke: "#333",    text: "#888"    },
  visiting: { fill: "#c8843a", stroke: "#c8843a",  text: "#fff"    },
  visited:  { fill: "#2e4a2e", stroke: "#4ade80",  text: "#4ade80" },
  current:  { fill: "#4ade80", stroke: "#4ade80",  text: "#0a0a0a" },
  path:     { fill: "#1a3a1a", stroke: "#4ade80",  text: "#4ade80" },
  queued:   { fill: "#1a2a3a", stroke: "#60a5fa",  text: "#60a5fa" },
};

const EDGE_COLORS: Record<GraphEdge["state"], string> = {
  default:  "#2a2a2a",
  active:   "#c8843a",
  path:     "#4ade80",
  rejected: "#3a1a1a",
};

const SPEED_MAP: Record<number, number> = { 1: 800, 2: 400, 3: 200, 4: 80, 5: 25 };

function buildSteps(algoId: string, cfg: GraphConfig): GraphStep[] {
  const { nodes, edges, startNode } = cfg;
  switch (algoId) {
    case "bfs":      return bfsSteps(nodes, edges, startNode);
    case "dfs":      return dfsSteps(nodes, edges, startNode);
    case "dijkstra": return dijkstraSteps(nodes, edges, startNode);
    case "topo":     return topoSortSteps(nodes, edges);
    case "prim":     return primSteps(nodes, edges, startNode);
    default:         return bfsSteps(nodes, edges, startNode);
  }
}

function makeDefaultConfig(algoId: string): GraphConfig {
  const base = algoId === "topo" ? makeDAG() : makeDefaultGraph();
  return { ...base, startNode: 0 };
}

// ─── Canvas painter ───────────────────────────────────────────────────────────

function paintGraph(canvas: HTMLCanvasElement, nodes: GraphNode[], edges: GraphEdge[], directed: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = 48;
  const scaleX = (W - pad * 2) / (maxX - minX || 1);
  const scaleY = (H - pad * 2) / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY, 2.5);

  function tx(x: number) { return pad + (x - minX) * scale + (W - pad * 2 - (maxX - minX) * scale) / 2; }
  function ty(y: number) { return pad + (y - minY) * scale + (H - pad * 2 - (maxY - minY) * scale) / 2; }

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);

  const R = 20;

  // Edges
  edges.forEach(edge => {
    const from = nodes[edge.from];
    const to   = nodes[edge.to];
    if (!from || !to) return;
    const fx = tx(from.x), fy = ty(from.y);
    const tx2 = tx(to.x),  ty2 = ty(to.y);

    ctx.beginPath();
    ctx.strokeStyle = EDGE_COLORS[edge.state];
    ctx.lineWidth = edge.state === "path" ? 2.5 : 1.5;
    ctx.moveTo(fx, fy);
    ctx.lineTo(tx2, ty2);
    ctx.stroke();

    if (edge.weight !== undefined) {
      const mx = (fx + tx2) / 2;
      const my = (fy + ty2) / 2;
      ctx.fillStyle = edge.state === "default" ? "#444" : EDGE_COLORS[edge.state];
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(edge.weight), mx, my - 9);
    }

    if (directed || edge.directed) {
      const angle = Math.atan2(ty2 - fy, tx2 - fx);
      const arrowLen = 10;
      const arrowX = tx2 - (R + 4) * Math.cos(angle);
      const arrowY = ty2 - (R + 4) * Math.sin(angle);
      ctx.beginPath();
      ctx.fillStyle = EDGE_COLORS[edge.state];
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - arrowLen * Math.cos(angle - 0.4), arrowY - arrowLen * Math.sin(angle - 0.4));
      ctx.lineTo(arrowX - arrowLen * Math.cos(angle + 0.4), arrowY - arrowLen * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();
    }
  });

  // Nodes
  nodes.forEach(node => {
    const cx = tx(node.x);
    const cy = ty(node.y);
    const colors = NODE_COLORS[node.state];

    if (node.state === "current" || node.state === "visiting") {
      ctx.beginPath();
      ctx.arc(cx, cy, R + 6, 0, Math.PI * 2);
      ctx.fillStyle = `${colors.stroke}22`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = colors.fill;
    ctx.fill();
    ctx.lineWidth = node.state === "current" ? 2.5 : 1.5;
    ctx.strokeStyle = colors.stroke;
    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, cx, cy);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { algoId: string }

export default function GraphVisualizer({ algoId }: Props) {
  const algo      = ALGORITHMS.find(a => a.id === algoId)!;
  const isDirected = algoId === "topo";

  const [mounted, setMounted]         = useState(false);
  const [config,  setConfig]          = useState<GraphConfig>({ nodes: [], edges: [], startNode: 0 });
  const [steps,   setSteps]           = useState<GraphStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [speed, setSpeed]             = useState(2);

  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef  = useRef(false);

  // Init on client only (avoids SSR hydration mismatch)
  useEffect(() => {
    const cfg = makeDefaultConfig(algoId);
    setConfig(cfg);
    const s = buildSteps(algoId, cfg);
    setSteps(s);
    setCurrentStep(0);
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-init when algorithm category changes
  useEffect(() => {
    if (!mounted) return;
    stopPlayback();
    const cfg = makeDefaultConfig(algoId);
    setConfig(cfg);
    const s = buildSteps(algoId, cfg);
    setSteps(s);
    setCurrentStep(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId]);

  // Paint canvas whenever step changes
  useEffect(() => {
    const step = steps[currentStep];
    if (!step || !canvasRef.current) return;
    paintGraph(canvasRef.current, step.nodes, step.edges, isDirected);
  }, [currentStep, steps, isDirected]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const step = steps[currentStep];
      if (step) paintGraph(canvas, step.nodes, step.edges, isDirected);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [steps, currentStep, isDirected]);

  function stopPlayback() {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }

  function startPlayback(from: number, allSteps: GraphStep[], spd: number) {
    isPlayingRef.current = true;
    setIsPlaying(true);
    let step = from;
    function tick() {
      if (!isPlayingRef.current) return;
      if (step >= allSteps.length - 1) { isPlayingRef.current = false; setIsPlaying(false); setCurrentStep(allSteps.length - 1); return; }
      step++;
      setCurrentStep(step);
      timerRef.current = setTimeout(tick, SPEED_MAP[spd]);
    }
    timerRef.current = setTimeout(tick, SPEED_MAP[spd]);
  }

  function handleRun() {
    stopPlayback();
    const s = buildSteps(algoId, config);
    setSteps(s);
    setCurrentStep(0);
  }

  const handlePlay        = useCallback(() => { if (currentStep < steps.length - 1) startPlayback(currentStep, steps, speed); }, [currentStep, steps, speed]);
  const handlePause       = useCallback(() => stopPlayback(), []);
  const handleReset       = useCallback(() => { stopPlayback(); setCurrentStep(0); }, []);
  const handleStepForward = useCallback(() => { stopPlayback(); setCurrentStep(s => Math.min(s + 1, steps.length - 1)); }, [steps.length]);
  const handleStepBack    = useCallback(() => { stopPlayback(); setCurrentStep(s => Math.max(s - 1, 0)); }, []);
  const handleSpeedChange = useCallback((v: number) => { setSpeed(v); if (isPlaying) { stopPlayback(); startPlayback(currentStep, steps, v); } }, [isPlaying, currentStep, steps]);
  const handleSlider      = useCallback((v: number) => { stopPlayback(); setCurrentStep(v); }, []);

  useEffect(() => () => stopPlayback(), []);

  const currentData = steps[currentStep];
  const isFinished  = currentStep >= steps.length - 1;

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[12, 20, 80, 32].map((h, i) => (
          <div key={i} className="bg-card border border-border rounded-lg" style={{ height: `${h * 4}px` }} />
        ))}
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
      </div>

      {/* Info panel */}
      <div className="bg-card border border-border rounded-lg p-4">
        <AlgoInfoPanel algo={algo} />
      </div>

      {/* Graph Editor */}
      <GraphEditor
        config={config}
        algoId={algoId}
        onChange={cfg => { stopPlayback(); setConfig(cfg); }}
        onRun={handleRun}
      />

      {/* Graph canvas */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Graph Visualization</span>
          <span className="text-[10px] font-mono text-muted-foreground">{config.nodes.length} nodes · {config.edges.length} edges</span>
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={340}
          className="w-full rounded"
          style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
          aria-label={`${algo.name} graph visualization`}
        />
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(["default","queued","visiting","current","visited","path"] as GraphNode["state"][]).map(state => (
            <div key={state} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: NODE_COLORS[state].fill, border: `1.5px solid ${NODE_COLORS[state].stroke}` }} />
              <span className="text-[10px] font-mono text-muted-foreground capitalize">{state}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step description */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Step</span>
              <span className="text-lg font-mono font-bold tabular-nums" style={{ color: "#60a5fa" }}>
                {currentStep} / {Math.max(0, steps.length - 1)}
              </span>
            </div>
            {currentData?.extra && (
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Info</span>
                <span className="text-[11px] font-mono text-foreground">{currentData.extra}</span>
              </div>
            )}
          </div>
          <div className="flex gap-1.5">
            {isPlaying && <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "#4ade8020", color: "#4ade80", border: "1px solid #4ade8040" }}>Running</span>}
            {isFinished && !isPlaying && <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "#60a5fa20", color: "#60a5fa", border: "1px solid #60a5fa40" }}>Done</span>}
          </div>
        </div>
        {currentData?.description && (
          <div className="rounded px-3 py-2 font-mono text-[12px]" style={{ background: "#0f1a0f", border: "1px solid #1a3a1a", color: "#4ade80" }}>
            {">"} {currentData.description}
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(["default","active","path","rejected"] as GraphEdge["state"][]).map(state => (
            <div key={state} className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 rounded" style={{ background: EDGE_COLORS[state] }} />
              <span className="text-[10px] font-mono text-muted-foreground capitalize">{state}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Playback controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <PlaybackControls
          isPlaying={isPlaying} isFinished={isFinished}
          currentStep={currentStep} totalSteps={steps.length} speed={speed}
          onPlay={handlePlay} onPause={handlePause} onReset={handleReset}
          onStepForward={handleStepForward} onStepBack={handleStepBack}
          onSpeedChange={handleSpeedChange} onSliderChange={handleSlider}
        />
      </div>
    </div>
  );
}
