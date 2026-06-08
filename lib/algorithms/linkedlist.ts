import { LinkedListNode, LinkedListStep } from "./types";

export type LinkedListType = "singly" | "doubly" | "circular";

export function runLinkedListAlgo(
  algoId: string,
  values: number[],
  insertValue: number,
  insertPosition: number,
  type: LinkedListType = "singly"
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];

  if (algoId === "ll-insert") {
    return simulateInsert(values, insertValue, insertPosition, steps, type);
  } else if (algoId === "ll-search") {
    return simulateSearch(values, insertValue, steps, type);
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
  insertValue: number,
  insertPos: number,
  steps: LinkedListStep[],
  type: LinkedListType
): LinkedListStep[] {
  let nodes: LinkedListNode[] = createNodes(values, type);
  const pos = Math.min(Math.max(0, insertPos), nodes.length);

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> ${getTypeInfo(type)}: Insert ${insertValue} at position ${pos}`,
  });

  // Traverse to insertion point
  for (let i = 0; i < pos && i < nodes.length; i++) {
    nodes[i].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      description: `> Traverse to position ${i}`,
      extra: `Current node: ${nodes[i].value}`,
    });
    nodes[i].state = "default";
  }

  // Create new node
  const newNode: LinkedListNode = {
    id: nodes.length,
    value: insertValue,
    x: 100 + pos * 120,
    y: 150,
    state: "inserted",
  };

  // Insert new node
  nodes.splice(pos, 0, newNode);

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Inserted ${insertValue} at position ${pos}`,
    extra: `${type === "circular" ? "Circular link updated" : "Pointers updated"}`,
  });

  // Mark as visited
  nodes[pos].state = "visited";
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Insertion complete`,
    extra: `New list has ${nodes.length} nodes`,
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
      extra: `Position: ${i}`,
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
    nodes[i].state = "visited";

    if (type === "circular" && i > values.length) break;
  }

  if (!found) {
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      description: `> Value ${target} not found in list`,
      extra: `Searched all ${nodes.length} nodes`,
    });
  }

  return steps;
}
