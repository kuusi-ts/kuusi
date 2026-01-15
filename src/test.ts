//import { getRoutes } from "./utils.ts";
import { Route } from "./types.ts";

const route = new Route({
  GET: (req: Request) => {
    const responseBody = JSON.stringify({
      todo_url: req.url,
    });

    return new Response(responseBody, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  },
});

console.log(route);
