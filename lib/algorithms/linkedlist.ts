import { SortStep } from "./types";

/**
 * Singly Linked List - Insert at position
 * Shows each step of insertion: find position, create node, link nodes
 */
export function singleLinkedListInsert(array: number[], position: number, value: number): SortStep[] {
  const steps: SortStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), array.length);

  // Step 1: Show original list
  steps.push({
    array: array.map((v) => ({ value: v, state: "default" as const })),
    description: `Singly Linked List: Insert ${value} at position ${clampedPos}`,
    comparisons: 0,
    swaps: 0,
  });

  // Step 2: Highlight insertion position
  steps.push({
    array: array.map((v, i) => ({
      value: v,
      state: i === clampedPos ? "comparing" : i < clampedPos ? "visited" : "default",
    })),
    description: `Found insertion point at position ${clampedPos}`,
    comparisons: clampedPos,
    swaps: 0,
  });

  // Step 3-N: Create and shift
  const result = [...array.slice(0, clampedPos), value, ...array.slice(clampedPos)];

  for (let i = clampedPos; i < result.length - 1; i++) {
    steps.push({
      array: result.map((v, idx) => ({
        value: v,
        state: idx === clampedPos ? "sorted" : idx > clampedPos && idx <= i + 1 ? "comparing" : "default",
      })),
      description: `Shifting element at position ${i} to the right`,
      comparisons: clampedPos,
      swaps: i - clampedPos + 1,
    });
  }

  // Step N+1: Final result
  steps.push({
    array: result.map((v, i) => ({
      value: v,
      state: i === clampedPos ? "sorted" : "default",
    })),
    description: `Insertion complete! New list: [${result.join(", ")}]`,
    comparisons: clampedPos,
    swaps: array.length - clampedPos,
  });

  return steps;
}

/**
 * Singly Linked List - Delete at position
 */
export function singleLinkedListDelete(array: number[], position: number): SortStep[] {
  const steps: SortStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), array.length - 1);

  // Step 1: Show original list
  steps.push({
    array: array.map((v) => ({ value: v, state: "default" as const })),
    description: `Singly Linked List: Delete at position ${clampedPos}`,
    comparisons: 0,
    swaps: 0,
  });

  // Step 2: Mark for deletion
  steps.push({
    array: array.map((v, i) => ({
      value: v,
      state: i === clampedPos ? "comparing" : "default",
    })),
    description: `Target node found at position ${clampedPos} (value: ${array[clampedPos]})`,
    comparisons: clampedPos,
    swaps: 0,
  });

  // Step 3-N: Remove and shift
  const result = array.filter((_, i) => i !== clampedPos);

  for (let i = clampedPos; i < result.length; i++) {
    steps.push({
      array: result.map((v, idx) => ({
        value: v,
        state: idx >= clampedPos ? "comparing" : "default",
      })),
      description: `Shifting element at position ${i} to the left`,
      comparisons: clampedPos,
      swaps: i - clampedPos + 1,
    });
  }

  // Step N+1: Final result
  steps.push({
    array: result.map((v) => ({ value: v, state: "default" as const })),
    description: `Deletion complete! New list: [${result.join(", ")}]`,
    comparisons: clampedPos,
    swaps: array.length - clampedPos,
  });

  return steps;
}

/**
 * Singly Linked List - Search/Find
 */
export function singleLinkedListSearch(array: number[], target: number): SortStep[] {
  const steps: SortStep[] = [];
  const foundIndex = array.indexOf(target);

  // Step 1: Starting search
  steps.push({
    array: array.map((v) => ({ value: v, state: "default" as const })),
    description: `Searching for value ${target} in singly linked list`,
    comparisons: 0,
    swaps: 0,
  });

  // Step 2-N: Check each node
  for (let i = 0; i < array.length; i++) {
    steps.push({
      array: array.map((v, idx) => ({
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : "default",
      })),
      description: `Checking node at position ${i}: value is ${array[i]}`,
      comparisons: i + 1,
      swaps: 0,
    });

    if (array[i] === target) {
      steps.push({
        array: array.map((v, idx) => ({
          value: v,
          state: idx === i ? "sorted" : idx < i ? "visited" : "default",
        })),
        description: `Found ${target} at position ${i}!`,
        comparisons: i + 1,
        swaps: 0,
      });
      return steps;
    }
  }

  // Not found
  steps.push({
    array: array.map((v) => ({ value: v, state: "visited" as const })),
    description: `Search complete: ${target} not found in list`,
    comparisons: array.length,
    swaps: 0,
  });

  return steps;
}

/**
 * Doubly Linked List - Insert at position
 */
export function doublyLinkedListInsert(array: number[], position: number, value: number): SortStep[] {
  // Same algorithm as singly, but conceptually with bidirectional links
  const steps: SortStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), array.length);

  steps.push({
    array: array.map((v) => ({ value: v, state: "default" as const })),
    description: `Doubly Linked List: Insert ${value} at position ${clampedPos}`,
    comparisons: 0,
    swaps: 0,
  });

  steps.push({
    array: array.map((v, i) => ({
      value: v,
      state: i === clampedPos ? "comparing" : i < clampedPos ? "visited" : "default",
    })),
    description: `Found insertion point at position ${clampedPos}`,
    comparisons: clampedPos,
    swaps: 0,
  });

  const result = [...array.slice(0, clampedPos), value, ...array.slice(clampedPos)];

  steps.push({
    array: result.map((v, i) => ({
      value: v,
      state: i === clampedPos ? "sorted" : "default",
    })),
    description: `Created bidirectional link with new node (value: ${value})`,
    comparisons: clampedPos,
    swaps: 0,
  });

  steps.push({
    array: result.map((v, i) => ({
      value: v,
      state: i === clampedPos ? "sorted" : "default",
    })),
    description: `Insertion complete! New list: [${result.join(", ")}]`,
    comparisons: clampedPos,
    swaps: 1,
  });

  return steps;
}

/**
 * Circular Linked List - Insert at position
 */
export function circularLinkedListInsert(array: number[], position: number, value: number): SortStep[] {
  const steps: SortStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), array.length);

  steps.push({
    array: array.map((v) => ({ value: v, state: "default" as const })),
    description: `Circular Linked List: Insert ${value} at position ${clampedPos}`,
    comparisons: 0,
    swaps: 0,
  });

  steps.push({
    array: array.map((v, i) => ({
      value: v,
      state: i === clampedPos ? "comparing" : i < clampedPos ? "visited" : "default",
    })),
    description: `Found insertion point at position ${clampedPos}`,
    comparisons: clampedPos,
    swaps: 0,
  });

  const result = [...array.slice(0, clampedPos), value, ...array.slice(clampedPos)];

  steps.push({
    array: result.map((v, i) => ({
      value: v,
      state: i === clampedPos ? "sorted" : i === result.length - 1 ? "comparing" : "default",
    })),
    description: `Linked new node with circular pointer (wraps to head)`,
    comparisons: clampedPos,
    swaps: 0,
  });

  steps.push({
    array: result.map((v, i) => ({
      value: v,
      state: i === clampedPos || i === result.length - 1 ? "sorted" : "default",
    })),
    description: `Insertion complete! List circulates: [${result.join(", ")}] → [0]`,
    comparisons: clampedPos,
    swaps: 1,
  });

  return steps;
}
