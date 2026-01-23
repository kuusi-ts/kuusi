import { kuusi } from "kuusi";

Deno.serve(
  { port: 1296 },
  async function (req: Request): Promise<Response> {
    return await kuusi(req);
  },
);
