import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Validate a linked WebGL program
 *
 * **Parameters**
 * - `context` – WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Program object to validate
 * - `options` – Optional configuration
 *    - `strict` – Throw error if validation fails (default: false)
 *
 * **Usage**
 * ```ts
 * // Validate program after linking (silent mode)
 * validateProgram(context, program)
 *
 * // Strict mode: throws an error if validation fails
 * validateProgram(context, program, { strict: true })
 * ```
 */
export function validateProgram(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram | null,
  options: BaseOptions = {}
): boolean {
  const { strict = false } = options

  // Case 1: Program reference is null → report error
  if (!program) {
    handleError({
      subject: "program",
      context: {
        action: "validateProgram",
        result: "Program reference is null (not created, not linked, or already deleted)"
      },
      strict
    })
    return false
  }

  // Case 2: Validate program
  context.validateProgram(program)

  // Case 3: Check validation status
  const status = context.getProgramParameter(program, context.VALIDATE_STATUS)
  if (!status) {
    const infoLog = context.getProgramInfoLog(program) || "No validation log available"
    handleError({
      subject: "program",
      context: {
        action: "validateProgram",
        result: "Program validation failed",
        details: infoLog
      },
      strict
    })
    return false
  }

  // Case 4: Validation succeeded
  return true
}
