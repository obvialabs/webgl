import type { BaseOptions } from "./option"

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

/**
 * Configuration options for enabling a vertex attribute
 */
export interface EnableAttributeOptions extends BaseOptions {
  /**
   * Attribute name in the shader (e.g. "aPosition")
   */
  name: string
}

/**
 * Enable a vertex attribute
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Linked shader program
 * - `options` – Attribute enabling configuration
 *    - `name` – Attribute name in the shader
 *    - `strict` – Throw error if attribute is not found (optional, default: false)
 *
 * **Usage**
 * ```ts
 * // Enable the "aPosition" attribute
 * enableAttribute(context, program, { name: "aPosition" })
 *
 * // Enforce strict mode: throw error if missing
 * enableAttribute(context, program, { name: "aPosition", strict: true })
 * ```
 */
export function enableAttribute(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: EnableAttributeOptions
): void {
  // Validate attribute location using shared helper
  const location = validateAttribute(context, program, options)

  // If attribute is valid, enable it
  if (location !== -1) {
    context.enableVertexAttribArray(location)
  }
}

/**
 * Configuration options for disabling a vertex attribute
 */
export interface DisableAttributeOptions extends BaseOptions {
  /**
   * Attribute name in the shader (e.g. "aTexCoord")
   */
  name: string
}

/**
 * Disable a vertex attribute
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Linked shader program
 * - `options` – Attribute disabling configuration
 *    - `name` – Attribute name in the shader
 *    - `strict` – Throw error if attribute is not found (optional, default: false)
 *
 * **Usage**
 * ```ts
 * // Disable the "aTexCoord" attribute when it's not needed
 * disableAttribute(context, program, { name: "aTexCoord" })
 *
 * // Enforce strict mode: throw error if missing
 * disableAttribute(context, program, { name: "aTexCoord", strict: true })
 * ```
 */
export function disableAttribute(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: DisableAttributeOptions
): void {
  // Validate attribute location using shared helper
  const location = validateAttribute(context, program, options)

  // If attribute is valid, disable it
  if (location !== -1) {
    context.disableVertexAttribArray(location)
  }
}

/**
 * Configuration options for validating a vertex attribute
 */
export interface ValidateAttributeOptions extends BaseOptions {
  /**
   * Attribute name in the shader (e.g. "aPosition")
   */
  name: string
}

/**
 * Validate a vertex attribute by checking its location
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Linked shader program
 * - `options` – Validation configuration
 *    - `name` – Attribute name in the shader
 *    - `strict` – Throw error if attribute is not found (optional, default: false)
 *
 * **Usage**
 * ```ts
 * // Validate attribute existence
 * const location = validateAttribute(context, program, { name: "aPosition" })
 *
 * // Enforce strict mode
 * const location = validateAttribute(context, program, {
 *   name: "aPosition",
 *   strict: true
 * })
 * ```
 */
export function validateAttribute(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: ValidateAttributeOptions
): number {
  // Destructure options for clarity and consistency
  const { name, strict = false } = options

  // Look up the attribute location in the linked shader program
  const location = context.getAttribLocation(program, name)

  // If attribute is not found
  if (location === -1) {
    // In strict mode, throw an error to alert the developer
    if (strict) {
      throw new Error(`Attribute "${name}" not found in shader program`)
    }
  }

  return location
}
