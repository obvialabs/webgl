import type { BaseOptions } from "../option"

/**
 * Delete a WebGL buffer and free GPU memory
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `buffer` – Buffer object to delete
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer deletion fails (default: false)
 *
 * **Notes**
 * - Frees GPU memory associated with the buffer
 * - Always call this when a buffer is no longer needed to avoid memory leaks
 * - Compatible with both WebGL1 and WebGL2 contexts
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): ignores if buffer is null
 * deleteBuffer(context, vbo)
 *
 * // Strict mode: throws an error if buffer is null or deletion fails
 * deleteBuffer(context, vbo, { strict: true })
 *
 * // Delete both vertex and index buffers when cleaning up
 * deleteBuffer(context, vbo)
 * deleteBuffer(context, ibo)
 * ```
 */
export function deleteBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  buffer: WebGLBuffer | null,
  options: BaseOptions = {}
): void {
  const { strict = false } = options

  // If buffer is null and strict mode is enabled, throw an error
  if (!buffer) {
    if (strict) {
      throw new Error("Cannot delete WebGL buffer: buffer is null.")
    }
    return
  }

  // Delete the buffer and free GPU memory
  context.deleteBuffer(buffer)
}

