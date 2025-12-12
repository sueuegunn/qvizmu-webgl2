import vertexShaderSource from './shader-vertex.glsl?raw';
import fragmentShaderSource from './shader-fragment.glsl?raw';

import type { SingleColorUnlitMaterial } from "../../material/SingleColorUnlitMaterial";
import { AbstractProgram } from "../AbstractProgram";
import type { GLCamera } from "../../gl/camera/GLCamera";
import { GLCameraSeparate } from "../../gl/camera/GLCameraSeparate";
import type { Object3D } from "../../object/Object3D";
import type { Attribute } from '../../object/Geometry';

const NAME = 'SingleColorUnlitProgram';

type SingleColorUnlitAttributes = [
  Attribute<'position', 3>,
];

class SingleColorUnlitProgram extends AbstractProgram<SingleColorUnlitMaterial, SingleColorUnlitAttributes> {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, NAME);
  }

  createCamera(gl: WebGL2RenderingContext, program: WebGLProgram): GLCamera | null {
    return GLCameraSeparate.create(gl, program);
  }

  glSettings(gl: WebGL2RenderingContext): void {
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
  }

  glDraw(gl: WebGL2RenderingContext, object3D: Object3D<SingleColorUnlitMaterial, SingleColorUnlitAttributes>): void {
    const {geometry} = object3D;
    const count = geometry.getIndicesLength();
    if (count <= 0) {
      return;
    }
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
  }
}

export {SingleColorUnlitProgram};
export type {SingleColorUnlitAttributes};
