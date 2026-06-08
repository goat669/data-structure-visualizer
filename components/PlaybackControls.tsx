"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PlaybackControlsProps {
  isPlaying: boolean;
  isFinished: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // 1–5
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onSpeedChange: (v: number) => void;
  onSliderChange: (step: number) => void;
}

const SPEED_LABELS: Record<number, string> = {
  1: "0.5×",
  2: "1×",
  3: "2×",
  4: "4×",
  5: "8×",
};

export default function PlaybackControls({
  isPlaying,
  isFinished,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  onSpeedChange,
  onSliderChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Section label */}
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        Playback Controls
      </span>

      {/* Progress slider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono tabular-nums w-6 shrink-0 text-right" style={{ color: "#444" }}>
          {currentStep}
        </span>
        <Slider
          min={0}
          max={Math.max(0, totalSteps - 1)}
          step={1}
          value={[currentStep]}
          onValueChange={(vals) => {
            const v = Array.isArray(vals) ? vals[0] : vals;
            onSliderChange(v);
          }}
          className="flex-1"
          aria-label="Seek to step"
        />
        <span className="text-[10px] font-mono tabular-nums w-8 shrink-0 text-right" style={{ color: "#444" }}>
          {Math.max(0, totalSteps - 1)}
        </span>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Transport buttons */}
        <div className="flex items-center gap-1.5">
          <IconBtn
            onClick={onReset}
            aria-label="Reset"
            title="Reset"
          >
            <ResetIcon />
          </IconBtn>

          <IconBtn
            onClick={onStepBack}
            disabled={currentStep === 0}
            aria-label="Step back"
            title="Step back"
          >
            <StepBackIcon />
          </IconBtn>

          {/* Play / Pause — larger, accent coloured */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={isFinished && !isPlaying}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isPlaying ? "rgba(74,222,128,0.18)" : "rgba(74,222,128,0.92)",
              border: "1px solid rgba(74,222,128,0.5)",
              color: isPlaying ? "#4ade80" : "#0a0a0a",
              boxShadow: isPlaying ? "0 0 12px rgba(74,222,128,0.25)" : "none",
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <IconBtn
            onClick={onStepForward}
            disabled={isFinished}
            aria-label="Step forward"
            title="Step forward"
          >
            <StepForwardIcon />
          </IconBtn>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono" style={{ color: "#444" }}>Speed</span>
          <div className="flex items-center gap-1">
            {([1, 2, 3, 4, 5] as const).map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className="px-2 py-1 rounded text-[10px] font-mono tabular-nums transition-all"
                style={
                  speed === s
                    ? { background: "rgba(74,222,128,0.18)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.35)" }
                    : { background: "transparent", color: "#555", border: "1px solid transparent" }
                }
                aria-pressed={speed === s}
                aria-label={`Speed ${SPEED_LABELS[s]}`}
              >
                {SPEED_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Small square icon button
function IconBtn({
  children,
  onClick,
  disabled,
  "aria-label": ariaLabel,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  "aria-label": string;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className="w-8 h-8 rounded flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888" }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.color = "#ccc";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a3a";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#888";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
      }}
    >
      {children}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M3 1.5L11.5 6.5L3 11.5V1.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <rect x="2.5" y="2"  width="2.5" height="9" rx="1" fill="currentColor" />
      <rect x="8"   y="2"  width="2.5" height="9" rx="1" fill="currentColor" />
    </svg>
  );
}

function StepBackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M9 2.5L4.5 6.5L9 10.5V2.5Z" fill="currentColor" />
      <rect x="2.5" y="2.5" width="1.5" height="8" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function StepForwardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M4 2.5L8.5 6.5L4 10.5V2.5Z" fill="currentColor" />
      <rect x="9" y="2.5" width="1.5" height="8" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M6.5 2C4.01 2 2 4.01 2 6.5S4.01 11 6.5 11c1.74 0 3.25-.99 4.01-2.44"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"
      />
      <path d="M9.5 2v2.5H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
