/**
 * kuusi: Se ei ole Oak-viittaus. A simple router / library / framework for Deno utilizing file-based routing.
 *
 * ```ts
 * import { kuusi } from "@kuusi/kuusi";
 *
 * const routes = getKuusiRoutes();
 *
 * Deno.serve(
 *   { port: 1296 },
 *   async function (req: Request): Promise<Response> {
 *     return await kuusi(req, routes);
 *   },
 * );
 * ```
 *
 * @module
 */

import { walkSync } from "@std/fs";
import { join, relative, toFileUrl } from "@std/path";
import { kuusiConfig } from "./config.ts";
import { type KuusiRoutes, Route } from "./types.ts";
import { isObjKey, parsePath, unwrap } from "./utils.ts";

export * from "./env.ts";
export * from "./types.ts";
export * from "./config.ts";

/**
 * Function that collects all the routes from the routes directory.
 *
 * @returns The routes and their paths as KuusiRoutes
 */
export async function getKuusiRoutes(): Promise<KuusiRoutes> {
  const paths = Array.from(
    walkSync(kuusiConfig.routesPath, { includeDirs: false }),
    ({ path }) => relative(kuusiConfig.routesPath, path),
  );

  const routes: KuusiRoutes = [];

  for (const path of paths) {
    if (!path.endsWith(".route.ts")) continue;

    const absolutePath =
      toFileUrl(join(Deno.cwd(), kuusiConfig.routesPath + path)).href;
    const imports = await import(absolutePath) as object;

    if (!("route" in imports)) {
      throw new Error(`${absolutePath} does not provide a route export`);
    }

    if (!(imports.route instanceof Route)) {
      throw new Error(`${absolutePath} does not provide a valid route export`);
    }

    routes.push([
      new URLPattern({ pathname: parsePath(path) }),
      imports.route,
    ]);
  }

  return routes;
}

/**
 * A simple router that uses file system-based routing on the specified routes directory.
 *
 * @param req The request that needs to be routed.
 * @param routes The collected routes.
 * @returns A response from the route if a match was found. If there was no match, the response is a 404. If there was a match, but the endpoint did not support the HTTP verb of the request, the response is 405.
 */
export async function kuusi(
  req: Request,
  routes: KuusiRoutes,
): Promise<Response> {
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
