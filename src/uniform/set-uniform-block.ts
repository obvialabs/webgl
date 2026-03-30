import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Configuration options for setting a uniform block
 */
export interface UniformBlockOptions extends BaseOptions {
  /**
   * Uniform block name in the shader
   */
  name: string

  /**
   * Binding point index
   */
  index: number
}

/**
 * Bind a uniform block to a binding point in a WebGL2 shader program
 *
 * **Parameters**
 * - `context` – Target WebGL2 rendering context (not supported in WebGL1)
 * - `program` – Linked shader program
 * - `options` – Configuration object
 *    - `name` – Uniform block name in the shader
 *    - `index` – Binding point index
 *    - `strict` – Throw error if uniform block is not found (default: false)
 *
 * **Usage**
 * ```ts
 * // Bind uniform block "Matrices" to binding point 0
 * setUniformBlock(context, program, {
 *   name: "Matrices",
 *   index: 0
 * })
 *
 * // With strict mode enabled
 * setUniformBlock(context, program, {
 *   name: "Matrices",
 *   index: 0,
 *   strict: true
 * })
 * ```
 */
export function setUniformBlock(
  context: WebGL2RenderingContext,
  program: WebGLProgram,
  options: UniformBlockOptions
): void {
  const { name, index, strict = false } = options

  // Find the uniform block index in the shader program
  const blockIndex = context.getUniformBlockIndex(program, name)

  // If uniform block is not found, delegate to centralized error handler
  if (blockIndex === context.INVALID_INDEX) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniformBlock",
        result  : `Uniform block "${name}" not found in shader program`
      },
      strict  : strict
    })
    return
  }

  // Bind the uniform block to the given binding point
  context.uniformBlockBinding(program, blockIndex, index)
}
