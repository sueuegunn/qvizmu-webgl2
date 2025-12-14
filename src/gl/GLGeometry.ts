import type { Identifiable } from "../identity/Identifiable";
import { IdGenerator } from "../identity/IdGenerator";
import type { AttributeType } from "../object/Geometry";
import { GLAttribute } from "./geometry/GLAttribute";
import { GLBuffer } from "./geometry/GLBuffer";
import { GLIndexBuffer } from "./geometry/GLIndexBuffer";
import { AbstractGLDisposable } from "./GLDisposable";
import { GLResourceManager } from "./resource/GLResourceManager";

class GLGeometry extends AbstractGLDisposable implements Identifiable {
  readonly vertexBuffer: GLBuffer;
  readonly indexBuffer: GLIndexBuffer;

  // Identifiable
  readonly id: number;
  readonly tag: string;

  private constructor(
    vertexBuffer: GLBuffer,
    indexBuffer: GLIndexBuffer,
    id: number,
    tag: string
  ) {
    super();
    this.vertexBuffer = vertexBuffer;
    this.indexBuffer = indexBuffer;
    this.id = id;
    this.tag = tag;
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

    const id = IdGenerator.next();
    const tag = `GLGeometry:${id}`;

    const glGeometry = new GLGeometry(vertexBuffer, indexBuffer, id, tag);
    GLResourceManager.add(gl, glGeometry)

    return glGeometry;
  }

  bind(gl: WebGL2RenderingContext): void {
    this.vertexBuffer.bind(gl);
    this.indexBuffer.bind(gl);
  }

  onDispose(gl: WebGL2RenderingContext): void {
    const {vertexBuffer, indexBuffer} = this;
    vertexBuffer.dispose(gl);
    indexBuffer.dispose(gl);
  }
}

export {GLGeometry};
