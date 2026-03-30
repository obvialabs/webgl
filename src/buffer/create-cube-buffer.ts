import type { BaseOptions } from "../option"
import { createBuffer } from "./create-buffer"

/**
 * Create a buffer for a unit cube
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `position` – Attribute location index for vertex positions
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Works together with `createCubeIndexBuffer` (indices)
 * - Produces 8 unique vertices and 36 indices (6 faces × 2 triangles × 3 vertices)
 * - Compatible with both WebGL1 and WebGL2 contexts
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vboDefault = createCubeBuffer(context, positionLocation)
 * const iboDefault = createCubeIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const vboStrict = createCubeBuffer(context, positionLocation, { strict: true })
 * const iboStrict = createCubeIndexBuffer(context, { strict: true })
 * context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createCubeBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  position: number,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 8 unique vertices for a unit cube
  const vertices = new Float32Array([
    -1,-1,-1,  1,-1,-1,  1, 1,-1, -1, 1,-1, // back face
    -1,-1, 1,  1,-1, 1,  1, 1, 1, -1, 1, 1  // front face
  ])

  // Create the buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ARRAY_BUFFER,
    data: vertices,
    strict
  })

  // Return null if buffer creation failed in silent mode
  if (!buffer) return null

  // Enable the vertex attribute and define its layout (3 floats per vertex)
  context.enableVertexAttribArray(position)
  context.vertexAttribPointer(position, 3, context.FLOAT, false, 0, 0)

  return buffer
}
