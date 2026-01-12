import { Matrix4, Quaternion, Vector3, type Clonable } from "mathue";
import { GLTransform } from "../gl/GLTransform";

class Transform implements Clonable<Transform> {
  readonly position: Vector3;
  readonly rotation: Quaternion;
  readonly scale: Vector3;

  readonly model: Matrix4;
  private tmpMatrix: Matrix4;

  private glTransform: GLTransform | undefined;

  constructor(position: Vector3, rotation: Quaternion, scale: Vector3) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;

    this.model = Matrix4.identity();
    this.tmpMatrix = Matrix4.identity();
  }

  clone(): Transform {
    const {position, rotation, scale} = this;
    return new Transform(position, rotation, scale);
  }

  static identity(): Transform {
    return new Transform(Vector3.zero(), Quaternion.identity(), Vector3.one());
  }

  update(): void {
    const {model, position, rotation, scale} = this;
    model.setIdentity()
      .multiplyTranslation(position)
      .multiplyRotation(rotation)
      .multiplyScale(scale);
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
      console.error('[quvysm] Transform.prepare() could not create GLTransform');
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
    modelUniform.copy(this.model);
    modelUniform.uniform(gl);
  }
}

export {Transform};
