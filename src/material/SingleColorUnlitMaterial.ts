import { GLUniformFloat4 } from "../gl/uniform/GLUniformFloat4";
import type { Color } from "../value/Color";
import { AbstractMaterial } from "./AbstractMaterial";

const NAME = 'SingleColorUnlitMaterial';

type UniformMap = {
  color: GLUniformFloat4;
};

class SingleColorUnlitMaterial extends AbstractMaterial<UniformMap> {
  readonly color: Color;

  constructor(color: Color) {
    super(NAME);
    this.color = color;
  }

  createUniformMap(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): UniformMap | null {
    const color = GLUniformFloat4.createFromColor(gl, program, 'color', this.color);
    if (!color) {
      console.warn(`[qvizmu] ${NAME}.createUniformMap() could not create GLUniform`);
      return null;
    }

    return {color};
  }

  updateUniformMap(): void {
    // TODO: update
  }
}

export {SingleColorUnlitMaterial};
