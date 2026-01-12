import vertexShaderSource from './shader-vertex.glsl?raw';
import fragmentShaderSource from './shader-fragment.glsl?raw';

import type { EmptyMaterial } from "../../material/EmptyMaterial";
import type { Attribute, VertexOf } from "../../object/Geometry";
import { AbstractProgram } from "../AbstractProgram";
import type { GLCamera } from '../../gl/camera/GLCamera';
import { GLCameraSeparate } from '../../gl/camera/GLCameraSeparate';
import type { Object3D } from '../../object/Object3D';

const NAME = 'VertexColorUnlitProgram';

type VertexColorUnlitAttributes = [
  Attribute<'a_position', 3>,
  Attribute<'a_color', 4>
];

type VertexColorUnlitVertex = VertexOf<VertexColorUnlitAttributes>;

class VertexColorUnlitProgram extends AbstractProgram<EmptyMaterial, VertexColorUnlitAttributes> {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, NAME);
  }

  createCamera(gl: WebGL2RenderingContext, program: WebGLProgram): GLCamera | null {
    return GLCameraSeparate.create(gl, program);
  }

  glSettings(gl: WebGL2RenderingContext): void {
    gl.disable(gl.CULL_FACE);
  }

  glDraw(gl: WebGL2RenderingContext, object3D: Object3D<EmptyMaterial, VertexColorUnlitAttributes>): void {
    const {geometry} = object3D;
    const count = geometry.getIndicesLength();
    if (count <= 0) {
      return;
    }
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
  }
}

export {VertexColorUnlitProgram};
export type {VertexColorUnlitAttributes, VertexColorUnlitVertex};
