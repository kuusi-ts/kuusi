import { Route } from "@kuusi/kuusi";

export const route = new Route({
  GET: (req, patternResult) => {
    return new Response(
      JSON.stringify({
        message: "Welcome to kuusi!",
        url: req.url,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      },
    );
  },
});
