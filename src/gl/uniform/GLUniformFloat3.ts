import { Vector3 } from "mathue";
import type { GLUniform } from "./GLUniform";
import { GLUniformLocation } from "./GLUniformLocation";
import type { GLDisposable } from "../GLDisposable";
import { GLResourceManager } from "../resource/GLResourceManager";

class GLUniformFloat3 extends Vector3 implements GLUniform, GLDisposable {

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
    y: number,
    z: number
  ) {
    super(x, y, z);
    this.glUniform = glUniform;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    x: number,
    y: number,
    z: number
  ): GLUniformFloat3 | null {
    const glUniform = GLUniformLocation.create(gl, program, name);
    if (!glUniform) {
      console.warn(`[qvizmu] could not create GLUniformLocation name='${name}'`);
      return null;
    }

    const glUniformFloat4 = new GLUniformFloat3(glUniform, x, y, z);
    GLResourceManager.add(gl, glUniformFloat4);

    return glUniformFloat4;
  }

  static createFromVector(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    vector: Vector3
  ): GLUniformFloat3 | null {
    const {x, y, z} = vector;
    return GLUniformFloat3.create(gl, program, name, x, y, z);
  }

  copyVector(vector: Vector3): void {
    const {x, y, z} = vector;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {glUniform, x, y, z} = this;
    const {location} = glUniform;
    gl.uniform3f(location, x, y, z);
  }

  dispose(_gl: WebGL2RenderingContext): void {
    // WebGLUniformLocation objects do not require explicit disposal
    this.isDisposed = true;
  }
}

export {GLUniformFloat3};
