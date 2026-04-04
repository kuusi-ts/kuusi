import { WebSource } from "@kuusi/kuusi";

const route = new WebSource({
  GET: (req: Request): Response => {
    return new Response(
      JSON.stringify({
        message: "Welcome to the index route",
        request: req,
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
