import { getKuusiRoutes, kuusi } from "@kuusi/kuusi";

const routes = await getKuusiRoutes();

console.log(routes);

Deno.serve({ port: 1296 }, async (req) => {
  return await kuusi(req, routes);
});
