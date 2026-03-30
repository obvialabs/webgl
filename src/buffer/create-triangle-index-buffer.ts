import type { BaseOptions } from "../option"
import { createBuffer } from "./create-buffer"

/**
 * Create an index buffer for a full‑screen triangle
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Produces 3 indices (one triangle)
 * - Works together with `createTriangleBuffer` (vertex positions)
 * - Compatible with both WebGL1 and WebGL2 contexts
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vbo = createTriangleBuffer(context, positionLocation)
 * const iboDefault = createTriangleIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 3, context.UNSIGNED_SHORT, 0)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const iboStrict = createTriangleIndexBuffer(context, { strict: true })
 * context.drawElements(context.TRIANGLES, 3, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createTriangleIndexBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 3 indices for a single triangle
  const indices = new Uint16Array([0, 1, 2])

  // Create the index buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ELEMENT_ARRAY_BUFFER,
    data: indices,
    strict
  })

  // Return null if buffer creation failed in silent mode
  if (!buffer) return null

  return buffer
}
