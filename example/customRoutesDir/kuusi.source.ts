import { WebSource } from "@kuusi/kuusi";

const route = new WebSource({
  GET: (req, _patternResult): Response => {
    const params = new URL(req.url).searchParams;

    return new Response(
      JSON.stringify({
        message: "Welcome to kuusi",
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
