import { getKuusiRoutes, kuusi } from "@kuusi/kuusi";

const routes = await getKuusiRoutes();

Deno.serve(async (req) => {
  return await kuusi(req, routes);
});
