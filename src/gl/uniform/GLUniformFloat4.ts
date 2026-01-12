import { Vector4 } from "mathue";
import type { GLUniform } from "./GLUniform";
import { GLUniformLocation } from "./GLUniformLocation";
import type { Color } from "../../value/Color";
import type { GLDisposable } from "../GLDisposable";
import { GLResourceManager } from "../resource/GLResourceManager";

class GLUniformFloat4 extends Vector4 implements GLUniform, GLDisposable {

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
    z: number,
    w: number
  ) {
    super(x, y, z, w);
    this.glUniform = glUniform;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    x: number,
    y: number,
    z: number,
    w: number
  ): GLUniformFloat4 | null {
    const glUniform = GLUniformLocation.create(gl, program, name);
    if (!glUniform) {
      console.warn(`[quvysm] could not create GLUniformLocation name='${name}'`);
      return null;
    }

    const glUniformFloat4 = new GLUniformFloat4(glUniform, x, y, z, w);
    GLResourceManager.add(gl, glUniformFloat4);

    return glUniformFloat4;
  }

  static createFromVector(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    vector: Vector4
  ): GLUniformFloat4 | null {
    const {x, y, z, w} = vector;
    return GLUniformFloat4.create(gl, program, name, x, y, z, w);
  }

  static createFromColor(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    color: Color
  ): GLUniformFloat4 | null {
    const {r, g, b, a} = color;
    return GLUniformFloat4.create(gl, program, name, r, g, b, a);
  }

  setVector(vector: Vector4): void {
    const {x, y, z, w} = vector;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  setColor(color: Color): void {
    const {r, g, b, a} = color;
    this.x = r;
    this.y = g;
    this.z = b;
    this.w = a;
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {glUniform, x, y, z, w} = this;
    const {location} = glUniform;
    gl.uniform4f(location, x, y, z, w);
  }

  dispose(_gl: WebGL2RenderingContext): void {
    // WebGLUniformLocation objects do not require explicit disposal
    this.isDisposed = true;
  }
}

export {GLUniformFloat4};
