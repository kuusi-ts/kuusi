/**
 * Module containing all the types kuusi exports.
 *
 * @module
 */

/**
 * Type of an array of tuples that hold the URLPattern and the Route of each Route.
 */
export type KuusiRoute = [URLPattern, Route];

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
 * Type that is implemented by `Route`, and used by said class in the constructor as parameter type. Holds the same properties as `Route`, but they aren't `readonly`.
 */
export type RouteMethods = {
  GET?: RouteMethod;
  POST?: RouteMethod;
  PUT?: RouteMethod;
  PATCH?: RouteMethod;
  DELETE?: RouteMethod;
};

/**
 * Class that represents a kuusi route. A property holding the UrlPattern is unnecessary, because kuusi's file system-based routing makes the path of the file the UrlPattern url.
 *
 * @method GET The method serving the GET method of this `Route`.
 * @method POST The method serving the POST method of this `Route`.
 * @method PUT The method serving the PUT method of this `Route`.
 * @method PATCH The method serving the PATCH method of this `Route`.
 * @method DELETE The method serving the DELETE method of this `Route`.
 *
 * @constructor Puts all the assigned methods on the class.
 */
export class Route implements RouteMethods {
  readonly GET?: RouteMethod;
  readonly POST?: RouteMethod;
  readonly PUT?: RouteMethod;
  readonly PATCH?: RouteMethod;
  readonly DELETE?: RouteMethod;

  constructor(obj: RouteMethods) {
    Object.assign(this, obj);
  }
}

/**
 * Type holding the configgable options for kuusi.
 *
 * @property routePath: The path to the directory that holds the routes. Defaults to `routes/`.
 * @property envPath: The path to the dotenv file that will be loaded. Defaults to `.env`.
 * @property templateEnvPath: The path to the template dotenv file that will be loaded. The template dotenv file contains all keys that the dotenv file must contain. Defaults to `template.env`.
 * @property exportDotenv: whether the dotenv variables should also be included in the env variables. Defaults to `false`.
 * @property warnAmbiguousRoutes: whether a warning should be shown when two url's only differ by a trailing forwardslash.
 */
export type KuusiConfig = {
  routes: {
    path: string;
    warnAmbiguousRoutes: boolean;
  };
  dotenv: {
    path: string;
    templatePath: string;
    export: boolean;
  };
};

// Notice `PartialKuusiConfig !== Partial<KuusiConfig>`
export type PartialKuusiConfig = {
  routes?: {
    path?: string;
    warnAmbiguousRoutes?: boolean;
  };
  dotenv?: {
    path?: string;
    templatePath?: string;
    export?: boolean;
  };
};

