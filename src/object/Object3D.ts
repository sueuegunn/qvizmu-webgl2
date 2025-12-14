import { AbstractGLDisposable } from "../gl/GLDisposable";
import type { Identifiable } from "../identity/Identifiable";
import { IdGenerator } from "../identity/IdGenerator";
import type { Material } from "../material/AbstractMaterial";
import type { AttributeType, Geometry } from "./Geometry";
import type { Transform } from "./Transform";

type Object3DOptions = {
  tag?: string;
};

class Object3D<M extends Material, Attrs extends AttributeType[]>
  extends AbstractGLDisposable
  implements Identifiable
{
  readonly transform: Transform;
  readonly geometry: Geometry<Attrs>;
  readonly material: M;

  // Identifiable
  readonly id: number;
  readonly tag: string;

  constructor(
    transform: Transform,
    geometry: Geometry<Attrs>,
    material: M,
    options?: Object3DOptions,
  ) {
    super();
    this.transform = transform;
    this.geometry = geometry;
    this.material = material;

    this.id = IdGenerator.next();
    this.tag = options?.tag ?? `Object3D:${this.id}`;
  }

  bind(gl: WebGL2RenderingContext, program: WebGLProgram): boolean {
    const {transform, geometry, material} = this;

    transform.prepare(gl, program);
    geometry.prepare(gl, program);
    material.prepare(gl, program);

    if (!transform.isPrepared() || !geometry.isPrepared() || !material.isPrepared()) {
      return false;
    }

    gl.useProgram(program);
    transform.update();
    transform.bind(gl);
    gl.useProgram(program);
    geometry.bind(gl);
    gl.useProgram(program);
    material.bind(gl);
    return true;
  }

  onDispose(gl: WebGL2RenderingContext): void {
    const {geometry} = this;
    geometry.dispose(gl);
  }
}

export {Object3D};
