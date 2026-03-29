## WebGL

## Attributes

By centralizing validation and using a consistent options‑object pattern, it reduces boilerplate,
eliminates code duplication, and ensures a clean, predictable API for enabling, disabling,
binding, and validating attributes.

### API

#### validateAttribute
Checks whether an attribute exists in the shader program and returns its location.

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

```ts
// Silent mode (default): does nothing if attribute is missing
enableAttribute(context, program, { name: "aPosition" })

// Strict mode: throws an error if attribute is missing
enableAttribute(context, program, { name: "aPosition", strict: true })
```

#### disableAttribute
Disables a vertex attribute in the shader program.

```ts
// Silent mode (default): does nothing if attribute is missing
disableAttribute(context, program, { name: "aTexCoord" })

// Strict mode: throws an error if attribute is missing
disableAttribute(context, program, { name: "aTexCoord", strict: true })
```

#### bindAttribute
Binds a vertex attribute to the currently bound buffer and defines how data is read.

```ts
// Strict mode (default): does nothing if attribute is missing
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
