import { Route } from "@kuusi/kuusi";

export const route = new Route({
  GET: (req, patternResult) => {
    return new Response(JSON.stringify({
      message: "Welcome to kuusi!",
    }));
  },
});
