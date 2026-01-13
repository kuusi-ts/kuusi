export type Route = {
  url: URLPattern;
  GET: (req: Request) => Promise<Response> | Response;
  POST?: (
    req: Request,
    postBody: object,
  ) => Promise<Response> | Response;
  PUT?: (
    req: Request,
    postBody: object,
  ) => Promise<Response> | Response;
  DELETE?: (req: Request) => Promise<Response> | Response;
};

export const routeGuard = (object: object) =>
  "url" in object && "GET" in object;
