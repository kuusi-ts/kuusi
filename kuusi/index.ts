import { walkSync } from "@std/fs";
import { relative } from "@std/path";
import { config } from "../kuusi.config.ts";
import { Route } from "./types.ts";
import { isObjKey } from "./utils.ts";

const routeDir = config.routeDir ?? "routes";

const paths = Array.from(
  walkSync(routeDir, { includeDirs: false }),
  ({ path }) => relative(routeDir, path),
);

const routes: [URLPattern, Route][] = [];

for (const path of paths) {
  if (!path.endsWith(".route.ts")) continue;

  const imports = await import(`./${routeDir}/${path}`) as object;

  if (!("route" in imports)) {
    throw new Error(`routes/${path} does not provide a route export`);
  }

  if (!(imports.route instanceof Route)) {
    throw new Error(`routes/${path} does not provide a valid route export`);
  }

  let pathname = "/" + path;
  pathname = pathname.slice(
    0,
    path.split("/").at(-1) === "index.route.ts"
      ? -("index.route.ts".length + 1)
      : -".route.ts".length,
  );

  if (pathname === "") pathname = "/";

  routes.push([
    new URLPattern({ pathname: pathname }),
    imports.route,
  ]);
}

export async function kuusi(req: Request): Promise<Response> {
  const match = routes.find(([url]) => url.exec(req.url));

  if (!match) {
    return new Response("{}", {
      status: 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  const [matchPattern, matchRoute] = match;
  const matchPatternResult = matchPattern.exec(req.url) as URLPatternResult;
  const reqMethod = req.method.toUpperCase();

  if (
    isObjKey(reqMethod, matchRoute) &&
    matchRoute[reqMethod]?.(req, matchPatternResult)
  ) return await matchRoute[reqMethod]?.(req, matchPatternResult);

  return new Response("{}", {
    status: 405,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
