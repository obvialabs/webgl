export class ShaderError extends Error {
  constructor(action: string, details: string, infoLog?: string) {
    super(`Shader ${action} failed: ${details}${infoLog ? " | Log: " + infoLog : ""}`)
    this.name = "ShaderError"
  }
}

export class ProgramError extends Error {
  constructor(action: string, details: string, infoLog?: string) {
    super(`Program ${action} failed: ${details}${infoLog ? " | Log: " + infoLog : ""}`)
    this.name = "ProgramError"
  }
}

export class BufferError extends Error {
  constructor(action: string, details: string) {
    super(`Buffer ${action} failed: ${details}`)
    this.name = "BufferError"
  }
}

export class AttributeError extends Error {
  constructor(action: string, details: string) {
    super(`Attribute ${action} failed: ${details}`)
    this.name = "AttributeError"
  }
}

export class UniformError extends Error {
  constructor(action: string, details: string) {
    super(`Uniform ${action} failed: ${details}`)
    this.name = "UniformError"
  }
}

export class TextureError extends Error {
  constructor(action: string, details: string) {
    super(`Texture ${action} failed: ${details}`)
    this.name = "TextureError"
  }
}

export class CanvasError extends Error {
  constructor(action: string, details: string) {
    super(`Canvas ${action} failed: ${details}`)
    this.name = "CanvasError"
  }
}

type ErrorCategory =
  | "shader"
  | "program"
  | "buffer"
  | "attribute"
  | "uniform"
  | "texture"
  | "canvas"

/**
 * Categorizes errors by type (shader, program, buffer, attribute, uniform, texture, canvas)
 * and throws the appropriate specialized error class when `strict` mode is enabled.
 * In non-strict mode, returns `false` instead of throwing.
 *
 * **Parameters**
 * - `strict` – Whether to throw an error (`true`) or return `false` (`false`)
 * - `category` – Error category (`"shader" | "program" | "buffer" | "attribute" | "uniform" | "texture" | "canvas"`)
 * - `action` – The operation being performed (e.g. `"creation"`, `"compilation"`, `"validation"`)
 * - `details` – Human-readable description of why the operation failed
 * - `infoLog` – Optional WebGL info log string for additional context
 *
 * **Returns**
 * - `false` when `strict` is disabled (silent mode)
 * - Throws a category-specific error when `strict` is enabled
 *
 * **Usage**
 * ```ts
 * // Silent mode: returns false if shader creation fails
 * if (!shader) {
 *   return handleError(false, "shader", "creation", "shader object is null")
 * }
 *
 * // Strict mode: throws ShaderError if compilation fails
 * if (!status) {
 *   const infoLog = context.getShaderInfoLog(shader) || "No compilation log available"
 *   handleError(true, "shader", "compilation", "GLSL source could not be compiled", infoLog)
 * }
 * ```
 */
export function handleError(
  strict: boolean,
  category: ErrorCategory,
  action: string,
  details: string,
  infoLog?: string
): boolean {
  if (strict) {
    switch (category) {
      case "shader":
        throw new ShaderError(action, details, infoLog)
      case "program":
        throw new ProgramError(action, details, infoLog)
      case "buffer":
        throw new BufferError(action, details)
      case "attribute":
        throw new AttributeError(action, details)
      case "uniform":
        throw new UniformError(action, details)
      case "texture":
        throw new TextureError(action, details)
      case "canvas":
        throw new CanvasError(action, details)
    }
  }
  return false
}

/**
 * Format a standardized WebGL error log message
 *
 * @param category - Error category (shader, program, buffer, attribute, uniform, texture, canvas)
 * @param action - Operation being performed (creation, compilation, validation, etc.)
 * @param details - Human-readable description of the failure
 * @param infoLog - Optional WebGL info log string
 */
function formatError(
  category: string,
  action: string,
  details: string,
  infoLog?: string
): string {
  return `[${category.toUpperCase()}] ${action} - failed : ${details}${
    infoLog ? " - Context : " + infoLog : ""
  }`
}
