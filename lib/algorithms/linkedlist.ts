import { LinkedListStep, LLNode, LinkedListConfig } from "./llTypes";

// Helper to generate node positions in a row
function generateNodePositions(count: number): Array<{ x: number; y: number }> {
  const spacing = 80;
  const startX = 60;
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * spacing,
    y: 200,
  }));
}

// ════════════════════════════════════════════════════════════════════════════════
// SINGLY LINKED LIST
// ════════════════════════════════════════════════════════════════════════════════

export function singlyInsert(
  values: number[],
  position: number,
  insertValue: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), values.length);
  let comparisons = 0;
  let operations = 0;

  // Step 1: Show original list
  const positions1 = generateNodePositions(values.length);
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: positions1[i].x,
      y: positions1[i].y,
    })),
    description: `Singly LL: Inserting ${insertValue} at position ${clampedPos}`,
    detail: "Starting from HEAD, traversing to find insertion point",
    comparisons,
    operations,
  });

  // Step 2: Traverse to position
  for (let i = 0; i < clampedPos; i++) {
    comparisons++;
    operations++;
    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : "default",
        x: positions1[idx].x,
        y: positions1[idx].y,
      })),
      description: `Traversing node ${i}: value = ${values[i]}`,
      detail: `Position pointer moved to node ${i}`,
      comparisons,
      operations,
    });
  }

  // Step 3: Create new node
  operations++;
  const newValues = [...values.slice(0, clampedPos), insertValue, ...values.slice(clampedPos)];
  const positions2 = generateNodePositions(newValues.length);
  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      state: i === clampedPos ? "highlight" : "default",
      x: positions2[i].x,
      y: positions2[i].y,
    })),
    description: `New node created with value ${insertValue}`,
    detail: "Node inserted at position " + clampedPos,
    comparisons,
    operations,
  });

  // Step 4: Link pointers
  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      state: i === clampedPos ? "sorted" : i === clampedPos - 1 || i === clampedPos ? "comparing" : "default",
      x: positions2[i].x,
      y: positions2[i].y,
    })),
    description: `Links established: node ${clampedPos - 1} → node ${clampedPos} → node ${clampedPos + 1}`,
    detail: "Pointers updated successfully",
    comparisons,
    operations,
  });

  return steps;
}

export function singlyDelete(
  values: number[],
  position: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), values.length - 1);
  let comparisons = 0;
  let operations = 0;

  const positions1 = generateNodePositions(values.length);

  // Step 1: Show list and target node
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: i === clampedPos ? "highlight" : "default",
      x: positions1[i].x,
      y: positions1[i].y,
    })),
    description: `Singly LL: Deleting node at position ${clampedPos} (value: ${values[clampedPos]})`,
    detail: "Node marked for deletion",
    comparisons,
    operations,
  });

  // Step 2: Traverse to node before delete position
  for (let i = 0; i < clampedPos - 1; i++) {
    comparisons++;
    operations++;
    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : idx === clampedPos ? "highlight" : "default",
        x: positions1[idx].x,
        y: positions1[idx].y,
      })),
      description: `Traversing to node before deletion: ${i}`,
      detail: "Moving to predecessor node",
      comparisons,
      operations,
    });
  }

  // Step 3: Update links
  operations++;
  const newValues = values.filter((_, i) => i !== clampedPos);
  const positions2 = generateNodePositions(newValues.length);

  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      state: i === Math.max(0, clampedPos - 1) ? "comparing" : i === clampedPos ? "comparing" : "default",
      x: positions2[i].x,
      y: positions2[i].y,
    })),
    description: `Node deleted. Link updated: node ${clampedPos - 1} → node ${clampedPos}`,
    detail: "Pointer redirected to skip deleted node",
    comparisons,
    operations,
  });

  return steps;
}

export function singlySearch(
  values: number[],
  searchValue: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const positions = generateNodePositions(values.length);
  let comparisons = 0;
  let operations = 0;
  const foundIndex = values.indexOf(searchValue);

  // Step 1: Start search
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: positions[i].x,
      y: positions[i].y,
    })),
    description: `Singly LL: Searching for value ${searchValue}`,
    detail: "Starting from HEAD node",
    comparisons,
    operations,
  });

  // Step 2-N: Traverse and compare
  for (let i = 0; i < values.length; i++) {
    comparisons++;
    operations++;
    if (values[i] === searchValue) {
      steps.push({
        nodes: values.map((v, idx) => ({
          id: idx,
          value: v,
          state: idx === i ? "found" : idx < i ? "visited" : "default",
          x: positions[idx].x,
          y: positions[idx].y,
        })),
        description: `Found ${searchValue} at position ${i}!`,
        detail: `Search completed in ${comparisons} comparisons`,
        comparisons,
        operations,
      });
      return steps;
    } else {
      steps.push({
        nodes: values.map((v, idx) => ({
          id: idx,
          value: v,
          state: idx === i ? "comparing" : idx < i ? "visited" : "default",
          x: positions[idx].x,
          y: positions[idx].y,
        })),
        description: `Checking node ${i}: value ${v} ≠ ${searchValue}`,
        detail: "Moving to next node...",
        comparisons,
        operations,
      });
    }
  }

  // Not found
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "visited",
      x: positions[i].x,
      y: positions[i].y,
    })),
    description: `Value ${searchValue} not found in list`,
    detail: `Traversed all ${values.length} nodes`,
    comparisons,
    operations,
  });

  return steps;
}

export function singlyReverse(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const originalPositions = generateNodePositions(values.length);
  let comparisons = 0;
  let operations = 0;

  // Step 1: Show original
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: originalPositions[i].x,
      y: originalPositions[i].y,
    })),
    description: "Singly LL: Reversing the linked list",
    detail: "Original order: " + values.join(" → "),
    comparisons,
    operations,
  });

  // Step 2-N: Reverse one by one
  const reversed: number[] = [];
  for (let i = values.length - 1; i >= 0; i--) {
    operations++;
    reversed.push(values[i]);
    const positions = generateNodePositions(reversed.length);
    steps.push({
      nodes: reversed.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === reversed.length - 1 ? "comparing" : idx === 0 ? "highlight" : "default",
        x: positions[idx].x,
        y: positions[idx].y,
      })),
      description: `Reversing: Added ${values[i]} to result`,
      detail: `Current reversed order: ${reversed.join(" → ")}`,
      comparisons,
      operations,
    });
  }

  return steps;
}

// ════════════════════════════════════════════════════════════════════════════════
// DOUBLY LINKED LIST
// ════════════════════════════════════════════════════════════════════════════════

export function doublyInsert(
  values: number[],
  position: number,
  insertValue: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), values.length);
  let comparisons = 0;
  let operations = 0;

  const positions1 = generateNodePositions(values.length);
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: positions1[i].x,
      y: positions1[i].y,
    })),
    description: `Doubly LL: Inserting ${insertValue} at position ${clampedPos}`,
    detail: "Can traverse forward or backward",
    comparisons,
    operations,
  });

  // Traverse to position
  for (let i = 0; i < clampedPos; i++) {
    comparisons++;
    operations++;
    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : "default",
        x: positions1[idx].x,
        y: positions1[idx].y,
      })),
      description: `Traversing forward to position ${i}`,
      detail: `Can return backward if needed`,
      comparisons,
      operations,
    });
  }

  // Create new node with both links
  operations++;
  const newValues = [...values.slice(0, clampedPos), insertValue, ...values.slice(clampedPos)];
  const positions2 = generateNodePositions(newValues.length);
  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      state: i === clampedPos ? "highlight" : "default",
      x: positions2[i].x,
      y: positions2[i].y,
    })),
    description: `New node created with value ${insertValue}`,
    detail: "Node has both prev and next pointers",
    comparisons,
    operations,
  });

  // Update bidirectional links
  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      state: i === clampedPos || i === clampedPos - 1 || i === clampedPos + 1 ? "comparing" : "default",
      x: positions2[i].x,
      y: positions2[i].y,
    })),
    description: `Bidirectional links established`,
    detail: `${clampedPos - 1} ⇄ ${clampedPos} ⇄ ${clampedPos + 1}`,
    comparisons,
    operations,
  });

  return steps;
}

export function doublyDelete(
  values: number[],
  position: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), values.length - 1);
  let comparisons = 0;
  let operations = 0;

  const positions1 = generateNodePositions(values.length);
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: i === clampedPos ? "highlight" : "default",
      x: positions1[i].x,
      y: positions1[i].y,
    })),
    description: `Doubly LL: Deleting node at position ${clampedPos}`,
    detail: "Can approach from either direction",
    comparisons,
    operations,
  });

  // Traverse to deletion point
  for (let i = 0; i < clampedPos; i++) {
    comparisons++;
    operations++;
    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : idx === clampedPos ? "highlight" : "default",
        x: positions1[idx].x,
        y: positions1[idx].y,
      })),
      description: `Traversing forward to node ${i}`,
      detail: "Moving closer to target node",
      comparisons,
      operations,
    });
  }

  // Remove and update bidirectional links
  operations++;
  const newValues = values.filter((_, i) => i !== clampedPos);
  const positions2 = generateNodePositions(newValues.length);

  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      state: i === Math.max(0, clampedPos - 1) || i === clampedPos ? "comparing" : "default",
      x: positions2[i].x,
      y: positions2[i].y,
    })),
    description: `Node deleted. Bidirectional links updated`,
    detail: `${clampedPos - 1} ⇄ ${clampedPos}`,
    comparisons,
    operations,
  });

  return steps;
}

export function doublySearch(
  values: number[],
  searchValue: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const positions = generateNodePositions(values.length);
  let comparisons = 0;
  let operations = 0;
  const foundIndex = values.indexOf(searchValue);

  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: positions[i].x,
      y: positions[i].y,
    })),
    description: `Doubly LL: Searching for value ${searchValue}`,
    detail: "Can search forward from HEAD or backward from TAIL",
    comparisons,
    operations,
  });

  // Search forward
  for (let i = 0; i < values.length; i++) {
    comparisons++;
    operations++;
    if (values[i] === searchValue) {
      steps.push({
        nodes: values.map((v, idx) => ({
          id: idx,
          value: v,
          state: idx === i ? "found" : idx < i ? "visited" : "default",
          x: positions[idx].x,
          y: positions[idx].y,
        })),
        description: `Found ${searchValue} at position ${i}!`,
        detail: `Search completed in ${comparisons} comparisons`,
        comparisons,
        operations,
      });
      return steps;
    }

    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : "default",
        x: positions[idx].x,
        y: positions[idx].y,
      })),
      description: `Checking node ${i}: value ${v} ≠ ${searchValue}`,
      detail: "Moving forward to next node...",
      comparisons,
      operations,
    });
  }

  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "visited",
      x: positions[i].x,
      y: positions[i].y,
    })),
    description: `Value ${searchValue} not found in list`,
    detail: `Checked all ${values.length} nodes`,
    comparisons,
    operations,
  });

  return steps;
}

export function doublyReverse(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const originalPositions = generateNodePositions(values.length);
  let comparisons = 0;
  let operations = 0;

  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: originalPositions[i].x,
      y: originalPositions[i].y,
    })),
    description: "Doubly LL: Reversing the linked list",
    detail: "Swapping prev and next pointers for each node",
    comparisons,
    operations,
  });

  // Show reversal by swapping pointers
  const reversed: number[] = [];
  for (let i = values.length - 1; i >= 0; i--) {
    operations++;
    reversed.push(values[i]);
    const positions = generateNodePositions(reversed.length);
    steps.push({
      nodes: reversed.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === reversed.length - 1 ? "comparing" : idx === 0 ? "highlight" : "default",
        x: positions[idx].x,
        y: positions[idx].y,
      })),
      description: `Swapped pointers for node with value ${values[i]}`,
      detail: `Current order: ${reversed.join(" ⇄ ")}`,
      comparisons,
      operations,
    });
  }

  return steps;
}

// ════════════════════════════════════════════════════════════════════════════════
// CIRCULAR LINKED LIST
// ════════════════════════════════════════════════════════════════════════════════

export function circularInsert(
  values: number[],
  position: number,
  insertValue: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), values.length);
  let comparisons = 0;
  let operations = 0;

  const positions1 = generateNodePositions(values.length);
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: positions1[i].x,
      y: positions1[i].y,
    })),
    description: `Circular LL: Inserting ${insertValue} at position ${clampedPos}`,
    detail: "Last node points back to first (circular)",
    comparisons,
    operations,
  });

  // Traverse
  for (let i = 0; i < clampedPos; i++) {
    comparisons++;
    operations++;
    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : "default",
        x: positions1[idx].x,
        y: positions1[idx].y,
      })),
      description: `Traversing to position ${i}`,
      detail: "Circular traversal: will return to head after last node",
      comparisons,
      operations,
    });
  }

  // Create and insert
  operations++;
  const newValues = [...values.slice(0, clampedPos), insertValue, ...values.slice(clampedPos)];
  const positions2 = generateNodePositions(newValues.length);
  steps.push({
    nodes: newValues.map((v, i) => ({
      id: i,
      value: v,
      state: i === clampedPos ? "highlight" : i === newValues.length - 1 ? "comparing" : "default",
      x: positions2[i].x,
      y: positions2[i].y,
    })),
    description: `New node inserted. Circular link maintained`,
    detail: `Last node (${newValues.length - 1}) → First node (0)`,
    comparisons,
    operations,
  });

  return steps;
}

export function circularDelete(
  values: number[],
  position: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const clampedPos = Math.min(Math.max(0, position), values.length - 1);
  let comparisons = 0;
  let operations = 0;

  const positions1 = generateNodePositions(values.length);
  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: i === clampedPos ? "highlight" : i === values.length - 1 ? "comparing" : "default",
      x: positions1[i].x,
      y: positions1[i].y,
    })),
    description: `Circular LL: Deleting node at position ${clampedPos}`,
    detail: "Maintaining circular structure",
    comparisons,
    operations,
  });

  // Traverse to deletion point
  for (let i = 0; i < clampedPos; i++) {
    comparisons++;
    operations++;
    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : idx === clampedPos ? "highlight" : idx === values.length - 1 ? "comparing" : "default",
        x: positions1[idx].x,
        y: positions1[idx].y,
      })),
      description: `Traversing to node ${i}`,
      detail: "Moving toward deletion point",
      comparisons,
      operations,
    });
  }

  // Delete and maintain circular
  operations++;
  const newValues = values.filter((_, i) => i !== clampedPos);
  const positions2 = generateNodePositions(Math.max(1, newValues.length));

  steps.push({
    nodes: newValues.length > 0 ? newValues.map((v, i) => ({
      id: i,
      value: v,
      state: i === Math.max(0, clampedPos - 1) || i === newValues.length - 1 ? "comparing" : "default",
      x: positions2[i].x,
      y: positions2[i].y,
    })) : [{
      id: 0,
      value: 0,
      state: "default",
      x: 200,
      y: 200,
    }],
    description: `Node deleted. Circular structure maintained`,
    detail: newValues.length > 0 ? `Last node → First node (circular)` : "List is now empty",
    comparisons,
    operations,
  });

  return steps;
}

export function circularSearch(
  values: number[],
  searchValue: number
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const positions = generateNodePositions(values.length);
  let comparisons = 0;
  let operations = 0;
  const foundIndex = values.indexOf(searchValue);

  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: positions[i].x,
      y: positions[i].y,
    })),
    description: `Circular LL: Searching for value ${searchValue}`,
    detail: "Starting from HEAD, will loop through circular structure",
    comparisons,
    operations,
  });

  // Search with circular traversal
  for (let i = 0; i < values.length; i++) {
    comparisons++;
    operations++;
    if (values[i] === searchValue) {
      steps.push({
        nodes: values.map((v, idx) => ({
          id: idx,
          value: v,
          state: idx === i ? "found" : idx < i ? "visited" : "default",
          x: positions[idx].x,
          y: positions[idx].y,
        })),
        description: `Found ${searchValue} at position ${i}!`,
        detail: `Search completed in ${comparisons} comparisons`,
        comparisons,
        operations,
      });
      return steps;
    }

    steps.push({
      nodes: values.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === i ? "comparing" : idx < i ? "visited" : "default",
        x: positions[idx].x,
        y: positions[idx].y,
      })),
      description: `Checking node ${i}: value ${v} ≠ ${searchValue}`,
      detail: `Continuing circular traversal...`,
      comparisons,
      operations,
    });
  }

  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "visited",
      x: positions[i].x,
      y: positions[i].y,
    })),
    description: `Value ${searchValue} not found in list`,
    detail: `Completed one full circular cycle`,
    comparisons,
    operations,
  });

  return steps;
}

export function circularReverse(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const originalPositions = generateNodePositions(values.length);
  let comparisons = 0;
  let operations = 0;

  steps.push({
    nodes: values.map((v, i) => ({
      id: i,
      value: v,
      state: "default",
      x: originalPositions[i].x,
      y: originalPositions[i].y,
    })),
    description: "Circular LL: Reversing the linked list",
    detail: "Circular structure maintained: last → first",
    comparisons,
    operations,
  });

  // Reverse with circular maintenance
  const reversed: number[] = [];
  for (let i = values.length - 1; i >= 0; i--) {
    operations++;
    reversed.push(values[i]);
    const positions = generateNodePositions(reversed.length);
    steps.push({
      nodes: reversed.map((v, idx) => ({
        id: idx,
        value: v,
        state: idx === reversed.length - 1 ? "comparing" : idx === 0 ? "highlight" : "default",
        x: positions[idx].x,
        y: positions[idx].y,
      })),
      description: `Reversed node with value ${values[i]}`,
      detail: `Circular: ${reversed[reversed.length - 1]} → ... → ${reversed[0]} → (back to ${reversed[0]})`,
      comparisons,
      operations,
    });
  }

  return steps;
}
