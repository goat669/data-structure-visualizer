import { LinkedListStep } from "./types";

interface LLNode {
  id: number;
  value: number;
}

export function runLinkedListAlgo(
  algoId: string,
  initialValues: number[],
  operation: "insert" | "find" | "delete",
  position: number,
  value: number,
  llType: "singly" | "doubly" | "circular"
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  
  if (operation === "insert") {
    return generateInsertSteps(initialValues, position, value, llType);
  } else if (operation === "find") {
    return generateFindSteps(initialValues, value, llType);
  } else if (operation === "delete") {
    return generateDeleteSteps(initialValues, position, llType);
  }
  
  return steps;
}

function generateInsertSteps(
  values: number[],
  position: number,
  value: number,
  llType: string
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  
  // Step 0: Show original list
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: "default" as const,
      nextArrow: "default" as const,
    })),
    description: `Inserting ${value} at position ${Math.min(position, values.length)}`,
    extra: `Original list: [${values.join(", ")}]`,
  });

  // Step 1: Show insertion position
  const clampedPos = Math.min(Math.max(0, position), values.length);
  const newValues = [...values.slice(0, clampedPos), value, ...values.slice(clampedPos)];
  
  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: i === clampedPos ? "inserted" : i < clampedPos ? "default" : "default",
      nextArrow: "default" as const,
    })),
    description: `Successfully inserted ${value} at position ${clampedPos}`,
    extra: `New list: [${newValues.join(", ")}]`,
  });

  return steps;
}

function generateFindSteps(
  values: number[],
  target: number,
  llType: string
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  
  const foundIndex = values.indexOf(target);
  
  for (let i = 0; i <= Math.min(foundIndex === -1 ? values.length : foundIndex, values.length); i++) {
    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        x: 100 + idx * 80,
        y: 100,
        state: idx === foundIndex && foundIndex !== -1 ? "found" : idx < i ? "visited" : "default",
        nextArrow: "default" as const,
      })),
      description: i === foundIndex && foundIndex !== -1 ? `Found ${target} at position ${foundIndex}` : `Searching for ${target}...`,
      extra: foundIndex === -1 ? "Value not found in list" : `Found at index ${foundIndex}`,
    });
  }

  if (foundIndex === -1) {
    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        x: 100 + idx * 80,
        y: 100,
        state: "default" as const,
        nextArrow: "default" as const,
      })),
      description: `${target} not found in list`,
      extra: "Search completed",
    });
  }

  return steps;
}

function generateDeleteSteps(
  values: number[],
  position: number,
  llType: string
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  
  const clampedPos = Math.min(Math.max(0, position), values.length - 1);
  
  // Step 0: Show original list with deletion target
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      x: 100 + i * 80,
      y: 100,
      state: i === clampedPos ? "highlight" : "default",
      nextArrow: "default" as const,
    })),
    description: `Deleting element at position ${clampedPos} (value: ${values[clampedPos]})`,
    extra: `Original list: [${values.join(", ")}]`,
  });

  // Step 1: Show list after deletion
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
    description: `Successfully deleted element at position ${clampedPos}`,
    extra: `New list: [${newValues.join(", ")}]`,
  });

  return steps;
}
