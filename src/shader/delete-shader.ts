import type { BaseOptions } from "../option"

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
  context: WebGLRenderingContext | WebGL2RenderingContext,
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
