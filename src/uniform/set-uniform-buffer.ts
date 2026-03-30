import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Configuration options for binding a uniform buffer
 */
export interface UniformBufferOptions extends BaseOptions {
  /**
   * WebGLBuffer to bind
   */
  buffer: WebGLBuffer

  /**
   * Binding point index
   */
  index: number
}

/**
 * Bind a buffer to a uniform binding point in a WebGL2 shader program
 *
 * **Parameters**
 * - `context` – Target WebGL2 rendering context (not supported in WebGL1)
 * - `options` – Configuration object
 *    - `buffer` – WebGLBuffer to bind
 *    - `index` – Binding point index
 *    - `strict` – Throw error if buffer binding fails (default: false)
 *
 * **Usage**
 * ```ts
 * // Create buffer and bind to binding point 0
 * const buffer = createBuffer(context, {
 *   target: context.UNIFORM_BUFFER,
 *   data: new Float32Array([0.1, 0.2, 0.3, 0.4])
 * })
 *
 * setUniformBuffer(context, {
 *   buffer,
 *   index: 0
 * })
 *
 * // With strict mode enabled
 * setUniformBuffer(context, {
 *   buffer,
 *   index: 0,
 *   strict: true
 * })
 * ```
 */
export function setUniformBuffer(
  context: WebGL2RenderingContext,
  options: UniformBufferOptions
): void {
  const { buffer, index, strict = false } = options

  // If buffer is missing, delegate to centralized error handler
  if (!buffer) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniformBuffer",
        result  : "Uniform buffer is null or undefined"
      },
      strict  : strict
    })
    return
  }

  // Bind the buffer to the given binding point
  context.bindBufferBase(context.UNIFORM_BUFFER, index, buffer)
}
