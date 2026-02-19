export function unwrap<T>(thing: T | undefined | null): NonNullable<T> {
  if (thing === undefined) {
    throw new Error("Unwrapping failed: value is undefined");
  } else if (thing === null) {
    throw new Error("Unwrapping failed: value is null");
  }

  return thing;
}
