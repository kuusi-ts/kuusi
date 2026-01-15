import { routeGuard } from "./types.ts";
import { getRoutes, returnStatus } from "./utils.ts";

const routes = getRoutes("./routes");

async function handler(req: Request): Promise<Response> {
  let parsedURL = "/" + req.url.split("/").slice(3).join("/");
  if (parsedURL.endsWith("/")) parsedURL = parsedURL.slice(0, -1);

  const match = routes.find((route) => route.exec(req.url));
  if (!match) return returnStatus(404);

  console.log(`path is "${parsedURL}"`);
  console.log(match);

  const imports = await import(
    `../routes${match.pathname}/index.route.ts`
  ) as object;

  console.log(imports);

  if (
    !("route" in imports &&
      typeof imports.route === typeof Object &&
      routeGuard(imports.route as object))
  ) {
    return returnStatus(404);
  }

  return returnStatus(200);
}

Deno.serve({ port: 7776 }, handler);
