import { Vector2, Vector3, type Dimension, type Vector1, type Vector4 } from "mathue";
import { GLGeometry } from "../gl/GLGeometry";
import { range, sumMap } from "mathue/src/function";
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

// TupleOf<Ele, 2> -> [Ele, Ele] 
type TupleOf<Ele, Len extends number, Tup extends Ele[] = []> =
  Tup['length'] extends Len ? Tup : TupleOf<Ele, Len, [...Tup, Ele]>;

const calculateVertexSize = <Attrs extends AttributeType[]>(vertex: VertexOf<Attrs>): number => {
  return sumMap(Object.values(vertex), v => (v as AttributeValue).dimension); // as...
};

type GeometryFace = [number, number, number];

const buildGeometryByPattern = <
  Attrs extends AttributeType[],
  NumVert extends number,
  NumFace extends number,
>
(
  attributes: Attrs,
  patternCount: number,
  verticesPerPattern: NumVert,
  facesPerPattern: NumFace,
  buildVertexTuplePerPattern: (patternIndex: number) => TupleOf<VertexOf<Attrs>, NumVert>,
  buildFacesPerPattern: (patternIndex: number) => TupleOf<GeometryFace, NumFace>,
): Geometry<Attrs> | null => {
  if (verticesPerPattern <= 0 || facesPerPattern <= 0) {
    return null;
  }

  const firstVertexTuple = buildVertexTuplePerPattern(0) as Array<VertexOf<Attrs>>; // as...
  const vertexSize = calculateVertexSize(firstVertexTuple[0]);
  const vertices = new Float32Array(patternCount * verticesPerPattern * vertexSize);
  for (const patternIndex of range(patternCount)) {
    const vertexTuple = patternIndex === 0
      ? firstVertexTuple
      : buildVertexTuplePerPattern(patternIndex) as Array<VertexOf<Attrs>>; // as...
    const baseIndex = patternIndex * verticesPerPattern * vertexSize;
    vertexTuple.forEach((vertex, vertexIndex) => {
      let index = baseIndex + vertexIndex * vertexSize;
      for (const value of Object.values(vertex)) {
        for (const element of (value as AttributeValue).elements) {
          vertices[index] = element;
          index++;
        }
      }
    });
  }

  const indices = new Uint16Array(patternCount * facesPerPattern * 3);
  for (const patternIndex of range(patternCount)) {
    const faces = buildFacesPerPattern(patternIndex) as GeometryFace[];
    const baseIndex = patternIndex * facesPerPattern * 3;
    faces.forEach((face, faceIndex) => {
      let index = baseIndex + faceIndex * 3;
      for (const i of range(3)) {
        indices[index + i] = face[i];
      }
    });
  }

  return new Geometry(vertices, indices, attributes);
};

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

  private getVertexSize(vertex: VertexOf<Attrs>): number {
    if (this._vertexSize !== undefined) {
      return this._vertexSize;
    }

    this._vertexSize = calculateVertexSize(vertex);
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

export {Geometry, buildGeometryByPattern};
export type {Attribute, AttributeType, VertexOf, ShaderAttributeInputs, GeometryFace, TupleOf};
