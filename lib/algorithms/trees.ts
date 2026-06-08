import { TreeNode, TreeStep } from "./types";

export function runTreeAlgo(algoId: string, nodeCount: number = 7, customValues?: number[]): TreeStep[] {
  const steps: TreeStep[] = [];
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
  } else if (algoId === "bst-insert") {
    return simulateBSTInsert(tree, steps);
  } else if (algoId === "bst-search") {
    return simulateBSTSearch(tree, 5, steps);
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

// Validate if values form a valid BST when inserted in order
export function isValidBSTSequence(values: number[]): { valid: boolean; message: string } {
  if (values.length === 0) {
    return { valid: false, message: "Please enter at least one value" };
  }
  
  if (values.length === 1) {
    return { valid: true, message: "Valid single-node BST" };
  }

  // Insert values one by one and check BST property
  const tree: (TreeNode | null)[] = [];
  
  for (let i = 0; i < values.length; i++) {
    const tempNodes = createBSTFromValues(values.slice(0, i + 1));
    
    // Check if BST property is maintained
    if (!checkBSTProperty(tempNodes)) {
      return { 
        valid: false, 
        message: `Values don't maintain BST property. Left child must be < parent < right child.` 
      };
    }
  }

  return { valid: true, message: "Valid BST sequence" };
}

// Create BST from values by inserting in order
function createBSTFromValues(values: number[]): TreeNode[] {
  if (values.length === 0) return [];
  
  const nodes: TreeNode[] = [];
  const nodeMap = new Map<number, TreeNode>();
  
  for (const val of values) {
    const node: TreeNode = {
      id: nodes.length,
      value: val,
      x: 0,
      y: 0,
      children: [],
      state: "default"
    };
    nodes.push(node);
    nodeMap.set(val, node);
  }

  // Build tree structure (simulate BST insertion order)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const parent = nodes[i];
      const child = nodes[j];
      
      // Determine if child should be left or right
      if (child.value < parent.value) {
        if (!parent.children.includes(child.id)) {
          parent.children.push(child.id);
        }
      } else {
        if (!parent.children.includes(child.id)) {
          parent.children.push(child.id);
        }
      }
    }
  }

  return nodes;
}

// Check if tree maintains BST property
function checkBSTProperty(nodes: TreeNode[]): boolean {
  const checkNode = (nodeId: number, min: number, max: number): boolean => {
    if (nodeId >= nodes.length) return true;
    
    const node = nodes[nodeId];
    if (node.value <= min || node.value >= max) {
      return false;
    }
    
    for (const childId of node.children) {
      if (childId < nodes.length) {
        const child = nodes[childId];
        const isLeftChild = child.value < node.value;
        
        if (isLeftChild) {
          if (!checkNode(childId, min, node.value)) return false;
        } else {
          if (!checkNode(childId, node.value, max)) return false;
        }
      }
    }
    
    return true;
  };

  return checkNode(0, -Infinity, Infinity);
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

  steps.push({
    nodes: currentNodes,
    description: `> Post-Order complete: [${order.map((id) => currentNodes[id].value).join(", ")}]`,
    traversalOrder: order,
  });

  return steps;
}

function simulateBSTInsert(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const insertValue = 3;

  steps.push({
    nodes: currentNodes,
    description: `> BST Insert: value ${insertValue}`,
  });

  let current = 0;
  for (let i = 0; i < 5; i++) {
    if (current >= currentNodes.length) break;

    currentNodes[current].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Compare ${insertValue} with ${currentNodes[current].value}`,
      extra: `${insertValue < currentNodes[current].value ? "Go LEFT" : "Go RIGHT"}`,
    });

    const leftChild = 2 * current + 1;
    const rightChild = 2 * current + 2;

    if (insertValue < currentNodes[current].value) {
      if (leftChild < currentNodes.length) {
        current = leftChild;
      } else {
        currentNodes[current].state = "default";
        steps.push({
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          description: `> Position found: insert ${insertValue} as LEFT child of ${currentNodes[current].value}`,
          extra: `Insert complete`,
        });
        return steps;
      }
    } else {
      if (rightChild < currentNodes.length) {
        current = rightChild;
      } else {
        currentNodes[current].state = "default";
        steps.push({
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          description: `> Position found: insert ${insertValue} as RIGHT child of ${currentNodes[current].value}`,
          extra: `Insert complete`,
        });
        return steps;
      }
    }

    currentNodes[current].state = "default";
  }

  return steps;
}

function simulateBSTSearch(nodes: TreeNode[], target: number, steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));

  steps.push({
    nodes: currentNodes,
    description: `> BST Search: find ${target}`,
  });

  let current = 0;
  for (let i = 0; i < 10; i++) {
    if (current >= currentNodes.length) break;

    currentNodes[current].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Check node ${currentNodes[current].value}`,
      extra: target === currentNodes[current].value ? "FOUND!" : target < currentNodes[current].value ? "Search LEFT" : "Search RIGHT",
    });

    if (currentNodes[current].value === target) {
      currentNodes[current].state = "found";
      steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        description: `> Found ${target}!`,
        extra: `Search successful`,
      });
      return steps;
    }

    const leftChild = 2 * current + 1;
    const rightChild = 2 * current + 2;

    if (target < currentNodes[current].value) {
      if (leftChild < currentNodes.length) {
        current = leftChild;
      } else {
        break;
      }
    } else {
      if (rightChild < currentNodes.length) {
        current = rightChild;
      } else {
        break;
      }
    }

    currentNodes[current].state = "default";
  }

  steps.push({
    nodes: currentNodes,
    description: `> Value ${target} not found`,
    extra: `Search failed`,
  });

  return steps;
}

