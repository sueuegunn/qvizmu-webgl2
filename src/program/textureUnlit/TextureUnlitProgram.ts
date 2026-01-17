import vertexShaderSource from './shader-vertex.glsl?raw';
import fragmentShaderSource from './shader-fragment.glsl?raw';

import type { Attribute, VertexOf } from '../../object/Geometry';
import { AbstractProgram } from '../AbstractProgram';
import type { TextureUnlitMaterial } from '../../material/TextureUnlitMaterial';
import { GLCameraSeparate } from '../../gl/camera/GLCameraSeparate';
import type { Object3D } from '../../object/Object3D';

const NAME = 'TextureUnlitProgram';

type TextureUnlitAttributes = [
  Attribute<'a_position', 3>,
  Attribute<'a_uv', 2>
];

type TextureUnlitVertex = VertexOf<TextureUnlitAttributes>;

class TextureUnlitProgram extends AbstractProgram<TextureUnlitMaterial, TextureUnlitAttributes> {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, NAME);
  }

  createCamera(gl: WebGL2RenderingContext, program: WebGLProgram): GLCameraSeparate | null {
    return GLCameraSeparate.create(gl, program);
  }

  glSettings(gl: WebGL2RenderingContext): void {
    gl.disable(gl.CULL_FACE);
  }

  glDraw(gl: WebGL2RenderingContext, object3D: Object3D<TextureUnlitMaterial, TextureUnlitAttributes>): void {
    const {geometry} = object3D;
    const count = geometry.getIndicesLength();
    if (count <= 0) {
      return;
    }
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
  }
}

export {TextureUnlitProgram};
export type {TextureUnlitAttributes, TextureUnlitVertex};
