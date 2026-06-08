// Linked List Node visualization types
export interface LLNode {
  id: number;
  value: number;
  state: "default" | "comparing" | "visited" | "highlight" | "found" | "sorted";
  x: number;
  y: number;
}

export interface LinkedListStep {
  nodes: LLNode[];
  description: string;
  detail: string;
  comparisons: number;
  operations: number;
}

export interface LinkedListConfig {
  type: "singly" | "doubly" | "circular";
  operation: "insert" | "delete" | "search" | "reverse";
  initialSize: number;
  values?: number[];
  position?: number;
  searchValue?: number;
}
