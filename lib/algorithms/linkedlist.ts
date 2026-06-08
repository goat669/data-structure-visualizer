import { LinkedListNode, LinkedListStep } from "./types";

export function runLinkedListAlgo(algoId: string, values: number[], position: number): LinkedListStep[] {
  const steps: LinkedListStep[] = [];

  if (algoId === "ll-insert") {
    return simulateInsert(values, position, steps);
  } else if (algoId === "ll-delete") {
    return simulateDelete(values, position, steps);
  } else if (algoId === "ll-reverse") {
    return simulateReverse(values, steps);
  } else if (algoId === "ll-search") {
    return simulateSearch(values, position, steps);
  }

  return steps;
}

function simulateInsert(values: number[], insertVal: number, steps: LinkedListStep[]): LinkedListStep[] {
  // Initial state
  let nodes: LinkedListNode[] = createNodes(values);
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Starting Insert: value ${insertVal}`,
  });

  // Traverse to insertion point (assume insert at position min(3, length))
  const insertPos = Math.min(3, values.length);
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
    extra: `Insertion complete`,
  });

  return steps;
}

function simulateDelete(values: number[], deletePos: number, steps: LinkedListStep[]): LinkedListStep[] {
  let nodes: LinkedListNode[] = createNodes(values);
  const pos = Math.min(deletePos, values.length - 1);

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Starting Delete at position ${pos}`,
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
    description: `> Found node at position ${pos}`,
  });

  // Delete
  nodes.splice(pos, 1);
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Deleted node at position ${pos}`,
    extra: `Deletion complete`,
  });

  return steps;
}

function simulateReverse(values: number[], steps: LinkedListStep[]): LinkedListStep[] {
  let nodes: LinkedListNode[] = createNodes(values);
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Starting Reverse`,
  });

  // Reverse by swapping pointer directions
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].state = "highlight";
    if (i + 1 < nodes.length) nodes[i + 1].state = "current";

    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      description: `> Reversing pointers: node ${i} to ${i + 1}`,
    });

    nodes[i].state = "visited";
  }
  nodes[nodes.length - 1].state = "visited";

  // Reverse array order
  nodes.reverse();
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Reverse complete`,
    extra: `List reversed`,
  });

  return steps;
}

function simulateSearch(values: number[], target: number, steps: LinkedListStep[]): LinkedListStep[] {
  let nodes: LinkedListNode[] = createNodes(values);
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Searching for value ${target}`,
  });

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
        description: `> Found target ${target} at position ${i}`,
        extra: `Search successful`,
      });
      return steps;
    }
    nodes[i].state = "default";
  }

  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    description: `> Value ${target} not found`,
    extra: `Search failed`,
  });

  return steps;
}

function createNodes(values: number[]): LinkedListNode[] {
  return values.map((val, idx) => ({
    id: idx,
    value: val,
    x: 100 + idx * 120,
    y: 150,
    state: "default" as const,
  }));
}
