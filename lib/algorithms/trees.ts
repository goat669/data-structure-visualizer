import { TreeNode, TreeStep } from "./types";

export function runTreeAlgo(algoId: string, nodeCount: number = 7): TreeStep[] {
  const steps: TreeStep[] = [];
  const tree = createSampleBinaryTree(Math.min(9, Math.max(1, nodeCount)));

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
  } else if (algoId === "avl-insert") {
    return simulateAVLInsert(tree, steps);
  }

  return steps;
}

function createSampleBinaryTree(count: number): TreeNode[] {
  const nodes: TreeNode[] = [];
  const nodeValues = [4, 2, 6, 1, 3, 5, 7, 8, 9].slice(0, Math.max(1, count));

  for (let i = 0; i < nodeValues.length; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const posInDepth = (i + 1) - (Math.pow(2, depth) - 1);
    const maxWidth = Math.pow(2, depth);
    const x = 50 + ((posInDepth - 1) / maxWidth) * 500;
    const y = 50 + depth * 100;

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

function simulateAVLInsert(nodes: TreeNode[], steps: TreeStep[]): TreeStep[] {
  let currentNodes = JSON.parse(JSON.stringify(nodes));

  steps.push({
    nodes: currentNodes,
    description: `> AVL Tree Insert: auto-balancing`,
  });

  currentNodes[0].state = "current";
  steps.push({
    nodes: JSON.parse(JSON.stringify(currentNodes)),
    description: `> Insert value, checking balance factors`,
    extra: `Balance factor at each node must be -1, 0, or 1`,
  });

  currentNodes[0].state = "default";
  steps.push({
    nodes: JSON.parse(JSON.stringify(currentNodes)),
    description: `> Tree is balanced, AVL property maintained`,
    extra: `No rotations needed`,
  });

  return steps;
}
