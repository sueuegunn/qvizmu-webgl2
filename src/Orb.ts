import type { Program } from "./program/AbstractProgram";

type ProgramMap = {[name: string]: Program};

class Orb<PM extends ProgramMap> {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;
  readonly programMap: PM;

  constructor(
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    programMap: PM
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.programMap = programMap;
  }

  destroy(): void {
    const {programMap} = this;
    for (const program of Object.values(programMap)) {
      program.destroy();
    }
  }
}

export {Orb};
export type {ProgramMap};
