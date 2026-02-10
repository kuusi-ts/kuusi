/**
 * kuusi: Se ei ole Oak-viittaus. A simple router / library / framework for Deno utilizing file-based routing.
 *
 * ```ts
 * // routes/index.source.ts
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
import { type Route, WebHook, WebSource } from "./types.ts";
import {
  getAmbiguousURLs,
  getDuplicate,
  httpVerbs,
  parsePath,
  unwrap,
} from "./utils.ts";

export * from "./env.ts";
export * from "./types.ts";

/**
 * Function that collects all the routes from the routes directory.
 *
 * @returns {Promise<Route[]>} The routes and their paths as KuusiRoutes
 */
export async function getKuusiRoutes(): Promise<Route[]> {
  const paths = Array.from(
    walkSync(kuusiConfig.routes.path, { includeDirs: false }),
    ({ path }) => relative(kuusiConfig.routes.path, path),
  );

  const routes: Route[] = [];

  for (const path of paths) {
    if (!/.\.(source|hook)\.(m|c)?(j|t)s$/.exec(path)) continue;

    const absolutePath =
      toFileUrl(join(Deno.cwd(), kuusiConfig.routes.path, path)).href;
    const imports = await import(absolutePath) as object;

    if (/.\.source\.(m|c)?(j|t)s$/.exec(path)) {
      if (!("default" in imports)) {
        throw new Error(
          `kuusi-no-route-export: ${absolutePath} does not provide a source export`,
        );
      }

      if (!(imports.default instanceof WebSource)) {
        throw new Error(
          `kuusi-no-valid-source: ${absolutePath} does not provide a valid source export`,
        );
      }
    } else if (/.\.hook\.(m|c)?(j|t)s$/.exec(path)) {
      if (!("default" in imports)) {
        throw new Error(
          `kuusi-no-route-export: ${absolutePath} does not provide a webhook export`,
        );
      }

      if (!(imports.default instanceof WebHook)) {
        throw new Error(
          `kuusi-no-valid-webhook: ${absolutePath} does not provide a valid webhook export`,
        );
      }
    } else continue; // Will never run

    routes.push([
      new URLPattern({ pathname: parsePath(path) }),
      imports.default,
    ]);
  }

  const parsedURLs = routes.map(([url]) =>
    url.pathname.replace(/\/:[^\/]+(?!=\/)/g, "®")
  );

  const duplicate = getDuplicate(parsedURLs)[0];

  if (duplicate) {
    const first = routes[duplicate.indexOf(duplicate)][0].pathname;
    const last = routes[duplicate.lastIndexOf(duplicate)][0].pathname;
    throw new Error(
      `kuusi-duplicate-routes: ${first} and ${last} share the same URL.`,
    );
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
 * @param {Request} req The request that needs to be handled.
 * @param {Route[]} routes The loaded routes. Notice that they can be collected by kuusi's `getKuusiRoutes` function, but is not required.
 *
 * @returns {Promise<Response>} A response from the route if a match was found. If there was no match, the response is a 404. If there was a match, but the endpoint did not support the HTTP verb of the request, the response is 405.
 */
export async function kuusi(req: Request, routes: Route[]): Promise<Response> {
  if (!httpVerbs.includes(req.method)) {
    return new Response("{}", {
      status: 405,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

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
  const matchMethod = matchRoute?.[req.method as keyof (WebSource | WebHook)];

  if (!matchMethod) {
    return new Response("{}", {
      status: 405,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  return await matchMethod(req, matchPatternResult);
}
