import { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Configuration options for setting a sampler uniform
 */
export interface UniformSamplerOptions extends BaseOptions {
  /**
   * Uniform name in the shader (e.g. "uTexture")
   */
  name: string

  /**
   * Texture unit index (e.g. 0 for TEXTURE0)
   */
  unit: number
}

/**
 * Set a sampler uniform in a WebGL shader program
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `program` – Linked shader program
 * - `options` – Configuration object
 *    - `name` – Sampler uniform name in the shader
 *    - `unit` – Texture unit index (must be >= 0)
 *    - `strict` – Throw error if uniform location is not found (default: false)
 *
 * **Usage**
 * ```ts
 * // Bind texture to unit 0 and assign sampler
 * context.activeTexture(context.TEXTURE0)
 * context.bindTexture(context.TEXTURE_2D, texture)
 *
 * setUniformSampler(context, program, {
 *   name: "uTexture",
 *   unit: 0
 * })
 *
 * // With strict mode enabled
 * setUniformSampler(context, program, {
 *   name: "uTexture",
 *   unit: 0,
 *   strict: true
 * })
 * ```
 */
export function setUniformSampler(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  options: UniformSamplerOptions
): void {
  const { name, unit, strict = false } = options

  // Validate texture unit index
  if (unit < 0) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniformSampler",
        result  : `Invalid texture unit index "${unit}" for sampler "${name}"`
      },
      strict  : strict
    })
    return
  }

  // Find the uniform location in the shader program
  const location = context.getUniformLocation(program, name)

  // If uniform is not found, delegate to centralized error handler
  if (location === null) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniformSampler",
        result  : `Sampler uniform "${name}" not found in shader program`
      },
      strict  : strict
    })
    return
  }

  // Bind the texture unit to the uniform sampler
  context.uniform1i(location, unit)
}