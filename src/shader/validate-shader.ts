import type { BaseOptions } from "../option"

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
  context: WebGLRenderingContext | WebGL2RenderingContext,
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
