/**
 * Parse a context object into a structured, aligned message string
 *
 * **Parameters**
 * - `subject` – Subject string (e.g. "shader", "attribute")
 * - `label`   – Label string (e.g. "error", "warning")
 * - `context` – Context object containing key-value pairs
 *
 * **Output**
 * ```bash
 * [attribute warning]
 * - action  : binding
 * - message : Attribute not found
 * - file    : /src/attribute.ts
 * - line    : 42
 * - column  : 13
 * ```
 */
export function parseContext(
  subject: string,
  label: string,
  context: Record<string, unknown>
): string {
  // Find the longest key length for alignment
  const maxKeyLength = Math.max(...Object.keys(context).map(k => k.length))

  // Build structured message
  return [
    `[${subject} ${label}]`,
    ...Object.entries(context).map(([key, value]) => {
      const paddedKey = key.padEnd(maxKeyLength, " ")
      return `- ${paddedKey} : ${value}`
    })
  ].join("\n")
}
