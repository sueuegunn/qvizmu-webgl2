import type { GLDisposable } from "../GLDisposable";
import { GLResourceManager } from "../resource/GLResourceManager";
import type { GLUniform } from "./GLUniform";
import { GLUniformLocation } from "./GLUniformLocation";
import { Matrix4 } from 'mathue';

class GLUniformMatrix4 extends Matrix4 implements GLUniform, GLDisposable {

  // GLDisposable
  private _isDisposed: boolean = false;
  
  get isDisposed(): boolean {
    return this._isDisposed;
  }
  
  private set isDisposed(value: boolean) {
    this._isDisposed = value;
  }

  readonly glUniformLocation: GLUniformLocation;

  private constructor(
    glUniformLocation: GLUniformLocation,
    matrix: Matrix4
  ) {
    const [e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33] = matrix.elements;
    super(e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33);
    this.copy(matrix);
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

    const glUniformMatrix4 = new GLUniformMatrix4(glUniformLocation, matrix);
    GLResourceManager.add(gl, glUniformMatrix4);

    return glUniformMatrix4;
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {location} = this.glUniformLocation;
    gl.uniformMatrix4fv(location, false, this.elements);
  }

  dispose(_gl: WebGL2RenderingContext): void {
    // WebGLUniformLocation objects do not require explicit disposal
    this.isDisposed = true;
  }
}

export {GLUniformMatrix4};
