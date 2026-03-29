# WebGL

## Attributes

By centralizing validation and using a consistent options‑object pattern, it reduces boilerplate,
eliminates code duplication, and ensures a clean, predictable API for enabling, disabling,
binding, and validating attributes.

### API

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
