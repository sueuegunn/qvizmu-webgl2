import type { AttributeType } from "../object/Geometry";
import { GLAttribute } from "./geometry/GLAttribute";
import { GLBuffer } from "./geometry/GLBuffer";
import { GLIndexBuffer } from "./geometry/GLIndexBuffer";

class GLGeometry {
  readonly vertexBuffer: GLBuffer;
  readonly indexBuffer: GLIndexBuffer;

  private constructor(
    vertexBuffer: GLBuffer,
    indexBuffer: GLIndexBuffer
  ) {
    this.vertexBuffer = vertexBuffer;
    this.indexBuffer = indexBuffer;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    vertices: Float32Array,
    indices: Uint16Array,
    attributes: AttributeType[]
  ): GLGeometry | null {
    let offset = 0;
    const glAttributes: GLAttribute[] = [];
    for (const attribute of attributes) {
      const glAttribute = GLAttribute.create(gl, program, attribute, offset);
      if (!glAttribute) {
        return null;
      }
      glAttributes.push(glAttribute);
      offset += attribute.size;
    }

    const vertexBuffer = GLBuffer.create(gl, vertices, glAttributes);
    if (!vertexBuffer) {
      return null;
    }

    const indexBuffer = GLIndexBuffer.create(gl, indices);
    if (!indexBuffer) {
      return null;
    }

    return new GLGeometry(vertexBuffer, indexBuffer);
  }

  bind(gl: WebGL2RenderingContext): void {
    this.vertexBuffer.bind(gl);
    this.indexBuffer.bind(gl);
  }
}

export {GLGeometry};
