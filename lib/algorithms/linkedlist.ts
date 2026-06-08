import { LinkedListNode, LinkedListStep } from "./types";

export type LinkedListType = "singly" | "doubly" | "circular";

export function runLinkedListAlgo(
  algoId: string,
  values: number[],
  position: number,
  type: LinkedListType = "singly"
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];

  if (algoId === "ll-insert") {
    return simulateInsert(values, position, steps, type);
  } else if (algoId === "ll-delete") {
    return simulateDelete(values, position, steps, type);
  } else if (algoId === "ll-reverse") {
    return simulateReverse(values, steps, type);
  } else if (algoId === "ll-search") {
    return simulateSearch(values, position, steps, type);
  }

  return steps;
}

function createNodes(values: number[], type: LinkedListType): LinkedListNode[] {
  return values.map((val, idx) => ({
    id: idx,
    value: val,
    x: 100 + idx * 120,
    y: 150,
    state: "default" as const,
  }));
}

function getTypeInfo(type: LinkedListType): string {
  if (type === "singly") return "Singly Linked List (single direction)";
  if (type === "doubly") return "Doubly Linked List (bidirectional)";
  if (type === "circular") return "Circular Linked List (loops back)";
  return "";
}

function simulateInsert(
  values: number[],
  insertVal: number,
  steps: LinkedListStep[],
  type: LinkedListType
): LinkedListStep[] {
  let nodes: LinkedListNode[] = createNodes(values, type);
  
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> ${getTypeInfo(type)}: Insert ${insertVal}`,
  });

  const insertPos = Math.min(2, values.length);
  
  // Traverse to insertion point
  for (let i = 0; i < insertPos; i++) {
    nodes[i].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      description: `> Traverse to position ${i}`,
      extra: `Position: ${i}`,
    });
    nodes[i].state = "default";
  }

  // Insert new node
  nodes.splice(insertPos, 0, {
    id: nodes.length,
    value: insertVal,
    x: 100 + insertPos * 120,
    y: 150,
    state: "inserted",
  });

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Inserted ${insertVal} at position ${insertPos}`,
    extra: `${type === "circular" ? "Updated circle link" : "Pointer updated"}`,
  });

  return steps;
}

function simulateDelete(
  values: number[],
  deletePos: number,
  steps: LinkedListStep[],
  type: LinkedListType
): LinkedListStep[] {
  let nodes: LinkedListNode[] = createNodes(values, type);
  const pos = Math.min(deletePos, values.length - 1);

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> ${getTypeInfo(type)}: Delete at position ${pos}`,
  });

  // Traverse to deletion point
  for (let i = 0; i < pos; i++) {
    nodes[i].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      description: `> Traverse to position ${i}`,
    });
    nodes[i].state = "default";
  }

  // Mark for deletion
  nodes[pos].state = "deleted";
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Found node at position ${pos}: value ${nodes[pos].value}`,
  });

  // Delete
  nodes.splice(pos, 1);
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Deleted node at position ${pos}`,
    extra: `${type === "doubly" ? "Updated prev/next" : "Pointer rerouted"}`,
  });

  return steps;
}

function simulateReverse(
  values: number[],
  steps: LinkedListStep[],
  type: LinkedListType
): LinkedListStep[] {
  let nodes: LinkedListNode[] = createNodes(values, type);
  
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> ${getTypeInfo(type)}: Reverse the list`,
  });

  // Show pointer reversal
  for (let i = 0; i < Math.min(nodes.length - 1, 4); i++) {
    nodes[i].state = "highlight";
    if (i + 1 < nodes.length) nodes[i + 1].state = "current";

    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      description: `> Reversing: node ${i} ↔ ${i + 1}`,
    });

    nodes[i].state = "visited";
  }

  // Final reversed state
  nodes.reverse();
  nodes.forEach((n) => (n.state = "visited"));
  
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Reverse complete`,
    extra: type === "circular" ? "Circle direction reversed" : "Pointers reversed",
  });

  return steps;
}

function simulateSearch(
  values: number[],
  target: number,
  steps: LinkedListStep[],
  type: LinkedListType
): LinkedListStep[] {
  let nodes: LinkedListNode[] = createNodes(values, type);
  
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> ${getTypeInfo(type)}: Search for ${target}`,
  });

  let found = false;
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      description: `> Checking node ${i}: value ${nodes[i].value}`,
    });

    if (nodes[i].value === target) {
      nodes[i].state = "found";
      steps.push({
        nodes: JSON.parse(JSON.stringify(nodes)),
        description: `> Found ${target} at position ${i}`,
        extra: `Search successful`,
      });
      found = true;
      break;
    }
    nodes[i].state = "default";

    // For circular, limit iterations
    if (type === "circular" && i > values.length) break;
  }

  if (!found) {
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      description: `> Value ${target} not found`,
      extra: `Search failed`,
    });
  }

  return steps;
}
