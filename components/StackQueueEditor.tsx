"use client";

import { useState } from "react";
import { StackOp, QueueOp } from "@/lib/algorithms/stackqueue";

// ─── Stack Editor ─────────────────────────────────────────────────────────────

interface StackEditorProps {
  sequence: StackOp[];
  onChange: (seq: StackOp[]) => void;
  onRun: () => void;
}

export function StackEditor({ sequence, onChange, onRun }: StackEditorProps) {
  const [op, setOp]   = useState<"push" | "pop" | "peek">("push");
  const [val, setVal] = useState("10");

  function add() {
    const v = op === "push" ? val.trim() : "";
    if (op === "push" && !v) return;
    onChange([...sequence, { op, val: v }]);
  }

  function remove(i: number) {
    onChange(sequence.filter((_, idx) => idx !== i));
  }

  function reset() {
    onChange([
      { op: "push", val: "10" }, { op: "push", val: "25" }, { op: "push", val: "8" },
      { op: "peek", val: ""   }, { op: "push", val: "42" }, { op: "pop",  val: "" },
      { op: "pop",  val: ""   }, { op: "push", val: "15" }, { op: "pop",  val: "" },
      { op: "pop",  val: ""   },
    ]);
  }

  return <SequenceEditor title="Stack Operations" ops={sequence as GenericOp[]} opOptions={["push","pop","peek"]} val={val} op={op} setOp={o => setOp(o as "push"|"pop"|"peek")} setVal={setVal} add={add} remove={remove} reset={reset} onRun={onRun} showVal={op === "push"} opColor={{ push: "#4ade80", pop: "#e05252", peek: "#60a5fa" }} />;
}

// ─── Queue Editor ─────────────────────────────────────────────────────────────

interface QueueEditorProps {
  sequence: QueueOp[];
  onChange: (seq: QueueOp[]) => void;
  onRun: () => void;
}

export function QueueEditor({ sequence, onChange, onRun }: QueueEditorProps) {
  const [op, setOp]   = useState<"enqueue" | "dequeue" | "front">("enqueue");
  const [val, setVal] = useState("10");

  function add() {
    const v = op === "enqueue" ? val.trim() : "";
    if (op === "enqueue" && !v) return;
    onChange([...sequence, { op, val: v }]);
  }

  function remove(i: number) {
    onChange(sequence.filter((_, idx) => idx !== i));
  }

  function reset() {
    onChange([
      { op: "enqueue", val: "10" }, { op: "enqueue", val: "25" }, { op: "enqueue", val: "8" },
      { op: "front",   val: ""   }, { op: "enqueue", val: "42" }, { op: "dequeue", val: "" },
      { op: "dequeue", val: ""   }, { op: "enqueue", val: "15" }, { op: "dequeue", val: "" },
      { op: "dequeue", val: ""   },
    ]);
  }

  return <SequenceEditor title="Queue Operations" ops={sequence as GenericOp[]} opOptions={["enqueue","dequeue","front"]} val={val} op={op} setOp={o => setOp(o as "enqueue"|"dequeue"|"front")} setVal={setVal} add={add} remove={remove} reset={reset} onRun={onRun} showVal={op === "enqueue"} opColor={{ enqueue: "#4ade80", dequeue: "#e05252", front: "#60a5fa" }} />;
}

// ─── Expression Editor (Brackets & Infix) ─────────────────────────────────────

interface ExprEditorProps {
  label: string;
  expr: string;
  placeholder: string;
  onChange: (v: string) => void;
  onRun: () => void;
}

export function ExprEditor({ label, expr, placeholder, onChange, onRun }: ExprEditorProps) {
  const btnBase: React.CSSProperties = {
    fontFamily: "monospace", fontSize: 11, borderRadius: 4,
    cursor: "pointer", padding: "4px 10px", border: "1px solid #2a2a2a",
  };
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666" }}>
          {label}
        </span>
        <button onClick={onRun} style={{ ...btnBase, background: "#0f2a0f", borderColor: "#4ade80", color: "#4ade80", fontSize: 12, padding: "5px 14px" }}>
          Run Algorithm
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <label style={{ fontSize: 10, fontFamily: "monospace", color: "#666" }}>Expression</label>
        <input
          type="text"
          value={expr}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 4,
            color: "#d4d4d4", fontFamily: "monospace", fontSize: 13, padding: "7px 10px",
            outline: "none", width: "100%",
          }}
        />
        <span style={{ fontSize: 10, fontFamily: "monospace", color: "#444" }}>
          Use letters, digits, brackets, and operators (+, -, *, /)
        </span>
      </div>
    </div>
  );
}

// ─── Generic sequence editor (shared) ─────────────────────────────────────────

type GenericOp = { op: string; val: string };

interface SequenceEditorProps {
  title: string;
  ops: GenericOp[];
  opOptions: string[];
  val: string;
  op: string;
  setOp: (v: string) => void;
  setVal: (v: string) => void;
  add: () => void;
  remove: (i: number) => void;
  reset: () => void;
  onRun: () => void;
  showVal: boolean;
  opColor: Record<string, string>;
}

function SequenceEditor({ title, ops, opOptions, val, op, setOp, setVal, add, remove, reset, onRun, showVal, opColor }: SequenceEditorProps) {
  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontFamily: "monospace", textTransform: "uppercase",
    letterSpacing: "0.08em", color: "#666",
  };
  const btnBase: React.CSSProperties = {
    fontFamily: "monospace", fontSize: 11, borderRadius: 4,
    cursor: "pointer", padding: "4px 10px", border: "1px solid #2a2a2a",
  };
  const inputStyle: React.CSSProperties = {
    background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 4,
    color: "#d4d4d4", fontFamily: "monospace", fontSize: 12, padding: "5px 8px",
    outline: "none",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span style={labelStyle}>{title}</span>
        <div className="flex gap-2">
          <button onClick={reset} style={{ ...btnBase, background: "#141414", color: "#666" }}>
            Reset
          </button>
          <button onClick={onRun} style={{ ...btnBase, background: "#0f2a0f", borderColor: "#4ade80", color: "#4ade80", fontSize: 12, padding: "5px 14px" }}>
            Run Algorithm
          </button>
        </div>
      </div>

      {/* Add operation row */}
      <div className="flex items-end gap-2 flex-wrap">
        <div className="flex flex-col gap-1">
          <label style={labelStyle}>Operation</label>
          <select value={op} onChange={e => setOp(e.target.value)} style={{ ...inputStyle, width: 110 }}>
            {opOptions.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
          </select>
        </div>
        {showVal && (
          <div className="flex flex-col gap-1">
            <label style={labelStyle}>Value</label>
            <input
              type="text" value={val} onChange={e => setVal(e.target.value)}
              placeholder="e.g. 42" maxLength={6}
              style={{ ...inputStyle, width: 80 }}
              onKeyDown={e => e.key === "Enter" && add()}
            />
          </div>
        )}
        <button
          onClick={add}
          style={{ ...btnBase, background: "#0f1a2a", borderColor: "#60a5fa", color: "#60a5fa", marginBottom: 1 }}
        >
          + Add
        </button>
      </div>

      {/* Operation sequence */}
      {ops.length > 0 && (
        <div>
          <label style={{ ...labelStyle, display: "block", marginBottom: 6 }}>Sequence ({ops.length} operations)</label>
          <div className="flex flex-wrap gap-1.5">
            {ops.map((o, i) => {
              const color = opColor[o.op] ?? "#888";
              return (
                <div key={i} className="flex items-center gap-0.5"
                  style={{ background: "#0f0f0f", border: `1px solid ${color}22`, borderRadius: 4, padding: "3px 8px" }}
                >
                  <span style={{ fontFamily: "monospace", fontSize: 11, color, textTransform: "uppercase" }}>{o.op}</span>
                  {o.val && <span style={{ fontFamily: "monospace", fontSize: 11, color: "#aaa" }}>&nbsp;{o.val}</span>}
                  <button
                    onClick={() => remove(i)}
                    style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 13, paddingLeft: 4, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
