import type { BaseOptions } from "../option"
import { handleError } from "../utility/handle-error"

/**
 * Configuration options for setting an unsigned integer uniform (WebGL2-only)
 */
export interface UniformUiOptions extends BaseOptions {
  /**
   * Uniform name in the shader (e.g. "uCount")
   */
  name: string

  /**
   * One to four unsigned integer values
   *
   * - [number] → uniform1ui
   * - [number, number] → uniform2ui
   * - [number, number, number] → uniform3ui
   * - [number, number, number, number] → uniform4ui
   */
  values:
    | [number]
    | [number, number]
    | [number, number, number]
    | [number, number, number, number]

  /**
   * Throw error if uniform location is not found
   *
   * @default false
   */
  strict?: boolean
}

/**
 * Set an unsigned integer uniform in a WebGL shader program (WebGL2-only)
 *
 * **Parameters**
 * - `context` – Target WebGL2 rendering context
 * - `program` – Linked shader program
 * - `options` – Configuration object
 *    - `name` – Uniform name in the shader
 *    - `values` – One to four unsigned integer values
 *    - `strict` – Throw error if uniform location is not found (default: false)
 *
 * **Usage**
 * ```ts
 * // Single unsigned int
 * setUniformUi(context, program, { name: "uCount", values: [5] })
 *
 * // Two unsigned ints
 * setUniformUi(context, program, { name: "uCoords", values: [10, 20] })
 *
 * // Three unsigned ints
 * setUniformUi(context, program, { name: "uTriple", values: [1, 2, 3] })
 *
 * // Four unsigned ints
 * setUniformUi(context, program, { name: "uColor", values: [255, 128, 64, 32] })
 * ```
 */
export function setUniformUi(
  context: WebGL2RenderingContext,
  program: WebGLProgram,
  options: UniformUiOptions
): void {
  const { name, values, strict = false } = options

  // Validate values (must be non-negative)
  if (values.some(v => v < 0)) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniformUi",
        result  : `Invalid negative value in unsigned integer uniform "${name}"`
      },
      strict  : strict
    })
    return
  }

  // Get the uniform location from the shader program by name
  const location = context.getUniformLocation(program, name)

  // If the uniform location is not found, handle the error
  if (location === null) {
    handleError({
      subject : "uniform",
      context : {
        action  : "setUniformUi",
        result  : `Unsigned integer uniform "${name}" not found in shader program`
      },
      strict  : strict
    })
    return
  }

  // Dispatch to the correct WebGL2 function based on the number of values
  switch (values.length) {
    case 1: {
      // Single unsigned integer (uniform1ui)
      const [x] = values
      context.uniform1ui(location, x)
      break
    }
    case 2: {
      // Two unsigned integers (uniform2ui)
      const [x, y] = values
      context.uniform2ui(location, x, y)
      break
    }
    case 3: {
      // Three unsigned integers (uniform3ui)
      const [x, y, z] = values
      context.uniform3ui(location, x, y, z)
      break
    }
    case 4: {
      // Four unsigned integers (uniform4ui)
      const [x, y, z, w] = values
      context.uniform4ui(location, x, y, z, w)
      break
    }
  }
}
