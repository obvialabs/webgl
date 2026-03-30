import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"
import { validateProgram } from "./validate-program"

export interface LinkProgramOptions extends BaseOptions {
  vertexShader: WebGLShader | null
  fragmentShader: WebGLShader | null
}

/**
 * Attach shaders, link, and validate a WebGL program
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Program object created with `createProgram`
 * - `options` – Program configuration
 *    - `vertexShader` – Compiled vertex shader
 *    - `fragmentShader` – Compiled fragment shader
 *    - `strict` – Throw error if linking/validation fails (default: false)
 *
 * **Usage**
 * ```ts
 * const vertexShader = compileShader(context, { source: vsSource, type: context.VERTEX_SHADER })
 * const fragmentShader = compileShader(context, { source: fsSource, type: context.FRAGMENT_SHADER })
 *
 * const program = createProgram(context)
 *
 * // Silent mode
 * linkProgram(context, program, { vertexShader, fragmentShader })
 *
 * // Strict mode
 * linkProgram(context, program, { vertexShader, fragmentShader, strict: true })
 * ```
 */
export function linkProgram(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram | null,
  options: LinkProgramOptions
): boolean {
  const { vertexShader, fragmentShader, strict = false } = options

  if (!program || !vertexShader || !fragmentShader) {
    handleError({
      subject: "program",
      context: { action: "linkProgram", result: "Program or shader reference is null" },
      strict
    })
    return false
  }

  context.attachShader(program, vertexShader)
  context.attachShader(program, fragmentShader)
  context.linkProgram(program)

  // Do validation after linking
  return validateProgram(context, program, { strict })
}
