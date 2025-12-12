class GLUniformLocation {
  readonly location: WebGLUniformLocation;

  private constructor(location: WebGLUniformLocation) {
    this.location = location;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string
  ): GLUniformLocation | null {
    const location = gl.getUniformLocation(program, name);
    if (location === null) {
      console.error('[ERROR] webgl-ts could not create GLUniformLocation', name);
      return null;
    }

    return new GLUniformLocation(location);
  }
}

export {GLUniformLocation};
