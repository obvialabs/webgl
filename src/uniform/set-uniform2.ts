import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Configuration options for setting a vec2 uniform
 */
export interface Uniform2Options extends BaseOptions {
  /**
   * Uniform name in the shader
   */
  name: string

  /**
   * Value to assign
   */
  value: [number, number] | boolean[] | Float32Array | Int32Array
}

/**
 * Set a vec2 uniform in a WebGL shader program
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `program` – Linked shader program
 * - `options` – Configuration object
 *    - `name` – Uniform name in the shader
 *    - `value` – Value to assign (tuple or array of length 2)
 *    - `strict` – Throw error if uniform location is not found (default: false)
 *
 * **Usage**
 * ```ts
 * // Float vec2 uniform
 * setUniform2(context, program, {
 *    name: "uOffset",
 *    value: [0.5, 1.2]
 * })
 *
 * // Integer vec2 uniform
 * setUniform2(context, program, {
 *    name: "uCoords",
 *    value: [3, 7]
 * })
 *
 * // Boolean vec2 uniform
 * setUniform2(context, program, {
 *    name: "uFlags",
 *    value: [true, false]
 * })
 *
 * // Float array uniform
 * setUniform2(context, program, {
 *    name: "uWeights",
 *    value: new Float32Array([0.1, 0.2])
 * })
 *
 * // Int array uniform
 * setUniform2(context, program, {
 *    name: "uIndices",
 *    value: new Int32Array([1, 2])
 * })
 *
 * // Strict mode example
 * setUniform2(context, program, {
 *    name: "uMissing",
 *    value: [0, 0],
 *    strict: true
 * })
 * ```
 */
export function setUniform2(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: Uniform2Options
): void {
  const { name, value, strict = false } = options

  // Find the uniform location in the shader program
  const location = context.getUniformLocation(program, name)

  // If uniform is not found, delegate to centralized error handler
  if (location === null) {
    handleError({
      subject: "uniform",
      context: {
        action: "setUniform2",
        result: `Uniform "${name}" not found in shader program`
      },
      strict
    })
    return
  }

  // Boolean array → map true/false to 1/0 and call uniform2i
  if (Array.isArray(value) && value.length === 2 && typeof value[0] === "boolean") {
    const [x, y] = value as boolean[]
    context.uniform2i(location, x ? 1 : 0, y ? 1 : 0)
    return
  }

  // Number tuple → if both integers use uniform2i, otherwise use uniform2f
  if (Array.isArray(value) && value.length === 2 && typeof value[0] === "number") {
    const [x, y] = value as [number, number]
    if (Number.isInteger(x) && Number.isInteger(y)) {
      context.uniform2i(location, x, y)
    } else {
      context.uniform2f(location, x, y)
    }
    return
  }

  // Float32Array → pass directly to uniform2fv
  if (value instanceof Float32Array) {
    context.uniform2fv(location, value)
    return
  }

  // Int32Array → pass directly to uniform2iv
  if (value instanceof Int32Array) {
    context.uniform2iv(location, value)
    return
  }

  // If none of the supported types match, delegate to centralized error handler
  handleError({
    subject : "uniform",
    context : {
      action  : "setUniform2",
      result  : `Unsupported uniform value type for "${name}"`
    },
    strict : strict
  })
}
