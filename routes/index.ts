import type { Route } from "$src/types.ts";
import { getRandomEmoji } from "$src/utils.ts";

export const route: Route = {
  url: new URLPattern({ pathname: "/" }),
  GET: (req) => {
    const responseBody = JSON.stringify({
      todo_url: req.url,
      emoji: getRandomEmoji(),
    });

    return new Response(responseBody, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  },
};
