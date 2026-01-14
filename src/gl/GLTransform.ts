import { Matrix4 } from "mathue";
import { GLUniformMatrix4 } from "./uniform/GLUniformMatrix4";

class GLTransform {
  readonly modelUniform: GLUniformMatrix4;

  private constructor(modelUniform: GLUniformMatrix4) {
    this.modelUniform = modelUniform;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): GLTransform | null {
    const matrix = Matrix4.identity();
    const modelUniform = GLUniformMatrix4.create(gl, program, 'model', matrix);
    if (!modelUniform) {
      console.error('[qvizmu] GLTransform.create() could not create GLUniformMatrix4');
      return null;
    }

    return new GLTransform(modelUniform);
  }
}

export {GLTransform};
