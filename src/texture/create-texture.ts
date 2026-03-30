export interface TextureOptions extends WebGLTexture {
  internalFormat?: number
  format?: number
  type?: number
  wrapS?: number
  wrapT?: number
  minFilter?: number
  magFilter?: number
  generateMipmap?: boolean
}

/**
 * Create and initialize a 2D texture
 *
 * **Parameters**
 * - `gl` – Target WebGL rendering context
 * - `image` – Source image (HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, HTMLCanvasElement, etc.)
 * - `options` – Optional texture configuration:
 *   - `internalFormat` – Internal format (default: `gl.RGBA`)
 *   - `format` – Format (default: `gl.RGBA`)
 *   - `type` – Data type (default: `gl.UNSIGNED_BYTE`)
 *   - `wrapS` – Horizontal wrapping mode (default: `gl.CLAMP_TO_EDGE`)
 *   - `wrapT` – Vertical wrapping mode (default: `gl.CLAMP_TO_EDGE`)
 *   - `minFilter` – Minification filter (default: `gl.LINEAR`)
 *   - `magFilter` – Magnification filter (default: `gl.LINEAR`)
 *   - `generateMipmap` – Whether to generate mipmaps (default: `false`)
 *
 * **Usage**
 * ```ts
 * // Fragment shader example:
 * // uniform sampler2D uTexture;
 *
 * // Load an image and create a texture with default parameters
 * const texture = createTexture2D(gl, image)
 *
 * // Or customize parameters (e.g. repeat wrapping and mipmaps)
 * const texture = createTexture2D(gl, image, {
 *   wrapS: gl.REPEAT,
 *   wrapT: gl.REPEAT,
 *   minFilter: gl.LINEAR_MIPMAP_LINEAR,
 *   generateMipmap: true
 * })
 *
 * // Bind texture to unit 0 and assign sampler
 * gl.activeTexture(gl.TEXTURE0)
 * gl.bindTexture(gl.TEXTURE_2D, texture)
 * setUniformSampler(gl, program, "uTexture", 0)
 * ```
 */
export function createTexture2D(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  image: TexImageSource,
  options: TextureOptions = {}
): WebGLTexture {
  const {
    internalFormat = gl.RGBA,
    format = gl.RGBA,
    type = gl.UNSIGNED_BYTE,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    minFilter = gl.LINEAR,
    magFilter = gl.LINEAR,
    generateMipmap = false
  } = options

  const texture = gl.createTexture()
  if (!texture) throw new Error("Failed to create texture")

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, image)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter)

  if (generateMipmap) {
    gl.generateMipmap(gl.TEXTURE_2D)
  }

  gl.bindTexture(gl.TEXTURE_2D, null)
  return texture
}
