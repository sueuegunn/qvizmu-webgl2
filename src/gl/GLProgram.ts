import type { Identifiable } from "../identity/Identifiable";
import { IdGenerator } from "../identity/IdGenerator";

const compileShader = (
  gl: WebGL2RenderingContext,
  source: string,
  type: number,
  name: string
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) {
    console.warn(`[quvysm] could not create WebGLShader name='${name}'`);
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!status) {
    console.warn(`[quvysm] shader compile error name='${name}'`);
    const info = gl.getShaderInfoLog(shader);
    console.warn(info);
    return null;
  }

  return shader;
};

const linkProgram = (
  gl: WebGL2RenderingContext,
  vertex: WebGLShader,
  fragment: WebGLShader
): WebGLProgram | null => {
  const program = gl.createProgram();
  if (!program) {
    console.warn(`[quvysm] could not create WebGLProgram name='${name}'`);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  const status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!status) {
    console.warn(`[quvysm] program link error name='${name}'`);
    const info = gl.getProgramInfoLog(program);
    console.warn(info);
    return null;
  }

  // TODO: use program?

  return program;
};

class GLProgram implements Identifiable {
  readonly program: WebGLProgram;
  private vertex: WebGLShader;
  private fragment: WebGLShader;

  // Identifiable
  readonly id: number;
  readonly tag: string;

  private constructor(
    program: WebGLProgram,
    vertex: WebGLShader,
    fragment: WebGLShader,
    id: number,
    tag: string
  ) {
    this.program = program;
    this.vertex = vertex;
    this.fragment = fragment;

    this.id = id;
    this.tag = tag;
  }

  static create(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    name: string
  ): GLProgram | null {
    const vertex = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER, name);
    if (!vertex) {
      return null;
    }

    const fragment = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER, name);
    if (!fragment) {
      return null;
    }

    const program = linkProgram(gl, vertex, fragment);
    if (!program) {
      return null;
    }

    const id = IdGenerator.next();
    const tag = `${name}.GLProgram:${id}`;

    return new GLProgram(program, vertex, fragment, id, tag);
  }

  destroy(gl: WebGL2RenderingContext): void {
    const {program, vertex, fragment} = this;
    gl.useProgram(null);

    gl.detachShader(program, vertex);
    gl.detachShader(program, fragment);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    gl.deleteProgram(program);
  }
}

export {GLProgram};
