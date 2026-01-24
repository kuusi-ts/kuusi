/**
 * The type of a method that serves a HTTP method on a route.
 *
 * @property req The Request that the method should fullfill.
 * @property patternResult The URLPatternResult containing the data of the match.
 */
export type RouteMethodMethod = (
  req: Request,
  patternResult: URLPatternResult,
) => Promise<Response> | Response;

/**
 * A type that is implemented by `Route`, and used by said class in the constructor as parameter type. Holds the same properties as `Route`, but they aren't `readonly`.
 */
export type RouteMethodsMethods = {
  GET?: RouteMethodMethod;
  POST?: RouteMethodMethod;
  PUT?: RouteMethodMethod;
  DELETE?: RouteMethodMethod;
};

/**
 * @property GET The method serving the GET method of this `Route`.
 * @property POST The method serving the POST method of this `Route`.
 * @property PUT The method serving the PUT method of this `Route`.
 * @property DELETE The method serving the DELETE method of this `Route`.
 */
export class Route implements RouteMethodsMethods {
  readonly GET?: RouteMethodMethod;
  readonly POST?: RouteMethodMethod;
  readonly PUT?: RouteMethodMethod;
  readonly DELETE?: RouteMethodMethod;

  constructor(obj: RouteMethodsMethods) {
    Object.assign(this, obj);
  }
}

/**
 * @property routePath The path to the directory that holds the routes. Defaults to `routes`.
 * @property envPath The path to the dotenv file that should be loaded by kuusi. Defaults to `.env`.
 * @property envTemplatePath The path to the template dotenv. All keys in the template dotenv should also be in the dotenv. If this is not the case, kuusi will throw an error.
 */
export type KuusiConfig = {
  routePath?: string;
  envPath?: string;
  envTemplatePath?: string;
};
