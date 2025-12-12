import type { Matrix4 } from "mathue";

interface GLCamera {
  update(view: Matrix4, projection: Matrix4): void;
  uniform(gl: WebGL2RenderingContext): void;
}

export type {GLCamera};
