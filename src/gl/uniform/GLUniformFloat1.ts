import { Vector1 } from "mathue";
import type { GLDisposable } from "../GLDisposable";
import { GLUniformLocation } from "./GLUniformLocation";
import { GLResourceManager } from "../resource/GLResourceManager";
import type { GLUniform } from "./GLUniform";

class GLUniformFloat1 extends Vector1 implements GLUniform, GLDisposable {

  // GLDisposable
  private _isDisposed: boolean = false;

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  private set isDisposed(value: boolean) {
    this._isDisposed = value;
  }

  readonly glUniform: GLUniformLocation;

  private constructor(glUniform: GLUniformLocation, x: number) {
    super(x);
    this.glUniform = glUniform;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    x: number
  ): GLUniformFloat1 | null {
    const glUniform = GLUniformLocation.create(gl, program, name);
    if (!glUniform) {
      console.warn(`[qvizmu] could not create GLUniformLocation name='${name}'`);
      return null;
    }

    const glUniformFloat1 = new GLUniformFloat1(glUniform, x);
    GLResourceManager.add(gl, glUniformFloat1);

    return glUniformFloat1;
  }

  static createFromVector(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    vector: Vector1
  ): GLUniformFloat1 | null {
    const {x} = vector;
    return GLUniformFloat1.create(gl, program, name, x);
  }

  copyVector(vector: Vector1): void {
    this.x = vector.x;
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {glUniform, x} = this;
    const {location} = glUniform;
    gl.uniform1f(location, x);
  }

  dispose(_gl: WebGL2RenderingContext): void {
    // WebGLUniformLocation objects do not require explicit disposal
    this.isDisposed = true;
  }
}

export {GLUniformFloat1};
