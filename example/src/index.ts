import { getKuusiRoutes, kuusi } from "@kuusi/kuusi";

const routes = await getKuusiRoutes();

Deno.serve({ port: 1296 }, async (req) => {
  return await kuusi(req, routes);
});
