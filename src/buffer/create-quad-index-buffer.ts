import type { BaseOptions } from "../option"
import { createBuffer } from "./create-buffer"

/**
 * Create an index buffer for a full‑screen quad
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Works together with `createQuadBuffer` (vertex positions)
 * - Produces 6 indices (2 triangles × 3 vertices)
 * - Compatible with both WebGL1 and WebGL2 contexts
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vbo = createQuadBuffer(context, positionLocation)
 * const iboDefault = createQuadIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const iboStrict = createQuadIndexBuffer(context, { strict: true })
 * context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createQuadIndexBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 6 indices for two triangles forming a quad
  const indices = new Uint16Array([0, 1, 2, 2, 1, 3])

  // Create the index buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ELEMENT_ARRAY_BUFFER,
    data: indices,
    strict
  })

  if (!buffer) return null

  return buffer
}
