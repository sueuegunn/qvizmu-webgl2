import { Vector2, type Matrix4 } from "mathue";
import type { GLCamera } from "../gl/camera/GLCamera";
import { GLProgram } from "../gl/GLProgram";
import type { Material } from "../material/AbstractMaterial";
import type { Object3D } from "../object/Object3D";
import type { Framebuffer } from "./Framebuffer";
import type { AttributeType } from "../object/Geometry";

interface Program {
  drawObjects(objects: Iterable<Object3D<Material, AttributeType[]>>, framebuffer?: Framebuffer): void;
  destroy(): void;
}

type GLBundle = {
  gl: WebGL2RenderingContext,
  glProgram: GLProgram;
  glCamera: GLCamera;
};

abstract class AbstractProgram<Mat extends Material, Attrs extends AttributeType[]> implements Program {
  abstract createCamera(gl: WebGL2RenderingContext, program: WebGLProgram): GLCamera | null;
  abstract glSettings(gl: WebGL2RenderingContext): void;
  abstract glDraw(gl: WebGL2RenderingContext, object3D: Object3D<Mat, Attrs>): void;

  readonly glBundle?: GLBundle;
  readonly clientSize: Vector2;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    name: string
  ) {
    this.clientSize = Vector2.allOnes();
    
    const glProgram = GLProgram.create(gl, vertexShaderSource, fragmentShaderSource, name);
    if (!glProgram) {
      console.warn(`[sorb] could not create GLProgram name='${name}'`);
      return;
    }

    const {program} = glProgram;
    const glCamera = this.createCamera(gl, program);
    if (!glCamera) {
      console.warn(`[sorb] could not create GLCamera name='${name}'`);
      return;
    }

    this.glBundle = {gl, glProgram, glCamera};
  }

  updateCamera(
    clientSize: Vector2,
    view: Matrix4,
    projection: Matrix4
  ): void {
    const {glBundle} = this;
    if (!glBundle) {
      return;
    }

    this.clientSize.set(clientSize);

    const {gl, glProgram, glCamera} = glBundle;
    const {program} = glProgram;
    gl.useProgram(program);
    glCamera.update(view, projection);
    glCamera.uniform(gl);
  }

  private unbindFramebuffer(gl: WebGL2RenderingContext): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const {x, y} = this.clientSize;
    // TODO: device pixel ratio
    gl.viewport(0, 0, x, y);
  }

  private glDefaultSettings(gl: WebGL2RenderingContext): void {
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
    gl.enable(gl.BLEND);
  }

  drawObjects(objects: Iterable<Object3D<Mat, Attrs>>, framebuffer?: Framebuffer): void {
    const {glBundle} = this;
    if (!glBundle) {
      return;
    }

    const {gl, glProgram} = glBundle;
    const {program} = glProgram;

    if (framebuffer) {
      const binded = framebuffer.bind(gl);
      if (!binded) {
        this.unbindFramebuffer(gl);
        return;
      }
    } else {
      this.unbindFramebuffer(gl);
    }

    this.glDefaultSettings(gl);
    this.glSettings(gl);

    for (const object3D of objects) {
      const binded = object3D.bind(gl, program);
      if (!binded) {
        continue;
      }
      this.glDraw(gl, object3D);
    }

    if (framebuffer) {
      this.unbindFramebuffer(gl);
    }
  }

  destroy(): void {
    const {glBundle} = this;
    if (!glBundle) {
      return;
    }

    const {gl, glProgram} = glBundle;
    glProgram.destroy(gl);

    // TODO: free glBundle=undefined
  }
}

export type {Program};
export {AbstractProgram};
