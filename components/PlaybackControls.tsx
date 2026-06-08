"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlaybackControlsProps {
  isPlaying: boolean;
  isFinished: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // 1-5
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onSpeedChange: (v: number) => void;
  onSliderChange: (step: number) => void;
}

const SPEED_LABELS: Record<number, string> = {
  1: "0.5x",
  2: "1x",
  3: "2x",
  4: "4x",
  5: "8x",
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
    <div className="flex flex-col gap-3">
      {/* Progress slider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-muted-foreground w-6 shrink-0">
          {currentStep}
        </span>
        <Slider
          min={0}
          max={Math.max(0, totalSteps - 1)}
          step={1}
          value={[currentStep]}
          onValueChange={([v]) => onSliderChange(v)}
          className="flex-1"
        />
        <span className="text-[10px] font-mono text-muted-foreground w-8 shrink-0 text-right">
          {totalSteps}
        </span>
      </div>

      {/* Buttons + speed */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {/* Step back */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border"
            onClick={onStepBack}
            disabled={currentStep === 0}
            aria-label="Step back"
          >
            <StepBackIcon />
          </Button>

          {/* Play / Pause */}
          <Button
            size="icon"
            className={cn(
              "h-9 w-9 font-mono",
              isFinished ? "bg-secondary text-foreground hover:bg-secondary/80" : ""
            )}
            onClick={isPlaying ? onPause : onPlay}
            disabled={isFinished}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>

          {/* Step forward */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border"
            onClick={onStepForward}
            disabled={isFinished}
            aria-label="Step forward"
          >
            <StepForwardIcon />
          </Button>

          {/* Reset */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onReset}
            aria-label="Reset"
          >
            <ResetIcon />
          </Button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">Speed</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono transition-all",
                  speed === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
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

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="3" y="2" width="2.5" height="10" rx="1" fill="currentColor" />
      <rect x="8.5" y="2" width="2.5" height="10" rx="1" fill="currentColor" />
    </svg>
  );
}

function StepBackIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M9 2L4 6L9 10V2Z" fill="currentColor" />
      <rect x="2" y="2" width="1.5" height="8" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function StepForwardIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 2L8 6L3 10V2Z" fill="currentColor" />
      <rect x="8.5" y="2" width="1.5" height="8" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M2.5 6.5C2.5 4.29 4.29 2.5 6.5 2.5C7.9 2.5 9.13 3.22 9.9 4.3L8.5 4.3V5.8H11.5V2.8H10V3.82C8.98 2.52 7.34 1.7 6.5 1.7C3.85 1.7 1.7 3.85 1.7 6.5C1.7 9.15 3.85 11.3 6.5 11.3C8.6 11.3 10.4 9.97 11.1 8.1H10.25C9.63 9.52 8.18 10.5 6.5 10.5C4.29 10.5 2.5 8.71 2.5 6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
