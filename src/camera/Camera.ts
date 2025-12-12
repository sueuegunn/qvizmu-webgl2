import type { Matrix4, Vector2 } from "mathue";

interface Camera {
  clientSize: Vector2;
  view: Matrix4;
  projection: Matrix4;
  updateMatrix(): void;
}

export type {Camera};
