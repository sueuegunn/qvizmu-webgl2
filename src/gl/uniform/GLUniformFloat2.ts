import { Vector2 } from "mathue";
import type { GLUniform } from "./GLUniform";
import { GLUniformLocation } from "./GLUniformLocation";
import type { GLDisposable } from "../GLDisposable";
import { GLResourceManager } from "../resource/GLResourceManager";

class GLUniformFloat2 extends Vector2 implements GLUniform, GLDisposable {

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
    x: number,
    y: number
  ) {
    super(x, y);
    this.glUniform = glUniform;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    x: number,
    y: number
  ): GLUniformFloat2 | null {
    const glUniform = GLUniformLocation.create(gl, program, name);
    if (!glUniform) {
      console.warn(`[qvizmu] could not create GLUniformLocation name='${name}'`);
      return null;
    }

    const glUniformFloat2 = new GLUniformFloat2(glUniform, x, y);
    GLResourceManager.add(gl, glUniformFloat2);

    return glUniformFloat2;
  }

  static createFromVector(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    vector: Vector2
  ): GLUniformFloat2 | null {
    const {x, y} = vector;
    return GLUniformFloat2.create(gl, program, name, x, y);
  }

  copyVector(vector: Vector2): void {
    const {x, y} = vector;
    this.x = x;
    this.y = y;
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {glUniform, x, y} = this;
    const {location} = glUniform;
    gl.uniform2f(location, x, y);
  }

  dispose(_gl: WebGL2RenderingContext): void {
    // WebGLUniformLocation objects do not require explicit disposal
    this.isDisposed = true;
  }
}

export {GLUniformFloat2};
