import type { BaseOptions } from "../option"

import { validateAttribute } from "../attribute"

/**
 * Configuration options for enabling a vertex attribute
 */
export interface EnableAttributeOptions extends BaseOptions {
  /**
   * Attribute name in the shader (e.g. "aPosition")
   */
  name: string
}

/**
 * Enable a vertex attribute
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Linked shader program
 * - `options` – Attribute enabling configuration
 *    - `name` – Attribute name in the shader
 *    - `strict` – Throw error if attribute is not found (optional, default: false)
 *
 * **Usage**
 * ```ts
 * // Enable the "aPosition" attribute
 * enableAttribute(context, program, { name: "aPosition" })
 *
 * // Enforce strict mode: throw error if missing
 * enableAttribute(context, program, { name: "aPosition", strict: true })
 * ```
 */
export function enableAttribute(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: EnableAttributeOptions
): void {
  // Validate attribute location using shared helper
  const location = validateAttribute(context, program, options)

  // If attribute is valid, enable it
  if (location !== -1) {
    context.enableVertexAttribArray(location)
  }
}
