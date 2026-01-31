export const isObjKey = <T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T => key in obj;

export function unwrap<T>(thing: T | undefined | null): NonNullable<T> {
  if (thing === undefined) {
    throw new Error(`Unwrapping failed: value is undefined`);
  } else if (thing === null) {
    throw new Error(`Unwrapping failed: value is null`);
  }

  return thing;
}

export const parsePath = (path: string) =>
  ("/" + path).slice(
    0,
    path.split("/").at(-1) === "index.route.ts" ? -14 : -9,
  );
// 9 = ".route.ts".length
// 14 = "index.route.ts".length;
