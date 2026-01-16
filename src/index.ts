import { isObjKey, loadRoutes, returnStatus } from "./utils.ts";

const routes = await loadRoutes("./routes");

async function handler(req: Request): Promise<Response> {
  const match = routes.find(([url]) => url.exec(req.url));
  if (!match) return returnStatus(404);

  const [matchPattern, matchRoute] = match;
  const matchPatternResult = matchPattern.exec(req.url) as URLPatternResult;
  const reqMethodUppercase = req.method.toUpperCase() ?? "GET";

  if (
    isObjKey(reqMethodUppercase, matchRoute) &&
    matchRoute[reqMethodUppercase]?.(req, matchPatternResult)
  ) return await matchRoute[reqMethodUppercase]?.(req, matchPatternResult);

  return returnStatus(405);
}

Deno.serve({ port: 7776 }, handler);
