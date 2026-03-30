import type { BaseOptions } from "../option"
import { validateAttribute } from "../attribute"
import { handleWarning } from "../utility/handle-warning"

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

  if (location !== -1) {
    // If attribute is valid, enable it
    context.enableVertexAttribArray(location)
  } else if (options.strict) {
    // If strict mode is enabled and attribute is missing → delegate to handleWarning
    handleWarning({
      subject : "attribute",
      context : {
        action  : "enable",
        result  : `Attribute "${options.name}" not found in program`
      },
      strict  : true
    })
  }
}