import { Route, WebSource } from "@kuusi/kuusi";

const thing = new Route({
  urlPattern: new URLPattern({ pathname: "/kuusi/viisi" }),
  route: new WebSource({
    GET: (req): Response => {
      const searchParams = new URL(req.url).searchParams;

      return new Response(
        JSON.stringify({
          message: "Welcome to viisi, shhhhh",
          id: searchParams.has("id") ? searchParams.get("id") : undefined,
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        },
      );
    },
  }),
});

export default thing;
