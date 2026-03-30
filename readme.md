# WebGL

## Canvas

By centralizing context creation and resize logic, it provides a unified, predictable API for
obtaining WebGL contexts and managing canvas scaling. This reduces repetitive setup code, ensures
consistent handling of device pixel ratios, and simplifies error management with optional strict mode.

### API

#### canvasContext
Safely obtain a WebGL rendering context from a canvas element.

- `canvas` – Target canvas element to initialize WebGL on
- `options` – Optional configuration (extends WebGL context attributes)
  - `strict` – Throw error if WebGL cannot be created (default: false)
  - `webGL2` – Attempt to create a WebGL2 context first, fallback to WebGL1 (default: false)
  - `*` – Inherits all standard WebGL context attributes

```ts
// Silent mode (default): returns null if WebGL cannot be created
const ctxDefault = canvasContext(canvas)

// Strict mode: throws an error if WebGL cannot be created
const ctxStrict = canvasContext(canvas, { strict: true })

// Custom options (disable antialias, depth buffer)
const ctxCustom = canvasContext(canvas, { antialias: false, depth: false })

// Try WebGL2 first, fallback to WebGL1
const ctxWebGL2 = canvasContext(canvas, { webGL2: true })

if (!ctxDefault) {
  // Handle fallback manually if needed
}
```

#### resizeCanvas
Resize a canvas element based on its bounding box and device pixel ratio (DPR).

- `canvas` – Target canvas element to resize
- `options` – Optional configuration
  - `max` – Maximum constraints
    - `dpr` – Maximum device pixel ratio (default: 1.5)
    - `width` – Maximum canvas width (default: Infinity)
    - `height` – Maximum canvas height (default: Infinity)
  - `min` – Minimum constraints
    - `dpr` – Minimum device pixel ratio (default: 1)
    - `width` – Minimum canvas width (default: 1)
    - `height` – Minimum canvas height (default: 1)
  - `source` – Device pixel ratio source (default: `window.devicePixelRatio || 1`)
  - `autoResize` – Automatically resize on window resize events (default: false)
  - `onResize` – Callback invoked after resize with new width/height
  - `rounding` – Rounding strategy for DPR scaling (`"floor" | "round" | "ceil"`)

```ts
// Default usage (uses window.devicePixelRatio)
resizeCanvas(canvas)

// Custom DPR source
resizeCanvas(canvas, { source: 2 })

// Custom min/max constraints
resizeCanvas(canvas, { max: { dpr: 2 }, min: { width: 10, height: 10 } })

// Auto resize with callback
resizeCanvas(canvas, {
  autoResize: true,
  onResize: (w, h) => console.log("Resized :", w, h),
  rounding: "round"
})
```

## Attributes

This section documents the helper functions for managing vertex attributes, including binding, enabling, disabling, and validating

### API

#### bindAttribute
Binds a vertex attribute to the currently bound buffer and defines how data is read

- `context` – WebGL rendering context (WebGL1 or WebGL2)
- `program` – Linked shader program
- `options` – Attribute binding configuration
  - `name` – Attribute name in the shader
  - `size` – Number of components per attribute (e.g. 2 for vec2, 3 for vec3)
  - `type` – Data type of each component (e.g. `context.FLOAT`, `context.UNSIGNED_BYTE`)
  - `stride` – Byte offset between consecutive attributes (default: 0)
  - `offset` – Byte offset of the first component (default: 0)
  - `strict` – Throw error if attribute is not found (default: false)
  - `normalize` – Normalize integer data values to [0,1] or [-1,1] (default: false, WebGL1 & WebGL2)
  - `divisor` – Divisor for instanced rendering (default: 0, WebGL2 only)
  - `integer` – Use integer attribute binding (`vertexAttribIPointer`) instead of float (default: false, WebGL2 only)

```ts
// Silent mode (default): does nothing if attribute is missing
bindAttribute(context, program, {
  name: "aPosition",
  size: 3,
  type: context.FLOAT
})

// Strict mode: throws an error if attribute is missing
bindAttribute(context, program, {
  name: "aPosition",
  size: 3,
  type: context.FLOAT,
  strict: true
})

// Normalize unsigned byte colors to [0,1]
bindAttribute(context, program, {
  name: "aColor",
  size: 4,
  type: context.UNSIGNED_BYTE,
  normalize: true
})

// Integer attribute binding (WebGL2 only)
bindAttribute(context, program, {
  name: "aBoneIDs",
  size: 4,
  type: context.UNSIGNED_BYTE,
  integer: true
})

// Instanced rendering (WebGL2 only)
bindAttribute(context, program, {
  name: "aOffset",
  size: 2,
  type: context.FLOAT,
  divisor: 1
})
```

#### disableAttribute
Disables a vertex attribute in the shader program

- `context` – WebGL rendering context (WebGL1 or WebGL2)
- `program` – Linked shader program
- `options` – Attribute disabling configuration
  - `name` – Attribute name in the shader (e.g. `"aTexCoord"`)
  - `strict` – Throw error if attribute is not found (default: false)

```ts
// Silent mode (default): does nothing if attribute is missing
disableAttribute(context, program, { name: "aTexCoord" })

// Strict mode: throws an error if attribute is missing
disableAttribute(context, program, { name: "aTexCoord", strict: true })
```

#### enableAttribute
Enables a vertex attribute in the shader program

- `context` – WebGL rendering context (WebGL1 or WebGL2)
- `program` – Linked shader program
- `options` – Attribute enabling configuration
  - `name` – Attribute name in the shader (e.g. `"aPosition"`)
  - `strict` – Throw error if attribute is not found (default: false)

```ts
// Silent mode (default): does nothing if attribute is missing
enableAttribute(context, program, { name: "aPosition" })

// Strict mode: throws an error if attribute is missing
enableAttribute(context, program, { name: "aPosition", strict: true })
```

#### validateAttribute
Checks whether an attribute exists in the shader program and returns its location

- `context` – WebGL rendering context (WebGL1 or WebGL2)
- `program` – Linked shader program
- `options` – Validation configuration
  - `name` – Attribute name in the shader (e.g. `"aPosition"`)
  - `strict` – Throw error if attribute is not found (default: false)

```ts
// Silent mode (default): returns -1 if attribute is missing, no error thrown
const location = validateAttribute(context, program, { name: "aPosition" })
if (location !== -1) {
  context.enableVertexAttribArray(location)
}

// Strict mode: throws an error if attribute is missing
const locationStrict = validateAttribute(context, program, {
  name: "aPosition",
  strict: true
})
```

## Buffers

By centralizing validation and using a consistent options‑object pattern, it reduces boilerplate,
eliminates code duplication, and ensures a clean, predictable API for creating, updating, deleting,
and binding buffers.

### API

#### createBuffer
Creates a generic WebGL buffer and uploads data.

- `context` – WebGL rendering context
- `options` – Buffer configuration
  - `target` – Buffer target (`ARRAY_BUFFER` or `ELEMENT_ARRAY_BUFFER`)
  - `data` – Vertex or index data (typed array)
  - `usage` – Buffer usage hint (default: `STATIC_DRAW`)
  - `strict` – Throw error if buffer cannot be created (default: false)

```ts
// Silent mode (default): returns null if buffer cannot be created
const vertices = new Float32Array([0,0, 1,0, 0,1])
const vboDefault = createBuffer(context, {
  target: context.ARRAY_BUFFER,
  data: vertices
})

// Strict mode: throws an error if buffer cannot be created
const indices = new Uint16Array([0,1,2, 2,1,3])
const iboStrict = createBuffer(context, {
  target: context.ELEMENT_ARRAY_BUFFER,
  data: indices,
  strict: true
})

// Custom usage hint (dynamic draw)
const dynamicVertices = new Float32Array([0,0, 1,0, 0,1])
const vboDynamic = createBuffer(context, {
  target: context.ARRAY_BUFFER,
  data: dynamicVertices,
  usage: context.DYNAMIC_DRAW
})
```

#### createQuadBuffer
Creates a buffer for a full‑screen quad.

- `context` – WebGL rendering context
- `position` – Attribute location index for vertex positions
- `options` – Optional configuration
  - `strict` – Throw error if buffer cannot be created (default: false)

```ts
// Silent mode (default): returns null if buffer cannot be created
const vboDefault = createQuadBuffer(context, positionLocation)
context.drawArrays(context.TRIANGLE_STRIP, 0, 4)

// Strict mode: throws an error if buffer cannot be created
const vboStrict = createQuadBuffer(context, positionLocation, { strict: true })
context.drawArrays(context.TRIANGLE_STRIP, 0, 4)

// With index buffer
const vbo = createQuadBuffer(context, positionLocation)
const ibo = createQuadIndexBuffer(context)
context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
```


#### createQuadIndexBuffer
Creates an index buffer for a full‑screen quad.

- `context` – WebGL rendering context
- `options` – Optional configuration
  - `strict` – Throw error if buffer cannot be created (default: false)

```ts
// Silent mode (default): returns null if buffer cannot be created
const vbo = createQuadBuffer(context, positionLocation)
const iboDefault = createQuadIndexBuffer(context)
context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)

// Strict mode: throws an error if buffer cannot be created
const iboStrict = createQuadIndexBuffer(context, { strict: true })
context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0)
```


#### createTriangleBuffer
Creates a buffer for a full‑screen triangle.

- `context` – WebGL rendering context
- `position` – Attribute location index for vertex positions
- `options` – Optional configuration
  - `strict` – Throw error if buffer cannot be created (default: false)

```ts
// Silent mode (default): returns null if buffer cannot be created
const vboDefault = createTriangleBuffer(context, positionLocation)
context.drawArrays(context.TRIANGLES, 0, 3)

// Strict mode: throws an error if buffer cannot be created
const vboStrict = createTriangleBuffer(context, positionLocation, { strict: true })
context.drawArrays(context.TRIANGLES, 0, 3)
```


#### createTriangleIndexBuffer
Creates an index buffer for a full‑screen triangle.

- `context` – WebGL rendering context
- `options` – Optional configuration
  - `strict` – Throw error if buffer cannot be created (default: false)

```ts
// Silent mode (default): returns null if buffer cannot be created
const vbo = createTriangleBuffer(context, positionLocation)
const iboDefault = createTriangleIndexBuffer(context)
context.drawElements(context.TRIANGLES, 3, context.UNSIGNED_SHORT, 0)

// Strict mode: throws an error if buffer cannot be created
const iboStrict = createTriangleIndexBuffer(context, { strict: true })
context.drawElements(context.TRIANGLES, 3, context.UNSIGNED_SHORT, 0)
```


#### createCubeBuffer
Creates a buffer for a unit cube.

- `context` – WebGL rendering context
- `position` – Attribute location index for vertex positions
- `options` – Optional configuration
  - `strict` – Throw error if buffer cannot be created (default: false)

```ts
// Silent mode (default): returns null if buffer cannot be created
const vboDefault = createCubeBuffer(context, positionLocation)
const iboDefault = createCubeIndexBuffer(context)
context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)

// Strict mode: throws an error if buffer cannot be created
const vboStrict = createCubeBuffer(context, positionLocation, { strict: true })
const iboStrict = createCubeIndexBuffer(context, { strict: true })
context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
```


#### createCubeIndexBuffer
Creates an index buffer for a cube.

- `context` – WebGL rendering context
- `options` – Optional configuration
  - `strict` – Throw error if buffer cannot be created (default: false)

```ts
// Silent mode (default): returns null if buffer cannot be created
const vboDefault = createCubeBuffer(context, positionLocation)
const iboDefault = createCubeIndexBuffer(context)
context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)

// Strict mode: throws an error if buffer cannot be created
const vboStrict = createCubeBuffer(context, positionLocation, { strict: true })
const iboStrict = createCubeIndexBuffer(context, { strict: true })
context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
```



#### updateBuffer
Updates an existing WebGL buffer with new data.

- `context` – WebGL rendering context
- `buffer` – Existing buffer to update
- `options` – Buffer configuration
  - `target` – Buffer target (`ARRAY_BUFFER` or `ELEMENT_ARRAY_BUFFER`)
  - `data` – New typed array data to upload
  - `usage` – Buffer usage hint (default: `STATIC_DRAW`)
  - `strict` – Throw error if buffer binding fails (default: false)

```ts
// Replace the entire buffer with new vertices
const newVertices = new Float32Array([0,0, 1,0, 1,1])
updateBuffer(context, vbo, {
  target: context.ARRAY_BUFFER,
  data: newVertices
})

// Resize the buffer with more vertices (old data discarded)
const largerVertices = new Float32Array([0,0, 1,0, 1,1, 0,1])
updateBuffer(context, vbo, {
  target: context.ARRAY_BUFFER,
  data: largerVertices,
  usage: context.DYNAMIC_DRAW
})

// Strict mode: throws an error if buffer binding fails
updateBuffer(context, vbo, {
  target: context.ARRAY_BUFFER,
  data: newVertices,
  strict: true
})
```


#### updateBufferPartial
Partially updates an existing WebGL buffer with new data.

- `context` – WebGL rendering context
- `buffer` – Existing buffer to update
- `options` – Buffer configuration
  - `target` – Buffer target (`ARRAY_BUFFER` or `ELEMENT_ARRAY_BUFFER`)
  - `data` – Typed array containing new data
  - `offset` – Byte offset in the buffer where data should be written (default: 0)
  - `strict` – Throw error if buffer binding fails (default: false)

```ts
// Replace only the first vertex (two floats) in the buffer
const newVertex = new Float32Array([0.5, 0.5])
updateBufferPartial(context, vbo, {
  target: context.ARRAY_BUFFER,
  data: newVertex,
  offset: 0
})

// Replace the 3rd vertex (offset = 2 * 4 bytes = 8)
const anotherVertex = new Float32Array([1.0, 1.0])
updateBufferPartial(context, vbo, {
  target: context.ARRAY_BUFFER,
  data: anotherVertex,
  offset: 8,
  strict: true
})
```


#### deleteBuffer
Deletes a WebGL buffer and frees GPU memory.

- `context` – WebGL rendering context
- `buffer` – Buffer object to delete
- `options` – Optional configuration
  - `strict` – Throw error if buffer deletion fails (default: false)

```ts
// Silent mode (default): ignores if buffer is null
deleteBuffer(context, vbo)

// Strict mode: throws an error if buffer is null or deletion fails
deleteBuffer(context, vbo, { strict: true })

// Delete both vertex and index buffers when cleaning up
deleteBuffer(context, vbo)
deleteBuffer(context, ibo)
```
