import type { GLUniform } from "./GLUniform";
import { GLUniformLocation } from "./GLUniformLocation";

class GLUniformInt1 implements GLUniform {
  readonly glUniform: GLUniformLocation;
  private _value: number;

  private constructor(
    glUniform: GLUniformLocation,
    value: number
  ) {
    this.glUniform = glUniform;
    this._value = value;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    value: number
  ): GLUniformInt1 | null {
    const glUniform = GLUniformLocation.create(gl, program, name);
    if (!glUniform) {
      console.warn(`[sorb] could not create GLUniformLocation name='${name}'`);
      return null;
    }

    return new GLUniformInt1(glUniform, value);
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {location} = this.glUniform;
    gl.uniform1i(location, this._value);
  }
}

export {GLUniformInt1};
