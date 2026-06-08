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

  return steps;
}

