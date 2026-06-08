import { GraphNode, GraphEdge, GraphStep } from "./types";

// ─── Default graph layouts ────────────────────────────────────────────────────

/** 8-node undirected weighted graph used for BFS / DFS / Dijkstra / Prim */
export function makeDefaultGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    { id: 0, x: 300, y: 80,  label: "A", state: "default" },
    { id: 1, x: 160, y: 180, label: "B", state: "default" },
    { id: 2, x: 440, y: 180, label: "C", state: "default" },
    { id: 3, x: 80,  y: 300, label: "D", state: "default" },
    { id: 4, x: 260, y: 300, label: "E", state: "default" },
    { id: 5, x: 380, y: 300, label: "F", state: "default" },
    { id: 6, x: 520, y: 300, label: "G", state: "default" },
    { id: 7, x: 300, y: 400, label: "H", state: "default" },
  ];
  const edges: GraphEdge[] = [
    { from: 0, to: 1, weight: 4,  state: "default" },
    { from: 0, to: 2, weight: 2,  state: "default" },
    { from: 1, to: 3, weight: 5,  state: "default" },
    { from: 1, to: 4, weight: 3,  state: "default" },
    { from: 2, to: 4, weight: 1,  state: "default" },
    { from: 2, to: 5, weight: 6,  state: "default" },
    { from: 2, to: 6, weight: 8,  state: "default" },
    { from: 3, to: 7, weight: 2,  state: "default" },
    { from: 4, to: 7, weight: 4,  state: "default" },
    { from: 5, to: 7, weight: 3,  state: "default" },
    { from: 6, to: 7, weight: 1,  state: "default" },
  ];
  return { nodes, edges };
}

/** 6-node DAG for topological sort */
export function makeDAG(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    { id: 0, x: 80,  y: 200, label: "A", state: "default" },
    { id: 1, x: 220, y: 100, label: "B", state: "default" },
    { id: 2, x: 220, y: 300, label: "C", state: "default" },
    { id: 3, x: 360, y: 100, label: "D", state: "default" },
    { id: 4, x: 360, y: 300, label: "E", state: "default" },
    { id: 5, x: 500, y: 200, label: "F", state: "default" },
  ];
  const edges: GraphEdge[] = [
    { from: 0, to: 1, state: "default", directed: true },
    { from: 0, to: 2, state: "default", directed: true },
    { from: 1, to: 3, state: "default", directed: true },
    { from: 1, to: 4, state: "default", directed: true },
    { from: 2, to: 4, state: "default", directed: true },
    { from: 3, to: 5, state: "default", directed: true },
    { from: 4, to: 5, state: "default", directed: true },
  ];
  return { nodes, edges };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cloneNodes(nodes: GraphNode[]): GraphNode[] {
  return nodes.map((n) => ({ ...n }));
}
function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map((e) => ({ ...e }));
}
function snap(nodes: GraphNode[], edges: GraphEdge[], desc: string, extra?: string): GraphStep {
  return { nodes: cloneNodes(nodes), edges: cloneEdges(edges), description: desc, extra };
}

function getNeighbours(edges: GraphEdge[], nodeId: number, directed = false): { id: number; edgeIdx: number; weight: number }[] {
  const result: { id: number; edgeIdx: number; weight: number }[] = [];
  edges.forEach((e, i) => {
    if (e.from === nodeId) result.push({ id: e.to, edgeIdx: i, weight: e.weight ?? 1 });
    if (!directed && e.to === nodeId) result.push({ id: e.from, edgeIdx: i, weight: e.weight ?? 1 });
  });
  return result;
}

// ─── BFS ─────────────────────────────────────────────────────────────────────

export function bfsSteps(src = 0): GraphStep[] {
  const { nodes, edges } = makeDefaultGraph();
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const queue: number[] = [];

  steps.push(snap(nodes, edges, `Starting BFS from node ${nodes[src].label}`, `Queue: [${nodes[src].label}]`));

  visited.add(src);
  queue.push(src);
  nodes[src].state = "current";
  steps.push(snap(nodes, edges, `Enqueue ${nodes[src].label}, mark visited`, `Queue: [${nodes[src].label}]`));

  while (queue.length > 0) {
    const u = queue.shift()!;
    nodes[u].state = "visiting";
    const qLabels = queue.map((id) => nodes[id].label).join(", ");
    steps.push(snap(nodes, edges, `Dequeue ${nodes[u].label} — exploring neighbours`, `Queue: [${qLabels || "empty"}]`));

    for (const { id: v, edgeIdx } of getNeighbours(edges, u)) {
      if (!visited.has(v)) {
        edges[edgeIdx].state = "active";
        nodes[v].state = "queued";
        visited.add(v);
        queue.push(v);
        const ql = queue.map((id) => nodes[id].label).join(", ");
        steps.push(snap(nodes, edges, `Discover ${nodes[v].label} via ${nodes[u].label} — enqueue`, `Queue: [${ql}]`));
        edges[edgeIdx].state = "path";
      } else {
        edges[edgeIdx].state = edges[edgeIdx].state === "path" ? "path" : "rejected";
        steps.push(snap(nodes, edges, `${nodes[v].label} already visited — skip`, `Queue: [${queue.map((id) => nodes[id].label).join(", ")}]`));
      }
    }

    nodes[u].state = "visited";
    steps.push(snap(nodes, edges, `${nodes[u].label} fully explored`, `Queue: [${queue.map((id) => nodes[id].label).join(", ")}]`));
  }

  steps.push(snap(nodes, edges, "BFS complete — all reachable nodes visited", "Queue: [empty]"));
  return steps;
}

// ─── DFS ─────────────────────────────────────────────────────────────────────

export function dfsSteps(src = 0): GraphStep[] {
  const { nodes, edges } = makeDefaultGraph();
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const stackTrace: string[] = [];

  steps.push(snap(nodes, edges, `Starting DFS from node ${nodes[src].label}`, `Stack: []`));

  function dfs(u: number) {
    visited.add(u);
    nodes[u].state = "current";
    stackTrace.push(nodes[u].label);
    steps.push(snap(nodes, edges, `Visit ${nodes[u].label} — push onto call stack`, `Stack: [${stackTrace.join(", ")}]`));

    for (const { id: v, edgeIdx } of getNeighbours(edges, u)) {
      if (!visited.has(v)) {
        edges[edgeIdx].state = "active";
        steps.push(snap(nodes, edges, `Explore edge ${nodes[u].label} → ${nodes[v].label}`, `Stack: [${stackTrace.join(", ")}]`));
        dfs(v);
        edges[edgeIdx].state = "path";
      } else {
        edges[edgeIdx].state = edges[edgeIdx].state === "path" ? "path" : "rejected";
        steps.push(snap(nodes, edges, `${nodes[v].label} already visited — backtrack`, `Stack: [${stackTrace.join(", ")}]`));
      }
    }

    nodes[u].state = "visited";
    stackTrace.pop();
    steps.push(snap(nodes, edges, `Backtrack from ${nodes[u].label}`, `Stack: [${stackTrace.join(", ")}]`));
  }

  dfs(src);
  steps.push(snap(nodes, edges, "DFS complete", "Stack: []"));
  return steps;
}

// ─── Dijkstra ────────────────────────────────────────────────────────────────

export function dijkstraSteps(src = 0): GraphStep[] {
  const { nodes, edges } = makeDefaultGraph();
  const steps: GraphStep[] = [];
  const n = nodes.length;
  const dist = Array(n).fill(Infinity);
  const visited = new Set<number>();

  dist[src] = 0;
  steps.push(snap(nodes, edges, `Init Dijkstra from ${nodes[src].label}. dist[${nodes[src].label}]=0`, `dist: [${dist.map((d, i) => `${nodes[i].label}:${d === Infinity ? "∞" : d}`).join(" ")}]`));

  for (let iter = 0; iter < n; iter++) {
    // Pick min-dist unvisited node
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1 || dist[u] === Infinity) break;

    visited.add(u);
    nodes[u].state = "current";
    steps.push(snap(nodes, edges, `Pick node ${nodes[u].label} (dist=${dist[u]}) — minimum unvisited`, `dist: [${dist.map((d, i) => `${nodes[i].label}:${d === Infinity ? "∞" : d}`).join(" ")}]`));

    for (const { id: v, edgeIdx, weight } of getNeighbours(edges, u)) {
      if (visited.has(v)) continue;
      edges[edgeIdx].state = "active";
      const newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        nodes[v].state = "queued";
        steps.push(snap(nodes, edges, `Relax edge ${nodes[u].label}→${nodes[v].label}: dist[${nodes[v].label}]=${newDist}`, `dist: [${dist.map((d, i) => `${nodes[i].label}:${d === Infinity ? "∞" : d}`).join(" ")}]`));
        edges[edgeIdx].state = "path";
      } else {
        edges[edgeIdx].state = "rejected";
        steps.push(snap(nodes, edges, `Edge ${nodes[u].label}→${nodes[v].label} not shorter — skip`, `dist: [${dist.map((d, i) => `${nodes[i].label}:${d === Infinity ? "∞" : d}`).join(" ")}]`));
      }
    }

    nodes[u].state = "visited";
    steps.push(snap(nodes, edges, `${nodes[u].label} finalized with shortest dist=${dist[u]}`, `dist: [${dist.map((d, i) => `${nodes[i].label}:${d === Infinity ? "∞" : d}`).join(" ")}]`));
  }

  steps.push(snap(nodes, edges, "Dijkstra complete — all shortest paths found", `dist: [${dist.map((d, i) => `${nodes[i].label}:${d === Infinity ? "∞" : d}`).join(" ")}]`));
  return steps;
}

// ─── Topological Sort ────────────────────────────────────────────────────────

export function topoSortSteps(): GraphStep[] {
  const { nodes, edges } = makeDAG();
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const order: string[] = [];

  steps.push(snap(nodes, edges, "Starting Topological Sort (DFS-based) on DAG", "Order: []"));

  function dfs(u: number) {
    visited.add(u);
    nodes[u].state = "current";
    steps.push(snap(nodes, edges, `Visit ${nodes[u].label}`, `Order: [${order.join(", ")}]`));

    for (const { id: v, edgeIdx } of getNeighbours(edges, u, true)) {
      if (!visited.has(v)) {
        edges[edgeIdx].state = "active";
        steps.push(snap(nodes, edges, `Follow edge ${nodes[u].label} → ${nodes[v].label}`, `Order: [${order.join(", ")}]`));
        dfs(v);
        edges[edgeIdx].state = "path";
      }
    }

    nodes[u].state = "visited";
    order.unshift(nodes[u].label);
    steps.push(snap(nodes, edges, `${nodes[u].label} finished — prepend to order`, `Order: [${order.join(", ")}]`));
  }

  for (let i = 0; i < nodes.length; i++) {
    if (!visited.has(i)) dfs(i);
  }

  steps.push(snap(nodes, edges, "Topological Sort complete", `Order: [${order.join(" → ")}]`));
  return steps;
}

// ─── Prim's MST ──────────────────────────────────────────────────────────────

export function primSteps(src = 0): GraphStep[] {
  const { nodes, edges } = makeDefaultGraph();
  const steps: GraphStep[] = [];
  const n = nodes.length;
  const inMST = new Set<number>();
  const key = Array(n).fill(Infinity);
  const parent = Array(n).fill(-1);
  key[src] = 0;
  let totalWeight = 0;

  steps.push(snap(nodes, edges, `Init Prim's MST from ${nodes[src].label}`, "MST edges: []"));

  for (let iter = 0; iter < n; iter++) {
    // Pick minimum key not in MST
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!inMST.has(i) && (u === -1 || key[i] < key[u])) u = i;
    }
    if (u === -1) break;

    inMST.add(u);
    nodes[u].state = "current";

    if (parent[u] !== -1) {
      const edgeIdx = edges.findIndex(
        (e) => (e.from === parent[u] && e.to === u) || (e.from === u && e.to === parent[u])
      );
      if (edgeIdx >= 0) edges[edgeIdx].state = "path";
      totalWeight += key[u];
      steps.push(snap(nodes, edges, `Add ${nodes[parent[u]].label}–${nodes[u].label} (w=${key[u]}) to MST`, `MST weight: ${totalWeight}`));
    } else {
      steps.push(snap(nodes, edges, `Start MST at ${nodes[u].label}`, `MST weight: ${totalWeight}`));
    }

    for (const { id: v, edgeIdx, weight } of getNeighbours(edges, u)) {
      if (!inMST.has(v)) {
        if (weight < key[v]) {
          key[v] = weight;
          parent[v] = u;
          nodes[v].state = "queued";
          edges[edgeIdx].state = "active";
          steps.push(snap(nodes, edges, `Update key[${nodes[v].label}]=${weight} via ${nodes[u].label}`, `MST weight: ${totalWeight}`));
        }
      }
    }

    nodes[u].state = "visited";
  }

  steps.push(snap(nodes, edges, `Prim's MST complete — total weight: ${totalWeight}`, `MST weight: ${totalWeight}`));
  return steps;
}
