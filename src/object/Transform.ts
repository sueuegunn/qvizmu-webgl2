import { Matrix4, Quaternion, Vector3 } from "mathue";
import type { Clonable } from "mathue/src/Clonable";
import { GLTransform } from "../gl/GLTransform";

class Transform implements Clonable<Transform> {
  readonly position: Vector3;
  readonly rotation: Quaternion;
  readonly scale: Vector3;
  readonly model: Matrix4;

  private positionMatrix: Matrix4;
  private rotationMatrix: Matrix4;
  private scaleMatrix: Matrix4;

  private glTransform: GLTransform | undefined;

  constructor(position: Vector3, rotation: Quaternion, scale: Vector3) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.model = Matrix4.identity();

    this.positionMatrix = Matrix4.identity();
    this.rotationMatrix = Matrix4.identity();
    this.scaleMatrix = Matrix4.identity();
  }

  clone(): Transform {
    const {position, rotation, scale} = this;
    return new Transform(position, rotation, scale);
  }

  static identity(): Transform {
    return new Transform(Vector3.zero(), Quaternion.identity(), Vector3.allOnes());
  }

  update(): void {
    this.positionMatrix.setIdentity();
    this.positionMatrix.scale(this.scale);

    this.rotationMatrix.setIdentity();
    this.rotationMatrix.setQuaternion(this.rotation);

    this.scaleMatrix.setIdentity();
    this.scaleMatrix.scale(this.scale);

    this.model.setIdentity()
      .multiply(this.positionMatrix)
      .multiply(this.rotationMatrix)
      .multiply(this.scaleMatrix);
  }

  isPrepared(): boolean {
    return this.glTransform !== undefined;
  }

  prepare(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    if (this.isPrepared()) {
      return;
    }

    const glTransform = GLTransform.create(gl, program);
    if (!glTransform) {
      console.error('[sorb] Transform.prepare() could not create GLTransform');
      return;
    }

    this.glTransform = glTransform;
  }

  bind(gl: WebGL2RenderingContext): void {
    const {glTransform} = this;
    if (!glTransform) {
      return;
    }

    const {modelUniform} = glTransform;
    modelUniform.set(this.model);
    modelUniform.uniform(gl);
  }
}

export {Transform};
