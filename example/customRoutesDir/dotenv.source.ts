import { dotenv, WebSource } from "@kuusi/kuusi";

const route = new WebSource({
  GET: (): Response =>
    new Response(
      JSON.stringify({
        message:
          "This is the dotenv route. The dotenv variables were loaded with kuusi's dotenv importing.",
        dotenv: dotenv,
        url: "/kuusi"
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
