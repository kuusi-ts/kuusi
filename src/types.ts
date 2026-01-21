export type RouteMethod = (
  req: Request,
  patternResult: URLPatternResult,
) => Promise<Response> | Response;

export type RouteMethods = {
  GET?: RouteMethod;
  POST?: RouteMethod;
  PUT?: RouteMethod;
  DELETE?: RouteMethod;
};

export class Route implements RouteMethods {
  readonly GET?: RouteMethod;
  readonly POST?: RouteMethod;
  readonly PUT?: RouteMethod;
  readonly DELETE?: RouteMethod;

  constructor(obj: RouteMethods) {
    Object.assign(this, obj);
  }
}
