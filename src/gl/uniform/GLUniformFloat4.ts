import type { Vector4 } from "mathue";
import type { GLUniform } from "./GLUniform";
import { GLUniformLocation } from "./GLUniformLocation";
import type { Color } from "../../value/Color";

class GLUniformFloat4 implements GLUniform {
  readonly glUniform: GLUniformLocation;
  private _x: number;
  private _y: number;
  private _z: number;
  private _w: number;

  private constructor(
    glUniform: GLUniformLocation,
    x: number,
    y: number,
    z: number,
    w: number
  ) {
    this.glUniform = glUniform;
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
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
      console.warn(`[sorb] could not create GLUniformLocation name='${name}'`);
      return null;
    }

    return new GLUniformFloat4(glUniform, x, y, z, w);
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

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get z(): number {
    return this._z;
  }

  set z(value: number) {
    this._z = value;
  }

  get w(): number {
    return this._w;
  }

  set w(value: number) {
    this._w = value;
  }

  setVector(vector: Vector4): void {
    const {x, y, z, w} = vector;
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  setColor(color: Color): void {
    const {r, g, b, a} = color;
    this._x = r;
    this._y = g;
    this._z = b;
    this._w = a;
  }

  uniform(gl: WebGL2RenderingContext): void {
    const {glUniform, x, y, z, w} = this;
    const {location} = glUniform;
    gl.uniform4f(location, x, y, z, w);
  }
}

export {GLUniformFloat4};
