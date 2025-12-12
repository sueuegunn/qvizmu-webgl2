import type { GLUniform } from "../gl/uniform/GLUniform";

type UniformMap = {[name: string]: GLUniform};

interface Material {
  isPrepared(): boolean;
  prepare(gl: WebGL2RenderingContext, program: WebGLProgram): void;
  bind(gl: WebGL2RenderingContext): void;
}

abstract class AbstractMaterial<T extends UniformMap> implements Material {
  private uniformMap?: T;
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract createUniformMap(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): T | null;

  abstract updateUniformMap(): void;

  isPrepared(): boolean {
    return this.uniformMap !== undefined;
  }

  prepare(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    if (this.uniformMap) {
      return;
    }

    const uniformMap = this.createUniformMap(gl, program);
    if (!uniformMap) {
      const {name} = this;
      console.warn(`[sorb] ${name}.prepare() could not create UniformMap`);
      return;
    }

    this.uniformMap = uniformMap;
  }

  bind(gl: WebGL2RenderingContext): void {
    if (!this.uniformMap) {
      return;
    }

    this.updateUniformMap();
    for (const uniform of Object.values(this.uniformMap)) {
      uniform.uniform(gl);
    }
  }
}

export type {Material};
export {AbstractMaterial};
