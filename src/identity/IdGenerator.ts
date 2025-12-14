class IdGenerator {
  private static nextId: number;

  static {
    IdGenerator.nextId = 0;
  }

  static next(): number {
    const id = IdGenerator.nextId;
    IdGenerator.nextId++;
    return id;
  }
}

export {IdGenerator};
