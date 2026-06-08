import { ArrayBar, SortStep } from "./types";

function makeBar(value: number, state: ArrayBar["state"] = "default"): ArrayBar {
  return { value, state };
}

function snapshot(arr: ArrayBar[], comparisons: number, swaps: number, description: string): SortStep {
  return { array: arr.map((b) => ({ ...b })), comparisons, swaps, description };
}

export function bubbleSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map((v) => makeBar(v));
  let comps = 0;
  let swaps = 0;
  const n = arr.length;

  steps.push(snapshot(arr, comps, swaps, "Starting Bubble Sort"));

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // mark comparing
      arr[j].state = "comparing";
      arr[j + 1].state = "comparing";
      comps++;
      steps.push(snapshot(arr, comps, swaps, `Comparing ${arr[j].value} and ${arr[j + 1].value}`));

      if (arr[j].value > arr[j + 1].value) {
        arr[j].state = "swapping";
        arr[j + 1].state = "swapping";
        swaps++;
        steps.push(snapshot(arr, comps, swaps, `Swapping ${arr[j].value} and ${arr[j + 1].value}`));
        const tmp = arr[j].value;
        arr[j].value = arr[j + 1].value;
        arr[j + 1].value = tmp;
      }
      arr[j].state = "default";
      arr[j + 1].state = "default";
    }
    arr[n - 1 - i].state = "sorted";
    steps.push(snapshot(arr, comps, swaps, `Element ${arr[n - 1 - i].value} is in its sorted position`));
  }
  arr[0].state = "sorted";
  steps.push(snapshot(arr, comps, swaps, "Array is fully sorted!"));
  return steps;
}

export function selectionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map((v) => makeBar(v));
  let comps = 0;
  let swaps = 0;
  const n = arr.length;

  steps.push(snapshot(arr, comps, swaps, "Starting Selection Sort"));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    arr[i].state = "pivot";
    steps.push(snapshot(arr, comps, swaps, `Finding minimum from index ${i}`));

    for (let j = i + 1; j < n; j++) {
      arr[j].state = "comparing";
      comps++;
      steps.push(snapshot(arr, comps, swaps, `Comparing ${arr[j].value} with current min ${arr[minIdx].value}`));
      if (arr[j].value < arr[minIdx].value) {
        if (minIdx !== i) arr[minIdx].state = "default";
        minIdx = j;
        arr[minIdx].state = "pivot";
      } else {
        arr[j].state = "default";
      }
    }

    if (minIdx !== i) {
      arr[i].state = "swapping";
      arr[minIdx].state = "swapping";
      swaps++;
      steps.push(snapshot(arr, comps, swaps, `Swapping ${arr[i].value} and ${arr[minIdx].value}`));
      const tmp = arr[i].value;
      arr[i].value = arr[minIdx].value;
      arr[minIdx].value = tmp;
    }

    // reset all non-sorted
    for (let k = i; k < n; k++) {
      if (arr[k].state !== "sorted") arr[k].state = "default";
    }
    arr[i].state = "sorted";
    steps.push(snapshot(arr, comps, swaps, `${arr[i].value} placed at position ${i}`));
  }
  arr[n - 1].state = "sorted";
  steps.push(snapshot(arr, comps, swaps, "Array is fully sorted!"));
  return steps;
}

export function insertionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map((v) => makeBar(v));
  let comps = 0;
  let swaps = 0;
  const n = arr.length;

  arr[0].state = "sorted";
  steps.push(snapshot(arr, comps, swaps, "Starting Insertion Sort"));

  for (let i = 1; i < n; i++) {
    const key = arr[i].value;
    arr[i].state = "pivot";
    steps.push(snapshot(arr, comps, swaps, `Inserting ${key} into sorted portion`));
    let j = i - 1;

    while (j >= 0 && arr[j].value > key) {
      arr[j].state = "comparing";
      comps++;
      swaps++;
      steps.push(snapshot(arr, comps, swaps, `Moving ${arr[j].value} one position right`));
      arr[j + 1].value = arr[j].value;
      arr[j + 1].state = "sorted";
      arr[j].state = "sorted";
      j--;
    }
    arr[j + 1].value = key;
    arr[j + 1].state = "sorted";
    steps.push(snapshot(arr, comps, swaps, `Placed ${key} at position ${j + 1}`));
  }
  steps.push(snapshot(arr, comps, swaps, "Array is fully sorted!"));
  return steps;
}

export function mergeSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map((v) => makeBar(v));
  let comps = 0;
  let swaps = 0;

  steps.push(snapshot(arr, comps, swaps, "Starting Merge Sort"));

  function merge(left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1).map((b) => b.value);
    const rightArr = arr.slice(mid + 1, right + 1).map((b) => b.value);

    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      arr[k].state = "comparing";
      comps++;
      steps.push(snapshot(arr, comps, swaps, `Merging: comparing ${leftArr[i]} and ${rightArr[j]}`));
      arr[k].state = "default";
      if (leftArr[i] <= rightArr[j]) {
        arr[k].value = leftArr[i++];
      } else {
        arr[k].value = rightArr[j++];
        swaps++;
      }
      arr[k].state = "swapping";
      steps.push(snapshot(arr, comps, swaps, `Placed ${arr[k].value} at position ${k}`));
      arr[k].state = "default";
      k++;
    }
    while (i < leftArr.length) {
      arr[k].value = leftArr[i++];
      arr[k].state = "swapping";
      steps.push(snapshot(arr, comps, swaps, `Copying remaining left element ${arr[k].value}`));
      arr[k].state = "default";
      k++;
    }
    while (j < rightArr.length) {
      arr[k].value = rightArr[j++];
      arr[k].state = "swapping";
      steps.push(snapshot(arr, comps, swaps, `Copying remaining right element ${arr[k].value}`));
      arr[k].state = "default";
      k++;
    }
    for (let x = left; x <= right; x++) arr[x].state = "sorted";
    steps.push(snapshot(arr, comps, swaps, `Merged subarray [${left}..${right}]`));
    for (let x = left; x <= right; x++) arr[x].state = "default";
  }

  function mergeSort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSort(0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) arr[i].state = "sorted";
  steps.push(snapshot(arr, comps, swaps, "Array is fully sorted!"));
  return steps;
}

export function quickSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr: ArrayBar[] = input.map((v) => makeBar(v));
  let comps = 0;
  let swaps = 0;

  steps.push(snapshot(arr, comps, swaps, "Starting Quick Sort"));

  function partition(low: number, high: number): number {
    const pivot = arr[high].value;
    arr[high].state = "pivot";
    steps.push(snapshot(arr, comps, swaps, `Pivot selected: ${pivot}`));
    let i = low - 1;

    for (let j = low; j < high; j++) {
      arr[j].state = "comparing";
      comps++;
      steps.push(snapshot(arr, comps, swaps, `Comparing ${arr[j].value} with pivot ${pivot}`));

      if (arr[j].value <= pivot) {
        i++;
        if (i !== j) {
          arr[i].state = "swapping";
          arr[j].state = "swapping";
          swaps++;
          steps.push(snapshot(arr, comps, swaps, `Swapping ${arr[i].value} and ${arr[j].value}`));
          const tmp = arr[i].value;
          arr[i].value = arr[j].value;
          arr[j].value = tmp;
          arr[i].state = "default";
        }
      }
      arr[j].state = "default";
    }

    // place pivot
    const pivotPos = i + 1;
    arr[pivotPos].state = "swapping";
    arr[high].state = "swapping";
    swaps++;
    steps.push(snapshot(arr, comps, swaps, `Placing pivot ${pivot} at position ${pivotPos}`));
    const tmp = arr[pivotPos].value;
    arr[pivotPos].value = arr[high].value;
    arr[high].value = tmp;
    arr[pivotPos].state = "sorted";
    arr[high].state = "default";
    steps.push(snapshot(arr, comps, swaps, `Pivot ${pivot} is at its correct position`));
    return pivotPos;
  }

  function quickSort(low: number, high: number) {
    if (low >= high) {
      if (low === high) arr[low].state = "sorted";
      return;
    }
    const pi = partition(low, high);
    quickSort(low, pi - 1);
    quickSort(pi + 1, high);
  }

  quickSort(0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) arr[i].state = "sorted";
  steps.push(snapshot(arr, comps, swaps, "Array is fully sorted!"));
  return steps;
}
