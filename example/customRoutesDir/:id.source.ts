import { WebSource } from "@kuusi/kuusi";

const route = new WebSource({
  GET: (_, patternResult) =>
    new Response(
      JSON.stringify({
        message:
          "Kuusi also supports route parameters from URLPatterns. This route uses generic routes.",
        url: patternResult.pathname.groups.id === "3" ? "/2" : "/3",
        id: patternResult.pathname.groups.id!,
        extraUrl: "/kuusi/viisi",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      },
    ),
});

export default route;
