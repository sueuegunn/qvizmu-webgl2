import { sumMap } from "mathue/src/function";
import type { GLAttribute } from "./GLAttribute";

const calculateStrideBytes = (stride: number, glAttributes: GLAttribute[]): number => {
  if (glAttributes.length === 1) {
    return 0;
  }
  return stride * Float32Array.BYTES_PER_ELEMENT;
};

class GLBuffer {
  readonly buffer: WebGLBuffer;
  readonly vertices: Float32Array;
  readonly stride: number;
  readonly glAttributes: GLAttribute[];

  private isApplyRequired: boolean;

  private constructor(
    buffer: WebGLBuffer,
    vertices: Float32Array,
    stride: number,
    glAttributes: GLAttribute[]
  ) {
    this.buffer = buffer;
    this.vertices = vertices;
    this.stride = stride;
    this.glAttributes = glAttributes;

    this.isApplyRequired = true;
  }

  static create(
    gl: WebGL2RenderingContext,
    vertices: Float32Array,
    glAttributes: GLAttribute[]
  ): GLBuffer | null {
    const buffer = gl.createBuffer();
    if (!buffer) {
      return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const stride = sumMap(glAttributes, (a) => a.size);
    const strideBytes = calculateStrideBytes(stride, glAttributes);
    for (const glAttribute of glAttributes) {
      const {location, size, offset, normalized} = glAttribute;
      const offsetBytes = offset * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, normalized, strideBytes, offsetBytes);
    }

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    return new GLBuffer(buffer, vertices, stride, glAttributes);
  }

  setValue(value: number, index: number): void {
    const {vertices} = this;
    if (index < 0 || index >= vertices.length) {
      return;
    }
    vertices[index] = value;
    this.isApplyRequired = true;
  }

  applyVertices(gl: WebGL2RenderingContext): void {
    const {buffer, vertices} = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  }

  bind(gl: WebGL2RenderingContext): void {
    const {buffer, stride, glAttributes, isApplyRequired} = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    if (isApplyRequired) {
      this.applyVertices(gl);
      this.isApplyRequired = false;
    }

    const strideBytes = calculateStrideBytes(stride, glAttributes);
    for (const glAttribute of glAttributes) {
      const {offset, location, size, normalized} = glAttribute;
      const offsetBytes = offset * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, normalized, strideBytes, offsetBytes);
    }
  }
}

export {GLBuffer};
