export type AlgorithmCategory = "sorting" | "searching";

export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  stable?: boolean;
  cppCode: string;
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
    description:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through repeats until no swaps are needed.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
    cppCode: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    bool swapped = false;
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted
  }
}`,
  },
  {
    id: "selection",
    name: "Selection Sort",
    category: "sorting",
    description:
      "Divides the array into a sorted and unsorted region. On each pass it finds the minimum element in the unsorted region and moves it to the end of the sorted region.",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: false,
    cppCode: `void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx])
        minIdx = j;
    }
    if (minIdx != i)
      swap(arr[i], arr[minIdx]);
  }
}`,
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    category: "sorting",
    description:
      "Builds the final sorted array one item at a time. Each new element is compared to already-sorted elements and inserted at the correct position.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
    cppCode: `void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
  },
  {
    id: "merge",
    name: "Merge Sort",
    category: "sorting",
    description:
      "A divide-and-conquer algorithm. Recursively splits the array in half, sorts each half, then merges the two sorted halves back together.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    stable: true,
    cppCode: `void merge(int arr[], int l, int m, int r) {
  vector<int> tmp;
  int i = l, j = m + 1;
  while (i <= m && j <= r)
    tmp.push_back(arr[i] <= arr[j] ? arr[i++] : arr[j++]);
  while (i <= m) tmp.push_back(arr[i++]);
  while (j <= r) tmp.push_back(arr[j++]);
  for (int k = l; k <= r; k++)
    arr[k] = tmp[k - l];
}

void mergeSort(int arr[], int l, int r) {
  if (l >= r) return;
  int m = (l + r) / 2;
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
}`,
  },
  {
    id: "quick",
    name: "Quick Sort",
    category: "sorting",
    description:
      "Picks a pivot element and partitions the array so all elements less than the pivot come before it and all greater come after. Then recursively sorts each partition.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    stable: false,
    cppCode: `int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] <= pivot)
      swap(arr[++i], arr[j]);
  }
  swap(arr[i + 1], arr[high]);
  return i + 1;
}

void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}`,
  },
  {
    id: "linear",
    name: "Linear Search",
    category: "searching",
    description:
      "Sequentially checks each element of the list until a match is found or all elements have been checked. Works on unsorted arrays.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == target)
      return i; // found at index i
  }
  return -1; // not found
}`,
  },
  {
    id: "binary",
    name: "Binary Search",
    category: "searching",
    description:
      "Works on sorted arrays. Repeatedly halves the search interval by comparing the target to the middle element, eliminating half the remaining elements each step.",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    cppCode: `int binarySearch(int arr[], int n, int target) {
  int low = 0, high = n - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target)
      return mid; // found
    else if (arr[mid] < target)
      low = mid + 1;
    else
      high = mid - 1;
  }
  return -1; // not found
}`,
  },
];
