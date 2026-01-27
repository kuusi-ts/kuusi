/**
 * This module contains the `kuusi()` router, and also re-exports everything else importable from this package.
 *
 * ```ts
 * import { kuusi } from "@kuusi/kuusi";
 *
 * Deno.serve(
 *   { port: 1296 },
 *   async function (req: Request): Promise<Response> {
 *     return await kuusi(req);
 *   },
 * );
 * ```
 *
 * @module
 */

import { walkSync } from "@std/fs";
import { relative } from "@std/path";
import { kuusiConfig } from "./config.ts";
import { Route } from "./types.ts";
import { isObjKey, unwrap } from "./utils.ts";

export * from "./env.ts";
export * from "./types.ts";
export * from "./config.ts";

const routeDir = kuusiConfig.routesPath ?? "routes";

const paths = Array.from(
  walkSync(routeDir, { includeDirs: false }),
  ({ path }) => relative(routeDir, path),
);

const routes: [URLPattern, Route][] = [];

for (const path of paths) {
  if (!path.endsWith(".route.ts")) continue;

  const imports = await import(
    `${import.meta.dirname}/../${routeDir}/${path}`
  ) as object;

  if (!("route" in imports)) {
    throw new Error(`routes/${path} does not provide a route export`);
  }

  if (!(imports.route instanceof Route)) {
    throw new Error(`routes/${path} does not provide a valid route export`);
  }

  let parsedPath = "/" + path;
  parsedPath = parsedPath.slice(
    0,
    path.split("/").at(-1) === "index.route.ts"
      ? -("index.route.ts".length + 1)
      : -".route.ts".length,
  );

  if (parsedPath === "") parsedPath = "/";

  routes.push([
    new URLPattern({ pathname: parsedPath }),
    imports.route,
  ]);
}

/**
 * A simple router that uses file system-based routing on the specified routes directory.
 *
 * @param req The request that needs to be routed.
 * @returns A response from the route if a match was found. If there was no match, the response is a 404. If there was a match, but the endpoint did not support the HTTP verb of the request, the response is 405.
 */
export async function kuusi(req: Request): Promise<Response> {
  const match = routes.find(([url]) => url.test(req.url));

  if (!match) {
    return new Response("{}", {
      status: 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  const [matchPattern, matchRoute] = match;
  const matchPatternResult = unwrap(matchPattern.exec(req.url));

  if (isObjKey(req.method, matchRoute)) {
    const matchMethod = unwrap(matchRoute[req.method]);
    return await matchMethod(req, matchPatternResult);
  }

  return new Response("{}", {
    status: 405,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
