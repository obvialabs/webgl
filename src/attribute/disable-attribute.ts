import type { BaseOptions } from "../option"

import { validateAttribute } from "../attribute"

/**
 * Configuration options for disabling a vertex attribute
 */
export interface DisableAttributeOptions extends BaseOptions {
  /**
   * Attribute name in the shader (e.g. "aTexCoord")
   */
  name: string
}

/**
 * Disable a vertex attribute
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Linked shader program
 * - `options` – Attribute disabling configuration
 *    - `name` – Attribute name in the shader
 *    - `strict` – Throw error if attribute is not found (optional, default: false)
 *
 * **Usage**
 * ```ts
 * // Disable the "aTexCoord" attribute when it's not needed
 * disableAttribute(context, program, { name: "aTexCoord" })
 *
 * // Enforce strict mode: throw error if missing
 * disableAttribute(context, program, { name: "aTexCoord", strict: true })
 * ```
 */
export function disableAttribute(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: DisableAttributeOptions
): void {
  // Validate attribute location using shared helper
  const location = validateAttribute(context, program, options)

  // If attribute is valid, disable it
  if (location !== -1) {
    context.disableVertexAttribArray(location)
  }
}
