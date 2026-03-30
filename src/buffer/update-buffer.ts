import type { BufferOptions } from "./create-buffer"

/**
 * Update an existing WebGL buffer with new data
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `buffer` – Existing buffer to update
 * - `options` – Buffer configuration
 *    - `target` – Buffer target (e.g. `context.ARRAY_BUFFER`)
 *    - `data` – New typed array data to upload
 *    - `usage` – Buffer usage hint (default: `context.STATIC_DRAW`)
 *    - `strict` – Throw error if buffer binding fails (default: false)
 *
 * **Notes**
 * - Uses `context.bufferData`, which **replaces the entire buffer contents**
 * - The buffer may be reallocated on the GPU, so it’s less efficient for small changes
 * - Use this when you want to completely reset or resize the buffer
 * - Compatible with both WebGL1 and WebGL2 contexts
 *
 * **Usage**
 * ```ts
 * // Replace the entire buffer with new vertices
 * const newVertices = new Float32Array([0,0, 1,0, 1,1])
 * updateBuffer(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: newVertices
 * })
 *
 * // Resize the buffer with more vertices (old data discarded)
 * const largerVertices = new Float32Array([0,0, 1,0, 1,1, 0,1])
 * updateBuffer(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: largerVertices,
 *   usage: context.DYNAMIC_DRAW
 * })
 *
 * // Strict mode: throws an error if buffer binding fails
 * updateBuffer(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: newVertices,
 *   strict: true
 * })
 * ```
 */
export function updateBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  buffer: WebGLBuffer,
  options: BufferOptions
): void {
  const {
    target,
    data,
    usage = context.STATIC_DRAW,
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

  // Replace the entire buffer contents with new data
  context.bufferData(target, data, usage)
}
