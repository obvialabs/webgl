import type { BaseOptions } from "../option"

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
