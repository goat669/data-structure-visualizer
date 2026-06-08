import { SortStep } from "./types";

export function runVectorAlgo(
  algoId: string,
  initialValues: number[],
  operation: "insert" | "delete",
  position: number,
  value: number
): SortStep[] {
  const steps: SortStep[] = [];
  
  if (operation === "insert") {
    return generateInsertSteps(initialValues, position, value);
  } else if (operation === "delete") {
    return generateDeleteSteps(initialValues, position);
  }
  
  return steps;
}

function generateInsertSteps(values: number[], position: number, value: number): SortStep[] {
  const steps: SortStep[] = [];
  
  const clampedPos = Math.min(Math.max(0, position), values.length);
  
  // Step 0: Show original vector
  steps.push({
    array: values.map((v) => ({ value: v, state: "default" as const })),
    description: `Inserting ${value} at position ${clampedPos}`,
    comparisons: 0,
    swaps: 0,
  });

  // Step 1: Shift elements
  const newArray = [...values];
  for (let i = newArray.length; i > clampedPos; i--) {
    newArray[i] = newArray[i - 1];
    steps.push({
      array: newArray.map((v, idx) => ({
        value: v,
        state: idx >= clampedPos ? "comparing" : "default",
      })),
      description: `Shifting elements to make room at position ${clampedPos}`,
      comparisons: 0,
      swaps: i - clampedPos,
    });
  }

  // Step 2: Insert value
  newArray[clampedPos] = value;
  steps.push({
    array: newArray.map((v, idx) => ({
      value: v,
      state: idx === clampedPos ? "sorted" : "default",
    })),
    description: `Inserted ${value} at position ${clampedPos}`,
    comparisons: 0,
    swaps: newArray.length - clampedPos,
  });

  return steps;
}

function generateDeleteSteps(values: number[], position: number): SortStep[] {
  const steps: SortStep[] = [];
  
  const clampedPos = Math.min(Math.max(0, position), values.length - 1);
  
  // Step 0: Show vector with element to delete highlighted
  steps.push({
    array: values.map((v, idx) => ({
      value: v,
      state: idx === clampedPos ? "comparing" : "default",
    })),
    description: `Deleting element at position ${clampedPos} (value: ${values[clampedPos]})`,
    comparisons: 0,
    swaps: 0,
  });

  // Step 1: Shift elements
  const newArray = [...values];
  for (let i = clampedPos; i < newArray.length - 1; i++) {
    newArray[i] = newArray[i + 1];
    steps.push({
      array: newArray.slice(0, newArray.length - 1).map((v, idx) => ({
        value: v,
        state: idx >= clampedPos ? "comparing" : "default",
      })),
      description: `Shifting elements after position ${clampedPos}`,
      comparisons: 0,
      swaps: newArray.length - 1 - i,
    });
  }

  // Step 2: Final state
  newArray.pop();
  steps.push({
    array: newArray.map((v) => ({ value: v, state: "sorted" as const })),
    description: `Successfully deleted element at position ${clampedPos}`,
    comparisons: 0,
    swaps: values.length - clampedPos - 1,
  });

  return steps;
}
