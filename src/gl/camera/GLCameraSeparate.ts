import { Matrix4 } from "mathue";
import { GLUniformMatrix4 } from "../uniform/GLUniformMatrix4";
import type { GLCamera } from "./GLCamera";

class GLCameraSeparate implements GLCamera {
  private view: GLUniformMatrix4;
  private projection: GLUniformMatrix4;

  private constructor(
    view: GLUniformMatrix4,
    projection: GLUniformMatrix4
  ) {
    this.view = view;
    this.projection = projection;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): GLCameraSeparate | null {
    const view = GLUniformMatrix4.create(gl, program, 'view', Matrix4.identity());
    if (!view) {
      return null;
    }

    const projection = GLUniformMatrix4.create(gl, program, 'projection', Matrix4.identity());
    if (!projection) {
      return null;
    }

    return new GLCameraSeparate(view, projection);
  }

  update(view: Matrix4, projection: Matrix4): void {
    this.view.set(view);
    this.projection.set(projection);
  }

  uniform(gl: WebGL2RenderingContext): void {
    this.view.uniform(gl);
    this.projection.uniform(gl);
  }
}

export {GLCameraSeparate};
