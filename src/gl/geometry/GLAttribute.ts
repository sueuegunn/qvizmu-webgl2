import type { AttributeType } from "../../object/Geometry";

class GLAttribute {
  readonly location: number;
  readonly size: number;
  readonly offset: number;
  readonly normalized: boolean;

  private constructor(
    location: number,
    size: number,
    offset: number,
    normalized: boolean
  ) {
    this.location = location;
    this.size = size;
    this.offset = offset;
    this.normalized = normalized;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    attribute: AttributeType,
    offset: number
  ): GLAttribute | null {
    const {name} = attribute;
    const location = gl.getAttribLocation(program, name);

    const {size} = attribute;
    const normalized = attribute.normalized ?? false;
    return new GLAttribute(location, size, offset, normalized)
  }
}

export {GLAttribute};