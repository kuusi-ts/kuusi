import { getRandomEmoji } from "$src/utils.ts";
import { dotenv } from "kuusi/env";
import { Route } from "kuusi/types";

export const route = new Route({
  GET: (req) => {
    const responseBody = JSON.stringify({
      todo_url: req.url,
      emoji: getRandomEmoji(),
      dotenv: dotenv,
    });

    return new Response(responseBody, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  },
});
