/**
 * kuusi: Se ei ole Oak-viittaus. A simple router / library / framework for
 * Deno utilizing file-based routing.
 *
 * @module
 */

import { walkSync } from "@std/fs";
import { relative } from "@std/path";
import { kuusiConfig } from "./config.ts";
import { type Route, WebHook, WebSource } from "./types.ts";
import {
  getAmbiguousURLs,
  getDuplicate,
  hookGuard,
  httpVerbs,
  parsePath,
  routeGuard,
  sourceGuard,
  toLocalPath,
} from "./utils.ts";

export * from "./env.ts";
export * from "./types.ts";

function checkDuplicateRoutes(routes: Route[]): void {
  const parsedURLs = routes.map(([url]) =>
    url.pathname.replace(/\/:[^\/]+(?!=\/)/g, "®")
  );

  const duplicate = getDuplicate(parsedURLs)[0];

  if (duplicate) {
    throw new Error(
      `kuusi-duplicate-routes: The "${duplicate}" URL is served multiple times.`,
    );
  }
}

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
    if (!routeGuard(path)) continue;

    const absolutePath = toLocalPath(kuusiConfig.routes.path, path).href;
    const imports = await import(absolutePath) as object;

    if (!("default" in imports)) {
      throw new Error(
        `kuusi-no-route-export: ${absolutePath} does not provide a default export`,
      );
    }

    if (sourceGuard(path)) {
      if (!(imports.default instanceof WebSource)) {
        throw new Error(
          `kuusi-no-source-export: ${absolutePath} does not provide a source export`,
        );
      }
    } else if (hookGuard(path)) {
      if (!(imports.default instanceof WebHook)) {
        throw new Error(
          `kuusi-no-hook-export: ${absolutePath} does not provide a webhook export`,
        );
      }
    } else continue;

    routes.push([
      new URLPattern({ pathname: parsePath(path) }),
      imports.default as WebSource | WebHook,
    ]);
  }

  checkDuplicateRoutes(routes);

  if (kuusiConfig.routes.warnAmbiguousRoutes) {
    for (const ambiguousURL of getAmbiguousURLs(routes)) {
      console.warn(
        `kuusi-ambiguous-url: The routes "${ambiguousURL}" and "${ambiguousURL}/" are very similar. Consider renaming at least one of them.`,
      );
    }
  }

  // Sorting and reversing makes sure the pathnames are checked in the
  // following order:
  // 1. Normal pathnames
  // 2. Generic pathnames (those starting with a colon)
  // 3. The root pathname
  return routes.sort(([a], [b]) =>
    a.pathname.toLowerCase().localeCompare(b.pathname.toLowerCase())
  ).reverse();
}

/**
 * A simple router that uses file system-based routing on the specified routes
 * directory.
 *
 * @param {Request} req The request that needs to be handled.
 * @param {Route[]} routes The loaded routes. Notice that they can be collected
 * by kuusi's `getKuusiRoutes` function, but is not required.
 *
 * @returns {Promise<Response>} A response from the route if a match was found.
 * If there was no match, the response is a 404. If there was a match, but the
 * endpoint did not support the HTTP verb of the request, the response is 405.
 */
export async function kuusi(req: Request, routes: Route[]): Promise<Response> {
  const headers = {
    "content-type": "application/json; charset=utf-8",
  } as const;

  if (!httpVerbs.includes(req.method)) {
    return new Response("{}", {
      status: 405,
      ...headers,
    });
  }

  const match = routes.find(([url]) => url.test(req.url));

  if (!match) {
    return new Response("{}", {
      status: 404,
      ...headers,
    });
  }

  const [matchPattern, matchRoute] = match;
  const matchPatternResult = matchPattern.exec(req.url)!;
  const matchMethod = matchRoute[req.method as keyof (WebSource | WebHook)];

  return matchMethod
    ? await matchMethod(req, matchPatternResult)
    : new Response("{}", {
      status: 405,
      ...headers,
    });
}
