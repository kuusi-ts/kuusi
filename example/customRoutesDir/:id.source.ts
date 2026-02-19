import { unwrap } from "$src/utils.ts";
import { dotenv, WebSource } from "@kuusi/kuusi";

const route = new WebSource({
  GET: (req, patternResult) => {
    const id = unwrap(patternResult.pathname.groups.id);

    return new Response(
      JSON.stringify({
        message: "hello",
        id: id,
        dotenv,
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
