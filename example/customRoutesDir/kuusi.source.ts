import { WebSource } from "@kuusi/kuusi";

const route = new WebSource({
  GET: (req, _patternResult): Response => {
    const params = new URL(req.url).searchParams;

    return new Response(
      JSON.stringify({
        message:
          "Kuusi also supports route parameters, try to add `?id=2` to this url.",
        url: req.url.endsWith("/kuusi?id=2") ? "/subscribe" : "/kuusi?id=2",
        id: params.has("id") ? params.get("id") : undefined,
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

export default route;
