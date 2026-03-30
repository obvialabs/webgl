import type { BaseOptions } from "../option"

/**
 * Configuration options for creating a WebGL context
 */
export interface CanvasContextOptions extends WebGLContextAttributes, BaseOptions {
  /**
   * Attempt to create a WebGL2 context first, fallback to WebGL1 if unavailable
   *
   * @default false
   */
  webGL2?: boolean
}

/**
 * Safely obtain a WebGL rendering context from a canvas element
 *
 * **Parameters**
 * - `canvas` – Target canvas element to initialize WebGL on
 * - `options` – Optional canvas context options (extends WebGL context attributes)
 *    - `*` – Inherits all standard WebGL context attributes
 *    - `webGL2` – Attempt to create a WebGL2 context first, fallback to WebGL1 if unavailable (default: false)
 *    - `strict` – Throw error if WebGL cannot be created (default: false)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if WebGL cannot be created
 * const ctxDefault = canvasContext(canvas)
 *
 * // Strict mode: throws an error if WebGL cannot be created
 * const ctxStrict = canvasContext(canvas, { strict: true })
 *
 * // Custom options
 * const ctxCustom = canvasContext(canvas, { antialias: false, depth: false })
 *
 * // Try WebGL2 first, fallback to WebGL1
 * const ctxWebGL2 = canvasContext(canvas, { webGL2: true })
 * ```
 */
export function canvasContext(
  canvas: HTMLCanvasElement,
  options: CanvasContextOptions = {}
): WebGLRenderingContext | WebGL2RenderingContext | null {
  // Extract options: webGL2 flag, strict mode, and other context attributes
  const {
    webGL2 = false,
    strict = false,
    ...attributes
  } = options

  // Define the context variable (can be WebGL1 or WebGL2)
  let context: WebGLRenderingContext | WebGL2RenderingContext | null = null

  // If webGL2 is requested, try to get a WebGL2 context first
  if (webGL2) {
    context = canvas.getContext("webgl2", attributes) as WebGL2RenderingContext | null
  }

  // If WebGL2 is not available, fall back to WebGL1
  if (!context) {
    context = canvas.getContext("webgl", attributes)
  }

  // If no context was created and strict mode is enabled, throw an error
  if (!context && strict) {
    throw new Error(
      "Failed to initialize WebGL context. " +
      "This browser or device may not support WebGL, " +
      "or the provided context attributes are not compatible."
    )
  }

  // Return the created context (or null if not available)
  return context
}
