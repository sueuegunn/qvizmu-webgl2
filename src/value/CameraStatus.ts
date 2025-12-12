import type { PolarCoordinate3, Vector3 } from "mathue";
import type { Size2 } from "./Size2";

class CameraStatus {
  readonly target: Vector3;
  readonly coordinate: PolarCoordinate3;
  readonly clientSize: Size2;

  constructor(
    target: Vector3,
    coordinate: PolarCoordinate3,
    clientSize: Size2
  ) {
    this.target = target;
    this.coordinate = coordinate;
    this.clientSize = clientSize;
  }
}

export {CameraStatus};
