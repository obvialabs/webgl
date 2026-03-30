/**
 * Set texture parameters (wrapping and filtering)
 *
 * **Parameters**
 * - `gl` – Target WebGL rendering context
 * - `target` – Texture target (e.g. `gl.TEXTURE_2D`)
 * - `wrapS` – Horizontal wrapping mode (default: `gl.CLAMP_TO_EDGE`)
 * - `wrapT` – Vertical wrapping mode (default: `gl.CLAMP_TO_EDGE`)
 * - `minFilter` – Minification filter (default: `gl.LINEAR`)
 * - `magFilter` – Magnification filter (default: `gl.LINEAR`)
 *
 * **Usage**
 * ```ts
 * gl.bindTexture(gl.TEXTURE_2D, texture)
 * setTextureParameters(gl, gl.TEXTURE_2D, gl.REPEAT, gl.REPEAT, gl.NEAREST, gl.NEAREST)
 * ```
 */
export function setTextureParameters(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  target: number,
  wrapS: number = gl.CLAMP_TO_EDGE,
  wrapT: number = gl.CLAMP_TO_EDGE,
  minFilter: number = gl.LINEAR,
  magFilter: number = gl.LINEAR
): void {
  gl.texParameteri(target, gl.TEXTURE_WRAP_S, wrapS)
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, wrapT)
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, minFilter)
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, magFilter)
}
