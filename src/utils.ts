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

export function parsePath(path: `${string}.route.ts`): `/${string}` {
  let parsedPath = "/" + path;
  parsedPath = parsedPath.slice(
    0,
    path.split("/").at(-1) === "index.route.ts"
      ? -("index.route.ts".length + 1)
      : -".route.ts".length,
  );

  if (parsedPath === "") parsedPath = "/";

  return parsedPath;
}
