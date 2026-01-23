import { getRandomEmoji } from "$src/utils.ts";
import { Route } from "kuusi/types";

export const route = new Route({
  GET: (req, patternResult) => {
    const responseBody = JSON.stringify({
      todo_url: req.url,
      id: patternResult.pathname.groups.id,
      emoji: getRandomEmoji(),
    });

    return new Response(responseBody, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  },
});
