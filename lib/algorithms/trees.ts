import { TreeNode, TreeStep } from "./types";

export function runTreeAlgo(algoId: string, nodeCount: number = 7, customValues?: number[]): TreeStep[] {
  const steps: TreeStep[] = [];
  
  // Handle BST algorithms separately with proper tree building
  if (algoId === "bst-insert") {
    return simulateBSTInsertion(customValues || [4, 2, 6, 1, 3, 5, 7]);
  } else if (algoId === "bst-search") {
    return simulateBSTSearch(customValues || [4, 2, 6, 1, 3, 5, 7], 5);
  }

  // Handle regular tree algorithms
  const valuesToUse = customValues && customValues.length > 0 ? customValues : undefined;
  const tree = createSampleBinaryTree(Math.min(31, Math.max(1, nodeCount)), valuesToUse);

  if (algoId === "tree-bfs") {
    return simulateBFS(tree, steps);
  } else if (algoId === "tree-dfs-inorder") {
    return simulateInorder(tree, steps);
  } else if (algoId === "tree-dfs-preorder") {
    return simulatePreorder(tree, steps);
  } else if (algoId === "tree-dfs-postorder") {
    return simulatePostorder(tree, steps);
  }

  return steps;
}

function createSampleBinaryTree(count: number, customValues?: number[]): TreeNode[] {
  const nodes: TreeNode[] = [];
  let nodeValues: number[];
  
  if (customValues && customValues.length > 0) {
    nodeValues = customValues.slice(0, Math.max(1, count));
  } else {
    // Generate random BST-ordered values
    nodeValues = generateRandomBST(Math.max(1, count));
  }

  const maxDepth = Math.ceil(Math.log2(nodeValues.length + 1));
  const levelWidth = Math.pow(2, maxDepth);
  const horizontalSpacing = 120;
  const verticalSpacing = 100;

  for (let i = 0; i < nodeValues.length; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const posInDepth = (i + 1) - (Math.pow(2, depth) - 1);
    const maxWidth = Math.pow(2, depth);
    
    // Center the tree horizontally based on the widest level
    const levelWidthPixels = (maxWidth - 1) * horizontalSpacing;
    const centerOffset = (levelWidth - 1) * horizontalSpacing / 2;
    
    const x = centerOffset + ((posInDepth - 1) * horizontalSpacing) - (levelWidthPixels / 2);
    const y = 50 + depth * verticalSpacing;

    nodes.push({
      id: i,
      value: nodeValues[i],
      x,
      y,
      children: getChildrenIds(i, nodeValues.length),
      state: "default",
    });
  }

  return nodes;
}

// Generate a balanced BST with sorted values
function generateRandomBST(count: number): number[] {
  const values = Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1);
  values.sort((a, b) => a - b);
  
  // Create balanced BST by inserting in sorted order
  const result: number[] = [];
  const inorder = (arr: number[], left: number, right: number) => {
    if (left > right) return;
    const mid = Math.floor((left + right) / 2);
    inorder(arr, left, mid - 1);
    result.push(arr[mid]);
    inorder(arr, mid + 1, right);
  };
  
  inorder(values, 0, values.length - 1);
  return result;
}


function getChildrenIds(nodeId: number, totalNodes: number): number[] {
  const left = 2 * nodeId + 1;
  const right = 2 * nodeId + 2;
  return [left, right].filter((id) => id < totalNodes);
}

function simulateBFS(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const order: number[] = [];

  steps.push({
    nodes: currentNodes,
    description: `> BFS: Level-order traversal (queue-based)`,
    traversalOrder: [],
  });

  const queue: number[] = [0];
  const visited = new Set<number>([0]);

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    currentNodes[nodeId].state = "visiting";

    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Visit node ${currentNodes[nodeId].value}`,
      extra: `Queue: [${queue.map((id) => currentNodes[id]?.value || "?").join(", ")}]`,
      traversalOrder: [...order, nodeId],
    });

    currentNodes[nodeId].state = "visited";
    order.push(nodeId);

    for (const childId of currentNodes[nodeId].children) {
      if (!visited.has(childId) && childId < currentNodes.length) {
        visited.add(childId);
        queue.push(childId);
      }
    }
  }

  steps.push({
    nodes: currentNodes,
    description: `> BFS complete: [${order.map((id) => currentNodes[id].value).join(", ")}]`,
    traversalOrder: order,
  });

  return steps;
}

function simulateInorder(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const order: number[] = [];

  steps.push({
    nodes: currentNodes,
    description: `> In-Order: Left → Root → Right (recursive DFS)`,
    traversalOrder: [],
  });

  function inorderDFS(nodeId: number) {
    if (nodeId >= currentNodes.length || nodeId === undefined) return;

    const leftChild = 2 * nodeId + 1;
    const rightChild = 2 * nodeId + 2;

    if (leftChild < currentNodes.length) {
      inorderDFS(leftChild);
    }

    currentNodes[nodeId].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Process node ${currentNodes[nodeId].value}`,
      traversalOrder: [...order, nodeId],
    });

    currentNodes[nodeId].state = "visited";
    order.push(nodeId);

    if (rightChild < currentNodes.length) {
      inorderDFS(rightChild);
    }
  }

  inorderDFS(0);

  steps.push({
    nodes: currentNodes,
    description: `> In-Order complete: [${order.map((id) => currentNodes[id].value).join(", ")}]`,
    traversalOrder: order,
  });

  return steps;
}

function simulatePreorder(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const order: number[] = [];

  steps.push({
    nodes: currentNodes,
    description: `> Pre-Order: Root → Left → Right (recursive DFS)`,
    traversalOrder: [],
  });

  function preorderDFS(nodeId: number) {
    if (nodeId >= currentNodes.length || nodeId === undefined) return;

    currentNodes[nodeId].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Process node ${currentNodes[nodeId].value}`,
      traversalOrder: [...order, nodeId],
    });

    currentNodes[nodeId].state = "visited";
    order.push(nodeId);

    const leftChild = 2 * nodeId + 1;
    const rightChild = 2 * nodeId + 2;

    if (leftChild < currentNodes.length) {
      preorderDFS(leftChild);
    }

    if (rightChild < currentNodes.length) {
      preorderDFS(rightChild);
    }
  }

  preorderDFS(0);

  steps.push({
    nodes: currentNodes,
    description: `> Pre-Order complete: [${order.map((id) => currentNodes[id].value).join(", ")}]`,
    traversalOrder: order,
  });

  return steps;
}

function simulatePostorder(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const order: number[] = [];

  steps.push({
    nodes: currentNodes,
    description: `> Post-Order: Left → Right → Root (recursive DFS)`,
    traversalOrder: [],
  });

  function postorderDFS(nodeId: number) {
    if (nodeId >= currentNodes.length || nodeId === undefined) return;

    const leftChild = 2 * nodeId + 1;
    const rightChild = 2 * nodeId + 2;

    if (leftChild < currentNodes.length) {
      postorderDFS(leftChild);
    }

    if (rightChild < currentNodes.length) {
      postorderDFS(rightChild);
    }

    currentNodes[nodeId].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Process node ${currentNodes[nodeId].value}`,
      traversalOrder: [...order, nodeId],
    });

    currentNodes[nodeId].state = "visited";
    order.push(nodeId);
  }

  postorderDFS(0);

  return {
    nodes: steps[steps.length - 1]?.nodes || [],
    traversalOrder: order,
    description: "Post-Order traversal complete",
  };
}

// ─── Binary Search Tree ───────────────────────────────────────────────────────

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

// Build a proper BST by inserting values in order
function buildBSTFromValues(values: number[]): BSTNode | null {
  if (values.length === 0) return null;

  let root: BSTNode | null = null;

  for (const value of values) {
    root = insertBSTNode(root, value);
  }

  return root;
}

// Insert a value into BST
function insertBSTNode(root: BSTNode | null, value: number): BSTNode {
  if (!root) {
    return { value, left: null, right: null };
  }

  if (value < root.value) {
    root.left = insertBSTNode(root.left, value);
  } else {
    root.right = insertBSTNode(root.right, value);
  }

  return root;
}

// Validate BST using bounds checking - each node must be within (min, max)
export function isValidBSTSequence(values: number[]): { valid: boolean; message: string } {
  if (values.length === 0) {
    return { valid: false, message: "Please enter at least one value" };
  }

  const root = buildBSTFromValues(values);
  if (!root) {
    return { valid: false, message: "Failed to build tree" };
  }

  const isValidBST = (node: BSTNode | null, min: number, max: number): boolean => {
    if (!node) return true;

    // Current node must be within bounds
    if (node.value <= min || node.value >= max) {
      return false;
    }

    // Left subtree: all values must be less than node
    // Right subtree: all values must be greater than node
    return (
      isValidBST(node.left, min, node.value) &&
      isValidBST(node.right, node.value, max)
    );
  };

  if (!isValidBST(root, -Infinity, Infinity)) {
    return {
      valid: false,
      message: "Invalid BST: For each node, all left subtree values < node < all right subtree values",
    };
  }

  return { valid: true, message: "Valid BST sequence" };
}

// Convert BST to TreeNode format for visualization
function bstToTreeNodes(root: BSTNode | null): TreeNode[] {
  if (!root) return [];

  const nodes: TreeNode[] = [];
  const nodeMap = new Map<BSTNode, number>();
  const queue: (BSTNode | null)[] = [root];
  let id = 0;

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) {
      queue.push(null);
      continue;
    }

    const nodeId = nodes.length;
    nodeMap.set(node, nodeId);
    nodes.push({
      id: nodeId,
      value: node.value,
      x: 0,
      y: 0,
      children: [],
      state: "default",
    });

    if (node.left) queue.push(node.left);
    else queue.push(null);

    if (node.right) queue.push(node.right);
    else queue.push(null);
  }

  // Calculate positions
  const maxDepth = Math.ceil(Math.log2(nodes.length + 1));
  const levelWidth = Math.pow(2, maxDepth);
  const horizontalSpacing = 120;
  const verticalSpacing = 100;

  for (let i = 0; i < nodes.length; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const posInDepth = (i + 1) - (Math.pow(2, depth) - 1);
    const maxWidth = Math.pow(2, depth);

    const levelWidthPixels = (maxWidth - 1) * horizontalSpacing;
    const centerOffset = (levelWidth - 1) * horizontalSpacing / 2;

    nodes[i].x = centerOffset + ((posInDepth - 1) * horizontalSpacing) - (levelWidthPixels / 2);
    nodes[i].y = 50 + depth * verticalSpacing;
  }

  // Set children relationships
  for (let i = 0; i < nodes.length; i++) {
    const leftChild = 2 * i + 1;
    const rightChild = 2 * i + 2;

    if (leftChild < nodes.length) {
      nodes[i].children.push(leftChild);
    }
    if (rightChild < nodes.length) {
      nodes[i].children.push(rightChild);
    }
  }

  return nodes;
}

// Simulate BST insertion step by step
function simulateBSTInsertion(values: number[]): TreeStep[] {
  const steps: TreeStep[] = [];
  let root: BSTNode | null = null;

  steps.push({
    nodes: [],
    traversalOrder: [],
    description: "> Starting BST insertion",
    detail: `Will insert: ${values.join(", ")}`,
  });

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    root = insertBSTNode(root, value);

    const nodes = bstToTreeNodes(root);

    // Mark the newly inserted node
    let insertedNode: TreeNode | null = null;
    const findNode = (node: BSTNode | null, val: number): BSTNode | null => {
      if (!node) return null;
      if (node.value === val) return node;
      if (val < node.value) return findNode(node.left, val);
      return findNode(node.right, val);
    };

    const newNode = findNode(root, value);
    if (newNode) {
      for (const n of nodes) {
        if (n.value === newNode.value) {
          n.state = "found";
          insertedNode = n;
        }
      }
    }

    steps.push({
      nodes: nodes,
      traversalOrder: [],
      description: `> Insert value: ${value}`,
      detail: `Tree now has ${nodes.length} node(s). BST property maintained.`,
    });
  }

  return steps;
}

// Simulate BST search step by step
function simulateBSTSearch(values: number[], target: number): TreeStep[] {
  const steps: TreeStep[] = [];
  const root = buildBSTFromValues(values);
  let nodes = bstToTreeNodes(root);

  steps.push({
    nodes: nodes,
    traversalOrder: [],
    description: `> Starting BST search for ${target}`,
    detail: `Tree values: ${values.join(", ")}`,
  });

  let current: BSTNode | null = root;
  let comparisons = 0;

  while (current) {
    comparisons++;
    nodes = bstToTreeNodes(root);

    // Mark current node being checked
    for (const node of nodes) {
      if (node.value === current.value) {
        node.state = "current";
      }
    }

    steps.push({
      nodes: nodes,
      traversalOrder: [],
      description: `> Check node: ${current.value}`,
      detail: `Target: ${target}, Comparisons: ${comparisons}`,
    });

    if (current.value === target) {
      // Found
      nodes = bstToTreeNodes(root);
      for (const node of nodes) {
        if (node.value === target) {
          node.state = "found";
        }
      }

      steps.push({
        nodes: nodes,
        traversalOrder: [],
        description: `> Found ${target}!`,
        detail: `Search successful in ${comparisons} comparison(s)`,
      });
      return steps;
    }

    if (target < current.value) {
      current = current.left;
      if (current) {
        steps.push({
          nodes: bstToTreeNodes(root),
          traversalOrder: [],
          description: `> ${target} < ${current.value} (current), go LEFT`,
          detail: `Comparisons: ${comparisons}`,
        });
      }
    } else {
      current = current.right;
      if (current) {
        steps.push({
          nodes: bstToTreeNodes(root),
          traversalOrder: [],
          description: `> ${target} > previous node, go RIGHT`,
          detail: `Comparisons: ${comparisons}`,
        });
      }
    }
  }

  // Not found
  steps.push({
    nodes: bstToTreeNodes(root),
    traversalOrder: [],
    description: `> Value ${target} not found`,
    detail: `Reached end of tree after ${comparisons} comparison(s)`,
  });

  return steps;
}

