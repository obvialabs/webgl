import { BaseOptions } from "../option"
import { handleError } from "../error"

/**
 * Configuration options for setting a matrix uniform (mat2, mat3, or mat4)
 */
export interface UniformMatrixOptions extends BaseOptions {
  /**
   * Uniform name in the shader
   */
  name: string

  /**
   * Matrix values as a Float32Array
   */
  matrix: Float32Array

  /**
   * Whether to transpose the matrix before uploading
   *
   * @default false
   */
  transpose?: boolean
}

/**
 * Set a matrix uniform (mat2, mat3, or mat4) in a WebGL shader program
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `program` – Linked shader program
 * - `options` – Configuration object
 *    - `name` – Uniform name in the shader
 *    - `matrix` – Matrix as a Float32Array
 *    - `transpose` – Whether to transpose the matrix
 *    - `strict` – Throw error if uniform location is not found or matrix length is invalid
 *
 * **Usage**
 * ```ts
 * // 2×2 identity matrix
 * const mat2 = new Float32Array([1, 0, 0, 1])
 * setUniformMatrix(context, program, {
 *   name: "uMat2",
 *   matrix: mat2
 * })
 *
 * // 3×3 identity matrix with strict mode
 * const mat3 = new Float32Array([1,0,0, 0,1,0, 0,0,1])
 * setUniformMatrix(context, program, {
 *   name: "uMat3",
 *   matrix: mat3,
 *   strict: true
 * })
 *
 * // 4×4 identity matrix with transpose
 * const mat4 = new Float32Array([
 *   1,0,0,0,
 *   0,1,0,0,
 *   0,0,1,0,
 *   0,0,0,1
 * ])
 * setUniformMatrix(context, program, {
 *   name: "uMat4",
 *   matrix: mat4,
 *   transpose: true
 * })
 * ```
 */
export function setUniformMatrix(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: UniformMatrixOptions
): void {
  const { name, matrix, transpose = false, strict = false } = options

  // Find the uniform location in the shader program
  const location = context.getUniformLocation(program, name)

  if (location === null) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniformMatrix",
        result  : `Uniform "${name}" not found in shader program`
      },
      strict  : strict
    })
    return
  }

  // Deduce matrix size from array length
  switch (matrix.length) {
    case 4: // 2x2
      context.uniformMatrix2fv(location, transpose, matrix)
      break
    case 9: // 3x3
      context.uniformMatrix3fv(location, transpose, matrix)
      break
    case 16: // 4x4
      context.uniformMatrix4fv(location, transpose, matrix)
      break
    default:
      handleError({
        subject : "uniform",
        context : {
          action  : "setUniformMatrix",
          result  : `Unsupported matrix length "${matrix.length}" for uniform "${name}"`
        },
        strict  : strict
      })
  }
}
