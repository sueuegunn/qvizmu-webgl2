import { Matrix4, type Vector2 } from "mathue";
import type { Camera } from "./Camera";
import type { CameraStance } from "./stance/CameraStance";
import { IdGenerator } from "../identity/IdGenerator";

type OrthographicCameraOptions = {
  tag?: string;
};

class OrthographicCamera implements Camera {
  readonly clientSize: Vector2;
  readonly view: Matrix4;
  readonly projection: Matrix4;

  readonly stance: CameraStance;

  private _left: number;
  private _right: number;
  private _bottom: number;
  private _top: number;
  private _near: number;
  private _far: number;

  // Identifiable
  readonly id: number;
  readonly tag: string;

  constructor(
    clientSize: Vector2,
    stance: CameraStance,
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
    options?: OrthographicCameraOptions
  ) {
    this.clientSize = clientSize;
    this.view = Matrix4.identity();
    this.projection = Matrix4.identity();
    this.stance = stance;

    this._left = left;
    this._right = right;
    this._bottom = bottom;
    this._top = top;
    this._near = near;
    this._far = far;

    this.id = IdGenerator.next();
    this.tag = options?.tag ?? `OrthographicCamera:${this.id}`;
  }

  updateMatrix(): void {
    const {view, stance} = this;
    const {position, target, up} = stance;
    view.setIdentity();
    view.lookAt(position, target, up);

    const {projection, _left, _right, _bottom, _top, _near, _far} = this;
    projection.setIdentity();
    projection.orthographic(_left, _right, _bottom, _top, _near, _far);
  }
}

export {OrthographicCamera};
