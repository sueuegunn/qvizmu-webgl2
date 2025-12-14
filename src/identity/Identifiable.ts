interface Identifiable {
  readonly id: number;
  readonly tag: string;
}

const isIdentifiable = (obj: unknown): obj is Identifiable => {
  if (typeof obj !== 'object' || !obj) {
    return false;
  }

  const record = obj as Record<string, unknown>;
  return (
    typeof record.id === 'number' &&
    typeof record.tag === 'string'
  );
}

export type {Identifiable};
export {isIdentifiable};
