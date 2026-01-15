type RouteMethod = (req: Request) => Promise<Response> | Response;

export interface RouteMethods {
  readonly GET?: RouteMethod;
  readonly POST?: RouteMethod;
  readonly PUT?: RouteMethod;
  readonly DELETE?: RouteMethod;
};

export class Route implements RouteMethods {
  // readonly GET?: RouteMethod;
  // readonly POST?: RouteMethod;
  // readonly PUT?: RouteMethod;
  // readonly DELETE?: RouteMethod;

  constructor(obj: RouteMethods) {
    if ("GET" in obj) super(GET) = obj.GET;
    if ("POST" in obj) super(POST) = obj.POST;
    if ("PUT" in obj) super(PUT) = obj.PUT;
    if ("DELETE" in obj) super(DELETE) = obj.DELETE;
  }
}

export const routeGuard = (object: object) => object instanceof Route;
