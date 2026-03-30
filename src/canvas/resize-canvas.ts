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
    // Remove any existing listener to avoid duplicates
    window.removeEventListener("resize", (canvas as any)._resizeHandler)

    // Create and store a new handler on the canvas object
    const handler = () => resizeCanvas(canvas, options)
    ;(canvas as any)._resizeHandler = handler

    window.addEventListener("resize", handler)
  }
}
