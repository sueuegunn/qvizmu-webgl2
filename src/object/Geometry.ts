import { Vector2, Vector3, type Dimension, type Vector1, type Vector4 } from "mathue";
import { GLGeometry } from "../gl/GLGeometry";
import { sumMap } from "mathue/src/function";
import { AbstractGLDisposable } from "../gl/GLDisposable";

type Attribute<Name extends string, Dim extends Dimension, Norm extends boolean = false> = {
  name: Name;
  size: Dim;
  normalized: Norm;
};

type AttributeType = {
  name: string;
  size: Dimension;
  normalized?: boolean;
};

type AttributeValue = Vector1 | Vector2 | Vector3 | Vector4;

// 1 -> Vector1, 2 -> Vector2, ...
type AttributeValueOf<Dim extends Dimension> =
  Dim extends 1 ? Vector1 :
  Dim extends 2 ? Vector2 :
  Dim extends 3 ? Vector3 :
  Dim extends 4 ? Vector4 : never;

// -> {position: Vector3, ...}
type VertexOf<Attrs extends AttributeType[]> = {
  [Attr in Attrs[number] as Attr['name']]: AttributeValueOf<Attr['size']>;
};

// 1 -> float, 2 -> vec2, ...
type ShaderTypeOf<Dim extends Dimension> =
  Dim extends 1 ? 'float' :
  Dim extends 2 ? 'vec2' :
  Dim extends 3 ? 'vec3' :
  Dim extends 4 ? 'vec4' : never;

// -> "\n in vec3 position; ..."
type ShaderAttributeInputs<Attrs extends AttributeType[]> =
  Attrs extends [infer First extends AttributeType, ...infer Rest extends AttributeType[]] ?
  Rest['length'] extends 0 ? First : `\nin ${ShaderTypeOf<First['size']>} ${First['name']}` : '';

class Geometry<Attrs extends AttributeType[]> extends AbstractGLDisposable {
  readonly vertices: Float32Array;
  readonly indices: Uint16Array;
  readonly attributes: Attrs;

  private _vertexSize?: number;

  private glGeometry?: GLGeometry;

  constructor(
    vertices: Float32Array,
    indices: Uint16Array,
    attributes: Attrs
  ) {
    super();
    this.vertices = vertices;
    this.indices = indices;
    this.attributes = attributes;
  }

  getIndicesLength(): number {
    const {glGeometry} = this;
    if (glGeometry) {
      return glGeometry.indexBuffer.indices.length;
    }

    return this.indices.length;
  }

  setVerticesValue(value: number, index: number): void {
    const {glGeometry} = this;
    if (glGeometry) {
      glGeometry.vertexBuffer.setValue(value, index);
      return;
    }

    const {vertices} = this;
    if (index < 0 || index >= vertices.length) {
      return;
    }
    vertices[index] = value;
  }

  private calculateVertexSize(vertex: VertexOf<Attrs>): number {
    return sumMap(Object.values(vertex), v => (v as AttributeValue).dimension); // as...
  }

  private getVertexSize(vertex: VertexOf<Attrs>): number {
    if (this._vertexSize !== undefined) {
      return this._vertexSize;
    }

    this._vertexSize = this.calculateVertexSize(vertex);
    return this._vertexSize;
  }

  setVertex(vertex: VertexOf<Attrs>, index: number): void {
    const vertexSize = this.getVertexSize(vertex);
    const baseIndex = index * vertexSize;
    let elementIndex = 0;
    for (const value of Object.values(vertex)) {
      for (const element of (value as AttributeValue).elements) { // as...
        const index = baseIndex + elementIndex;
        this.setVerticesValue(element, index);
        elementIndex++;
      }
    }
  }

  isPrepared(): boolean {
    return this.glGeometry !== undefined;
  }

  prepare(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): void {
    if (this.isPrepared()) {
      return;
    }

    const {vertices, indices, attributes} = this;
    const glGeometry = GLGeometry.create(gl, program, vertices, indices, attributes);
    if (!glGeometry) {
      return;
    }

    this.glGeometry = glGeometry;
    
  }

  bind(gl: WebGL2RenderingContext): void {
    const {glGeometry} = this;
    if (!glGeometry) {
      return;
    }

    glGeometry.bind(gl);
  }

  onDispose(gl: WebGL2RenderingContext): void {
    if (!this.glGeometry) {
      return;
    }

    const {glGeometry} = this;
    glGeometry.dispose(gl);
    this.glGeometry = undefined;
  }
}

export {Geometry};
export type {Attribute, AttributeType, ShaderAttributeInputs};
