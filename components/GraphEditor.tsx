"use client";

import { useState } from "react";
import { GraphNode, GraphEdge } from "@/lib/algorithms/types";
import { layoutNodes } from "@/lib/algorithms/graph";

export interface GraphConfig {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode: number;
}

interface Props {
  config: GraphConfig;
  algoId: string;
  onChange: (cfg: GraphConfig) => void;
  onRun: () => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const needsWeight = (id: string) => ["dijkstra", "prim"].includes(id);
const isDirected  = (id: string) => id === "topo";

export default function GraphEditor({ config, algoId, onChange, onRun }: Props) {
  const [edgeFrom,   setEdgeFrom]   = useState("0");
  const [edgeTo,     setEdgeTo]     = useState("1");
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [error,      setError]      = useState("");

  const withWeight = needsWeight(algoId);
  const directed   = isDirected(algoId);

  // ─── Nodes ────────────────────────────────────────────────────────────────

  function addNode() {
    if (config.nodes.length >= 10) { setError("Maximum 10 nodes allowed."); return; }
    const label = ALPHABET[config.nodes.length] ?? String(config.nodes.length);
    const newNodes = layoutNodes([...config.nodes.map(n => n.label), label]);
    onChange({ ...config, nodes: newNodes });
    setError("");
  }

  function removeNode(id: number) {
    if (config.nodes.length <= 2) { setError("Minimum 2 nodes required."); return; }
    const newNodes = config.nodes
      .filter(n => n.id !== id)
      .map((n, i) => ({ ...n, id: i }));
    // Remap edge indices; drop edges that referenced removed node
    const newEdges = config.edges
      .filter(e => e.from !== id && e.to !== id)
      .map(e => ({
        ...e,
        from: e.from > id ? e.from - 1 : e.from,
        to:   e.to   > id ? e.to   - 1 : e.to,
      }));
    const newStart = config.startNode === id
      ? 0
      : config.startNode > id
        ? config.startNode - 1
        : config.startNode;
    onChange({ nodes: newNodes, edges: newEdges, startNode: newStart });
    setError("");
  }

  // ─── Edges ────────────────────────────────────────────────────────────────

  function addEdge() {
    const from = parseInt(edgeFrom, 10);
    const to   = parseInt(edgeTo,   10);
    const w    = parseInt(edgeWeight, 10) || 1;

    if (isNaN(from) || isNaN(to)) { setError("Select valid nodes."); return; }
    if (from === to)              { setError("Cannot connect a node to itself."); return; }
    if (from >= config.nodes.length || to >= config.nodes.length) { setError("Node index out of range."); return; }

    const duplicate = config.edges.some(
      e => (e.from === from && e.to === to) || (!directed && e.from === to && e.to === from)
    );
    if (duplicate) { setError("Edge already exists."); return; }

    const newEdge: GraphEdge = { from, to, weight: withWeight ? w : undefined, state: "default", directed: directed || undefined };
    onChange({ ...config, edges: [...config.edges, newEdge] });
    setError("");
  }

  function removeEdge(idx: number) {
    onChange({ ...config, edges: config.edges.filter((_, i) => i !== idx) });
    setError("");
  }

  function setStart(id: number) {
    onChange({ ...config, startNode: id });
  }

  const labelStyle = {
    fontSize: "10px", fontFamily: "monospace", textTransform: "uppercase" as const,
    letterSpacing: "0.08em", color: "#666", marginBottom: 4, display: "block",
  };
  const inputStyle = {
    background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 4,
    color: "#d4d4d4", fontFamily: "monospace", fontSize: 12, padding: "5px 8px",
    outline: "none", width: "100%",
  };
  const btnBase = {
    fontFamily: "monospace", fontSize: 11, borderRadius: 4, cursor: "pointer",
    padding: "4px 10px", border: "1px solid #2a2a2a",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span style={{ ...labelStyle, marginBottom: 0 }}>Graph Editor</span>
        <button
          onClick={() => { setError(""); onRun(); }}
          style={{ ...btnBase, background: "#0f2a0f", borderColor: "#4ade80", color: "#4ade80", padding: "5px 14px", fontSize: 12 }}
        >
          Run Algorithm
        </button>
      </div>

      {error && (
        <div style={{ background: "#2a0f0f", border: "1px solid #e05252", borderRadius: 4, padding: "5px 10px", color: "#e05252", fontFamily: "monospace", fontSize: 11 }}>
          {error}
        </div>
      )}

      {/* Nodes */}
      <div>
        <label style={labelStyle}>Nodes</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {config.nodes.map((n) => (
            <div key={n.id} className="flex items-center gap-1">
              <button
                onClick={() => setStart(n.id)}
                title="Set as start node"
                style={{
                  ...btnBase,
                  padding: "3px 10px",
                  background: config.startNode === n.id ? "#0f2a0f" : "#141414",
                  borderColor: config.startNode === n.id ? "#4ade80" : "#2a2a2a",
                  color: config.startNode === n.id ? "#4ade80" : "#aaa",
                  fontSize: 12,
                }}
              >
                {n.label}
              </button>
              <button
                onClick={() => removeNode(n.id)}
                title="Remove node"
                style={{ ...btnBase, padding: "3px 6px", background: "#1a0f0f", borderColor: "#3a1a1a", color: "#e05252", fontSize: 11 }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addNode}
            style={{ ...btnBase, padding: "3px 10px", background: "#141414", color: "#888", fontSize: 12 }}
          >
            + Add Node
          </button>
        </div>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#555" }}>
          Click a node label to set it as the start node (highlighted green)
          {directed ? "" : " · Undirected graph"}
          {directed ? " · Directed graph" : ""}
        </div>
      </div>

      {/* Add Edge */}
      <div>
        <label style={labelStyle}>Add Edge</label>
        <div className="flex items-end gap-2 flex-wrap">
          <div className="flex flex-col gap-1" style={{ minWidth: 70 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>From</label>
            <select value={edgeFrom} onChange={e => setEdgeFrom(e.target.value)} style={{ ...inputStyle, width: 70 }}>
              {config.nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <div style={{ color: "#555", fontFamily: "monospace", marginBottom: 6 }}>
            {directed ? "→" : "—"}
          </div>
          <div className="flex flex-col gap-1" style={{ minWidth: 70 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>To</label>
            <select value={edgeTo} onChange={e => setEdgeTo(e.target.value)} style={{ ...inputStyle, width: 70 }}>
              {config.nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          {withWeight && (
            <div className="flex flex-col gap-1" style={{ minWidth: 60 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Weight</label>
              <input
                type="number" min={1} max={99} value={edgeWeight}
                onChange={e => setEdgeWeight(e.target.value)}
                style={{ ...inputStyle, width: 60 }}
              />
            </div>
          )}
          <button
            onClick={addEdge}
            style={{ ...btnBase, background: "#0f1a2a", borderColor: "#60a5fa", color: "#60a5fa", marginBottom: 1 }}
          >
            + Edge
          </button>
        </div>
      </div>

      {/* Edge list */}
      {config.edges.length > 0 && (
        <div>
          <label style={labelStyle}>Current Edges</label>
          <div className="flex flex-wrap gap-1.5">
            {config.edges.map((e, i) => (
              <div key={i} className="flex items-center gap-1"
                style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 4, padding: "3px 8px" }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#aaa" }}>
                  {config.nodes[e.from]?.label ?? e.from}
                  {directed ? " → " : " — "}
                  {config.nodes[e.to]?.label ?? e.to}
                  {withWeight && e.weight !== undefined ? ` (${e.weight})` : ""}
                </span>
                <button
                  onClick={() => removeEdge(i)}
                  style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13, padding: "0 0 0 4px", lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
