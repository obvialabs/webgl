import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Create a new WebGL program object
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `options` – Optional configuration
 *    - `strict` – Throw error if creation fails (default: false)
 *
 * **Usage**
 * ```ts
 * // Silent mode: returns null if creation fails
 * const program = createProgram(context)
 *
 * // Strict mode: throws an error if creation fails
 * const programStrict = createProgram(context, { strict: true })
 *
 * // Typical workflow
 * const vertexShader = compileShader(context, { source: vsSource, type: context.VERTEX_SHADER })
 * const fragmentShader = compileShader(context, { source: fsSource, type: context.FRAGMENT_SHADER })
 *
 * const program = createProgram(context, { strict: true })
 * if (program && vertexShader && fragmentShader) {
 *   linkProgram(context, program, { vertexShader, fragmentShader, strict: true })
 *   useProgram(context, program, { strict: true })
 * }
 * ```
 */
export function createProgram(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  options: BaseOptions = {}
): WebGLProgram | null {
  const { strict = false } = options

  const program = context.createProgram()

  if (!program) {
    handleError({
      subject : "program",
      context : { action: "createProgram", result: "Failed to create program object" },
      strict  : strict
    })
    return null
  }

  return program
}
