import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Configuration options for setting a vec1 uniform
 */
export interface Uniform1Options extends BaseOptions {
  /**
   * Uniform name in the shader
   */
  name: string

  /**
   * Value to assign
   */
  value: number | boolean | Float32Array | Int32Array
}

/**
 * Set a single-component uniform in a WebGL shader program
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
 * // Float uniform
 * setUniform1(context, program, {
 *    name: "uTime",
 *    value: performance.now() / 1000
 * })
 *
 * // Integer uniform
 * setUniform1(context, program, {
 *    name: "uEnabled",
 *    value: 1
 * })
 *
 * // Boolean uniform
 * setUniform1(context, program, {
 *    name: "uFlag",
 *    value: true
 * })
 *
 * // Float array uniform
 * setUniform1(context, program, {
 *    name: "uWeights",
 *    value: new Float32Array([0.1, 0.2, 0.3])
 * })
 *
 * // Int array uniform
 * setUniform1(context, program, {
 *    name: "uIndices",
 *    value: new Int32Array([1, 2, 3])
 * })
 *
 * // Strict mode: throw error if uniform not found
 * setUniform1(context, program, {
 *    name: "uMissing",
 *    value: 0,
 *    strict: true
 * })
 * ```
 */
export function setUniform1(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: Uniform1Options
): void {
  const { name, value, strict = false } = options

  // Find the uniform location in the shader program
  const location = context.getUniformLocation(program, name)

  // If uniform is not found, delegate to centralized error handler
  if (location === null) {
    handleError({
      subject: "uniform",
      context: {
        action: "setUniform1",
        result: `Uniform "${name}" not found in shader program`
      },
      strict
    })
    return
  }

  // Boolean → map true/false to 1/0 and call uniform1i
  if (typeof value === "boolean") {
    context.uniform1i(location, value ? 1 : 0)
    return
  }

  // Number → if integer use uniform1i, otherwise use uniform1f
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      context.uniform1i(location, value)
    } else {
      context.uniform1f(location, value)
    }
    return
  }

  // Float32Array → pass directly to uniform1fv
  if (value instanceof Float32Array) {
    context.uniform1fv(location, value)
    return
  }

  // Int32Array → pass directly to uniform1iv
  if (value instanceof Int32Array) {
    context.uniform1iv(location, value)
    return
  }

  // If none of the supported types match, delegate to centralized error handler
  handleError({
    subject : "uniform",
    context : {
      action  : "setUniform1",
      result  : `Unsupported uniform value type for "${name}"`
    },
    strict  : strict
  })
}
