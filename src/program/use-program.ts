import type { BaseOptions } from "../option"
import { validateProgram } from "./validate-program"

/**
 * Make a WebGL program the current active program
 *
 * **Parameters**
 * - `context` – WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Program object created and linked with shaders
 * - `options` – Optional configuration
 *    - `strict` – Throw error if program is null or validation fails (default: false)
 *
 * **Usage**
 * ```ts
 * // Create and link program
 * const program = createProgram(context)
 * linkProgram(context, program, { vertexShader, fragmentShader })
 *
 * // Use the program (silent mode)
 * useProgram(context, program)
 *
 * // Strict mode: throws an error if program is null or validation fails
 * useProgram(context, program, { strict: true })
 * ```
 */
export function useProgram(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram | null,
  options: BaseOptions = {}
): void {
  const { strict = false } = options

  // Validate program before using
  if (!validateProgram(context, program, { strict })) return

  // Make program active
  context.useProgram(program)
}
