import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Configuration options for setting a vec3 uniform
 */
export interface Uniform3Options extends BaseOptions {
  /**
   * Uniform name in the shader
   */
  name: string

  /**
   * Value to assign
   */
  value: [number, number, number] | boolean[] | Float32Array | Int32Array
}

/**
 * Set a vec3 uniform in a WebGL shader program
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `program` – Linked shader program
 * - `options` – Configuration object
 *    - `name` – Uniform name in the shader
 *    - `value` – Value to assign (tuple or array of length 3)
 *    - `strict` – Throw error if uniform location is not found (default: false)
 *
 * **Usage**
 * ```ts
 * // Float vec3 uniform
 * setUniform3(context, program, {
 *    name: "uPosition",
 *    value: [0.5, 1.2, -0.3]
 * })
 *
 * // Integer vec3 uniform
 * setUniform3(context, program, {
 *    name: "uCoords",
 *    value: [3, 7, 2]
 * })
 *
 * // Boolean vec3 uniform
 * setUniform3(context, program, {
 *    name: "uFlags",
 *    value: [true, false, true]
 * })
 *
 * // Float array uniform
 * setUniform3(context, program, {
 *    name: "uWeights",
 *    value: new Float32Array([0.1, 0.2, 0.3])
 * })
 *
 * // Int array uniform
 * setUniform3(context, program, {
 *    name: "uIndices",
 *    value: new Int32Array([1, 2, 3])
 * })
 *
 * // Strict mode example
 * setUniform3(context, program, {
 *    name: "uMissing",
 *    value: [0, 0, 0],
 *    strict: true
 * })
 * ```
 */
export function setUniform3(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: Uniform3Options
): void {
  const { name, value, strict = false } = options

  // Find the uniform location in the shader program
  const location = context.getUniformLocation(program, name)

  // If uniform is not found, delegate to centralized error handler
  if (location === null) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniform3",
        result  : `Uniform "${name}" not found in shader program`
      },
      strict  : strict
    })
    return
  }

  // Boolean array → map true/false to 1/0 and call uniform3i
  if (Array.isArray(value) && value.length === 3 && typeof value[0] === "boolean") {
    const [x, y, z] = value as boolean[]
    context.uniform3i(location, x ? 1 : 0, y ? 1 : 0, z ? 1 : 0)
    return
  }

  // Number tuple → if all integers use uniform3i, otherwise use uniform3f
  if (Array.isArray(value) && value.length === 3 && typeof value[0] === "number") {
    const [x, y, z] = value as [number, number, number]
    if (Number.isInteger(x) && Number.isInteger(y) && Number.isInteger(z)) {
      context.uniform3i(location, x, y, z)
    } else {
      context.uniform3f(location, x, y, z)
    }
    return
  }

  // Float32Array → pass directly to uniform3fv
  if (value instanceof Float32Array) {
    context.uniform3fv(location, value)
    return
  }

  // Int32Array → pass directly to uniform3iv
  if (value instanceof Int32Array) {
    context.uniform3iv(location, value)
    return
  }

  // If none of the supported types match, delegate to centralized error handler
  handleError({
    subject : "uniform",
    context : {
      action  : "setUniform3",
      result  : `Unsupported uniform value type for "${name}"`
    },
    strict : strict
  })
}
