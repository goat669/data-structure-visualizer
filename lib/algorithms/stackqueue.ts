import { StackQueueItem, StackQueueStep } from "./types";

function item(value: string, state: StackQueueItem["state"] = "default"): StackQueueItem {
  return { value, state };
}

function snap(
  primary: StackQueueItem[],
  description: string,
  secondary?: StackQueueItem[],
  operation?: string,
  extra?: string
): StackQueueStep {
  return {
    primary: primary.map((i) => ({ ...i })),
    secondary: secondary?.map((i) => ({ ...i })),
    description,
    operation,
    extra,
  };
}

// ─── Stack Operations ────────────────────────────────────────────────────────

const STACK_SEQUENCE = [
  { op: "push", val: "10" },
  { op: "push", val: "25" },
  { op: "push", val: "8"  },
  { op: "peek", val: ""   },
  { op: "push", val: "42" },
  { op: "pop",  val: ""   },
  { op: "pop",  val: ""   },
  { op: "push", val: "15" },
  { op: "pop",  val: ""   },
  { op: "pop",  val: ""   },
];

export function stackOpsSteps(): StackQueueStep[] {
  const steps: StackQueueStep[] = [];
  const stack: StackQueueItem[] = [];

  steps.push(snap([], "Stack initialized — empty LIFO structure", [], "init", "Top →"));

  for (const { op, val } of STACK_SEQUENCE) {
    if (op === "push") {
      // Mark all existing as default, new item as pushing
      const newStack = stack.map((i) => item(i.value, "default"));
      newStack.push(item(val, "pushing"));
      steps.push(snap(newStack, `PUSH ${val} onto top of stack`, [], "push", `Pushed: ${val}`));
      // Settle
      stack.push(item(val, "default"));
      steps.push(snap(stack.map((i) => item(i.value, "default")), `Stack after PUSH ${val}`, [], "push", `Size: ${stack.length}`));
    } else if (op === "pop") {
      if (stack.length === 0) {
        steps.push(snap([], "POP called — stack is empty (underflow!)", [], "pop", "Underflow!"));
        continue;
      }
      const top = stack[stack.length - 1];
      const before = stack.map((i, idx) =>
        item(i.value, idx === stack.length - 1 ? "popping" : "default")
      );
      steps.push(snap(before, `POP — removing top element ${top.value}`, [], "pop", `Popped: ${top.value}`));
      stack.pop();
      steps.push(snap(stack.map((i) => item(i.value, "default")), `Stack after POP. Removed: ${top.value}`, [], "pop", `Size: ${stack.length}`));
    } else if (op === "peek") {
      if (stack.length === 0) {
        steps.push(snap([], "PEEK — stack is empty", [], "peek", ""));
        continue;
      }
      const peekStack = stack.map((i, idx) =>
        item(i.value, idx === stack.length - 1 ? "highlight" : "default")
      );
      steps.push(snap(peekStack, `PEEK — top element is ${stack[stack.length - 1].value} (not removed)`, [], "peek", `Top: ${stack[stack.length - 1].value}`));
    }
  }

  steps.push(snap(stack.map((i) => item(i.value)), "Stack operations complete", [], "done", `Final size: ${stack.length}`));
  return steps;
}

// ─── Queue Operations ────────────────────────────────────────────────────────

const QUEUE_SEQUENCE = [
  { op: "enqueue", val: "10" },
  { op: "enqueue", val: "25" },
  { op: "enqueue", val: "8"  },
  { op: "front",   val: ""   },
  { op: "enqueue", val: "42" },
  { op: "dequeue", val: ""   },
  { op: "dequeue", val: ""   },
  { op: "enqueue", val: "15" },
  { op: "dequeue", val: ""   },
  { op: "dequeue", val: ""   },
];

export function queueOpsSteps(): StackQueueStep[] {
  const steps: StackQueueStep[] = [];
  const queue: StackQueueItem[] = [];

  steps.push(snap([], "Queue initialized — empty FIFO structure", [], "init", "← Rear   Front →"));

  for (const { op, val } of QUEUE_SEQUENCE) {
    if (op === "enqueue") {
      const newQueue = queue.map((i) => item(i.value, "default"));
      newQueue.unshift(item(val, "pushing")); // rear is left in our display
      steps.push(snap(newQueue, `ENQUEUE ${val} at rear`, [], "enqueue", `Enqueued: ${val}`));
      queue.unshift(item(val, "default"));
      steps.push(snap(queue.map((i) => item(i.value, "default")), `Queue after ENQUEUE ${val}`, [], "enqueue", `Size: ${queue.length}`));
    } else if (op === "dequeue") {
      if (queue.length === 0) {
        steps.push(snap([], "DEQUEUE called — queue is empty (underflow!)", [], "dequeue", "Underflow!"));
        continue;
      }
      const front = queue[queue.length - 1];
      const before = queue.map((i, idx) =>
        item(i.value, idx === queue.length - 1 ? "popping" : "default")
      );
      steps.push(snap(before, `DEQUEUE — removing front element ${front.value}`, [], "dequeue", `Dequeued: ${front.value}`));
      queue.pop();
      steps.push(snap(queue.map((i) => item(i.value, "default")), `Queue after DEQUEUE. Removed: ${front.value}`, [], "dequeue", `Size: ${queue.length}`));
    } else if (op === "front") {
      if (queue.length === 0) {
        steps.push(snap([], "FRONT — queue is empty", [], "front", ""));
        continue;
      }
      const frontQueue = queue.map((i, idx) =>
        item(i.value, idx === queue.length - 1 ? "highlight" : "default")
      );
      steps.push(snap(frontQueue, `FRONT — element is ${queue[queue.length - 1].value} (not removed)`, [], "front", `Front: ${queue[queue.length - 1].value}`));
    }
  }

  steps.push(snap(queue.map((i) => item(i.value)), "Queue operations complete", [], "done", `Final size: ${queue.length}`));
  return steps;
}

// ─── Balanced Brackets ───────────────────────────────────────────────────────

export function balancedBracketsSteps(): StackQueueStep[] {
  const expression = "{[A+(B*C)]-D/(E+F)}";
  const steps: StackQueueStep[] = [];
  const stack: StackQueueItem[] = [];
  const OPEN  = new Set(["(", "[", "{"]);
  const CLOSE = new Set([")", "]", "}"]);
  const MATCH: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

  steps.push(snap([], `Input: "${expression}"`, [], "init", "Scanning..."));

  let balanced = true;
  for (let i = 0; i < expression.length; i++) {
    const ch = expression[i];
    if (OPEN.has(ch)) {
      stack.push(item(ch, "pushing"));
      steps.push(
        snap([...stack], `PUSH '${ch}' — opening bracket`, [], "push",
          `Token: '${ch}' at pos ${i}`)
      );
      stack[stack.length - 1].state = "default";
    } else if (CLOSE.has(ch)) {
      if (stack.length === 0) {
        steps.push(snap([...stack, item(ch, "mismatch")], `Closing '${ch}' but stack empty — UNBALANCED!`, [], "error", `Token: '${ch}' at pos ${i}`));
        balanced = false;
        break;
      }
      const top = stack[stack.length - 1];
      const expected = MATCH[ch];
      if (top.value === expected) {
        const matched = stack.map((it, idx) =>
          item(it.value, idx === stack.length - 1 ? "matched" : "default")
        );
        steps.push(snap(matched, `'${ch}' matches '${top.value}' — POP`, [], "pop", `Token: '${ch}' at pos ${i}`));
        stack.pop();
      } else {
        const mis = stack.map((it, idx) =>
          item(it.value, idx === stack.length - 1 ? "mismatch" : "default")
        );
        steps.push(snap(mis, `'${ch}' does NOT match '${top.value}' — UNBALANCED!`, [], "error", `Token: '${ch}' at pos ${i}`));
        balanced = false;
        break;
      }
    } else {
      // Operand — just show, don't touch stack
      steps.push(snap([...stack], `Operand '${ch}' — skip`, [], "skip", `Token: '${ch}' at pos ${i}`));
    }
  }

  if (balanced) {
    if (stack.length === 0) {
      steps.push(snap([], `All brackets matched — BALANCED`, [], "done", "Result: BALANCED"));
    } else {
      steps.push(
        snap(stack.map((i) => item(i.value, "mismatch")),
          `Unmatched opening brackets remain — UNBALANCED`, [], "error", "Result: UNBALANCED")
      );
    }
  }

  return steps;
}

// ─── Infix to Postfix ────────────────────────────────────────────────────────

function precedence(op: string): number {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

export function infixToPostfixSteps(): StackQueueStep[] {
  const expr = "A+B*C-(D/E+F)*G";
  const steps: StackQueueStep[] = [];
  const opStack: StackQueueItem[] = [];
  const output: StackQueueItem[] = [];

  steps.push(
    snap([], `Input: "${expr}"`, [], "init", "Operator stack | Output queue"),
    // intentional comma — we can add more later but one snap is fine
  );

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (/[A-Za-z0-9]/.test(ch)) {
      output.push(item(ch, "pushing"));
      steps.push(
        snap([...opStack], `Operand '${ch}' — append to output`, [...output], "operand",
          `Token: '${ch}'`)
      );
      output[output.length - 1].state = "default";
    } else if (ch === "(") {
      opStack.push(item(ch, "pushing"));
      steps.push(
        snap([...opStack], `'(' — push to operator stack`, [...output], "push",
          `Token: '${ch}'`)
      );
      opStack[opStack.length - 1].state = "default";
    } else if (ch === ")") {
      steps.push(
        snap([...opStack], `')' — pop until matching '('`, [...output], "pop",
          `Token: '${ch}'`)
      );
      while (opStack.length && opStack[opStack.length - 1].value !== "(") {
        const op = opStack.pop()!;
        output.push(item(op.value, "pushing"));
        steps.push(
          snap([...opStack], `Pop '${op.value}' to output`, [...output], "pop",
            `Popping: '${op.value}'`)
        );
        output[output.length - 1].state = "default";
      }
      opStack.pop(); // remove '('
      steps.push(snap([...opStack], `Remove '(' from stack`, [...output], "pop", ""));
    } else if (["+", "-", "*", "/"].includes(ch)) {
      while (
        opStack.length &&
        opStack[opStack.length - 1].value !== "(" &&
        precedence(opStack[opStack.length - 1].value) >= precedence(ch)
      ) {
        const op = opStack.pop()!;
        output.push(item(op.value, "pushing"));
        steps.push(
          snap([...opStack], `Pop '${op.value}' (higher/equal precedence) to output`, [...output], "pop",
            `Popping: '${op.value}'`)
        );
        output[output.length - 1].state = "default";
      }
      opStack.push(item(ch, "pushing"));
      steps.push(
        snap([...opStack], `Push operator '${ch}' onto stack`, [...output], "push",
          `Token: '${ch}'`)
      );
      opStack[opStack.length - 1].state = "default";
    }
  }

  while (opStack.length) {
    const op = opStack.pop()!;
    output.push(item(op.value, "pushing"));
    steps.push(
      snap([...opStack], `Pop remaining operator '${op.value}' to output`, [...output], "pop",
        `Popping: '${op.value}'`)
    );
    output[output.length - 1].state = "default";
  }

  const result = output.map((o) => o.value).join(" ");
  steps.push(
    snap([], `Conversion complete`, [...output], "done",
      `Postfix: ${result}`)
  );

  return steps;
}
