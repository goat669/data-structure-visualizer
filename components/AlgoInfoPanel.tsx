"use client";

import { useState } from "react";
import { AlgorithmInfo } from "@/lib/algorithms/types";

interface AlgoInfoPanelProps {
  algo: AlgorithmInfo;
}

type Tab = "overview" | "code";

// Inline badge — avoids relying on Tailwind chart-color classes
function ComplexityBadge({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "green" | "neutral" | "red" | "blue";
}) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    green:   { bg: "rgba(74,222,128,0.12)",  color: "#4ade80", border: "rgba(74,222,128,0.25)"  },
    neutral: { bg: "rgba(255,255,255,0.06)", color: "#a0a0a0", border: "rgba(255,255,255,0.10)" },
    red:     { bg: "rgba(224,82,82,0.12)",   color: "#e05252", border: "rgba(224,82,82,0.25)"   },
    blue:    { bg: "rgba(96,165,250,0.12)",  color: "#60a5fa", border: "rgba(96,165,250,0.25)"  },
  };
  const s = styles[accent];
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-muted-foreground w-20 shrink-0">{label}</span>
      <span
        className="text-[10px] font-mono px-2 py-0.5 rounded"
        style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      >
        {value}
      </span>
    </div>
  );
}

export default function AlgoInfoPanel({ algo }: AlgoInfoPanelProps) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex flex-col gap-3">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-2">
        {(["overview", "code"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 text-[11px] font-mono rounded-sm transition-all capitalize ${
              tab === t
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "code" ? "C++ Code" : "Overview"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="flex items-start gap-8 flex-wrap">
          {/* Description */}
          <div className="flex-1 min-w-48">
            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
              {algo.description}
            </p>
          </div>

          {/* Complexities */}
          <div className="flex flex-col gap-2 shrink-0">
            <ComplexityBadge label="Best Case"  value={algo.timeComplexity.best}    accent="green"   />
            <ComplexityBadge label="Average"    value={algo.timeComplexity.average} accent="neutral" />
            <ComplexityBadge label="Worst Case" value={algo.timeComplexity.worst}   accent="red"     />
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <ComplexityBadge label="Space"  value={algo.spaceComplexity}                   accent="blue"    />
            {algo.stable !== undefined && (
              <ComplexityBadge
                label="Stable"
                value={algo.stable ? "Yes" : "No"}
                accent={algo.stable ? "green" : "neutral"}
              />
            )}
          </div>
        </div>
      )}

      {tab === "code" && (
        <div className="relative">
          <div
            className="rounded-md overflow-auto text-[11px] font-mono leading-relaxed p-4"
            style={{ background: "oklch(0.09 0 0)", border: "1px solid oklch(1 0 0 / 8%)" }}
          >
            <pre className="text-foreground/85 whitespace-pre">{algo.cppCode}</pre>
          </div>
          <CopyButton code={algo.cppCode} />
        </div>
      )}
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-[10px] font-mono rounded transition-all"
      style={{
        background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)",
        color:      copied ? "#4ade80" : "#888",
        border:     copied ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.08)",
      }}
      aria-label="Copy C++ code"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
