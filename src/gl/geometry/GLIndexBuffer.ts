class GLIndexBuffer {
  readonly buffer: WebGLBuffer;
  readonly indices: Uint16Array;

  private constructor(buffer: WebGLBuffer, indices: Uint16Array) {
    this.buffer = buffer;
    this.indices = indices;
  }

  static create(
    gl: WebGL2RenderingContext,
    indices: Uint16Array
  ): GLIndexBuffer | null {
    const buffer = gl.createBuffer();
    if (!buffer) {
      return null;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return new GLIndexBuffer(buffer, indices);
  }

  bind(gl: WebGL2RenderingContext): void {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }
}

export {GLIndexBuffer};
