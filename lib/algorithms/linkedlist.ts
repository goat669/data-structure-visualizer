import { LinkedListStep } from "./types";

export function runLinkedListAlgo(
  algoId: string,
  initialValues: number[],
  operation: "insert" | "find" | "delete",
  position: number,
  value: number,
  llType: "singly" | "doubly" | "circular"
): LinkedListStep[] {
  if (operation === "insert") {
    return generateInsertSteps(initialValues, position, value);
  } else if (operation === "find") {
    return generateFindSteps(initialValues, value);
  } else if (operation === "delete") {
    return generateDeleteSteps(initialValues, position);
  }
  return [];
}

function generateInsertSteps(
  values: number[],
  position: number,
  value: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), values.length);

  // Step 1: Show original list
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: "default" as const,
      nextArrow: "default" as const,
    })),
    description: `Original list: [${values.join(", ")}]`,
    extra: `Preparing to insert ${value} at position ${clampedPos}`,
  });

  // Step 2: Highlight insertion position
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: i === clampedPos ? "highlight" : "default",
      nextArrow: "default" as const,
    })),
    description: `Insertion point selected at position ${clampedPos}`,
    extra: `New node with value ${value} will be inserted here`,
  });

  // Step 3: Create new node (show it separately)
  const nodesWithNew = [
    ...values.slice(0, clampedPos).map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: "default" as const,
      nextArrow: "default" as const,
    })),
    {
      id: clampedPos,
      value: value,
      x: 100 + clampedPos * 80,
      y: 30,
      state: "inserted" as const,
      nextArrow: "default" as const,
    },
    ...values.slice(clampedPos).map((v, i) => ({
      id: clampedPos + 1 + i,
      value: v,
      x: 100 + (clampedPos + 1 + i) * 80,
      y: 100,
      state: "default" as const,
      nextArrow: "default" as const,
    })),
  ];

  steps.push({
    nodes: nodesWithNew,
    description: `New node created with value ${value}`,
    extra: `Node ready to be inserted at position ${clampedPos}`,
  });

  // Step 4: Move elements and insert (shift phase)
  for (let i = clampedPos; i < values.length; i++) {
    const animatedNodes = [
      ...values.slice(0, clampedPos).map((v, idx) => ({
        id: idx,
        value: v,
        x: 100 + idx * 80,
        y: 100,
        state: "default" as const,
        nextArrow: "default" as const,
      })),
      {
        id: clampedPos,
        value: value,
        x: 100 + clampedPos * 80,
        y: 30,
        state: "inserted" as const,
        nextArrow: "default" as const,
      },
      ...values.slice(clampedPos).map((v, idx) => ({
        id: clampedPos + 1 + idx,
        value: v,
        x: 100 + (clampedPos + 1 + idx) * 80,
        y: 100,
        state: idx <= i - clampedPos ? "comparing" : "default",
        nextArrow: "default" as const,
      })),
    ];

    steps.push({
      nodes: animatedNodes,
      description: `Shifting elements: Element at position ${i} moves to position ${i + 1}`,
      extra: `Elements after position ${clampedPos} are being shifted right`,
    });
  }

  // Step 5: Final state - show completed insertion
  const finalNodes = [
    ...values.slice(0, clampedPos),
    value,
    ...values.slice(clampedPos),
  ];

  steps.push({
    nodes: finalNodes.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: i === clampedPos ? "inserted" : "default",
      nextArrow: "default" as const,
    })),
    description: `Insertion complete! New list: [${finalNodes.join(", ")}]`,
    extra: `Successfully inserted ${value} at position ${clampedPos}`,
  });

  return steps;
}

function generateFindSteps(
  values: number[],
  target: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const foundIndex = values.indexOf(target);

  // Step 1: Show list and target to find
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: "default" as const,
      nextArrow: "default" as const,
    })),
    description: `Searching for value ${target} in the linked list`,
    extra: `Starting from HEAD, traversing the list node by node`,
  });

  // Step 2-N: Traverse and check each node
  for (let i = 0; i <= values.length; i++) {
    if (i === foundIndex) {
      steps.push({
        nodes: values.map((v, idx) => ({
          id: idx,
          value: v,
          x: 100 + idx * 80,
          y: 100,
          state: idx === i ? "found" : idx < i ? "visited" : "default",
          nextArrow: "default" as const,
        })),
        description: `Found ${target} at position ${i}!`,
        extra: `Search completed after checking ${i + 1} node(s)`,
      });
      break;
    } else if (i < values.length) {
      steps.push({
        nodes: values.map((v, idx) => ({
          id: idx,
          value: v,
          x: 100 + idx * 80,
          y: 100,
          state: idx === i ? "comparing" : idx < i ? "visited" : "default",
          nextArrow: "default" as const,
        })),
        description: `Checking position ${i}: value is ${values[i]}, not ${target}`,
        extra: `Moving to next node...`,
      });
    }
  }

  // Step N+1: Not found
  if (foundIndex === -1) {
    steps.push({
      nodes: values.map((v, i) => ({
        id: i,
        value: v,
        x: 100 + i * 80,
        y: 100,
        state: "visited" as const,
        nextArrow: "default" as const,
      })),
      description: `Value ${target} not found in the list`,
      extra: `Traversed all ${values.length} node(s), search unsuccessful`,
    });
  }

  return steps;
}

function generateDeleteSteps(
  values: number[],
  position: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), values.length - 1);

  // Step 1: Show original list
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: "default" as const,
      nextArrow: "default" as const,
    })),
    description: `Original list: [${values.join(", ")}]`,
    extra: `Preparing to delete element at position ${clampedPos}`,
  });

  // Step 2: Highlight node to delete
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: i === clampedPos ? "highlight" : "default",
      nextArrow: "default" as const,
    })),
    description: `Node to delete selected: position ${clampedPos}, value ${values[clampedPos]}`,
    extra: `Node is now marked for deletion`,
  });

  // Step 3: Highlight node to delete more prominently
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      x: i === clampedPos ? 100 + i * 80 : 100 + i * 80,
      y: i === clampedPos ? 30 : 100,
      state: i === clampedPos ? "highlight" : "default",
      nextArrow: "default" as const,
    })),
    description: `Removing node ${values[clampedPos]} from the list`,
    extra: `Breaking the link to this node`,
  });

  // Step 4-N: Shift remaining elements
  for (let i = clampedPos; i < values.length - 1; i++) {
    const intermediateValues = values.filter((_, idx) => idx !== clampedPos);
    steps.push({
      nodes: intermediateValues.map((v, idx) => ({
        id: idx,
        value: v,
        x: 100 + idx * 80,
        y: 100,
        state: idx >= clampedPos ? "comparing" : "default",
        nextArrow: "default" as const,
      })),
      description: `Shifting elements: position ${i} → position ${i}`,
      extra: `Elements after deletion position are shifting left`,
    });
  }

  // Step N+1: Final state
  const newValues = values.filter((_, i) => i !== clampedPos);
  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: "default" as const,
      nextArrow: "default" as const,
    })),
    description: `Deletion complete! New list: [${newValues.join(", ")}]`,
    extra: `Successfully deleted element at position ${clampedPos}`,
  });

  return steps;
}
