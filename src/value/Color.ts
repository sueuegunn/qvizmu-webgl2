class Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static clear(): Color {
    return new Color(0, 0, 0, 0);
  }

  static black(): Color {
    return new Color(0, 0, 0, 1);
  }

  static red(): Color {
    return new Color(1, 0, 0, 1);
  }

  static green(): Color {
    return new Color(0, 1, 0, 1);
  }

  static blue(): Color {
    return new Color(0, 0, 1, 1);
  }

  static yellow(): Color {
    return new Color(1, 1, 0, 1);
  }

  static cyan(): Color {
    return new Color(0, 1, 1, 1);
  }

  static magenta(): Color {
    return new Color(1, 0, 1, 1);
  }

  static white(): Color {
    return new Color(1, 1, 1, 1);
  }
}

export {Color};
