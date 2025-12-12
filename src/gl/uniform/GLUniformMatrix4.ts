import type { GLUniform } from "./GLUniform";
import { GLUniformLocation } from "./GLUniformLocation";
import { Matrix4 } from 'mathue';

class GLUniformMatrix4 extends Matrix4 implements GLUniform {
  readonly glUniformLocation: GLUniformLocation;

  private constructor(
    glUniformLocation: GLUniformLocation,
    matrix: Matrix4
  ) {
    super();
    this.set(matrix);

    this.glUniformLocation = glUniformLocation;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    matrix: Matrix4
  ): GLUniformMatrix4 | null {
    const glUniformLocation = GLUniformLocation.create(gl, program, name);
    if (!glUniformLocation) {
      return null;
    }

    return new GLUniformMatrix4(glUniformLocation, matrix);
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {location} = this.glUniformLocation;
    gl.uniformMatrix4fv(location, false, this);
  }
}

export {GLUniformMatrix4};
