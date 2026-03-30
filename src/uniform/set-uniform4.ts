import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Configuration options for setting a vec4 uniform
 */
export interface Uniform4Options extends BaseOptions {
  /**
   * Uniform name in the shader
   */
  name: string

  /**
   * Value to assign
   */
  value: [number, number, number, number] | boolean[] | Float32Array | Int32Array
}

/**
 * Set a vec4 uniform in a WebGL shader program
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `program` – Linked shader program
 * - `options` – Configuration object
 *    - `name` – Uniform name in the shader
 *    - `value` – Value to assign
 *    - `strict` – Throw error if uniform location is not found (default: false)
 *
 * **Usage**
 * ```ts
 * // Float vec4 uniform
 * setUniform4(context, program, {
 *    name: "uColor",
 *    value: [0.5, 0.2, 0.8, 1.0]
 * })
 *
 * // Integer vec4 uniform
 * setUniform4(context, program, {
 *    name: "uCoords",
 *    value: [3, 7, 2, 5]
 * })
 *
 * // Boolean vec4 uniform
 * setUniform4(context, program, {
 *    name: "uFlags",
 *    value: [true, false, true, false]
 * })
 *
 * // Float array uniform
 * setUniform4(context, program, {
 *    name: "uWeights",
 *    value: new Float32Array([0.1, 0.2, 0.3, 0.4])
 * })
 *
 * // Int array uniform
 * setUniform4(context, program, {
 *    name: "uIndices",
 *    value: new Int32Array([1, 2, 3, 4])
 * })
 *
 * // Strict mode example
 * setUniform4(context, program, {
 *   name: "uMissing",
 *   value: [0, 0, 0, 0],
 *   strict: true
 * })
 * ```
 */
export function setUniform4(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: Uniform4Options
): void {
  const { name, value, strict = false } = options

  // Find the uniform location in the shader program
  const location = context.getUniformLocation(program, name)

  // If uniform is not found, delegate to centralized error handler
  if (location === null) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniform4",
        result  : `Uniform "${name}" not found in shader program`
      },
      strict  : strict
    })
    return
  }

  // Boolean array → map true/false to 1/0 and call uniform4i
  if (Array.isArray(value) && value.length === 4 && typeof value[0] === "boolean") {
    const [x, y, z, w] = value as boolean[]
    context.uniform4i(location, x ? 1 : 0, y ? 1 : 0, z ? 1 : 0, w ? 1 : 0)
    return
  }

  // Number tuple → if all integers use uniform4i, otherwise use uniform4f
  if (Array.isArray(value) && value.length === 4 && typeof value[0] === "number") {
    const [x, y, z, w] = value as [number, number, number, number]
    if (Number.isInteger(x) && Number.isInteger(y) && Number.isInteger(z) && Number.isInteger(w)) {
      context.uniform4i(location, x, y, z, w)
    } else {
      context.uniform4f(location, x, y, z, w)
    }
    return
  }

  // Float32Array → pass directly to uniform4fv
  if (value instanceof Float32Array) {
    context.uniform4fv(location, value)
    return
  }

  // Int32Array → pass directly to uniform4iv
  if (value instanceof Int32Array) {
    context.uniform4iv(location, value)
    return
  }

  // If none of the supported types match, delegate to centralized error handler
  handleError({
    subject : "uniform",
    context : {
      action  : "setUniform4",
      result  : `Unsupported uniform value type for "${name}"`
    },
    strict : strict
  })
}
