/**
 * Module containing all the types kuusi exports.
 *
 * @module
 */

/**
 * Type of a method that serves a HTTP method on a route.
 *
 * @property req The Request that the method should fullfill.
 * @property patternResult The URLPatternResult containing the data of the match.
 */
export type RouteMethod = (
  req: Request,
  patternResult: URLPatternResult,
) => Promise<Response> | Response;

/**
 * A type that is implemented by `Route`, and used by said class in the constructor as parameter type. Holds the same properties as `Route`, but they aren't `readonly`.
 */
export type RouteMethods = {
  GET?: RouteMethod;
  POST?: RouteMethod;
  PUT?: RouteMethod;
  DELETE?: RouteMethod;
};

/**
 * Class that represents a kuusi route. A property holding the UrlPattern is unnecessary, because kuusi's file system-based routing makes the path of the file the UrlPattern url.
 *
 * @property GET The method serving the GET method of this `Route`.
 * @property POST The method serving the POST method of this `Route`.
 * @property PUT The method serving the PUT method of this `Route`.
 * @property DELETE The method serving the DELETE method of this `Route`.
 */
export class Route implements RouteMethods {
  readonly GET?: RouteMethod;
  readonly POST?: RouteMethod;
  readonly PUT?: RouteMethod;
  readonly DELETE?: RouteMethod;

  constructor(obj: RouteMethods) {
    Object.assign(this, obj);
  }
}

/**
 * Type holding the configgable options for kuusi.
 *
 * @property routePath The path to the directory that holds the routes. Defaults to `routes`.
 * @property envPath The path to the dotenv file that should be loaded by kuusi. Defaults to `.env`.
 * @property envTemplatePath The path to the template dotenv. All keys in the template dotenv should also be in the dotenv. If this is not the case, kuusi will throw an error.
 * @property exportEnv Whether the dotenv variables should be exported to the env variables. In other words, whether the dotenv variables should also be included in the env variables. Defaults to false.
 */
export type KuusiConfig = {
  routesPath: string;
  envPath: string;
  envTemplatePath: string;
  exportDotenv: boolean;
};
