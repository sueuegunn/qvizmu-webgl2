import type { Matrix4 } from "mathue";
import type { GLCamera } from "./GLCamera";

class GLCameraEmpty implements GLCamera {
  constructor() {}

  update(_view: Matrix4, _projection: Matrix4): void {}

  uniform(_gl: WebGL2RenderingContext): void {}
}

export {GLCameraEmpty};
