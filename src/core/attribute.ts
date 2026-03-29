/**
 * Configuration options for binding a vertex attribute
 */
export interface BindAttributeOptions {
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
   * Throw error if attribute is not found
   *
   * @default false
   */
  strict?: boolean
}

/**
 * Bind a vertex attribute to the currently bound buffer
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `program` – Linked shader program
 * - `options` – Attribute binding configuration
 *    - `name` – Attribute name in the shader
 *    - `size` – Number of components per attribute (e.g. 2 for vec2, 3 for vec3)
 *    - `type` – Data type of each component (e.g. context.FLOAT)
 *    - `stride` – Byte offset between consecutive attributes (optional, default: 0)
 *    - `offset` – Byte offset of the first component (optional, default: 0)
 *    - `strict` – Throw error if attribute is not found (optional, default: false)
 *
 * **Usage**
 * ```ts
 * // Vertex shader example:
 * // attribute vec3 aPosition;
 *
 * // Bind the "aPosition" attribute to a buffer
 * bindAttribute(context, program, { name: "aPosition", size: 3, type: context.FLOAT })
 *
 * // Enforce strict mode: throw error if missing
 * bindAttribute(context, program, { name: "aPosition", size: 3, type: context.FLOAT, strict: true })
 * ```
 */
export function bindAttribute(
  context: WebGLRenderingContext,
  program: WebGLProgram,
  options: BindAttributeOptions
): void {
  // Destructure options for clarity and consistency
  const {
    name,
    size,
    type,
    stride = 0,
    offset = 0,
    strict = false
  } = options

  // Validate attribute location using shared helper
  const location = validateAttribute(context, program, { name, strict })

  // If attribute is valid, bind it
  if (location !== -1) {
    // Enable the vertex attribute array at the resolved location
    context.enableVertexAttribArray(location)

    // Define how the attribute data is read from the currently bound buffer
    context.vertexAttribPointer(location, size, type, false, stride, offset)
  }
}

/**
 * Configuration options for enabling a vertex attribute
 */
export interface EnableAttributeOptions {
  /**
   * Attribute name in the shader (e.g. "aPosition")
   */
  name: string

  /**
   * Throw error if attribute is not found
   *
   * @default false
   */
  strict?: boolean
}

/**
 * Enable a vertex attribute
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
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
  context: WebGLRenderingContext,
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
export interface DisableAttributeOptions {
  /**
   * Attribute name in the shader
   */
  name: string

  /**
   * Throw error if attribute is not found
   *
   * @default false
   */
  strict?: boolean
}

/**
 * Disable a vertex attribute
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
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
  context: WebGLRenderingContext,
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
export interface ValidateAttributeOptions {
  /**
   * Attribute name in the shader
   */
  name: string

  /**
   * Throw error if attribute is not found
   *
   * @default false
   */
  strict?: boolean
}

/**
 * Validate a vertex attribute by checking its location
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `program` – Linked shader program
 * - `options` – Validation configuration
 *    - `name` – Attribute name in the shader
 *    - `strict` – Throw error if attribute is not found (optional)
 *
 * **Usage**
 * ```ts
 * // Validate attribute existence
 * const location = validateAttribute(context, program, { name: "aPosition" })
 *
 * // Enforce strict mode
 * const location = validateAttribute(context, program, { name: "aPosition", strict: true })
 * ```
 */
export function validateAttribute(
  context: WebGLRenderingContext,
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
