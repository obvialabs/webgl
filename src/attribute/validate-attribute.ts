import type { BaseOptions } from "../option"

/**
 * Configuration options for validating a vertex attribute
 */
export interface ValidateAttributeOptions extends BaseOptions {
  /**
   * Attribute name in the shader (e.g. "aPosition")
   */
  name: string
}

/**
 * Validate a vertex attribute by checking its location
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Linked shader program
 * - `options` – Validation configuration
 *    - `name` – Attribute name in the shader
 *    - `strict` – Throw error if attribute is not found (optional, default: false)
 *
 * **Usage**
 * ```ts
 * // Validate attribute existence
 * const location = validateAttribute(context, program, { name: "aPosition" })
 *
 * // Enforce strict mode
 * const location = validateAttribute(context, program, {
 *   name: "aPosition",
 *   strict: true
 * })
 * ```
 */
export function validateAttribute(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: ValidateAttributeOptions
): number {
  // Destructure options for clarity and consistency
  const { name, strict = false } = options

  // Look up the attribute location in the linked shader program
  const location = context.getAttribLocation(program, name)

  // If attribute is not found
  if (location === -1) {
    // In strict mode, throw an error to alert the developer
    if (strict) {
      throw new Error(`Attribute "${name}" not found in shader program`)
    }
  }

  return location
}
