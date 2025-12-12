import type { Material } from "../material/AbstractMaterial";
import type { AttributeType, Geometry } from "./Geometry";
import type { Transform } from "./Transform";

class Object3D<M extends Material, Attrs extends AttributeType[]> {
  readonly transform: Transform;
  readonly geometry: Geometry<Attrs>;
  readonly material: M;

  constructor(
    transform: Transform,
    geometry: Geometry<Attrs>,
    material: M
  ) {
    this.transform = transform;
    this.geometry = geometry;
    this.material = material;
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
}

export {Object3D};
