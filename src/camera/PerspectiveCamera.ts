import { Matrix4, Vector2 } from "mathue";
import type { Camera } from "./Camera";
import type { CameraStance } from "./stance/CameraStance";

class PerspectiveCamera implements Camera {
  readonly clientSize: Vector2;
  readonly view: Matrix4;
  readonly projection: Matrix4;

  readonly stance: CameraStance;

  private _verticalFov: number;
  private _near: number;
  private _far: number;

  constructor(
    clientSize: Vector2,
    stance: CameraStance,
    verticalFov: number,
    near: number,
    far: number
  ) {
    this.clientSize = clientSize;
    this.view = Matrix4.identity();
    this.projection = Matrix4.identity();
    this.stance = stance;
    this._verticalFov = verticalFov;
    this._near = near;
    this._far = far;
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
