import type { BaseOptions } from "../option"
import { createBuffer } from "./create-buffer"

/**
 * Create an index buffer for a cube
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Works together with `createCubeBuffer` (vertex positions)
 * - Produces 36 indices (6 faces × 2 triangles × 3 vertices)
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
export function createCubeIndexBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 36 indices for the cube (6 faces × 2 triangles × 3 vertices)
  const indices = new Uint16Array([
    0,1,2, 2,3,0, // back
    4,5,6, 6,7,4, // front
    0,4,7, 7,3,0, // left
    1,5,6, 6,2,1, // right
    3,2,6, 6,7,3, // top
    0,1,5, 5,4,0  // bottom
  ])

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
