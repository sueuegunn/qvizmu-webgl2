import { GLFramebuffer } from "../gl/GLFramebuffer";
import { Color } from "../value/Color";

type FramebufferOptions = {
  clear?: {
    color?: Color;
    depth?: number;
  };
};

type OnFramebufferInitialized = (glFramebuffer: GLFramebuffer) => void;

const DEFAULT_CLEAR_COLOR = Color.black();

class Framebuffer {
  readonly width: number;
  readonly height: number;

  readonly clearColor: Color;
  readonly clearDepth?: number;

  private _glFramebuffer?: GLFramebuffer | undefined;

  private onFramebufferInitializedList: OnFramebufferInitialized[];

  constructor(width: number, height: number, options?: FramebufferOptions) {
    this.width = width;
    this.height = height;
    this.clearColor = options?.clear?.color ?? DEFAULT_CLEAR_COLOR;
    this.clearDepth = options?.clear?.depth;
    this.onFramebufferInitializedList = [];
  }

  get glFramebuffer(): GLFramebuffer | undefined {
    return this._glFramebuffer;
  }

  addOnInitializedCallback(onFramebufferInitialized: OnFramebufferInitialized): void {
    const {glFramebuffer} = this;
    if (glFramebuffer) {
      onFramebufferInitialized(glFramebuffer);
      return;
    }

    this.onFramebufferInitializedList.push(onFramebufferInitialized);
  }

  initialize(gl: WebGL2RenderingContext): void {
    if (this._glFramebuffer) {
      return;
    }

    const {width, height} = this;
    const glFramebuffer = GLFramebuffer.create(gl, width, height);
    if (!glFramebuffer) {
      console.warn(`[sorb] Framebuffer.initialize() could not create GLFramebuffer`);
      return;
    }

    this._glFramebuffer = glFramebuffer;
    
    this.onFramebufferInitializedList.forEach((onFramebufferInitialized) => {
      onFramebufferInitialized(glFramebuffer);
    });
  }

  bind(gl: WebGL2RenderingContext): boolean {
    this.initialize(gl);
    if (!this._glFramebuffer) {
      return false;
    }

    const {width, height, _glFramebuffer} = this;
    const {framebuffer} = _glFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, width, height);

    return true;
  }

  destroy(gl: WebGL2RenderingContext): void {
    const {glFramebuffer} = this;
    if (!glFramebuffer) {
      return;
    }
    glFramebuffer.destroy(gl);
    this._glFramebuffer = undefined;
  }
}

export {Framebuffer};
