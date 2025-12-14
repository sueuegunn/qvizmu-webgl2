import type { GLDisposable } from "../GLDisposable";

interface GLUniform extends GLDisposable {
  uniform(gl: WebGL2RenderingContext): void;
}

export type {GLUniform};
