import { Matrix4, Vector2 } from "mathue";
import type { Camera } from "./Camera";
import type { CameraStance } from "./stance/CameraStance";
import { IdGenerator } from "../identity/IdGenerator";

type PerspectiveCameraOptions = {
  tag?: string;
};

class PerspectiveCamera implements Camera {
  readonly clientSize: Vector2;
  readonly view: Matrix4;
  readonly projection: Matrix4;

  readonly stance: CameraStance;

  private _verticalFov: number;
  private _near: number;
  private _far: number;

  // Identifiable
  readonly id: number;
  readonly tag: string;

  constructor(
    clientSize: Vector2,
    stance: CameraStance,
    verticalFov: number,
    near: number,
    far: number,
    options?: PerspectiveCameraOptions
  ) {
    this.clientSize = clientSize;
    this.view = Matrix4.identity();
    this.projection = Matrix4.identity();
    this.stance = stance;
    this._verticalFov = verticalFov;
    this._near = near;
    this._far = far;

    this.id = IdGenerator.next();
    this.tag = options?.tag ?? `PerspectiveCamera:${this.id}`;
  }

  updateMatrix(): void {
    const {view, stance} = this;
    const {position, target, up} = stance;
    view.setIdentity();
    view.lookAt(position, target, up);

    const {projection, clientSize, _verticalFov, _near, _far} = this;
    const {x, y} = clientSize;
    const aspect = x / y;
    projection.setIdentity();
    projection.perspective(_verticalFov, _near, _far, aspect);
  }
}

export {PerspectiveCamera};
