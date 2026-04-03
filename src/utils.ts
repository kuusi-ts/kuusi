/**
 * @module utilities
 *
 * Some utilities
 */

import { join, toFileUrl } from "@std/path";
import type { Route } from "./types.ts";

export type MaybePromise<T> = T | Promise<T>;

export const httpVerbs: string[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
] as const;

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

export const parsePath = (path: string) => {
  // Removes the file extensions
  path = path.split(".").slice(0, -1).join(".");

  if (path.endsWith("hook")) path = path.slice(0, -5);
  else if (path.endsWith("source")) path = path.slice(0, -7);

  if (path.endsWith("index")) path = path.slice(0, -5);

  if (Deno.build.os === "windows") path.replace(/\;/g, ";");

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

export const toLocalPath = (...path: string[]) =>
  toFileUrl(join(Deno.cwd(), ...path));

export const validRouteGuard = (path: string) =>
  /.\.(source|hook)\.(m|c)?(j|t)s(x)?$/.test(path);
