import { CompilerResult } from '../types';

/**
 * Transpiles NanoLang code into executable JavaScript.
 * This is a simplified regex-based transpiler for demonstration purposes.
 */
export const transpileNanoToJs = (input: string): string => {
  const lines = input.split('\n');
  let jsLines: string[] = [];
  let indentLevel = 0;

  // Helper for indentation
  const indent = () => '  '.repeat(indentLevel);

  try {
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // 1. Comments
      if (trimmed.startsWith('note ')) {
        jsLines.push(`${indent()}// ${trimmed.substring(5)}`);
        return;
      }

      // 2. Output (say)
      // Matches: say "text" or say variable
      if (trimmed.startsWith('say ')) {
        const content = trimmed.substring(4);
        jsLines.push(`${indent()}console.log(${content});`);
        return;
      }

      // 3. Variables (set)
      // Matches: set x = 10
      if (trimmed.startsWith('set ')) {
        const parts = trimmed.substring(4).split('=');
        if (parts.length >= 2) {
          const varName = parts[0].trim();
          const value = parts.slice(1).join('=').trim();
          // We use 'let' effectively by declaring top-level scope or reusing
          // To keep it simple, we treat them as let, but we don't redeclare if already exists in a real compiler
          // Here we just assume 'let' for safety in a block, but realistically we might check existence.
          // For this toy language, we will just assign to window variable or scoped variable.
          // Let's use a safe local variable approach.
          jsLines.push(`${indent()}let ${varName} = ${value};`);
        }
        return;
      }

      // 4. Loops (repeat)
      // Matches: repeat 5
      if (trimmed.startsWith('repeat ')) {
        const count = trimmed.substring(7).trim();
        // Create a unique iterator variable based on indent level to avoid collision
        const iterator = `i_${indentLevel}`;
        jsLines.push(`${indent()}for (let ${iterator} = 0; ${iterator} < ${count}; ${iterator}++) {`);
        indentLevel++;
        return;
      }

      // 5. Conditionals (check)
      // Matches: check x > 10
      if (trimmed.startsWith('check ')) {
        const condition = trimmed.substring(6).trim();
        jsLines.push(`${indent()}if (${condition}) {`);
        indentLevel++;
        return;
      }

      // 6. Block End (end)
      if (trimmed === 'end') {
        if (indentLevel > 0) indentLevel--;
        jsLines.push(`${indent()}}`);
        return;
      }

      // Fallback for unknown commands or direct math/expressions implies ignored
      jsLines.push(`${indent()}// Unknown syntax: ${trimmed}`);
    });

    return jsLines.join('\n');
  } catch (e) {
    return `// Error parsing code`;
  }
};

/**
 * Executes the transpiled JavaScript code safely and captures console output.
 */
export const executeCode = async (jsCode: string): Promise<string[]> => {
  const logs: string[] = [];

  // Mock console.log
  const mockConsole = {
    log: (...args: any[]) => {
      logs.push(args.map(a => String(a)).join(' '));
    }
  };

  try {
    // Wrap code in an async function to allow awaiting if needed (future proofing)
    // and to isolate scope variables
    const wrappedCode = `
      return (async () => {
        try {
          ${jsCode}
        } catch (err) {
          console.log("Runtime Error: " + err.message);
        }
      })();
    `;

    // Create function with mocked console
    const func = new Function('console', wrappedCode);
    await func(mockConsole);

  } catch (e: any) {
    logs.push(`System Error: ${e.message}`);
  }

  return logs;
};