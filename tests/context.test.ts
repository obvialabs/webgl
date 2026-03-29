/**
 * @vitest-environment jsdom
 */
import "../../setup-jsdom"

import { describe, it, expect, vi } from "vitest"
import { canvasContext, resizeCanvas } from "@obvia/webgl"

describe("webgl suite", () => {
  describe("canvasContext()", () => {
    it("returns a WebGLRenderingContext when supported", () => {
      const canvas = document.createElement("canvas")
      const fakeContext = {} as WebGLRenderingContext

      canvas.getContext = vi.fn().mockReturnValue(fakeContext)

      const gl = canvasContext({ canvas })
      expect(gl).toBe(fakeContext)
      expect(canvas.getContext).toHaveBeenCalledWith("webgl", {})
    })
    it("forwards custom options to getContext", () => {
      const canvas = document.createElement("canvas")
      const fakeContext = {} as WebGLRenderingContext
      const options = { antialias: false, depth: false }

      canvas.getContext = vi.fn().mockReturnValue(fakeContext)

      const gl = canvasContext({ canvas, options })
      expect(gl).toBe(fakeContext)
      expect(canvas.getContext).toHaveBeenCalledWith("webgl", options)
    })
    it("logs an error when WebGL is not supported", () => {
      const canvas = document.createElement("canvas")
      canvas.getContext = vi.fn().mockReturnValue(null)

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const gl = canvasContext({ canvas })
      expect(gl).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      // @ts-ignore
      const [message, details] = consoleSpy.mock.calls[0]
      expect(message).toContain("Failed to initialize WebGL context")
      expect(details).toMatchObject({ canvas, options: {} })

      consoleSpy.mockRestore()
    })
    it("suppresses error logging when silently is true", () => {
      const canvas = document.createElement("canvas")
      canvas.getContext = vi.fn().mockReturnValue(null)

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const gl = canvasContext({ canvas, options: { silently: true } })
      expect(gl).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
    it("still returns null when silently is true and WebGL unsupported", () => {
      const canvas = document.createElement("canvas")
      canvas.getContext = vi.fn().mockReturnValue(null)

      const gl = canvasContext({ canvas, options: { silently: true } })
      expect(gl).toBeNull()
    })
    it("handles undefined options gracefully", () => {
      const canvas = document.createElement("canvas")
      const fakeContext = {} as WebGLRenderingContext

      canvas.getContext = vi.fn().mockReturnValue(fakeContext)

      const gl = canvasContext({ canvas, options: undefined })
      expect(gl).toBe(fakeContext)
      expect(canvas.getContext).toHaveBeenCalledWith("webgl", {})
    })
    it("logs error with custom options when unsupported", () => {
      const canvas = document.createElement("canvas")
      canvas.getContext = vi.fn().mockReturnValue(null)

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const options = { antialias: true }
      const gl = canvasContext({ canvas, options })
      expect(gl).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      const [, details] = consoleSpy.mock.calls[0]
      expect(details).toMatchObject({ canvas, options })
    })
  })
  describe("resizeCanvas()", () => {
    it("applies default devicePixelRatio when none provided", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 100, height: 50 } as DOMRect)
      Object.defineProperty(window, "devicePixelRatio", { value: 2, configurable: true })

      resizeCanvas(canvas)
      // dpr clamp: min=1, max=1.5 → dpr=1.5
      expect(canvas.width).toBe(150)
      expect(canvas.height).toBe(75)
    })

    it("uses custom DPR source instead of window.devicePixelRatio", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 100, height: 100 } as DOMRect)

      resizeCanvas(canvas, { source: 3 })
      // clamp: maxDpr=1.5 → dpr=1.5
      expect(canvas.width).toBe(150)
      expect(canvas.height).toBe(150)
    })

    it("clamps DPR to minDpr when source is too low", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 100, height: 100 } as DOMRect)

      resizeCanvas(canvas, { source: 0.1, min: { dpr: 1.2 }, max: { dpr: 2 } })
      // dpr clamp: min=1.2 → dpr=1.2
      expect(canvas.width).toBe(120)
      expect(canvas.height).toBe(120)
    })

    it("clamps DPR to maxDpr when source is too high", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 100, height: 100 } as DOMRect)

      resizeCanvas(canvas, { source: 5, max: { dpr: 2 } })
      // dpr clamp: max=2 → dpr=2
      expect(canvas.width).toBe(200)
      expect(canvas.height).toBe(200)
    })

    it("respects max width/height constraints", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 500, height: 400 } as DOMRect)

      resizeCanvas(canvas, { source: 2, max: { width: 600, height: 300 } })
      expect(canvas.width).toBeLessThanOrEqual(600)
      expect(canvas.height).toBeLessThanOrEqual(300)
    })

    it("respects min width/height constraints", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 1, height: 1 } as DOMRect)

      resizeCanvas(canvas, { source: 0.5, min: { width: 50, height: 25 } })
      expect(canvas.width).toBeGreaterThanOrEqual(50)
      expect(canvas.height).toBeGreaterThanOrEqual(25)
    })

    it("applies floor to scaled dimensions", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 33.3, height: 33.3 } as DOMRect)

      resizeCanvas(canvas, { source: 1.5 })
      expect(canvas.width).toBe(Math.floor(33.3 * 1.5))
      expect(canvas.height).toBe(Math.floor(33.3 * 1.5))
    })

    it("handles Infinity max constraints gracefully", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 150, height: 100 } as DOMRect)

      resizeCanvas(canvas, { source: 2, max: { width: Infinity, height: Infinity } })
      // dpr clamp: maxDpr=1.5 → dpr=1.5
      expect(canvas.width).toBe(225)
      expect(canvas.height).toBe(150)
    })

    it("handles missing options object", () => {
      const canvas = document.createElement("canvas")
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({ width: 100, height: 50 } as DOMRect)

      resizeCanvas(canvas)
      expect(canvas.width).toBeGreaterThan(0)
      expect(canvas.height).toBeGreaterThan(0)
    })
  })
})
