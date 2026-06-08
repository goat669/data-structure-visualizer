export type AlgorithmCategory = "sorting" | "searching";

export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  stable?: boolean;
}

export interface ArrayBar {
  value: number;
  state: "default" | "comparing" | "swapping" | "sorted" | "pivot" | "found" | "searched";
}

export type SortStep = {
  array: ArrayBar[];
  comparisons: number;
  swaps: number;
  description: string;
};

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    category: "sorting",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
  },
  {
    id: "selection",
    name: "Selection Sort",
    category: "sorting",
    description: "Divides the array into a sorted and unsorted region, repeatedly selecting the minimum element from unsorted.",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: false,
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    category: "sorting",
    description: "Builds the sorted array one item at a time by inserting elements into their correct position.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
  },
  {
    id: "merge",
    name: "Merge Sort",
    category: "sorting",
    description: "Divides the array in half, recursively sorts each half, then merges them back together.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    stable: true,
  },
  {
    id: "quick",
    name: "Quick Sort",
    category: "sorting",
    description: "Picks a pivot element and partitions the array around it, recursively sorting sub-arrays.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    stable: false,
  },
  {
    id: "linear",
    name: "Linear Search",
    category: "searching",
    description: "Sequentially checks each element of the list until a match is found or all elements are checked.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
  },
  {
    id: "binary",
    name: "Binary Search",
    category: "searching",
    description: "Works on sorted arrays. Repeatedly divides the search interval in half until the target is found.",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
  },
];
