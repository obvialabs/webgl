# WebGL

## Canvas

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

By centralizing validation and using a consistent options‑object pattern, it reduces boilerplate,
eliminates code duplication, and ensures a clean, predictable API for enabling, disabling,
binding, and validating attributes.

### API

#### bindAttribute
Binds a vertex attribute to the currently bound buffer and defines how data is read.

- `context` – WebGL rendering context
- `program` – Linked shader program
- `options` – Attribute binding configuration
  - `name` – Attribute name in the shader
  - `size` – Number of components per attribute (e.g. 2 for vec2, 3 for vec3)
  - `type` – Data type of each component (e.g. context.FLOAT)
  - `stride` – Byte offset between consecutive attributes (default: 0)
  - `offset` – Byte offset of the first component (default: 0)
  - `strict` – Throw error if attribute is not found (default: false)

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
```

#### disableAttribute
Disables a vertex attribute in the shader program.

- `context` – WebGL rendering context
- `program` – Linked shader program
- `options` – Attribute disabling configuration
  - `name` – Attribute name in the shader
  - `strict` – Throw error if attribute is not found (default: false)

```ts
// Silent mode (default): does nothing if attribute is missing
disableAttribute(context, program, { name: "aTexCoord" })

// Strict mode: throws an error if attribute is missing
disableAttribute(context, program, { name: "aTexCoord", strict: true })
```

#### enableAttribute
Enables a vertex attribute in the shader program.

- `context` – WebGL rendering context
- `program` – Linked shader program
- `options` – Attribute enabling configuration
  - `name` – Attribute name in the shader
  - `strict` – Throw error if attribute is not found (default: false)

```ts
// Silent mode (default): does nothing if attribute is missing
enableAttribute(context, program, { name: "aPosition" })

// Strict mode: throws an error if attribute is missing
enableAttribute(context, program, { name: "aPosition", strict: true })
```

#### validateAttribute
Checks whether an attribute exists in the shader program and returns its location

- `context` – WebGL rendering context
- `program` – Linked shader program
- `options` – Validation configuration
  - `name` – Attribute name in the shader
  - `strict` – Throw error if attribute is not found (default: false)

```ts
// Silent mode (default): returns -1 if attribute is missing, no error thrown
const location = validateAttribute(context, program, { name: "aPosition" })
if (location !== -1) {
  context.enableVertexAttribArray(location)
}

// Strict mode: throws an error if attribute is missing
const locationStrict = validateAttribute(context, program, { name: "aPosition", strict: true })
```
