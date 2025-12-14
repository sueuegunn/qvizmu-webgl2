import type { Matrix4, Vector2 } from "mathue";
import type { Identifiable } from "../identity/Identifiable";

interface Camera extends Identifiable {
  clientSize: Vector2;
  view: Matrix4;
  projection: Matrix4;
  updateMatrix(): void;
}

export type {Camera};
