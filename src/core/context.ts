/**
 * Configuration options for creating a WebGL context
 */
export interface CanvasContextOptions extends WebGLContextAttributes {
  /**
   * Suppress console error logging if WebGL cannot be created (unsupported, browser or device limits)
   *
   * @default false
   */
  silently?: boolean

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
 *    - `silently` – Suppress error logging if WebGL cannot be created (default: false)
 *    - `webgl2` – Attempt to create a WebGL2 context first, fallback to WebGL1 if unavailable (default: false)
 *
 * **Usage**
 * ```ts
 * // Default usage
 * const gl = canvasContext(canvas)
 *
 * // Custom options
 * const gl = canvasContext(canvas, { antialias: false, depth: false, silently: true })
 *
 * // Try WebGL2 first, fallback to WebGL1
 * const gl2 = canvasContext(canvas, { webgl2: true })
 *
 * if (!gl) {
 *   // Handle fallback manually if needed
 * }
 * ```
 */
export function canvasContext(
  canvas: HTMLCanvasElement,
  options: CanvasContextOptions = {}
): WebGLRenderingContext | WebGL2RenderingContext | null {
  const {
    silently = false,
    webGL2 = false,
    ...attributes
  } = options

  // Attempt to obtain a WebGL2 context if requested
  let webGL: WebGLRenderingContext | WebGL2RenderingContext | null = null
  if (webGL2) {
    webGL = canvas.getContext("webgl2", attributes) as WebGL2RenderingContext | null
  }

  // Fallback to WebGL1 if WebGL2 is not available
  if (!webGL) {
    webGL = canvas.getContext("webgl", attributes)
  }

  // If WebGL is not supported and silently is not enabled, log an error
  if (!webGL && !silently) {
    console.error(
      "Failed to initialize WebGL context. " +
      "This browser or device may not support WebGL, " +
      "or the provided context attributes are not compatible.",
      { canvas, options }
    )
  }

  // Return the WebGLRenderingContext if available, otherwise null
  return webGL
}

/**
 * Configuration options for resizing a canvas element
 */
export interface ResizeCanvasOptions {
  /**
   * Maximum constraints for canvas scaling
   */
  max?: {
    /**
     * Maximum device pixel ratio
     *
     * @default 1.5
     */
    dpr?: number

    /**
     * Maximum canvas width
     *
     * @default Infinity
     */
    width?: number

    /**
     * Maximum canvas height
     *
     * @default Infinity
     */
    height?: number
  }

  /**
   * Minimum constraints for canvas scaling
   */
  min?: {
    /**
     * Minimum device pixel ratio
     *
     * @default 1
     */
    dpr?: number

    /**
     * Minimum canvas width
     *
     * @default 1
     */
    width?: number

    /**
     * Minimum canvas height
     *
     * @default 1
     */
    height?: number
  }

  /**
   * Device pixel ratio source
   */
  source?: number

  /**
   * Automatically resize on window resize events
   *
   * @default false
   */
  autoResize?: boolean

  /**
   * Callback invoked after resize
   */
  onResize?: (width: number, height: number) => void

  /**
   * Rounding strategy for DPR scaling
   *
   * @default "floor"
   */
  rounding?: "floor" | "round" | "ceil"
}

/**
 * Resize a canvas element based on its bounding box and device pixel ratio (DPR)
 *
 * **Parameters**
 * - `canvas` – Target canvas element to resize
 * - `options` – Optional configuration object
 *    - `max` – Maximum constraints
 *       - `dpr` – Maximum device pixel ratio (default: 1.5)
 *       - `width` – Maximum canvas width (default: Infinity)
 *       - `height` – Maximum canvas height (default: Infinity)
 *    - `min` – Minimum constraints
 *       - `dpr` – Minimum device pixel ratio (default: 1)
 *       - `width` – Minimum canvas width (default: 1)
 *       - `height` – Minimum canvas height (default: 1)
 *    - `source` – Device pixel ratio source (default: `window.devicePixelRatio || 1`)
 *    - `autoResize` – Automatically resize on window resize events (default: false)
 *    - `onResize` – Callback invoked after resize with new width/height
 *    - `rounding` – Rounding strategy for DPR scaling (`"floor" | "round" | "ceil"`)
 *
 * **Usage**
 * ```ts
 * // Default usage (uses window.devicePixelRatio)
 * resizeCanvas(canvas)
 *
 * // Custom DPR source
 * resizeCanvas(canvas, { source: 2 })
 *
 * // Custom min/max constraints
 * resizeCanvas(canvas, { max: { dpr: 2 }, min: { width: 10, height: 10 } })
 *
 * // Auto resize with callback
 * resizeCanvas(canvas, {
 *   autoResize: true,
 *   onResize: (w, h) => console.log("Resized:", w, h),
 *   rounding: "round"
 * })
 * ```
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  options: ResizeCanvasOptions = {}
): void {
  const {
    max: {
      dpr: maxDpr = 1.5,
      width: maxWidth = Infinity,
      height: maxHeight = Infinity
    } = {},
    min: {
      dpr: minDpr = 1,
      width: minWidth = 1,
      height: minHeight = 1
    } = {},
    source = window.devicePixelRatio || 1,
    autoResize = false,
    onResize,
    rounding = "floor"
  } = options

  // Select rounding function based on strategy
  const roundFn = Math[rounding]

  // Clamp DPR between min and max
  const dpr = Math.min(Math.max(source || 1, minDpr), maxDpr)

  // Get canvas size from its bounding box
  const { width, height } = canvas.getBoundingClientRect()

  // Apply DPR scaling with min/max constraints
  canvas.width = Math.min(maxWidth, Math.max(minWidth, roundFn(width * dpr)))
  canvas.height = Math.min(maxHeight, Math.max(minHeight, roundFn(height * dpr)))

  // Invoke callback if provided
  if (onResize) onResize(canvas.width, canvas.height)

  // Attach auto resize listener if enabled
  if (autoResize) {
    window.addEventListener("resize", () => resizeCanvas(canvas, options))
  }
}
