import { GLTexture } from "../gl/uniform/GLTexture";
import { AbstractMaterial } from "./AbstractMaterial";

const NAME = 'TextureUnlitMaterial';

type UniformMap = {
  colorMap: GLTexture;
};

class TextureUnlitMaterial extends AbstractMaterial<UniformMap> {
  private _colorMap: TexImageSource;

  // private isApplyColorMapRequired: boolean;

  constructor(colorMap: TexImageSource) {
    super(NAME);
    this._colorMap = colorMap;
    // this.isApplyColorMapRequired = false;
  }

  get colorMap(): TexImageSource {
    return this._colorMap;
  }

  set colorMap(value: TexImageSource) {
    this._colorMap = value;
    // this.isApplyColorMapRequired = true;
  }

  createUniformMap(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): UniformMap | null {
    const {_colorMap} = this;
    const colorMap = GLTexture.create(gl, program, 'u_colorMap', 0, _colorMap);
    if (!colorMap) {
      console.warn(`[qvizmu] ${NAME}.createUniformMap() could not create GLTexture`);
      return null;
    }

    return {colorMap};
  }

  updateUniformMap(): void {
    // if (!this.uniformMap) {
    //   return;
    // }

    // if (!this.isApplyColorMapRequired) {
    //   return;
    // }

    // const {colorMap} = this.uniformMap;
    // colorMap.update(this._colorMap);
  }
}

export {TextureUnlitMaterial};
