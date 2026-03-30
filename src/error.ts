/**
 * Context object for WebGL errors
 */
export type WebGLErrorContext = {
  action: string
  result: string
  details?: string
  file?: string
  line?: number
  column?: number
}

/**
 * Context object for WebGL errors
 */
export type WebGLErrorType =
  | "webgl"
  | "shader"
  | "program"
  | "buffer"
  | "attribute"
  | "uniform"
  | "texture"
  | "canvas"

/**
 * Base class for all related errors
 *
 * **Parameters**
 * - `subject` – Error subject (shader, program, buffer, attribute, uniform, texture, canvas)
 * - `context` – Object containing error details, typed as `WebGLErrorContext`
 *
 * **Usage**
 * ```ts
 * throw new WebGLError("shader", {
 *   action: "compilation",
 *   result: "GLSL source could not be compiled",
 *   details: "unexpected token"
 * })
 * ```
 *
 * **Output**
 * ```
 * [shader error]
 * - action    : compilation
 * - result    : GLSL source could not be compiled
 * - details   : unexpected token
 * - file      : /src/shader.ts
 * - line      : 42
 * - column    : 13
 * ```
 */
export class WebGLError extends Error {
  constructor(subject: string, context: WebGLErrorContext) {
    // Extract file, line, and column information from stack trace
    const stack = new Error().stack?.split("\n")[2] || ""
    const match = stack.match(/\((.*):(\d+):(\d+)\)/)

    if (match) {
      const [, file, line, column] = match
      context.file = file
      context.line = Number(line)
      context.column = Number(column)
    }

    // Find the longest key length for alignment
    const maxKeyLength = Math.max(...Object.keys(context).map(k => k.length))

    // Build structured error message with aligned keys
    const lines = [
      `[${subject} error]`,
      ...Object.entries(context).map(([key, value]) => {
        const paddedKey = key.padEnd(maxKeyLength, " ")
        return `- ${paddedKey} : ${value}`
      })
    ].join("\n")

    super(lines)
    this.name = "WebGLError"
  }
}

/**
 * Error thrown when a shader operation fails
 */
export class ShaderError extends WebGLError {
  constructor(context: WebGLErrorContext) {
    super("Shader", context)
    this.name = "ShaderError"
  }
}

/**
 * Error thrown when a program operation fails
 */
export class ProgramError extends WebGLError {
  constructor(context: WebGLErrorContext) {
    super("Program", context)
    this.name = "ProgramError"
  }
}

/**
 * Error thrown when a buffer operation fails
 */
export class BufferError extends WebGLError {
  constructor(context: WebGLErrorContext) {
    super("Buffer", context)
    this.name = "BufferError"
  }
}

/**
 * Error thrown when an attribute operation fails
 */
export class AttributeError extends WebGLError {
  constructor(context: WebGLErrorContext) {
    super("Attribute", context)
    this.name = "AttributeError"
  }
}

/**
 * Error thrown when a uniform operation fails
 */
export class UniformError extends WebGLError {
  constructor(context: WebGLErrorContext) {
    super("Uniform", context)
    this.name = "UniformError"
  }
}

/**
 * Error thrown when a texture operation fails
 */
export class TextureError extends WebGLError {
  constructor(context: WebGLErrorContext) {
    super("Texture", context)
    this.name = "TextureError"
  }
}

/**
 * Error thrown when a canvas operation fails
 */
export class CanvasError extends WebGLError {
  constructor(context: WebGLErrorContext) {
    super("Canvas", context)
    this.name = "CanvasError"
  }
}

/**
 * Centralized error handling
 *
 * **Parameters**
 * - `subject`  – Error subject (`"shader" | "program" | "buffer" | "attribute" | "uniform" | "texture" | "canvas" | "webgl"`)
 * - `context`  – Error details object typed as `WebGLErrorContext`
 * - `strict`   – Whether to throw an error (`true`) or return `false` (`false`)
 *
 * **Returns**
 * - Throws a category-specific error when `strict` is enabled
 * - Returns `false` when `strict` is disabled
 *
 * **Usage**
 * ```ts
 * // Shader error
 * handleError({
 *   subject: "shader",
 *   context: {
 *     action: "compilation",
 *     result: "GLSL source could not be compiled",
 *     details: "unexpected token"
 *   },
 *   strict: true
 * })
 *
 * // General WebGL error (e.g. WebGL2 not supported)
 * handleError({
 *   subject: "webgl",
 *   context: {
 *     action: "initialization",
 *     result: "WebGL2 not supported in this environment"
 *   },
 *   strict: true
 * })
 * ```
 */
export function handleError({
  strict,
  subject,
  context
}: {
  strict: boolean
  subject: WebGLErrorType
  context: WebGLErrorContext
}): boolean {
  if (strict) {
    switch (subject) {
      case "shader":
        throw new ShaderError(context)
      case "program":
        throw new ProgramError(context)
      case "buffer":
        throw new BufferError(context)
      case "attribute":
        throw new AttributeError(context)
      case "uniform":
        throw new UniformError(context)
      case "texture":
        throw new TextureError(context)
      case "canvas":
        throw new CanvasError(context)
      case "webgl":
        throw new WebGLError("WebGL", context)
    }
  }
  return false
}
