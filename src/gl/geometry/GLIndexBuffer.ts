import { AbstractGLDisposable } from "../GLDisposable";
import { GLResourceManager } from "../resource/GLResourceManager";

class GLIndexBuffer extends AbstractGLDisposable {
  readonly buffer: WebGLBuffer;
  readonly indices: Uint16Array;

  private constructor(buffer: WebGLBuffer, indices: Uint16Array) {
    super();
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

    const glIndexBuffer = new GLIndexBuffer(buffer, indices);
    GLResourceManager.add(gl, glIndexBuffer);

    return glIndexBuffer;
  }

  bind(gl: WebGL2RenderingContext): void {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  onDispose(gl: WebGL2RenderingContext): void {
    const {buffer} = this;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.deleteBuffer(buffer);
  }
}

export {GLIndexBuffer};
