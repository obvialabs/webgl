import { BaseOptions } from "./core/option"

/**
 * Configuration options for creating a WebGL shader object
 */
export interface CreateShaderOptions extends BaseOptions {
  /**
   * Shader type to create (`VERTEX_SHADER` or `FRAGMENT_SHADER`)
   */
  type: number
}

/**
 * Create a WebGL shader object with the given rendering context
 *
 * **Parameters**
 * - `context` – WebGL rendering context to create the shader in
 * - `options` – Shader configuration
 *    - `type` – Shader type (`VERTEX_SHADER` or `FRAGMENT_SHADER`)
 *    - `strict` – Throw error if shader creation fails (default: false)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if shader cannot be created
 * const vertexShader = createShader(context, { type: context.VERTEX_SHADER })
 *
 * // Strict mode: throws an error if shader cannot be created
 * const fragmentShader = createShader(context, {
 *   type: context.FRAGMENT_SHADER,
 *   strict: true
 * })
 * ```
 */
export function createShader(
  context: WebGLRenderingContext,
  options: CreateShaderOptions
): WebGLShader | null {
  const { type, strict = false } = options

  const shader = context.createShader(type)

  if (!shader) {
    if (strict) {
      throw new Error("Failed to create shader")
    }
    return null
  }

  return shader
}

/**
 * Configuration options for compiling a WebGL shader
 */
export interface CompileShaderOptions extends BaseOptions {
  /**
   * GLSL source code string to compile
   */
  source: string

  /**
   * Shader type (`VERTEX_SHADER` or `FRAGMENT_SHADER`)
   */
  type: number
}

/**
 * Compile a WebGL shader with the given source code
 *
 * **Parameters**
 * - `context` – WebGL rendering context to compile the shader in
 * - `options` – Shader configuration
 *    - `source` – GLSL source code
 *    - `type` – Shader type (`VERTEX_SHADER` or `FRAGMENT_SHADER`)
 *    - `strict` – Throw error if shader creation or compilation fails (default: false)
 *
 * **Usage**
 * ```ts
 * // Create and compile a vertex shader
 * const vertexShader = compileShader(context, {
 *   source: vsSource,
 *   type: context.VERTEX_SHADER
 * })
 *
 * // Strict mode: throws an error if compilation fails
 * const fragmentShader = compileShader(context, {
 *   source: fsSource,
 *   type: context.FRAGMENT_SHADER,
 *   strict: true
 * })
 * ```
 */
export function compileShader(
  context: WebGLRenderingContext,
  options: CompileShaderOptions
): WebGLShader | null {
  const { source, type, strict = false } = options

  // Create shader object using our utility
  const shader = createShader(context, { type, strict })

  if (!shader) {
    if (strict) {
      throw new Error(
        "Shader compilation aborted: failed to create shader object. " +
        "This may indicate insufficient GPU resources, unsupported shader type, " +
        "or that the WebGL context is invalid."
      )
    }
    return null
  }

  // Attach GLSL source code
  context.shaderSource(shader, source)

  // Compile the shader source
  context.compileShader(shader)

  if (strict) {
    // In strict mode, validate compilation result and throw if failed
    validateShader(context, shader, { strict: true })
  } else {
    // In silent mode, just check status without throwing
    const status = context.getShaderParameter(shader, context.COMPILE_STATUS)
    if (!status) {
      return null
    }
  }

  return shader
}

/**
 * Delete a WebGL shader object and free GPU resources
 *
 * **Parameters**
 * - `context` – WebGL rendering context
 * - `shader` – Shader object to delete
 * - `options` – Optional configuration
 *    - `strict` – Throw error if shader is null or deletion fails (default: false)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): ignores if shader is null
 * deleteShader(context, vertexShader)
 *
 * // Strict mode: throws an error if shader is null
 * deleteShader(context, fragmentShader, { strict: true })
 * ```
 */
export function deleteShader(
  context: WebGLRenderingContext,
  shader: WebGLShader | null,
  options: BaseOptions = {}
): void {
  const { strict = false } = options

  // If shader is null and strict mode is enabled, throw an error
  if (!shader) {
    if (strict) {
      throw new Error(
        "Shader deletion failed: provided shader reference is null. " +
        "This usually means the shader was never created successfully, " +
        "has already been deleted, or the reference was lost. " +
        "Ensure that compileShader returned a valid shader before attempting deletion."
      )
    }
    return
  }

  // Delete the shader and free GPU resources
  context.deleteShader(shader)
}

/**
 * Validate whether a WebGL shader compiled successfully
 *
 * **Parameters**
 * - `context` – WebGL rendering context
 * - `shader` – Shader object to validate
 * - `options` – Optional configuration
 *    - `strict` – Throw error if validation fails (default: false)
 *
 * **Usage**
 * ```ts
 * // Compile a shader
 * const vertexShader = compileShader(context, {
 *   source: vsSource,
 *   type: context.VERTEX_SHADER
 * })
 *
 * // Silent mode (default): returns false if validation fails
 * if (!validateShader(context, vertexShader)) {
 *   console.error("Vertex shader failed to compile")
 * }
 *
 * // Strict mode: throws an error if validation fails
 * validateShader(context, vertexShader, { strict: true })
 * ```
 */
export function validateShader(
  context: WebGLRenderingContext,
  shader: WebGLShader | null,
  options: BaseOptions = {}
): boolean {
  const { strict = false } = options

  // If shader is null, either throw (strict) or return false
  if (!shader) {
    if (strict) {
      throw new Error(
        "Shader validation failed: provided shader reference is null. " +
        "This usually indicates that shader creation did not succeed or " +
        "the shader object was already deleted."
      )
    }
    return false
  }

  // Query shader compilation status from WebGL
  const status = context.getShaderParameter(shader, context.COMPILE_STATUS)

  // If compilation failed, either throw (strict) or return false
  if (!status && strict) {
    const infoLog = context.getShaderInfoLog(shader) || "No compilation log available"
    throw new Error(
      "Shader validation failed: compilation did not succeed. " +
      "Possible causes include syntax errors in GLSL source, " +
      "unsupported features on the current GPU/driver, or exceeding resource limits. " +
      "WebGL info log : " + infoLog
    )
  }

  // Return true if compiled successfully, false otherwise
  return !!status
}
