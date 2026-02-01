import { dotenv, getKuusiRoutes, kuusi } from "@kuusi/kuusi";

console.log(dotenv);

const routes = await getKuusiRoutes();

Deno.serve(async (req) => {
  return await kuusi(req, routes);
});
