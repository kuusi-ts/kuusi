import { getKuusiRoutes, kuusi, setKuusiConfig } from "@kuusi/kuusi";

setKuusiConfig({
  routesPath: "customRoutesDir",
});

const routes = await getKuusiRoutes();

Deno.serve(async (req) => {
  return await kuusi(req, routes);
});
