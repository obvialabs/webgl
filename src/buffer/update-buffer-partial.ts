import type { BufferOptions } from "./create-buffer"

/**
 * Partially update an existing WebGL buffer with new data
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `buffer` – Existing buffer to update
 * - `options` – Buffer configuration
 *    - `target` – Buffer target (e.g. `context.ARRAY_BUFFER`)
 *    - `data` – Typed array containing new data
 *    - `offset` – Byte offset in the buffer where data should be written (default: 0)
 *    - `strict` – Throw error if buffer binding fails (default: false)
 *
 * **Notes**
 * - Unlike `updateBuffer`, this does **not** reallocate the buffer
 * - Existing data remains intact; only the specified region is overwritten
 * - More efficient for dynamic updates (animations, particle systems)
 * - Compatible with both WebGL1 and WebGL2 contexts
 *
 * **Usage**
 * ```ts
 * // Replace only the first vertex (two floats) in the buffer
 * const newVertex = new Float32Array([0.5, 0.5])
 * updateBufferPartial(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: newVertex,
 *   offset: 0
 * })
 *
 * // Replace the 3rd vertex (offset = 2 * 4 bytes = 8)
 * const anotherVertex = new Float32Array([1.0, 1.0])
 * updateBufferPartial(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: anotherVertex,
 *   offset: 8,
 *   strict: true
 * })
 * ```
 */
export function updateBufferPartial(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  buffer: WebGLBuffer,
  options: BufferOptions & { offset?: number }
): void {
  const {
    target,
    data,
    offset = 0,
    strict = false
  } = options

  // Bind the buffer before updating
  context.bindBuffer(target, buffer)

  // Determine correct binding parameter based on target
  const bindingParam =
    target === context.ARRAY_BUFFER
      ? context.ARRAY_BUFFER_BINDING
      : context.ELEMENT_ARRAY_BUFFER_BINDING

  // If strict mode is enabled, verify binding
  if (strict && context.getParameter(bindingParam) !== buffer) {
    throw new Error(`Failed to bind WebGL buffer (target=${target}).`)
  }

  // Partially update the buffer contents starting at the given offset
  context.bufferSubData(target, offset, data)
}
