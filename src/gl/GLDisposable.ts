interface GLDisposable {
  readonly isDisposed: boolean;
  dispose(gl: WebGL2RenderingContext): void;
}

abstract class AbstractGLDisposable implements GLDisposable {
  abstract onDispose(gl: WebGL2RenderingContext): void;

  private _isDisposed: boolean;

  get isDisposed(): boolean {
    return this._isDisposed;
  }
  
  constructor() {
    this._isDisposed = false;
  }

  dispose(gl: WebGL2RenderingContext): void {
    if (this.isDisposed) {
      return;
    }

    this.onDispose(gl);
    this._isDisposed = true;
  }
}

export type {GLDisposable};
export {AbstractGLDisposable};
