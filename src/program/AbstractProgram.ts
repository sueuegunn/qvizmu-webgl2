import { Vector2, type Matrix4 } from "mathue";
import type { GLCamera } from "../gl/camera/GLCamera";
import { GLProgram } from "../gl/GLProgram";
import type { Material } from "../material/AbstractMaterial";
import type { Object3D } from "../object/Object3D";
import type { Framebuffer } from "./Framebuffer";
import type { AttributeType } from "../object/Geometry";
import { AbstractGLDisposable, type GLDisposable } from "../gl/GLDisposable";
import { GLResourceManager } from "../gl/resource/GLResourceManager";
import type { Identifiable } from "../identity/Identifiable";
import { IdGenerator } from "../identity/IdGenerator";

interface Program extends GLDisposable {
  updateClientSize(clientSize: Vector2): void;
  updateCamera(view: Matrix4, projection: Matrix4): void;
  drawObjects(objects: Iterable<Object3D<Material, AttributeType[]>>, framebuffer?: Framebuffer): void;
}

type GLBundle = {
  gl: WebGL2RenderingContext,
  glProgram: GLProgram;
  glCamera: GLCamera;
};

abstract class AbstractProgram<Mat extends Material, Attrs extends AttributeType[]>
  extends AbstractGLDisposable
  implements Program, Identifiable
{
  abstract createCamera(gl: WebGL2RenderingContext, program: WebGLProgram): GLCamera | null;
  abstract glSettings(gl: WebGL2RenderingContext): void;
  abstract glDraw(gl: WebGL2RenderingContext, object3D: Object3D<Mat, Attrs>): void;

  private glBundle?: GLBundle;
  readonly clientSize: Vector2;

  // Identifiable
  readonly id: number;
  readonly tag: string;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    name: string
  ) {
    super();
    this.clientSize = Vector2.allOnes();

    this.id = IdGenerator.next();
    this.tag = `${name}.AbstractProgram:${this.id}`;
    
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

    GLResourceManager.add(gl, this);

    this.glBundle = {gl, glProgram, glCamera};
  }

  updateClientSize(clientSize: Vector2): void {
    this.clientSize.set(clientSize);
  }

  updateCamera(
    view: Matrix4,
    projection: Matrix4
  ): void {
    const {glBundle} = this;
    if (!glBundle) {
      return;
    }

    const {gl, glProgram, glCamera} = glBundle;
    const {program} = glProgram;
    gl.useProgram(program);
    glCamera.update(view, projection);
    glCamera.uniform(gl);
  }

  private unbindFramebuffer(gl: WebGL2RenderingContext): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // TODO: device pixel ratio
    const {x, y} = this.clientSize;
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
      if (object3D.isDisposed) {
        continue;
      }
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

  onDispose(gl: WebGL2RenderingContext): void {
    const {glBundle} = this;
    if (!glBundle) {
      return;
    }

    if (gl !== glBundle.gl) {
      return;
    }

    const {glProgram} = glBundle;
    glProgram.destroy(gl);

    this.glBundle = undefined;
  }
}

export type {Program};
export {AbstractProgram};
