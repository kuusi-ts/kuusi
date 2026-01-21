import { Route } from "$src/types.ts";
import { getRandomEmoji } from "$src/utils.ts";
import { env } from "kuusi/env";

export const route = new Route({
  GET: (req, _) => {
    const responseBody = JSON.stringify({
      todo_url: req.url,
      emoji: getRandomEmoji(),
      ...env,
    });

    return new Response(responseBody, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  },
});
