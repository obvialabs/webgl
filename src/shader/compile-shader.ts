import type { BaseOptions } from "../option"
import { createShader } from "./create-shader"
import { validateShader } from "./validate-shader"

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
