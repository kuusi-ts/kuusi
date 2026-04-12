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

export const parsePath = (path: string) => {
  // Removes the file extensions
  path = path.split(".").slice(0, -1).join(".");

  // Removes the .hook or .source
  if (path.endsWith("hook")) path = path.slice(0, -5);
  else if (path.endsWith("source")) path = path.slice(0, -7);

  if (path.endsWith("index")) path = path.slice(0, -5);

  // : is reserved, so use ; instead
  if (Deno.build.os === "windows") path.replace(/\;/g, ";");

  return "/" + path;
};

export const getDuplicate = <T>(array: T[]) =>
  array.filter((item, index) => array.indexOf(item) !== index);

export const getAmbiguousURLs = (routes: Route[]) =>
  getDuplicate(
    routes.map(({ urlPattern }) =>
      urlPattern.pathname.endsWith("/")
        ? urlPattern.pathname.slice(0, -1)
        : urlPattern.pathname
    ),
  );

export const toLocalPath = (...path: string[]) =>
  toFileUrl(join(Deno.cwd(), ...path));

export const routeGuard = (path: string) =>
  /.\.(source|hook)\.(m|c)?(j|t)s(x)?$/.test(path);

export const sourceGuard = (path: string) =>
  /.\.source\.(m|c)?(j|t)s(x)?$/.test(path);

export const hookGuard = (path: string) =>
  /.\.hook\.(m|c)?(j|t)s(x)?$/.test(path);
