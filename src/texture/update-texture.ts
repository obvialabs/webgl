/**
 * Update an existing texture with new image data
 *
 * **Parameters**
 * - `gl` – Target WebGL rendering context
 * - `texture` – Existing WebGLTexture
 * - `image` – New source image
 *
 * **Usage**
 * ```ts
 * updateTexture(gl, texture, videoElement)
 * ```
 */
export function updateTexture(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  texture: WebGLTexture,
  image: TexImageSource
): void {
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.bindTexture(gl.TEXTURE_2D, null)
}
