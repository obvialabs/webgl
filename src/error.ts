import { parseSource } from "./utility/parse-source"
import { parseContext } from "./utility/parse-context"

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
    // Enrich context with file/line/column info
    Object.assign(context, parseSource())

    // Build structured error message with aligned keys
    const message = parseContext(subject, "error", context)

    super(message)
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
}): void {
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
}
