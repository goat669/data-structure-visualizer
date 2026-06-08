"use client";

import { AlgorithmInfo } from "@/lib/algorithms/types";
import { Badge } from "@/components/ui/badge";

interface AlgoInfoPanelProps {
  algo: AlgorithmInfo;
}

export default function AlgoInfoPanel({ algo }: AlgoInfoPanelProps) {
  return (
    <div className="flex items-start gap-6 flex-wrap">
      {/* Description */}
      <div className="flex-1 min-w-48">
        <p className="text-xs text-muted-foreground font-mono leading-relaxed">{algo.description}</p>
      </div>

      {/* Complexity badges */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground w-20 shrink-0">Best Case</span>
          <Badge variant="secondary" className="font-mono text-[10px] bg-neon-dim text-primary border-primary/20">
            {algo.timeComplexity.best}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground w-20 shrink-0">Average</span>
          <Badge variant="secondary" className="font-mono text-[10px] bg-secondary text-foreground">
            {algo.timeComplexity.average}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground w-20 shrink-0">Worst Case</span>
          <Badge variant="secondary" className="font-mono text-[10px] bg-destructive/15 text-destructive border-destructive/20">
            {algo.timeComplexity.worst}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground w-20 shrink-0">Space</span>
          <Badge variant="secondary" className="font-mono text-[10px] bg-chart-2/15 text-chart-2 border-chart-2/20">
            {algo.spaceComplexity}
          </Badge>
        </div>
        {algo.stable !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground w-20 shrink-0">Stable</span>
            <Badge
              variant="secondary"
              className={`font-mono text-[10px] ${algo.stable ? "bg-neon-dim text-primary border-primary/20" : "bg-secondary text-muted-foreground"}`}
            >
              {algo.stable ? "Yes" : "No"}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
