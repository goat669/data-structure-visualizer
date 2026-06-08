"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALGORITHMS, StackQueueItem, StackQueueStep } from "@/lib/algorithms/types";
import {
  stackOpsSteps, queueOpsSteps, balancedBracketsSteps, infixToPostfixSteps,
  StackOp, QueueOp,
  DEFAULT_STACK_SEQUENCE, DEFAULT_QUEUE_SEQUENCE, DEFAULT_BRACKETS_EXPR, DEFAULT_INFIX_EXPR,
} from "@/lib/algorithms/stackqueue";
import AlgoInfoPanel from "./AlgoInfoPanel";
import PlaybackControls from "./PlaybackControls";
import { StackEditor, QueueEditor, ExprEditor } from "./StackQueueEditor";

const SPEED_MAP: Record<number, number> = { 1: 800, 2: 450, 3: 200, 4: 80, 5: 25 };

const ITEM_STYLE: Record<StackQueueItem["state"], { bg: string; border: string; text: string; shadow?: string }> = {
  default:   { bg: "#1c1c1c",   border: "#2e2e2e", text: "#aaa"    },
  pushing:   { bg: "#1a3a1a",   border: "#4ade80", text: "#4ade80", shadow: "0 0 10px #4ade8044" },
  popping:   { bg: "#3a1a1a",   border: "#e05252", text: "#e05252", shadow: "0 0 10px #e0525244" },
  highlight: { bg: "#1a2a3a",   border: "#60a5fa", text: "#60a5fa", shadow: "0 0 10px #60a5fa44" },
  matched:   { bg: "#1a3a1a",   border: "#4ade80", text: "#4ade80" },
  mismatch:  { bg: "#3a1a1a",   border: "#e05252", text: "#e05252" },
};

// ─── Cell ─────────────────────────────────────────────────────────────────────

function Cell({ it, isTop, isBottom, label }: { it: StackQueueItem; isTop?: boolean; isBottom?: boolean; label?: string }) {
  const s = ITEM_STYLE[it.state];
  return (
    <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 52 }}>
      {isTop && <span className="text-[9px] font-mono" style={{ color: "#4ade80" }}>TOP</span>}
      {label && <span className="text-[9px] font-mono text-muted-foreground">{label}</span>}
      <div
        className="w-12 h-11 rounded flex items-center justify-center font-mono text-sm font-bold transition-all duration-200"
        style={{ background: s.bg, border: `1.5px solid ${s.border}`, color: s.text, boxShadow: s.shadow }}
      >
        {it.value}
      </div>
      {isBottom && <span className="text-[9px] font-mono text-muted-foreground">BOT</span>}
    </div>
  );
}

// ─── Stack display ────────────────────────────────────────────────────────────

function StackDisplay({ items, title }: { items: StackQueueItem[]; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{title}</span>
      <div className="rounded-lg p-3 flex flex-col-reverse gap-1 items-center"
        style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", minHeight: 220, minWidth: 80 }}>
        {items.length === 0 && <span className="text-[11px] font-mono text-muted-foreground/40 mt-auto">empty</span>}
        {items.map((it, idx) => (
          <Cell key={idx} it={it} isTop={idx === items.length - 1} isBottom={idx === 0} />
        ))}
      </div>
    </div>
  );
}

// ─── Queue display ────────────────────────────────────────────────────────────

function QueueDisplay({ items, title }: { items: StackQueueItem[]; title: string }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{title}</span>
      <div className="rounded-lg p-3 flex flex-row-reverse gap-1.5 items-center overflow-x-auto"
        style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", minHeight: 90 }}>
        {items.length === 0 && <span className="text-[11px] font-mono text-muted-foreground/40">empty</span>}
        {items.map((it, idx) => (
          <Cell key={idx} it={it} label={idx === items.length - 1 ? "FRONT" : idx === 0 ? "REAR" : undefined} />
        ))}
      </div>
      <div className="flex justify-between text-[9px] font-mono text-muted-foreground/50 px-1">
        <span>← REAR (enqueue)</span>
        <span>FRONT (dequeue) →</span>
      </div>
    </div>
  );
}

// ─── Dual display ─────────────────────────────────────────────────────────────

function DualDisplay({ primary, secondary, primaryTitle, secondaryTitle }: {
  primary: StackQueueItem[]; secondary: StackQueueItem[]; primaryTitle: string; secondaryTitle: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <StackDisplay items={primary} title={primaryTitle} />
      <div className="flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{secondaryTitle}</span>
        <div className="rounded-lg p-3 flex flex-row gap-1.5 items-center overflow-x-auto flex-wrap"
          style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", minHeight: 80 }}>
          {secondary.length === 0 && <span className="text-[11px] font-mono text-muted-foreground/40">empty</span>}
          {secondary.map((it, idx) => <Cell key={idx} it={it} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { algoId: string }

export default function StackQueueVisualizer({ algoId }: Props) {
  const algo    = ALGORITHMS.find(a => a.id === algoId)!;
  const isQueue = algoId === "queue-ops";
  const isDual  = algoId === "infix-postfix" || algoId === "balanced-brackets";

  // Custom inputs
  const [stackSeq,      setStackSeq]      = useState<StackOp[]>([...DEFAULT_STACK_SEQUENCE]);
  const [queueSeq,      setQueueSeq]      = useState<QueueOp[]>([...DEFAULT_QUEUE_SEQUENCE]);
  const [bracketsExpr,  setBracketsExpr]  = useState(DEFAULT_BRACKETS_EXPR);
  const [infixExpr,     setInfixExpr]     = useState(DEFAULT_INFIX_EXPR);

  const [mounted,      setMounted]      = useState(false);
  const [steps,        setSteps]        = useState<StackQueueStep[]>([]);
  const [currentStep,  setCurrentStep]  = useState(0);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [speed,        setSpeed]        = useState(2);

  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  function buildSteps() {
    switch (algoId) {
      case "stack-ops":         return stackOpsSteps(stackSeq);
      case "queue-ops":         return queueOpsSteps(queueSeq);
      case "balanced-brackets": return balancedBracketsSteps(bracketsExpr);
      case "infix-postfix":     return infixToPostfixSteps(infixExpr);
      default:                  return stackOpsSteps(stackSeq);
    }
  }

  useEffect(() => {
    const s = buildSteps();
    setSteps(s);
    setCurrentStep(0);
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (step >= allSteps.length - 1) { isPlayingRef.current = false; setIsPlaying(false); setCurrentStep(allSteps.length - 1); return; }
      step++;
      setCurrentStep(step);
      timerRef.current = setTimeout(tick, SPEED_MAP[spd]);
    }
    timerRef.current = setTimeout(tick, SPEED_MAP[spd]);
  }

  function handleRun() {
    stopPlayback();
    const s = buildSteps();
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
  const primary     = currentData?.primary ?? [];
  const secondary   = currentData?.secondary ?? [];

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[12, 20, 24, 64, 32].map((h, i) => (
          <div key={i} className="bg-card border border-border rounded-lg" style={{ height: `${h * 4}px` }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono font-bold text-foreground">{algo.name}</h1>
        <span className="text-[10px] font-mono text-muted-foreground capitalize">{algo.category}</span>
      </div>

      {/* Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <AlgoInfoPanel algo={algo} />
      </div>

      {/* Editor panel */}
      {algoId === "stack-ops" && (
        <StackEditor sequence={stackSeq} onChange={seq => { stopPlayback(); setStackSeq(seq); }} onRun={handleRun} />
      )}
      {algoId === "queue-ops" && (
        <QueueEditor sequence={queueSeq} onChange={seq => { stopPlayback(); setQueueSeq(seq); }} onRun={handleRun} />
      )}
      {algoId === "balanced-brackets" && (
        <ExprEditor
          label="Bracket Expression"
          expr={bracketsExpr}
          placeholder={DEFAULT_BRACKETS_EXPR}
          onChange={v => { stopPlayback(); setBracketsExpr(v); }}
          onRun={handleRun}
        />
      )}
      {algoId === "infix-postfix" && (
        <ExprEditor
          label="Infix Expression"
          expr={infixExpr}
          placeholder={DEFAULT_INFIX_EXPR}
          onChange={v => { stopPlayback(); setInfixExpr(v); }}
          onRun={handleRun}
        />
      )}

      {/* Visualization */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Visualization</span>
          {currentData?.operation && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wide"
              style={{ background: "#4ade8015", color: "#4ade80", border: "1px solid #4ade8030" }}>
              {currentData.operation}
            </span>
          )}
        </div>

        {isDual ? (
          <DualDisplay
            primary={primary} secondary={secondary}
            primaryTitle={algoId === "infix-postfix" ? "Operator Stack" : "Bracket Stack"}
            secondaryTitle={algoId === "infix-postfix" ? "Output Queue" : "Matched Pairs"}
          />
        ) : isQueue ? (
          <QueueDisplay items={primary} title="Queue" />
        ) : (
          <StackDisplay items={primary} title="Stack" />
        )}
      </div>

      {/* Stats */}
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
              <span className="text-lg font-mono font-bold tabular-nums" style={{ color: "#c8843a" }}>{primary.length}</span>
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
          {(["default","pushing","popping","highlight","matched","mismatch"] as StackQueueItem["state"][]).map(state => (
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
