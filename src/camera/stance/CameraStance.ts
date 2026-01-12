import { Vector3 } from "mathue";

type CameraStanceInputCommon = {
  readonly position: Vector3;
  readonly target: Vector3;
};

type CameraStanceInputRight = CameraStanceInputCommon & {
  type: 'right';
  right: Vector3;
};

type CameraStanceInputUp = CameraStanceInputCommon & {
  type: 'up';
  up: Vector3;
};

type CameraStanceInput = CameraStanceInputRight | CameraStanceInputUp;

const calculateUp = (forward: Vector3, right: Vector3, out?: Vector3): Vector3 => {
  if (out) {
    return right.crossTo(forward, out).normalize();
  }

  const up = Vector3.zero();
  return up.copy(right).cross(forward).normalize();
};

const calculateRight = (forward: Vector3, up: Vector3, out?: Vector3): Vector3 => {
  if (out) {
    return up.crossTo(forward, out).normalize();
  }

  const right = Vector3.zero();
  return right.copy(up).cross(forward).normalize();
};

class CameraStance {
  readonly position: Vector3;
  readonly target: Vector3;
  readonly forward: Vector3;
  readonly right: Vector3;
  readonly up: Vector3;

  constructor(input: CameraStanceInput) {
    const {position, target, type} = input;
    this.position = position.clone();
    this.target = target.clone();

    const forward = target.clone().subtract(position).normalize();
    this.forward = forward;
    if (type === 'right') {
      const {right} = input;
      this.right = right;
      const up = calculateUp(forward, right);
      this.up = up;
    } else {
      const {up} = input;
      this.up = up;
      const right = calculateRight(forward, up);
      this.right = right;
    }
  }

  update(input: CameraStanceInput) {
    const {position, target, type} = input;
    this.position.copy(position);
    this.target.copy(target);

    const {forward} = this;
    forward.copy(target).subtract(position).normalize();
    if (type === 'right') {
      const {right} = input;
      this.right.copy(right).normalize();
      calculateUp(forward, right, this.up);
      this.up
      return;
    }

    const {up} = input;
    this.up.copy(up).normalize();
    calculateRight(forward, up, this.right);
  }
}

export {CameraStance};
export type {CameraStanceInput, CameraStanceInputRight, CameraStanceInputUp};
