import type { BaseOptions } from "./option"

/**
 * Configuration options for creating a WebGL buffer
 */
export interface BufferOptions extends BaseOptions {
  /**
   * Buffer target (`ARRAY_BUFFER` for vertex data, `ELEMENT_ARRAY_BUFFER` for indices)
   */
  target: number

  /**
   * Typed array containing vertex or index data
   */
  data: BufferSource

  /**
   * Buffer usage hint
   *
   * @default STATIC_DRAW
   */
  usage?: number
}

/**
 * Create a generic WebGL buffer and upload data
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `options` – Buffer configuration
 *    - `target` – Buffer target (`ARRAY_BUFFER` or `ELEMENT_ARRAY_BUFFER`)
 *    - `data` – Vertex or index data (typed array)
 *    - `usage` – Buffer usage hint (default: `STATIC_DRAW`)
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vertices = new Float32Array([0,0, 1,0, 0,1])
 * const vboDefault = createBuffer(context, {
 *   target: context.ARRAY_BUFFER,
 *   data: vertices
 * })
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const indices = new Uint16Array([0,1,2, 2,1,3])
 * const iboStrict = createBuffer(context, {
 *   target: context.ELEMENT_ARRAY_BUFFER,
 *   data: indices,
 *   strict: true
 * })
 *
 * // Custom usage hint (dynamic draw)
 * const dynamicVertices = new Float32Array([0,0, 1,0, 0,1])
 * const vboDynamic = createBuffer(context, {
 *   target: context.ARRAY_BUFFER,
 *   data: dynamicVertices,
 *   usage: context.DYNAMIC_DRAW
 * })
 *
 * // Drawing with buffers
 * context.drawArrays(context.TRIANGLES, 0, 3) // using vboDefault
 * context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0) // using iboStrict
 * ```
 */
export function createBuffer(
  context: WebGLRenderingContext,
  options: BufferOptions
): WebGLBuffer | null {
  // Extract configuration parameters from options
  const {
    target,
    data,
    usage = context.STATIC_DRAW,
    strict = false
  } = options

  // Attempt to create a new GPU buffer
  const buffer = context.createBuffer()
  if (!buffer) {
    // In strict mode, throw an error if buffer creation fails
    if (strict) {
      throw new Error(
        `Failed to create WebGL buffer (target=${target}).
         This usually indicates that the WebGL context is lost or resources are exhausted.`
      )
    }
    // In silent mode, return null instead of throwing
    return null
  }

  // Delegate the initial data upload to updateBuffer to avoid code duplication
  updateBuffer(context, buffer, { target, data, usage, strict })

  // Return the created buffer object
  return buffer
}

/**
 * Create a buffer for a full‑screen quad
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `position` – Attribute location index for vertex positions
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Produces 4 vertices covering the entire screen
 * - Can be drawn directly with `context.drawArrays` (triangle strip) or with `context.drawElements` using an index buffer
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vboDefault = createQuadBuffer(context, positionLocation)
 * context.drawArrays(context.TRIANGLE_STRIP, 0, 4)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const vboStrict = createQuadBuffer(context, positionLocation, { strict: true })
 * context.drawArrays(context.TRIANGLE_STRIP, 0, 4)
 *
 * // With index buffer
 * const vbo = createQuadBuffer(context, positionLocation)
 * const ibo = createQuadIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createQuadBuffer(
  context: WebGLRenderingContext,
  position: number,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define vertex data
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

  // Use createBuffer to allocate and upload data
  const buffer = createBuffer(context, {
    target: context.ARRAY_BUFFER,
    data: vertices,
    strict
  })

  // If buffer creation failed in silent mode, return null
  if (!buffer) return null

  // Configure vertex attribute pointer
  context.enableVertexAttribArray(position)
  context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0)

  return buffer
}

/**
 * Create an index buffer for a full‑screen quad
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Works together with `createQuadBuffer` (vertex positions)
 * - Produces 6 indices (2 triangles × 3 vertices)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vbo = createQuadBuffer(context, positionLocation)
 * const iboDefault = createQuadIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const iboStrict = createQuadIndexBuffer(context, { strict: true })
 * context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createQuadIndexBuffer(
  context: WebGLRenderingContext,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 6 indices for two triangles forming a quad
  const indices = new Uint16Array([0, 1, 2, 2, 1, 3])

  // Create the index buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ELEMENT_ARRAY_BUFFER,
    data: indices,
    strict
  })

  // Return null if buffer creation failed in silent mode
  if (!buffer) return null

  return buffer
}

/**
 * Create a buffer for a full‑screen triangle
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `position` – Attribute location index for vertex positions
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Produces 3 vertices that cover the entire screen
 * - No index buffer is required; this is drawn directly with `context.drawArrays`
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vboDefault = createTriangleBuffer(context, positionLocation)
 * context.drawArrays(context.TRIANGLES, 0, 3)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const vboStrict = createTriangleBuffer(context, positionLocation, { strict: true })
 * context.drawArrays(context.TRIANGLES, 0, 3)
 * ```
 */
export function createTriangleBuffer(
  context: WebGLRenderingContext,
  position: number,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 3 vertices that cover the entire screen
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])

  // Create the buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ARRAY_BUFFER,
    data: vertices,
    strict
  })

  // Return null if buffer creation failed in silent mode
  if (!buffer) return null

  // Enable the vertex attribute and define its layout (2 floats per vertex)
  context.enableVertexAttribArray(position)
  context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0)

  return buffer
}

/**
 * Create an index buffer for a full‑screen triangle
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Produces 3 indices (one triangle)
 * - Works together with `createTriangleBuffer` (vertex positions)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vbo = createTriangleBuffer(context, positionLocation)
 * const iboDefault = createTriangleIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 3, context.UNSIGNED_SHORT, 0)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const iboStrict = createTriangleIndexBuffer(context, { strict: true })
 * context.drawElements(context.TRIANGLES, 3, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createTriangleIndexBuffer(
  context: WebGLRenderingContext,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 3 indices for a single triangle
  const indices = new Uint16Array([0, 1, 2])

  // Create the index buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ELEMENT_ARRAY_BUFFER,
    data: indices,
    strict
  })

  // Return null if buffer creation failed in silent mode
  if (!buffer) return null

  return buffer
}

/**
 * Create a buffer for a unit cube
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `position` – Attribute location index for vertex positions
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Works together with `createCubeIndexBuffer` (indices)
 * - Produces 8 unique vertices and 36 indices (6 faces × 2 triangles × 3 vertices)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vboDefault = createCubeBuffer(context, positionLocation)
 * const iboDefault = createCubeIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const vboStrict = createCubeBuffer(context, positionLocation, { strict: true })
 * const iboStrict = createCubeIndexBuffer(context, { strict: true })
 * context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createCubeBuffer(
  context: WebGLRenderingContext,
  position: number,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 8 unique vertices for a unit cube
  const vertices = new Float32Array([
    -1,-1,-1,  1,-1,-1,  1, 1,-1, -1, 1,-1, // back face
    -1,-1, 1,  1,-1, 1,  1, 1, 1, -1, 1, 1  // front face
  ])

  // Create the buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ARRAY_BUFFER,
    data: vertices,
    strict
  })

  // Return null if buffer creation failed in silent mode
  if (!buffer) return null

  // Enable the vertex attribute and define its layout (3 floats per vertex)
  context.enableVertexAttribArray(position)
  context.vertexAttribPointer(position, 3, context.FLOAT, false, 0, 0)

  return buffer
}

/**
 * Create an index buffer for a cube
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer cannot be created (default: false)
 *
 * **Notes**
 * - Works together with `createCubeBuffer` (vertex positions)
 * - Produces 36 indices (6 faces × 2 triangles × 3 vertices)
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): returns null if buffer cannot be created
 * const vboDefault = createCubeBuffer(context, positionLocation)
 * const iboDefault = createCubeIndexBuffer(context)
 * context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
 *
 * // Strict mode: throws an error if buffer cannot be created
 * const vboStrict = createCubeBuffer(context, positionLocation, { strict: true })
 * const iboStrict = createCubeIndexBuffer(context, { strict: true })
 * context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
 * ```
 */
export function createCubeIndexBuffer(
  context: WebGLRenderingContext,
  options: BaseOptions = {}
): WebGLBuffer | null {
  const { strict = false } = options

  // Define 36 indices for the cube (6 faces × 2 triangles × 3 vertices)
  const indices = new Uint16Array([
    0,1,2, 2,3,0, // back
    4,5,6, 6,7,4, // front
    0,4,7, 7,3,0, // left
    1,5,6, 6,2,1, // right
    3,2,6, 6,7,3, // top
    0,1,5, 5,4,0  // bottom
  ])

  // Create the index buffer with optional strict error handling
  const buffer = createBuffer(context, {
    target: context.ELEMENT_ARRAY_BUFFER,
    data: indices,
    strict
  })

  // Return null if buffer creation failed in silent mode
  if (!buffer) return null

  return buffer
}

/**
 * Update an existing WebGL buffer with new data
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `buffer` – Existing buffer to update
 * - `options` – Buffer configuration
 *    - `target` – Buffer target (e.g. `context.ARRAY_BUFFER`)
 *    - `data` – New typed array data to upload
 *    - `usage` – Buffer usage hint (default: `context.STATIC_DRAW`)
 *    - `strict` – Throw error if buffer binding fails (default: false)
 *
 * **Notes**
 * - This uses `context.bufferData`, which **replaces the entire buffer contents**
 * - The buffer may be reallocated on the GPU, so it’s less efficient for small changes
 * - Use this when you want to completely reset or resize the buffer
 *
 * **Usage**
 * ```ts
 * // Replace the entire buffer with new vertices
 * const newVertices = new Float32Array([0,0, 1,0, 1,1])
 * updateBuffer(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: newVertices
 * })
 *
 * // Resize the buffer with more vertices (old data discarded)
 * const largerVertices = new Float32Array([0,0, 1,0, 1,1, 0,1])
 * updateBuffer(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: largerVertices,
 *   usage: context.DYNAMIC_DRAW
 * })
 *
 * // Strict mode: throws an error if buffer binding fails
 * updateBuffer(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: newVertices,
 *   strict: true
 * })
 * ```
 */
export function updateBuffer(
  context: WebGLRenderingContext,
  buffer: WebGLBuffer,
  options: BufferOptions
): void {
  const {
    target,
    data,
    usage = context.STATIC_DRAW,
    strict = false
  } = options

  // Bind the buffer before updating
  context.bindBuffer(target, buffer)

  // Determine correct binding parameter based on target
  const bindingParam =
    target === context.ARRAY_BUFFER
      ? context.ARRAY_BUFFER_BINDING
      : context.ELEMENT_ARRAY_BUFFER_BINDING

  // If strict mode is enabled, verify binding
  if (strict && context.getParameter(bindingParam) !== buffer) {
    throw new Error(`Failed to bind WebGL buffer (target=${target}).`)
  }

  // Replace the entire buffer contents with new data
  context.bufferData(target, data, usage)
}

/**
 * Partially update an existing WebGL buffer with new data
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `buffer` – Existing buffer to update
 * - `options` – Buffer configuration
 *    - `target` – Buffer target (e.g. `context.ARRAY_BUFFER`)
 *    - `data` – Typed array containing new data
 *    - `offset` – Byte offset in the buffer where data should be written (default: 0)
 *    - `strict` – Throw error if buffer binding fails (default: false)
 *
 * **Notes**
 * - Unlike `updateBuffer`, this does **not** reallocate the buffer
 * - Existing data remains intact; only the specified region is overwritten
 * - More efficient for dynamic updates (animations, particle systems)
 *
 * **Usage**
 * ```ts
 * // Replace only the first vertex (two floats) in the buffer
 * const newVertex = new Float32Array([0.5, 0.5])
 * updateBufferPartial(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: newVertex,
 *   offset: 0
 * })
 *
 * // Replace the 3rd vertex (offset = 2 * 4 bytes = 8)
 * const anotherVertex = new Float32Array([1.0, 1.0])
 * updateBufferPartial(context, vbo, {
 *   target: context.ARRAY_BUFFER,
 *   data: anotherVertex,
 *   offset: 8,
 *   strict: true
 * })
 * ```
 */
export function updateBufferPartial(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  buffer: WebGLBuffer,
  options: BufferOptions & { offset?: number }
): void {
  const {
    target,
    data,
    offset = 0,
    strict = false
  } = options

  // Bind the buffer before updating
  context.bindBuffer(target, buffer)

  // Determine correct binding parameter based on target
  const bindingParam =
    target === context.ARRAY_BUFFER
      ? context.ARRAY_BUFFER_BINDING
      : context.ELEMENT_ARRAY_BUFFER_BINDING

  // If strict mode is enabled, verify binding
  if (strict && context.getParameter(bindingParam) !== buffer) {
    throw new Error(`Failed to bind WebGL buffer (target=${target}).`)
  }

  // Partially update the buffer contents starting at the given offset
  context.bufferSubData(target, offset, data)
}

/**
 * Delete a WebGL buffer and free GPU memory
 *
 * **Parameters**
 * - `context` – Target WebGL rendering context
 * - `buffer` – Buffer object to delete
 * - `options` – Optional configuration
 *    - `strict` – Throw error if buffer deletion fails (default: false)
 *
 * **Notes**
 * - Frees GPU memory associated with the buffer
 * - Always call this when a buffer is no longer needed to avoid memory leaks
 *
 * **Usage**
 * ```ts
 * // Silent mode (default): ignores if buffer is null
 * deleteBuffer(context, vbo)
 *
 * // Strict mode: throws an error if buffer is null or deletion fails
 * deleteBuffer(context, vbo, { strict: true })
 *
 * // Delete both vertex and index buffers when cleaning up
 * deleteBuffer(context, vbo)
 * deleteBuffer(context, ibo)
 * ```
 */
export function deleteBuffer(
  context: WebGLRenderingContext | WebGL2RenderingContext,
  buffer: WebGLBuffer | null,
  options: BaseOptions = {}
): void {
  const { strict = false } = options

  // If buffer is null and strict mode is enabled, throw an error
  if (!buffer) {
    if (strict) {
      throw new Error("Cannot delete WebGL buffer: buffer is null.")
    }
    return
  }

  // Delete the buffer and free GPU memory
  context.deleteBuffer(buffer)
}
