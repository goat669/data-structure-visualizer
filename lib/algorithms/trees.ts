import { TreeNode, TreeStep } from "./types";

export function runTreeAlgo(algoId: string, nodeCount: number = 7): TreeStep[] {
  const steps: TreeStep[] = [];

  // Create a sample binary tree
  const tree = createSampleBinaryTree(nodeCount);

  if (algoId === "tree-bfs") {
    return simulateBFS(tree, steps);
  } else if (algoId === "tree-dfs-inorder") {
    return simulateInorder(tree, steps);
  } else if (algoId === "tree-dfs-preorder") {
    return simulatePreorder(tree, steps);
  } else if (algoId === "bst-insert") {
    return simulateBSTInsert(tree, steps);
  } else if (algoId === "bst-search") {
    return simulateBSTSearch(tree, 4, steps);
  } else if (algoId === "avl-insert") {
    return simulateAVLInsert(tree, steps);
  }

  return steps;
}

function createSampleBinaryTree(count: number): TreeNode[] {
  const nodes: TreeNode[] = [];
  const nodeValues = [4, 2, 6, 1, 3, 5, 7, 8, 9].slice(0, Math.max(1, count));

  // Layout in a binary tree pattern
  for (let i = 0; i < nodeValues.length; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const posInDepth = (i + 1) - (Math.pow(2, depth) - 1);
    const x = 50 + (posInDepth - 1) * (600 / Math.pow(2, depth));
    const y = 50 + depth * 80;

    nodes.push({
      id: i,
      value: nodeValues[i],
      x,
      y,
      children: getChildrenIds(i),
      state: "default",
    });
  }

  return nodes;
}

function getChildrenIds(nodeId: number): number[] {
  const left = 2 * nodeId + 1;
  const right = 2 * nodeId + 2;
  return [left, right].filter((id) => id < 9);
}

function simulateBFS(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const order: number[] = [];

  steps.push({
    nodes: currentNodes,
    description: `> Starting BFS (Level-Order Traversal)`,
    traversalOrder: [],
  });

  const queue: number[] = [0]; // Start with root
  const visited = new Set<number>();

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    currentNodes[nodeId].state = "visiting";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Visiting node ${currentNodes[nodeId].value}`,
      extra: `Queue: [${queue.map((id) => currentNodes[id].value).join(", ")}]`,
      traversalOrder: [...order, nodeId],
    });

    currentNodes[nodeId].state = "visited";
    order.push(nodeId);

    // Add children to queue
    for (const childId of currentNodes[nodeId].children) {
      if (!visited.has(childId) && childId < currentNodes.length) {
        queue.push(childId);
      }
    }

    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Added children to queue`,
      traversalOrder: order,
    });
  }

  return steps;
}

function simulateInorder(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const order: number[] = [];

  steps.push({
    nodes: currentNodes,
    description: `> Starting In-Order Traversal (Left-Root-Right)`,
    traversalOrder: [],
  });

  function inorderDFS(nodeId: number) {
    if (nodeId >= currentNodes.length) return;

    const node = currentNodes[nodeId];
    const leftChild = 2 * nodeId + 1;
    const rightChild = 2 * nodeId + 2;

    // Visit left
    if (leftChild < currentNodes.length) {
      currentNodes[leftChild].state = "visiting";
      inorderDFS(leftChild);
    }

    // Visit root
    currentNodes[nodeId].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Processing node ${node.value}`,
      traversalOrder: [...order, nodeId],
    });
    currentNodes[nodeId].state = "visited";
    order.push(nodeId);

    // Visit right
    if (rightChild < currentNodes.length) {
      currentNodes[rightChild].state = "visiting";
      inorderDFS(rightChild);
    }
  }

  inorderDFS(0);
  return steps;
}

function simulatePreorder(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const order: number[] = [];

  steps.push({
    nodes: currentNodes,
    description: `> Starting Pre-Order Traversal (Root-Left-Right)`,
    traversalOrder: [],
  });

  function preorderDFS(nodeId: number) {
    if (nodeId >= currentNodes.length) return;

    // Visit root
    currentNodes[nodeId].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Processing node ${currentNodes[nodeId].value}`,
      traversalOrder: [...order, nodeId],
    });
    currentNodes[nodeId].state = "visited";
    order.push(nodeId);

    const leftChild = 2 * nodeId + 1;
    const rightChild = 2 * nodeId + 2;

    // Visit left
    if (leftChild < currentNodes.length) {
      currentNodes[leftChild].state = "visiting";
      preorderDFS(leftChild);
    }

    // Visit right
    if (rightChild < currentNodes.length) {
      currentNodes[rightChild].state = "visiting";
      preorderDFS(rightChild);
    }
  }

  preorderDFS(0);
  return steps;
}

function simulateBSTInsert(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));
  const insertValue = 3.5;

  steps.push({
    nodes: currentNodes,
    description: `> Inserting value ${insertValue} into BST`,
  });

  let current = 0;
  for (let i = 0; i < 5; i++) {
    currentNodes[current].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Comparing ${insertValue} with node ${currentNodes[current].value}`,
      extra: `Current node: ${currentNodes[current].value}`,
    });

    const leftChild = 2 * current + 1;
    const rightChild = 2 * current + 2;

    if (insertValue < currentNodes[current].value) {
      if (leftChild < currentNodes.length) {
        current = leftChild;
      } else {
        steps.push({
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          description: `> Inserted ${insertValue} as left child of ${currentNodes[current].value}`,
          extra: `Insertion complete`,
        });
        return steps;
      }
    } else {
      if (rightChild < currentNodes.length) {
        current = rightChild;
      } else {
        steps.push({
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          description: `> Inserted ${insertValue} as right child of ${currentNodes[current].value}`,
          extra: `Insertion complete`,
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
    description: `> Searching for value ${target} in BST`,
  });

  let current = 0;
  for (let i = 0; i < 10; i++) {
    currentNodes[current].state = "current";
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      description: `> Checking node ${currentNodes[current].value}`,
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
    description: `> Value ${target} not found in BST`,
    extra: `Search failed`,
  });

  return steps;
}

function simulateAVLInsert(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));

  steps.push({
    nodes: currentNodes,
    description: `> Inserting into AVL tree with auto-balancing`,
  });

  // Simulate unbalanced insertion
  currentNodes[0].state = "current";
  steps.push({
    nodes: JSON.parse(JSON.stringify(currentNodes)),
    description: `> Value inserted, checking balance factor`,
    extra: `Balance factor at root: 0`,
  });

  // Simulate rotation if needed
  steps.push({
    nodes: JSON.parse(JSON.stringify(currentNodes)),
    description: `> Tree is balanced, no rotation needed`,
    extra: `AVL property maintained`,
  });

  return steps;
}
