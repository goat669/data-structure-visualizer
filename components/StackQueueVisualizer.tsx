"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALGORITHMS, StackQueueItem, StackQueueStep } from "@/lib/algorithms/types";
import {
  stackOpsSteps,
  queueOpsSteps,
  balancedBracketsSteps,
  infixToPostfixSteps,
} from "@/lib/algorithms/stackqueue";
import AlgoInfoPanel from "./AlgoInfoPanel";
import PlaybackControls from "./PlaybackControls";

const SPEED_MAP: Record<number, number> = { 1: 800, 2: 450, 3: 200, 4: 80, 5: 25 };

function getSteps(algoId: string): StackQueueStep[] {
  switch (algoId) {
    case "stack-ops":         return stackOpsSteps();
    case "queue-ops":         return queueOpsSteps();
    case "balanced-brackets": return balancedBracketsSteps();
    case "infix-postfix":     return infixToPostfixSteps();
    default:                  return stackOpsSteps();
  }
}

// ─── Item colour map ──────────────────────────────────────────────────────────

const ITEM_STYLE: Record<
  StackQueueItem["state"],
  { bg: string; border: string; text: string; shadow?: string }
> = {
  default:  { bg: "#1c1c1c",   border: "#2e2e2e", text: "#aaa"    },
  pushing:  { bg: "#1a3a1a",   border: "#4ade80", text: "#4ade80", shadow: "0 0 10px #4ade8044" },
  popping:  { bg: "#3a1a1a",   border: "#e05252", text: "#e05252", shadow: "0 0 10px #e0525244" },
  highlight:{ bg: "#1a2a3a",   border: "#60a5fa", text: "#60a5fa", shadow: "0 0 10px #60a5fa44" },
  matched:  { bg: "#1a3a1a",   border: "#4ade80", text: "#4ade80" },
  mismatch: { bg: "#3a1a1a",   border: "#e05252", text: "#e05252" },
};

// ─── Single stack/queue cell ──────────────────────────────────────────────────

function Cell({ it, index, isTop, isBottom, label }: {
  it: StackQueueItem;
  index: number;
  isTop?: boolean;
  isBottom?: boolean;
  label?: string;
}) {
  const s = ITEM_STYLE[it.state];
  return (
    <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 52 }}>
      {isTop && <span className="text-[9px] font-mono" style={{ color: "#4ade80" }}>TOP</span>}
      {label && <span className="text-[9px] font-mono text-muted-foreground">{label}</span>}
      <div
        className="w-12 h-11 rounded flex items-center justify-center font-mono text-sm font-bold transition-all duration-200"
        style={{
          background: s.bg,
          border: `1.5px solid ${s.border}`,
          color: s.text,
          boxShadow: s.shadow,
        }}
      >
        {it.value}
      </div>
      {isBottom && <span className="text-[9px] font-mono text-muted-foreground">BOTTOM</span>}
    </div>
  );
}

// ─── Stack display (vertical) ─────────────────────────────────────────────────

function StackDisplay({ items, title }: { items: StackQueueItem[]; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{title}</span>
      <div
        className="rounded-lg p-3 flex flex-col-reverse gap-1 items-center"
        style={{
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          minHeight: 220,
          minWidth: 80,
        }}
      >
        {items.length === 0 && (
          <span className="text-[11px] font-mono text-muted-foreground/40 mt-auto">empty</span>
        )}
        {items.map((it, idx) => (
          <Cell
            key={idx}
            it={it}
            index={idx}
            isTop={idx === items.length - 1}
            isBottom={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Queue display (horizontal) ───────────────────────────────────────────────

function QueueDisplay({ items, title }: { items: StackQueueItem[]; title: string }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{title}</span>
      <div
        className="rounded-lg p-3 flex flex-row-reverse gap-1.5 items-center overflow-x-auto"
        style={{
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          minHeight: 90,
        }}
      >
        {items.length === 0 && (
          <span className="text-[11px] font-mono text-muted-foreground/40">empty</span>
        )}
        {items.map((it, idx) => (
          <Cell
            key={idx}
            it={it}
            index={idx}
            label={idx === items.length - 1 ? "FRONT" : idx === 0 ? "REAR" : undefined}
          />
        ))}
      </div>
      <div className="flex justify-between text-[9px] font-mono text-muted-foreground/50 px-1">
        <span>← REAR (enqueue)</span>
        <span>FRONT (dequeue) →</span>
      </div>
    </div>
  );
}

// ─── Infix/Postfix dual display ───────────────────────────────────────────────

function DualDisplay({
  primary,
  secondary,
  primaryTitle,
  secondaryTitle,
}: {
  primary: StackQueueItem[];
  secondary: StackQueueItem[];
  primaryTitle: string;
  secondaryTitle: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <StackDisplay items={primary} title={primaryTitle} />
      <div className="flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{secondaryTitle}</span>
        <div
          className="rounded-lg p-3 flex flex-row gap-1.5 items-center overflow-x-auto flex-wrap"
          style={{
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
            minHeight: 80,
          }}
        >
          {secondary.length === 0 && (
            <span className="text-[11px] font-mono text-muted-foreground/40">empty</span>
          )}
          {secondary.map((it, idx) => (
            <Cell key={idx} it={it} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { algoId: string }

export default function StackQueueVisualizer({ algoId }: Props) {
  const algo = ALGORITHMS.find((a) => a.id === algoId)!;
  const isQueue   = algoId === "queue-ops";
  const isDual    = algoId === "infix-postfix" || algoId === "balanced-brackets";

  const [mounted, setMounted]           = useState(false);
  const [steps, setSteps]               = useState<StackQueueStep[]>([]);
  const [currentStep, setCurrentStep]   = useState(0);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [speed, setSpeed]               = useState(2);

  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const s = getSteps(algoId);
    setSteps(s);
    setCurrentStep(0);
    setMounted(true);
  }, [algoId]);

  function stopPlayback() {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }

  function startPlayback(from: number, allSteps: StackQueueStep[], spd: number) {
    isPlayingRef.current = true;
    setIsPlaying(true);
    let step = from;
    function tick() {
      if (!isPlayingRef.current) return;
      if (step >= allSteps.length - 1) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentStep(allSteps.length - 1);
        return;
      }
      step++;
      setCurrentStep(step);
      timerRef.current = setTimeout(tick, SPEED_MAP[spd]);
    }
    timerRef.current = setTimeout(tick, SPEED_MAP[spd]);
  }

  const handlePlay        = useCallback(() => { if (currentStep < steps.length - 1) startPlayback(currentStep, steps, speed); }, [currentStep, steps, speed]);
  const handlePause       = useCallback(() => stopPlayback(), []);
  const handleReset       = useCallback(() => { stopPlayback(); setCurrentStep(0); }, []);
  const handleStepForward = useCallback(() => { stopPlayback(); setCurrentStep((s) => Math.min(s + 1, steps.length - 1)); }, [steps.length]);
  const handleStepBack    = useCallback(() => { stopPlayback(); setCurrentStep((s) => Math.max(s - 1, 0)); }, []);
  const handleSpeedChange = useCallback((v: number) => { setSpeed(v); if (isPlaying) { stopPlayback(); startPlayback(currentStep, steps, v); } }, [isPlaying, currentStep, steps]);
  const handleSlider      = useCallback((v: number) => { stopPlayback(); setCurrentStep(v); }, []);

  useEffect(() => () => stopPlayback(), []);

  const currentData = steps[currentStep];
  const isFinished  = currentStep >= steps.length - 1;
  const primary     = currentData?.primary ?? [];
  const secondary   = currentData?.secondary ?? [];

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-12 bg-card border border-border rounded-lg" />
        <div className="h-20 bg-card border border-border rounded-lg" />
        <div className="h-64 bg-card border border-border rounded-lg" />
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
          C++ Implementation
        </span>
      </div>

      {/* Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <AlgoInfoPanel algo={algo} />
      </div>

      {/* Visualization */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Visualization
          </span>
          {currentData?.operation && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wide"
              style={{ background: "#4ade8015", color: "#4ade80", border: "1px solid #4ade8030" }}
            >
              {currentData.operation}
            </span>
          )}
        </div>

        {isDual ? (
          <DualDisplay
            primary={primary}
            secondary={secondary}
            primaryTitle={algoId === "infix-postfix" ? "Operator Stack" : "Bracket Stack"}
            secondaryTitle={algoId === "infix-postfix" ? "Output Queue" : "Matched Pairs"}
          />
        ) : isQueue ? (
          <QueueDisplay items={primary} title="Queue" />
        ) : (
          <StackDisplay items={primary} title="Stack" />
        )}
      </div>

      {/* Stats / description */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Step</span>
              <span className="text-lg font-mono font-bold tabular-nums" style={{ color: "#60a5fa" }}>
                {currentStep} / {Math.max(0, steps.length - 1)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Size</span>
              <span className="text-lg font-mono font-bold tabular-nums" style={{ color: "#c8843a" }}>
                {primary.length}
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

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(["default", "pushing", "popping", "highlight", "matched", "mismatch"] as StackQueueItem["state"][]).map((state) => (
            <div key={state} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: ITEM_STYLE[state].bg, border: `1.5px solid ${ITEM_STYLE[state].border}` }} />
              <span className="text-[10px] font-mono text-muted-foreground capitalize">{state}</span>
            </div>
          ))}
        </div>
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
          onSliderChange={handleSlider}
        />
      </div>
    </div>
  );
}
