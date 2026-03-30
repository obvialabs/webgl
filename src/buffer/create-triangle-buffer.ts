import type { BaseOptions } from "../option"
import { createBuffer } from "./create-buffer"

/**
 * Create a buffer for a full‑screen triangle
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `position` – Attribute location index for vertex positions
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Produces 3 vertices that cover the entire screen
 * - No index buffer is required; this is drawn directly with `context.drawArrays`
 * - Compatible with both WebGL1 and WebGL2 contexts
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vboDefault = createTriangleBuffer(context, positionLocation)
 * context.drawArrays(context.TRIANGLES, 0, 3)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const vboStrict = createTriangleBuffer(context, positionLocation, { strict: true })
 * context.drawArrays(context.TRIANGLES, 0, 3)
 * ```
 */
export function createTriangleBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  position: number,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 3 vertices that cover the entire screen
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])

  // Create the buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ARRAY_BUFFER,
    data: vertices,
    strict
  })

  if (!buffer) return null

  // Enable the vertex attribute and define its layout (2 floats per vertex)
  context.enableVertexAttribArray(position)
  context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0)

  return buffer
}
