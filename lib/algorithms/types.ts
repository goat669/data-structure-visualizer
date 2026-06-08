// ─── Shared ─────────────────────────────────────────────────────────────────

export type AlgorithmCategory = "sorting" | "searching" | "graph" | "stack-queue";

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

// ─── Array-based (sorting / searching) ──────────────────────────────────────

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

// ─── Graph ───────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
  state: "default" | "visiting" | "visited" | "current" | "path" | "queued";
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
  state: "default" | "active" | "path" | "rejected";
  directed?: boolean;
}

export interface GraphStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  description: string;
  extra?: string; // e.g. queue / stack contents
}

// ─── Stack / Queue ───────────────────────────────────────────────────────────

export interface StackQueueItem {
  value: string;
  state: "default" | "pushing" | "popping" | "highlight" | "matched" | "mismatch";
}

export interface StackQueueStep {
  primary: StackQueueItem[];   // main stack / queue
  secondary?: StackQueueItem[]; // output / auxiliary stack
  description: string;
  operation?: string;
  extra?: string;              // e.g. current token, result
}

// ─── Algorithm registry ──────────────────────────────────────────────────────

export const ALGORITHMS: AlgorithmInfo[] = [
  // ── Sorting ────────────────────────────────────────────────────────────────
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
    if (!swapped) break;
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
    for (int j = i + 1; j < n; j++)
      if (arr[j] < arr[minIdx]) minIdx = j;
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
    int key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key)
      arr[j + 1] = arr[j--];
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
  for (int k = l; k <= r; k++) arr[k] = tmp[k - l];
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
  int pivot = arr[high], i = low - 1;
  for (int j = low; j < high; j++)
    if (arr[j] <= pivot) swap(arr[++i], arr[j]);
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
  // ── Searching ──────────────────────────────────────────────────────────────
  {
    id: "linear",
    name: "Linear Search",
    category: "searching",
    description:
      "Sequentially checks each element of the list until a match is found or all elements have been checked. Works on unsorted arrays.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++)
    if (arr[i] == target) return i;
  return -1;
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
    if (arr[mid] == target)  return mid;
    else if (arr[mid] < target) low = mid + 1;
    else                    high = mid - 1;
  }
  return -1;
}`,
  },
  // ── Graph ──────────────────────────────────────────────────────────────────
  {
    id: "bfs",
    name: "BFS",
    category: "graph",
    description:
      "Breadth-First Search explores all neighbours of a node before moving to the next level. Uses a queue (FIFO) and guarantees the shortest path in unweighted graphs.",
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    cppCode: `void bfs(vector<vector<int>>& adj, int src, int V) {
  vector<bool> visited(V, false);
  queue<int> q;
  visited[src] = true;
  q.push(src);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    cout << u << " ";
    for (int v : adj[u])
      if (!visited[v]) {
        visited[v] = true;
        q.push(v);
      }
  }
}`,
  },
  {
    id: "dfs",
    name: "DFS",
    category: "graph",
    description:
      "Depth-First Search explores as far as possible along each branch before backtracking. Uses a stack (implicitly via recursion) and is the basis for topological sort, cycle detection, and more.",
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    cppCode: `void dfs(vector<vector<int>>& adj, int u,
         vector<bool>& visited) {
  visited[u] = true;
  cout << u << " ";
  for (int v : adj[u])
    if (!visited[v])
      dfs(adj, v, visited);
}

// Call: dfs(adj, src, visited);`,
  },
  {
    id: "dijkstra",
    name: "Dijkstra",
    category: "graph",
    description:
      "Finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edges. Uses a min-heap priority queue for efficiency.",
    timeComplexity: { best: "O((V+E) log V)", average: "O((V+E) log V)", worst: "O((V+E) log V)" },
    spaceComplexity: "O(V)",
    cppCode: `void dijkstra(vector<vector<pair<int,int>>>& adj,
              int src, int V) {
  vector<int> dist(V, INT_MAX);
  priority_queue<pair<int,int>,
    vector<pair<int,int>>, greater<>> pq;
  dist[src] = 0;
  pq.push({0, src});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;
    for (auto [w, v] : adj[u])
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push({dist[v], v});
      }
  }
}`,
  },
  {
    id: "topo",
    name: "Topological Sort",
    category: "graph",
    description:
      "Orders vertices of a DAG such that for every directed edge u→v, u appears before v. Uses DFS finishing times (Kahn's algorithm uses in-degree BFS). Used in build systems, course scheduling.",
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    cppCode: `void topoUtil(int u, vector<vector<int>>& adj,
              vector<bool>& vis, stack<int>& st) {
  vis[u] = true;
  for (int v : adj[u])
    if (!vis[v]) topoUtil(v, adj, vis, st);
  st.push(u);
}

void topologicalSort(vector<vector<int>>& adj, int V) {
  vector<bool> vis(V, false);
  stack<int> st;
  for (int i = 0; i < V; i++)
    if (!vis[i]) topoUtil(i, adj, vis, st);
  while (!st.empty()) {
    cout << st.top() << " ";
    st.pop();
  }
}`,
  },
  {
    id: "prim",
    name: "Prim's MST",
    category: "graph",
    description:
      "Builds a Minimum Spanning Tree by greedily adding the cheapest edge that connects a visited node to an unvisited one. Uses a priority queue for O((V+E) log V) time.",
    timeComplexity: { best: "O((V+E) log V)", average: "O((V+E) log V)", worst: "O((V+E) log V)" },
    spaceComplexity: "O(V)",
    cppCode: `void prim(vector<vector<pair<int,int>>>& adj, int V) {
  vector<int> key(V, INT_MAX), parent(V, -1);
  vector<bool> inMST(V, false);
  priority_queue<pair<int,int>,
    vector<pair<int,int>>, greater<>> pq;
  key[0] = 0;
  pq.push({0, 0});
  while (!pq.empty()) {
    int u = pq.top().second; pq.pop();
    inMST[u] = true;
    for (auto [w, v] : adj[u])
      if (!inMST[v] && w < key[v]) {
        key[v] = w;
        parent[v] = u;
        pq.push({key[v], v});
      }
  }
}`,
  },
  // ── Stack / Queue ──────────────────────────────────────────────────────────
  {
    id: "stack-ops",
    name: "Stack Operations",
    category: "stack-queue",
    description:
      "Demonstrates push, pop, and peek on a LIFO (Last-In First-Out) stack. Elements are added and removed from the same end (top). Used in undo systems, function call stacks, and expression evaluation.",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    cppCode: `#include <stack>
using namespace std;

stack<int> st;

// Push
st.push(42);

// Peek
int top = st.top(); // 42

// Pop
st.pop();

// isEmpty
bool empty = st.empty();`,
  },
  {
    id: "queue-ops",
    name: "Queue Operations",
    category: "stack-queue",
    description:
      "Demonstrates enqueue (push_back) and dequeue (pop_front) on a FIFO (First-In First-Out) queue. Elements are added at the rear and removed from the front. Used in BFS, task scheduling, and buffers.",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    cppCode: `#include <queue>
using namespace std;

queue<int> q;

// Enqueue
q.push(42);

// Front
int front = q.front(); // 42

// Dequeue
q.pop();

// isEmpty
bool empty = q.empty();`,
  },
  {
    id: "balanced-brackets",
    name: "Balanced Brackets",
    category: "stack-queue",
    description:
      "Uses a stack to verify that every opening bracket has a matching closing bracket in the correct order. A classic interview problem demonstrating stack-based string parsing.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    cppCode: `bool isBalanced(string s) {
  stack<char> st;
  for (char c : s) {
    if (c == '(' || c == '[' || c == '{')
      st.push(c);
    else {
      if (st.empty()) return false;
      char t = st.top(); st.pop();
      if (c == ')' && t != '(') return false;
      if (c == ']' && t != '[') return false;
      if (c == '}' && t != '{') return false;
    }
  }
  return st.empty();
}`,
  },
  {
    id: "infix-postfix",
    name: "Infix to Postfix",
    category: "stack-queue",
    description:
      "Converts an infix expression (e.g. A+B*C) to postfix (Reverse Polish Notation, e.g. ABC*+) using the Shunting Yard algorithm. Demonstrates operator precedence handling with a stack.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    cppCode: `int precedence(char op) {
  if (op == '+' || op == '-') return 1;
  if (op == '*' || op == '/') return 2;
  return 0;
}

string infixToPostfix(string expr) {
  stack<char> st;
  string result;
  for (char c : expr) {
    if (isalnum(c)) {
      result += c;
    } else if (c == '(') {
      st.push(c);
    } else if (c == ')') {
      while (!st.empty() && st.top() != '(') {
        result += st.top(); st.pop();
      }
      st.pop(); // remove '('
    } else {
      while (!st.empty() &&
             precedence(st.top()) >= precedence(c))
        { result += st.top(); st.pop(); }
      st.push(c);
    }
  }
  while (!st.empty()) { result += st.top(); st.pop(); }
  return result;
}`,
  },
];
