import type { Route } from "./types.ts";

export type MaybePromise<T> = T | Promise<T>;

export const httpVerbs = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

export const ObjectKeysof = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

export const ObjectEntriesof = <T extends object>(obj: T) =>
  Object.entries(obj) as [keyof T, T[keyof T]][];

export const isObjKey = <T extends NonNullable<object>>(
  key: string | number | symbol,
  obj: T,
): key is keyof T => key in obj;

export const isObjField = <T extends NonNullable<object>>(
  key: string | number | symbol,
  value: unknown,
  obj: T,
): key is keyof T => isObjKey(key, obj) && typeof value === typeof obj[key];

export function unwrap<T>(thing: T | undefined | null): NonNullable<T> {
  if (thing === undefined) {
    throw new Error("Unwrapping failed: value is undefined");
  } else if (thing === null) {
    throw new Error("Unwrapping failed: value is null");
  }

  return thing;
}

export const parsePath = (path: string) => {
  path = path.split(".").slice(0, -1).join(".");

  if (path.endsWith("hook")) path = path.slice(0, -5);
  else if (path.endsWith("source")) path = path.slice(0, -7);

  if (path.endsWith("index")) path = path.slice(0, -5);

  return "/" + path;
};

export const getDuplicate = <T>(array: T[]) =>
  array.filter((item, index) => array.indexOf(item) !== index);

export const getAmbiguousURLs = (routes: Route[]) =>
  getDuplicate(
    routes.map(([url]) =>
      url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname
    ),
  );
