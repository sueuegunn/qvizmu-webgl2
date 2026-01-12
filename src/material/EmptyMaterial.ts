import { AbstractMaterial } from "./AbstractMaterial";

const NAME = 'EmptyMaterial';

type UniformMap ={};

class EmptyMaterial extends AbstractMaterial<UniformMap> {
  constructor() {
    super(NAME);
  }

  createUniformMap(_gl: WebGL2RenderingContext, _program: WebGLProgram): UniformMap | null {
    return {};
  }

  updateUniformMap(): void {}
}

export {EmptyMaterial};
