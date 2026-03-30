import type { BaseOptions } from "../option"
import { createBuffer } from "./create-buffer"

/**
 * Create a buffer for a full‑screen quad
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `position` – Attribute location index for vertex positions
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Produces 4 vertices covering the entire screen
 * - Can be drawn directly with `context.drawArrays` (triangle strip) or with `context.drawElements` using an index buffer
 * - Works in both WebGL1 and WebGL2 contexts
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vboDefault = createQuadBuffer(context, positionLocation)
 * context.drawArrays(context.TRIANGLE_STRIP, 0, 4)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const vboStrict = createQuadBuffer(context, positionLocation, { strict: true })
 * context.drawArrays(context.TRIANGLE_STRIP, 0, 4)
 *
 * // With index buffer
 * const vbo = createQuadBuffer(context, positionLocation)
 * const ibo = createQuadIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createQuadBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  position: number,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define vertex data (full-screen quad)
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

  // Use create buffer to allocate and upload data
  const buffer = createBuffer(context, {
    target: context.ARRAY_BUFFER,
    data: vertices,
    strict
  })

  if (!buffer) return null

  // Configure vertex attribute pointer
  context.enableVertexAttribArray(position)
  context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0)

  return buffer
}
