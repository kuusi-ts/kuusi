import { WebHook } from "@kuusi/kuusi";

const subscribers: string[] = [];

const webHookData = {
  message: "this is a kuusi webhook",
  kuusi: 6,
};

const route = new WebHook({
  trigger: () => {
    for (const subscriber of subscribers) {
      fetch(subscriber, {
        body: JSON.stringify(webHookData),
      });
    }
  },
  GET: (req: Request): Response =>
    new Response(
      JSON.stringify({
        message: "hello",
        request: req,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      },
    ),
  POST: async (req: Request): Promise<Response> => {
    const body = await req.json() as { url?: string };

    if (body.url) subscribers.push(body.url);

    return new Response(
      JSON.stringify({
        message: "subscribed!",
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
