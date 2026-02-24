export function unwrap<T>($: T | undefined | null): NonNullable<T> {
  if ($ === undefined) {
    throw new Error("Unwrapping failed: value is undefined");
  } else if ($ === null) {
    throw new Error("Unwrapping failed: value is null");
  }

  return $;
}
