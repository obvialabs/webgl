import type { BaseOptions } from "../option"

import { validateAttribute } from "./validate-attribute"

/**
 * Configuration options for binding a vertex attribute
 */
export interface BindAttributeOptions extends BaseOptions {
  /**
   * Attribute name in the shader (e.g. "aPosition")
   */
  name: string

  /**
   * Number of components per attribute (e.g. 2 for vec2, 3 for vec3)
   */
  size: number

  /**
   * Data type of each component (e.g. context.FLOAT)
   */
  type: number

  /**
   * Byte offset between consecutive attributes
   *
   * @default 0
   */
  stride?: number

  /**
   * Byte offset of the first component
   *
   * @default 0
   */
  offset?: number

  /**
   * Normalize integer data values to [0,1] or [-1,1]
   *
   * @default false
   */
  normalize?: boolean

  /**
   * Divisor for instanced rendering (WebGL2 only)
   *
   * @default 0
   */
  divisor?: number

  /**
   * Use integer attribute binding (WebGL2 only)
   *
   * @default false
   */
  integer?: boolean
}

/**
 * Bind a vertex attribute to the currently bound buffer
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Linked shader program
 * - `options` – Attribute binding configuration
 *    - `name` – Attribute name in the shader (e.g. "aPosition")
 *    - `size` – Number of components per attribute (e.g. 2 for vec2, 3 for vec3)
 *    - `type` – Data type of each component (e.g. context.FLOAT, context.UNSIGNED_BYTE)
 *    - `stride` – Byte offset between consecutive attributes (optional, default: 0)
 *    - `offset` – Byte offset of the first component (optional, default: 0)
 *    - `strict` – Throw error if attribute is not found (optional, default: false)
 *    - `normalize` – Normalize integer data values to [0,1] or [-1,1] (optional, default: false, WebGL1 & WebGL2)
 *    - `divisor` – Divisor for instanced rendering (optional, default: 0, WebGL2 only)
 *    - `integer` – Use integer attribute binding (`vertexAttribIPointer`) instead of float (optional, default: false, WebGL2 only)
 *
 * **Usage**
 * ```ts
 * // Vertex shader example:
 * // attribute vec3 aPosition;
 *
 * // Bind the "aPosition" attribute to a buffer (float attribute)
 * bindAttribute(context, program, { name: "aPosition", size: 3, type: context.FLOAT })
 *
 * // Enforce strict mode: throw error if missing
 * bindAttribute(context, program, {
 *   name: "aPosition",
 *   size: 3,
 *   type: context.FLOAT,
 *   strict: true
 * })
 *
 * // Normalize unsigned byte colors to [0,1]
 * bindAttribute(context, program, {
 *   name: "aColor",
 *   size: 4,
 *   type: context.UNSIGNED_BYTE,
 *   normalize: true
 * })
 *
 * // Integer attribute binding (WebGL2 only)
 * // attribute ivec4 aBoneIDs;
 * bindAttribute(context, program, {
 *   name: "aBoneIDs",
 *   size: 4,
 *   type: context.UNSIGNED_BYTE,
 *   integer: true
 * })
 *
 * // Instanced rendering (WebGL2 only)
 * bindAttribute(context, program, {
 *   name: "aOffset",
 *   size: 2,
 *   type: context.FLOAT,
 *   divisor: 1
 * })
 * ```
 */
export function bindAttribute(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: BindAttributeOptions
): void {
  const {
    name,
    size,
    type,
    stride = 0,
    offset = 0,
    divisor = 0,
    normalize = false,
    strict = false,
    integer = false
  } = options

  const location = validateAttribute(context, program, { name, strict })

  if (location !== -1) {
    context.enableVertexAttribArray(location)

    if (integer && "vertexAttribIPointer" in context) {
      // WebGL2 integer attribute binding
      context.vertexAttribIPointer(location, size, type, stride, offset)
    } else {
      // Default float attribute binding
      context.vertexAttribPointer(location, size, type, normalize, stride, offset)
    }

    // WebGL2 instanced rendering support
    if ("vertexAttribDivisor" in context && divisor > 0) {
      context.vertexAttribDivisor(location, divisor)
    }
  }
}
