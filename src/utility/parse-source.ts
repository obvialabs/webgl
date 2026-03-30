/**
 * Parse file, line, and column information from the current stack trace
 */
export function parseSource(): {
  file: string
  line: number
  column: number
} {
  const stack = new Error().stack?.split("\n")[2] || ""

  // Regex patterns for different environments
  const patterns = [
    /\((.*):(\d+):(\d+)\)/,   // Node.js / Chrome with function
    /at (.*):(\d+):(\d+)/,    // Chrome without parentheses
    /(.*):(\d+):(\d+)/        // Firefox / Safari
  ]

  for (const pattern of patterns) {
    const match = stack.match(pattern)
    if (match) {
      const [, file, line, column] = match
      return {
        file: file ?? "unknown",
        line: line ? Number(line) : -1,
        column: column ? Number(column) : -1
      }
    }
  }

  // Fallback if no regex matches
  return {
    file: "unknown",
    line: -1,
    column: -1
  }
}