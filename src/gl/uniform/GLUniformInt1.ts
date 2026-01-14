import { Vector1 } from "mathue";
import type { GLUniform } from "./GLUniform";
import { GLUniformLocation } from "./GLUniformLocation";
import type { GLDisposable } from "../GLDisposable";
import { GLResourceManager } from "../resource/GLResourceManager";

class GLUniformInt1 extends Vector1 implements GLUniform, GLDisposable {

  // GLDisposable
  private _isDisposed: boolean = false;
  
  get isDisposed(): boolean {
    return this._isDisposed;
  }
  
  private set isDisposed(value: boolean) {
    this._isDisposed = value;
  }

  readonly glUniform: GLUniformLocation;

  private constructor(
    glUniform: GLUniformLocation,
    value: number
  ) {
    super(value);
    this.glUniform = glUniform;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    value: number
  ): GLUniformInt1 | null {
    const glUniform = GLUniformLocation.create(gl, program, name);
    if (!glUniform) {
      console.warn(`[qvizmu] could not create GLUniformLocation name='${name}'`);
      return null;
    }

    const glUniformInt1 = new GLUniformInt1(glUniform, value);
    GLResourceManager.add(gl, glUniformInt1);

    return glUniformInt1;
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {location} = this.glUniform;
    gl.uniform1i(location, this.x);
  }

  dispose(_gl: WebGL2RenderingContext): void {
    // WebGLUniformLocation objects do not require explicit disposal
    this.isDisposed = true;
  }
}

export {GLUniformInt1};
