import type { MaybePromise } from "./utils.ts";

/**
 * Module containing all the types kuusi exports.
 *
 * @module
 */

/**
 * Type that holds a URLPattern and a Route. Used to combine the path of a Route with the Route itself.
 */
export type Route = [URLPattern, WebSource | WebHook];

/**
 * Type that holds the URLPattern and a WebHook. Used to combine the path of a WebHook with the WebHook itself.
 */
export type KuusiWebHook = [URLPattern, WebHook];

/**
 * Type of a method that serves a HTTP method on a route.
 *
 * @property req The Request that the method should fullfill.
 * @property patternResult The URLPatternResult containing the data of the match.
 */
export type WebSourceMethod = (
  req: Request,
  patternResult: URLPatternResult,
) => MaybePromise<Response>;

/**
 * Type that is implemented by `Route`, and used by said class in the constructor as parameter type. Holds the same properties as `Route`, but they aren't `readonly`.
 */
export interface WebSourceMethods {
  GET?: WebSourceMethod;
  POST?: WebSourceMethod;
  PUT?: WebSourceMethod;
  PATCH?: WebSourceMethod;
  DELETE?: WebSourceMethod;
}

/**
 * Class that represents a kuusi route. A property holding the UrlPattern is unnecessary, because kuusi's file system-based routing makes the path of the file the UrlPattern url.
 *
 * @property GET The method serving the GET method of this `Route`.
 * @property POST The method serving the POST method of this `Route`.
 * @property PUT The method serving the PUT method of this `Route`.
 * @property PATCH The method serving the PATCH method of this `Route`.
 * @property DELETE The method serving the DELETE method of this `Route`.
 *
 * @constructor Puts all the assigned methods on the class.
 */
export class WebSource implements WebSourceMethods {
  readonly GET?: WebSourceMethod;
  readonly POST?: WebSourceMethod;
  readonly PUT?: WebSourceMethod;
  readonly PATCH?: WebSourceMethod;
  readonly DELETE?: WebSourceMethod;
  readonly OPTIONS?: WebSourceMethod = () => {
    return new Response(JSON.stringify(Object.entries(this)));
  };

  constructor(obj: WebSourceMethods) {
    Object.assign(this, obj);
  }
}

export type WebHookTrigger = () => MaybePromise<void>;

/**
 * Type that is implemented by `Source`, and used by said class in the constructor as parameter type. Holds the same properties as `Route`, but they aren't `readonly`.
 */
export interface WebHookMethods extends WebSourceMethods {
  trigger: WebHookTrigger;
}

/**
 * Class that represents a kuusi route. A property holding the UrlPattern is unnecessary, because kuusi's file system-based routing makes the path of the file the UrlPattern url.
 *
 * @property trigger The method that triggers the webhook.
 * @property subscribe The method that subscribes a server.
 *
 * @constructor Puts all the assigned methods on the class.
 */
export class WebHook extends WebSource {
  readonly trigger: WebHookTrigger;

  constructor(obj: WebHookMethods) {
    super(obj);
    this.trigger = obj.trigger;
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
export type RequiredKuusiConfig = {
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

// Notice `RequiredKuusiConfig !== Required<KuusiConfig>`
export type KuusiConfig = {
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
