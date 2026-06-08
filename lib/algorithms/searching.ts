import { ArrayBar, SortStep } from "./types";

function makeBar(value: number, state: ArrayBar["state"] = "default"): ArrayBar {
  return { value, state };
}

function snapshot(arr: ArrayBar[], comparisons: number, swaps: number, description: string): SortStep {
  return { array: arr.map((b) => ({ ...b })), comparisons, swaps, description };
}

export function linearSearchSteps(input: number[], target: number): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map((v) => makeBar(v));
  let comps = 0;

  steps.push(snapshot(arr, comps, 0, `Starting Linear Search for target: ${target}`));

  for (let i = 0; i < arr.length; i++) {
    arr[i].state = "comparing";
    comps++;
    steps.push(snapshot(arr, comps, 0, `Checking index ${i}: value = ${arr[i].value}`));

    if (arr[i].value === target) {
      arr[i].state = "found";
      steps.push(snapshot(arr, comps, 0, `Found ${target} at index ${i}!`));
      return steps;
    } else {
      arr[i].state = "searched";
    }
    steps.push(snapshot(arr, comps, 0, `${arr[i].value} != ${target}, moving on`));
  }

  steps.push(snapshot(arr, comps, 0, `${target} not found in the array`));
  return steps;
}

export function binarySearchSteps(input: number[], target: number): SortStep[] {
  const steps: SortStep[] = [];
  // Binary search needs sorted array
  const sorted = [...input].sort((a, b) => a - b);
  const arr: ArrayBar[] = sorted.map((v) => makeBar(v));
  let comps = 0;

  steps.push(snapshot(arr, comps, 0, `Array sorted. Searching for target: ${target}`));

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Mark range
    for (let i = left; i <= right; i++) {
      if (arr[i].state !== "searched") arr[i].state = "comparing";
    }
    arr[mid].state = "pivot";
    comps++;
    steps.push(snapshot(arr, comps, 0, `Left=${left}, Mid=${mid}, Right=${right}. Checking mid value: ${arr[mid].value}`));

    if (arr[mid].value === target) {
      arr[mid].state = "found";
      steps.push(snapshot(arr, comps, 0, `Found ${target} at index ${mid}!`));
      return steps;
    }

    if (arr[mid].value < target) {
      // eliminate left half
      for (let i = left; i <= mid; i++) arr[i].state = "searched";
      left = mid + 1;
      steps.push(snapshot(arr, comps, 0, `${arr[mid].value} < ${target}, search right half`));
    } else {
      // eliminate right half
      for (let i = mid; i <= right; i++) arr[i].state = "searched";
      right = mid - 1;
      steps.push(snapshot(arr, comps, 0, `${arr[mid].value} > ${target}, search left half`));
    }

    // reset remaining range
    for (let i = left; i <= right; i++) {
      if (arr[i].state !== "searched") arr[i].state = "default";
    }
  }

  steps.push(snapshot(arr, comps, 0, `${target} not found in the array`));
  return steps;
}
