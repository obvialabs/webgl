import type { BaseOptions } from "../option"

import { validateAttribute } from "../attribute"
import { handleWarning } from "../utility/handle-warning"

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

  if (location !== -1) {
    // If attribute is valid, disable it
    context.disableVertexAttribArray(location)
  } else if (options.strict) {
    // If strict mode is enabled and attribute is missing → delegate to handle warning
    handleWarning({
      subject : "attribute",
      context : {
        action  : "disable",
        result  : `Attribute "${options.name}" not found in program`
      },
      strict  : true
    })
  }
}