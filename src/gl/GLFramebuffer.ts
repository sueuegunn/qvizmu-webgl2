import { AbstractGLDisposable } from "./GLDisposable";
import { GLResourceManager } from "./resource/GLResourceManager";

class GLFramebuffer extends AbstractGLDisposable {
  readonly width: number;
  readonly height: number;
  readonly framebuffer: WebGLFramebuffer;
  readonly depthRenderbuffer: WebGLRenderbuffer;
  readonly canvas: HTMLCanvasElement;
  readonly texture: WebGLTexture;

  private constructor(
    width: number,
    height: number,
    framebuffer: WebGLFramebuffer,
    depthRenderbuffer: WebGLRenderbuffer,
    canvas: HTMLCanvasElement,
    texture: WebGLTexture
  ) {
    super();
    this.width = width;
    this.height = height;
    this.framebuffer = framebuffer;
    this.depthRenderbuffer = depthRenderbuffer;
    this.canvas = canvas;
    this.texture = texture;
  }

  static create(
    gl: WebGL2RenderingContext,
    width: number,
    height: number
  ): GLFramebuffer | null {
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
      console.warn(`[qvizmu] GLFramebuffer.create() could not create WebGLFramebuffer`);
      return null;
    }

    const depthRenderbuffer = gl.createRenderbuffer();
    if (!depthRenderbuffer) {
      console.warn(`[qvizmu] GLFramebuffer.create() could not create WebGLRenderbuffer`);
      return null;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderbuffer);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const texture = gl.createTexture();
    if (!texture) {
      console.warn(`[qvizmu] GLFramebuffer.create() could not create WebGLTexture`);
      return null;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const glFramebuffer = new GLFramebuffer(width, height, framebuffer, depthRenderbuffer, canvas, texture);
    GLResourceManager.add(gl, glFramebuffer);

    return glFramebuffer;
  }

  onDispose(gl: WebGL2RenderingContext): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    gl.deleteRenderbuffer(this.depthRenderbuffer);
    gl.deleteTexture(this.texture);
    gl.deleteFramebuffer(this.framebuffer);
  }
}

export {GLFramebuffer};
