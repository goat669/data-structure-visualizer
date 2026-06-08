// ─── Shared ─────────────────────────────────────────────────────────────────

export type AlgorithmCategory = "sorting" | "searching" | "graph" | "linked-list" | "stack" | "queue" | "tree" | "bst" | "vector";

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

// ─── Linked List ─────────────────────────────────────────────────────────────

export interface LinkedListNode {
  id: number;
  value: number;
  x: number;
  y: number;
  state: "default" | "current" | "highlight" | "deleted" | "inserted" | "found" | "visited";
  nextArrow?: "default" | "active" | "highlight";
}

export interface LinkedListStep {
  nodes: LinkedListNode[];
  description: string;
  extra?: string;
}

// ─── Tree / Binary Tree ───────────────────────────────────────────────────────

export interface TreeNode {
  id: number;
  value: number;
  x: number;
  y: number;
  children: number[]; // child node IDs
  state: "default" | "visiting" | "visited" | "current" | "found" | "unbalanced";
  childConnections?: Array<{ to: number; state: "default" | "active" | "highlight" }>;
}

export interface TreeStep {
  nodes: TreeNode[];
  description: string;
  extra?: string; // balance factor, rotation info, traversal order
  traversalOrder?: number[]; // node IDs in order of traversal
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
  {
    id: "bellman-ford",
    name: "Bellman-Ford",
    category: "graph",
    description:
      "Finds the shortest path from a source node to all other nodes in a weighted graph. Handles negative edge weights and detects negative cycles. Uses relaxation of all edges V-1 times. Slower than Dijkstra but more versatile.",
    timeComplexity: { best: "O(VE)", average: "O(VE)", worst: "O(VE)" },
    spaceComplexity: "O(V)",
    cppCode: `bool bellmanFord(vector<vector<pair<int,int>>>& adj,
                    int V, int src) {
  vector<int> dist(V, INT_MAX);
  dist[src] = 0;
  
  // Relax all edges V-1 times
  for (int i = 0; i < V - 1; i++) {
    for (int u = 0; u < V; u++) {
      if (dist[u] != INT_MAX) {
        for (auto [w, v] : adj[u]) {
          if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
          }
        }
      }
    }
  }
  
  // Check for negative cycle
  for (int u = 0; u < V; u++) {
    if (dist[u] != INT_MAX) {
      for (auto [w, v] : adj[u]) {
        if (dist[u] + w < dist[v]) {
          return false; // Negative cycle found
        }
      }
    }
  }
  return true;
}`,
  },
  // ── Stack / Queue ──────────────────────────────────────────────────────────
  {
    id: "stack-ops",
    name: "Stack Operations",
    category: "stack",
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
    category: "queue",
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
    category: "stack",
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
    category: "stack",
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

  // ── Linked List ────────────────────────────────────────────────────────────
  {
    id: "sll-insert",
    name: "Singly LL - Insert",
    category: "linked-list",
    description: "Insert a new node in a singly linked list (forward pointers only).",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `struct Node {
  int data;
  Node* next;
  Node(int val) : data(val), next(nullptr) {}
};

Node* insertAtPos(Node* head, int val, int pos) {
  Node* newNode = new Node(val);
  if (pos == 0) {
    newNode->next = head;
    return newNode;
  }
  Node* curr = head;
  for (int i = 0; i < pos - 1 && curr; i++)
    curr = curr->next;
  if (curr) {
    newNode->next = curr->next;
    curr->next = newNode;
  }
  return head;
}`,
  },
  {
    id: "dll-insert",
    name: "Doubly LL - Insert",
    category: "linked-list",
    description: "Insert a node in a doubly linked list (both prev and next pointers).",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `struct DNode {
  int data;
  DNode* next;
  DNode* prev;
  DNode(int val) : data(val), next(nullptr), prev(nullptr) {}
};

DNode* insertAtPos(DNode* head, int val, int pos) {
  DNode* newNode = new DNode(val);
  if (pos == 0) {
    newNode->next = head;
    if (head) head->prev = newNode;
    return newNode;
  }
  DNode* curr = head;
  for (int i = 0; i < pos - 1 && curr; i++)
    curr = curr->next;
  if (curr) {
    newNode->next = curr->next;
    newNode->prev = curr;
    if (curr->next) curr->next->prev = newNode;
    curr->next = newNode;
  }
  return head;
}`,
  },
  {
    id: "cll-insert",
    name: "Circular LL - Insert",
    category: "linked-list",
    description: "Insert a node in a circular linked list (last node points to first).",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `Node* insertAtPos(Node* head, int val, int pos) {
  Node* newNode = new Node(val);
  if (!head) {
    newNode->next = newNode; // Point to itself
    return newNode;
  }
  if (pos == 0) {
    Node* tail = head;
    while (tail->next != head) tail = tail->next;
    newNode->next = head;
    tail->next = newNode;
    return newNode;
  }
  Node* curr = head;
  for (int i = 0; i < pos - 1; i++) {
    curr = curr->next;
    if (curr == head) break;
  }
  newNode->next = curr->next;
  curr->next = newNode;
  return head;
}`,
  },
  {
    id: "sll-delete",
    name: "Singly LL - Delete",
    category: "linked-list",
    description: "Delete a node from a singly linked list at any position.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `Node* deleteAtPos(Node* head, int pos) {
  if (pos == 0 && head) {
    Node* temp = head;
    head = head->next;
    delete temp;
    return head;
  }
  Node* curr = head;
  for (int i = 0; i < pos - 1 && curr; i++)
    curr = curr->next;
  if (curr && curr->next) {
    Node* temp = curr->next;
    curr->next = temp->next;
    delete temp;
  }
  return head;
}`,
  },
  {
    id: "sll-search",
    name: "Singly LL - Search",
    category: "linked-list",
    description: "Search for a value in a singly linked list.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `Node* search(Node* head, int target) {
  while (head) {
    if (head->data == target) return head;
    head = head->next;
  }
  return nullptr;
}`,
  },
  {
    id: "sll-reverse",
    name: "Singly LL - Reverse",
    category: "linked-list",
    description: "Reverse a singly linked list.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `Node* reverse(Node* head) {
  Node* prev = nullptr;
  Node* curr = head;
  while (curr) {
    Node* next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
  },
  {
    id: "dll-delete",
    name: "Doubly LL - Delete",
    category: "linked-list",
    description: "Delete a node from a doubly linked list at any position.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `DNode* deleteAtPos(DNode* head, int pos) {
  if (pos == 0 && head) {
    DNode* temp = head;
    head = head->next;
    if (head) head->prev = nullptr;
    delete temp;
    return head;
  }
  DNode* curr = head;
  for (int i = 0; i < pos - 1 && curr; i++)
    curr = curr->next;
  if (curr && curr->next) {
    DNode* temp = curr->next;
    curr->next = temp->next;
    if (temp->next) temp->next->prev = curr;
    delete temp;
  }
  return head;
}`,
  },
  {
    id: "dll-search",
    name: "Doubly LL - Search",
    category: "linked-list",
    description: "Search for a value in a doubly linked list (can search forward or backward).",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `DNode* search(DNode* head, int target) {
  while (head) {
    if (head->data == target) return head;
    head = head->next;
  }
  return nullptr;
}`,
  },
  {
    id: "dll-reverse",
    name: "Doubly LL - Reverse",
    category: "linked-list",
    description: "Reverse a doubly linked list (swap prev and next pointers).",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `DNode* reverse(DNode* head) {
  DNode* curr = head;
  while (curr) {
    swap(curr->next, curr->prev);
    curr = curr->prev;
  }
  swap(head, curr);
  return head;
}`,
  },
  {
    id: "cll-delete",
    name: "Circular LL - Delete",
    category: "linked-list",
    description: "Delete a node from a circular linked list (maintains circular structure).",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `Node* deleteAtPos(Node* head, int pos) {
  if (!head || head->next == head) return nullptr;
  if (pos == 0) {
    Node* tail = head;
    while (tail->next != head) tail = tail->next;
    Node* temp = head;
    head = head->next;
    tail->next = head;
    delete temp;
    return head;
  }
  Node* curr = head;
  for (int i = 0; i < pos - 1; i++) {
    curr = curr->next;
    if (curr->next == head) break;
  }
  if (curr->next != head) {
    Node* temp = curr->next;
    curr->next = temp->next;
    delete temp;
  }
  return head;
}`,
  },
  {
    id: "cll-search",
    name: "Circular LL - Search",
    category: "linked-list",
    description: "Search for a value in a circular linked list.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `Node* search(Node* head, int target) {
  if (!head) return nullptr;
  Node* curr = head;
  do {
    if (curr->data == target) return curr;
    curr = curr->next;
  } while (curr != head);
  return nullptr;
}`,
  },
  {
    id: "cll-reverse",
    name: "Circular LL - Reverse",
    category: "linked-list",
    description: "Reverse a circular linked list (maintains circular structure).",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `Node* reverse(Node* head) {
  if (!head || head->next == head) return head;
  Node* prev = nullptr;
  Node* curr = head;
  Node* next = head->next;
  do {
    curr->next = prev;
    prev = curr;
    curr = next;
    next = next->next;
  } while (curr != head);
  head->next = prev;
  return prev;
}`,
  },


  // ── Stack (separate) ────────────────────────────────────────────────────────
  {
    id: "stack-ops",
    name: "Stack Operations",
    category: "stack",
    description: "Perform push, pop, and peek operations on a stack (LIFO data structure).",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    cppCode: `class Stack {
  vector<int> arr;
public:
  void push(int x) { arr.push_back(x); }
  void pop() { if (!arr.empty()) arr.pop_back(); }
  int peek() { return arr.empty() ? -1 : arr.back(); }
  bool isEmpty() { return arr.empty(); }
};`,
  },

  // ── Queue (separate) ────────────────────────────────────────────────────────
  {
    id: "queue-ops",
    name: "Queue Operations",
    category: "queue",
    description: "Perform enqueue, dequeue, and front operations on a queue (FIFO data structure).",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    cppCode: `class Queue {
  deque<int> arr;
public:
  void enqueue(int x) { arr.push_back(x); }
  void dequeue() { if (!arr.empty()) arr.pop_front(); }
  int front() { return arr.empty() ? -1 : arr.front(); }
  bool isEmpty() { return arr.empty(); }
};`,
  },


  // ── Vector ────────────────────────────────────────────────────────────────────
  {
    id: "vector-insert",
    name: "Vector - Insert",
    category: "vector",
    description: "Insert an element at any position in a vector/dynamic array",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    cppCode: `void insertAtPos(vector<int>& v, int pos, int val) {
  if (pos < 0 || pos > v.size()) return;
  v.insert(v.begin() + pos, val);
}`,
  },
  {
    id: "vector-delete",
    name: "Vector - Delete",
    category: "vector",
    description: "Delete an element at any position in a vector/dynamic array",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    cppCode: `void deleteAtPos(vector<int>& v, int pos) {
  if (pos < 0 || pos >= v.size()) return;
  v.erase(v.begin() + pos);
}`,
  },

  // ── Tree ────────────────────────────────────────────────────────────────────
  {
    id: "tree-bfs",
    name: "Level Order (BFS)",
    category: "tree",
    description: "Traverse tree level by level using breadth-first search.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(w)",
    cppCode: `vector<int> levelOrder(TreeNode* root) {
  vector<int> result;
  if (!root) return result;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    TreeNode* node = q.front();
    q.pop();
    result.push_back(node->val);
    if (node->left) q.push(node->left);
    if (node->right) q.push(node->right);
  }
  return result;
}`,
  },
  {
    id: "tree-dfs-inorder",
    name: "In-Order Traversal (DFS)",
    category: "tree",
    description: "Traverse tree using depth-first search in left-root-right order.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    cppCode: `vector<int> inorder(TreeNode* root, vector<int>& result) {
  if (!root) return result;
  inorder(root->left, result);
  result.push_back(root->val);
  inorder(root->right, result);
  return result;
}`,
  },
  {
    id: "tree-dfs-preorder",
    name: "Pre-Order Traversal (DFS)",
    category: "tree",
    description: "Traverse tree in root-left-right order.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    cppCode: `vector<int> preorder(TreeNode* root, vector<int>& result) {
  if (!root) return result;
  result.push_back(root->val);
  preorder(root->left, result);
  preorder(root->right, result);
  return result;
}`,
  },
  {
    id: "tree-dfs-postorder",
    name: "Post-Order Traversal (DFS)",
    category: "tree",
    description: "Traverse tree in left-right-root order. Visit children before parent.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    cppCode: `vector<int> postorder(TreeNode* root, vector<int>& result) {
  if (!root) return result;
  postorder(root->left, result);
  postorder(root->right, result);
  result.push_back(root->val);
  return result;
}`,
  },

  // ── Binary Search Tree ──────────────────────────────────────────────────────────────
  {
    id: "bst-insert",
    name: "BST Insert",
    category: "bst",
    description: "Insert values into a binary search tree maintaining BST property: all left < node < all right. Both subtrees must also be valid BSTs.",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    cppCode: `struct TreeNode {
  int val;
  TreeNode *left, *right;
  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
  if (!root) return new TreeNode(val);
  if (val < root->val)
    root->left = insert(root->left, val);
  else
    root->right = insert(root->right, val);
  return root;
}`,
  },
  {
    id: "bst-search",
    name: "BST Search",
    category: "bst",
    description: "Search for a value in BST. Use the BST property to eliminate half the tree at each step.",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    cppCode: `TreeNode* search(TreeNode* root, int target) {
  if (!root) return nullptr;
  if (root->val == target) return root;
  if (target < root->val)
    return search(root->left, target);
  return search(root->right, target);
}`,
  },

];

