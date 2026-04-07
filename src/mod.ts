/**
 * kuusi: Se ei ole Oak-viittaus. A simple router / library / framework for
 * Deno utilizing file-based routing.
 *
 * @module
 */

import { walkSync } from "@std/fs";
import { relative } from "@std/path";
import { kuusiConfig } from "./config.ts";
import { Route, WebHook, WebSource } from "./types.ts";
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

/**
 * Function that collects all the routes from the routes directory.
 *
 * @returns {Promise<Route[]>} The routes and their paths as KuusiRoutes
 */
export async function getKuusiRoutes(): Promise<Route[]> {
  const routes: Route[] = [];

  const directoryPath = kuusiConfig.routes.directoryPath;

  if (directoryPath) {
    const paths = Array.from(
      walkSync(directoryPath, { includeDirs: false }),
      ({ path }) => relative(directoryPath, path),
    );

    for (const path of paths) {
      if (!routeGuard(path)) continue;

      const absolutePath = toLocalPath(directoryPath, path).href;
      const imports = await import(absolutePath) as object;

      if (!("default" in imports)) {
        throw new Error(
          `kuusi-no-default-export: ${absolutePath} does not provide a default export.`,
        );
      }

      if (sourceGuard(path) && !(imports.default instanceof WebSource)) {
        throw new Error(
          `kuusi-no-source-export: ${absolutePath} does not provide a source export.`,
        );
      }

      if (hookGuard(path) && !(imports.default instanceof WebHook)) {
        throw new Error(
          `kuusi-no-hook-export: ${absolutePath} does not provide a webhook export.`,
        );
      }

      routes.push(
        new Route({
          urlPattern: new URLPattern({ pathname: parsePath(path) }),
          route: imports.default as WebSource | WebHook,
        }),
      );
    }
  }

  for (const filePath of kuusiConfig.routes.filePaths) {
    const routeFileImports = await import(toLocalPath(filePath).href) as object;

    if (Object.keys(routeFileImports).length === 0) {
      throw new Error(`kuusi-no-route-file-exports `);
    }

    for (const [name, routeFileImport] of Object.entries(routeFileImports)) {
      if (routeFileImport instanceof Route) {
        routes.push(routeFileImport);
      } else {
        // todo @Derek Verduijn document this warning and think of better name
        console.warn(
          `kuusi-extra-route-export: The ${name} export from ${filePath} is not a route.`,
        );
      }
    }
  }

  /* checkDuplicateRoutes */ {
    const parsedURLs = routes.map(({ urlPattern }) =>
      urlPattern.pathname.replace(/\/:[^\/]+(?!=\/)/g, "®")
    );

    const duplicate = getDuplicate(parsedURLs)[0];

    if (duplicate) {
      throw new Error(
        `kuusi-duplicate-routes: The "${duplicate}" URL is served multiple times.`,
      );
    }
  }

  if (kuusiConfig.routes.warnAmbiguousRoutes) {
    for (const ambiguousURL of getAmbiguousURLs(routes)) {
      // todo @Derek Verduijn document this warning
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
  return routes.sort(({ urlPattern: a }, { urlPattern: b }) =>
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

  const match = routes.find(({ urlPattern }) => urlPattern.test(req.url));

  if (!match) {
    return new Response("{}", {
      status: 404,
      ...headers,
    });
  }

  const { urlPattern, route } = match;
  const patternResult = urlPattern.exec(req.url)!;
  const method = route[req.method as keyof (WebSource | WebHook)];

  return method ? await method(req, patternResult) : new Response("{}", {
    status: 405,
    ...headers,
  });
}
