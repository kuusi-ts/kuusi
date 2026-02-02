import type { KuusiRoute } from "@kuusi/kuusi";

export const isObjKey = <T extends NonNullable<object>>(
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
  "/" + path.slice(
    0,
    path.split("/").at(-1) === "index.route.ts" ? -14 : -9,
  );
// 9 = ".route.ts".length
// 14 = "index.route.ts".length;

// I thought this algorithm was super clever but it turns out it sucks.
// export function getDuplicate<T>(array: T[]): T | undefined {
//   if (new Set(array).size === array.length) return undefined;

//   while (true) {
//     const lastelement = unwrap(array.pop());

//     if (new Set(array).size === array.length) return lastelement;
//   }
// }

export const getDuplicate = <T>(array: T[]) =>
  array.filter((item, index) => array.indexOf(item) !== index);

export const getAmbiguousURLs = (routes: KuusiRoute[]) =>
  getDuplicate(
    routes.map(([url]) =>
      url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname
    ),
  );
