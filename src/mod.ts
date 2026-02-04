/**
 * kuusi: Se ei ole Oak-viittaus. A simple router / library / framework for Deno utilizing file-based routing.
 *
 * ```ts
 * // routes/index.route.ts
 * import { Route } from "@kuusi/kuusi";
 *
 * export const route = new Route({
 *   GET: (req, patternResult) => {
 *     return new Response(
 *       JSON.stringify({
 *         message: "welcome to kuusi!",
 *       }),
 *       {
 *         status: 200,
 *         headers: {
 *           "content-type": "application/json; charset=utf-8",
 *         },
 *       },
 *     );
 *   },
 * });
 * ```
 *
 * ```ts
 * // src/index.ts
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
import { type KuusiRoute, Route } from "./types.ts";
import { getAmbiguousURLs, isObjKey, parsePath, unwrap } from "./utils.ts";

export * from "./env.ts";
export * from "./types.ts";

/**
 * Function that collects all the routes from the routes directory.
 *
 * @returns The routes and their paths as KuusiRoutes
 */
export async function getKuusiRoutes(): Promise<KuusiRoute[]> {
  const paths = Array.from(
    walkSync(kuusiConfig.routes.path, { includeDirs: false }),
    ({ path }) => relative(kuusiConfig.routes.path, path),
  );

  const routes: KuusiRoute[] = [];

  for (const path of paths) {
    if (!/.route.(m|c)?(j|t)s$/.exec(path)) continue;

    const absolutePath =
      toFileUrl(join(Deno.cwd(), kuusiConfig.routes.path, path)).href;
    const imports = await import(absolutePath) as object;

    if (!("route" in imports)) {
      throw new Error(
        `kuusi-no-route-export: ${absolutePath} does not provide a route export`,
      );
    }

    if (!(imports.route instanceof Route)) {
      throw new Error(
        `kuusi-no-valid-route: ${absolutePath} does not provide a valid route export`,
      );
    }

    routes.push([
      new URLPattern({ pathname: parsePath(path) }),
      imports.route,
    ]);
  }

  if (kuusiConfig.routes.warnAmbiguousRoutes) {
    for (const ambiguousURL of getAmbiguousURLs(routes)) {
      console.warn(
        `kuusi-ambiguous-url: "${ambiguousURL}" and "${ambiguousURL}/" are very similar. Consider renaming at least one of them.`,
      );
    }
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
  routes: KuusiRoute[],
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
