import type { BaseOptions } from "../option"
import { updateBuffer } from "./update-buffer"

/**
 * Configuration options for creating a WebGL buffer
 */
export interface BufferOptions extends BaseOptions {
  /**
   * Buffer target (`ARRAY_BUFFER` for vertex data, `ELEMENT_ARRAY_BUFFER` for indices)
   */
  target: number

  /**
   * Typed array containing vertex or index data
   */
  data: BufferSource

  /**
   * Buffer usage hint
   *
   * @default STATIC_DRAW
   */
  usage?: number
}

/**
 * Create a generic WebGL buffer and upload data
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `options` – Buffer configuration
 *    - `target` – Buffer target (`ARRAY_BUFFER` or `ELEMENT_ARRAY_BUFFER`)
 *    - `data` – Vertex or index data (typed array)
 *    - `usage` – Buffer usage hint (default: `STATIC_DRAW`)
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vertices = new Float32Array([0,0, 1,0, 0,1])
 * const vboDefault = createBuffer(context, {
 *   target: context.ARRAY_BUFFER,
 *   data: vertices
 * })
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const indices = new Uint16Array([0,1,2, 2,1,3])
 * const iboStrict = createBuffer(context, {
 *   target: context.ELEMENT_ARRAY_BUFFER,
 *   data: indices,
 *   strict: true
 * })
 *
 * // Custom usage hint (dynamic draw)
 * const dynamicVertices = new Float32Array([0,0, 1,0, 0,1])
 * const vboDynamic = createBuffer(context, {
 *   target: context.ARRAY_BUFFER,
 *   data: dynamicVertices,
 *   usage: context.DYNAMIC_DRAW
 * })
 *
 * // Drawing with buffers
 * context.drawArrays(context.TRIANGLES, 0, 3) // using vboDefault
 * context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0) // using iboStrict
 * ```
 */
export function createBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  options: BufferOptions
): WebGLBuffer | null {
  // Extract configuration parameters from options
  const {
    target,
    data,
    usage = context.STATIC_DRAW,
    strict = false
  } = options

  // Attempt to create a new GPU buffer
  const buffer = context.createBuffer()
  if (!buffer) {
    // In strict mode, throw an error if buffer creation fails
    if (strict) {
      throw new Error(
        `Failed to create WebGL buffer (target=${target}).
         This usually indicates that the WebGL context is lost or resources are exhausted.`
      )
    }
    // In silent mode, return null instead of throwing
    return null
  }

  // Delegate the initial data upload to updateBuffer to avoid code duplication
  updateBuffer(context, buffer, { target, data, usage, strict })

  // Return the created buffer object
  return buffer
}
