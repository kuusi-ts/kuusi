import { WebSource } from "@kuusi/kuusi";

const route = new WebSource({
  GET: (req: Request): Response => {
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response(null, { status: 501 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log("A client connected!");
    };

    socket.onmessage = (event) => {
      if (event.data === "ping") {
        socket.send("pong");
      }
    };

    socket.onerror = (event) => {
      console.log("Error observed, closing websocket. Error: ", event);
    };

    socket.onclose = (event) => {
      console.log(
        `WebSocket closed: Code=${event.code}, Reason=${event.reason}`,
      );
    };

    return response;
  },
});

export default route;
