import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Delete a WebGL program object and free GPU resources
 *
 * **Parameters**
 * - `context` – WebGL rendering context (WebGL1 or WebGL2)
 * - `program` – Program object to delete
 * - `options` – Optional configuration
 *    - `strict` – Throw error if program is null (default: false)
 *
 * **Usage**
 * ```ts
 * // Silent mode: ignores if program is null
 * deleteProgram(context, program)
 *
 * // Strict mode: throws an error if program is null
 * deleteProgram(context, program, { strict: true })
 * ```
 */
export function deleteProgram(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram | null,
  options: BaseOptions = {}
): void {
  const { strict = false } = options

  if (!program) {
    handleError({
      subject : "program",
      context : {
        action  : "deleteProgram",
        result  : "Program reference is null (never created, already deleted, or lost)"
      },
      strict  : strict
    })
    return
  }

  context.deleteProgram(program)
}
