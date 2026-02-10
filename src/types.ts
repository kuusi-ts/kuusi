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
 * Type of a method that serves a HTTP method on a route.
 *
 * @param {Request} req The Request that the method should fullfill.
 * @param {URLPatternResult} patternResult The URLPatternResult containing the data of the match.
 *
 * @returns {MaybePromise<Response>}
 */
export type WebSourceMethod = (
  req: Request,
  patternResult: URLPatternResult,
) => MaybePromise<Response>;

/**
 * Type that is implemented by `Route`, and used by said class in the
 * constructor as parameter type. Holds the same properties as `Route`, but
 * they aren't `readonly`.
 *
 * @property {WebSourceMethod | undefined} GET The method serving the GET method of this `WebSource`.
 * @property {WebSourceMethod | undefined} POST The method serving the POST method of this `WebSource`.
 * @property {WebSourceMethod | undefined} PUT The method serving the PUT method of this `WebSource`.
 * @property {WebSourceMethod | undefined} PATCH The method serving the PATCH method of this `WebSource`.
 * @property {WebSourceMethod | undefined} DELETE The method serving the DELETE method of this `WebSource`.
 */
export interface WebSourceMethods {
  readonly GET?: WebSourceMethod;
  readonly POST?: WebSourceMethod;
  readonly PUT?: WebSourceMethod;
  readonly PATCH?: WebSourceMethod;
  readonly DELETE?: WebSourceMethod;
  readonly OPTIONS?: WebSourceMethod;
}

/**
 * Class that represents a kuusi route. A property holding the UrlPattern is
 * unnecessary, because kuusi's file system-based routing makes the path of
 * the file the UrlPattern url.
 *
 * Note: A WebSource is what is known as a regular API endpoint.
 *
 * @property {WebSourceMethod | undefined} GET The method serving the GET method of this `WebSource`.
 * @property {WebSourceMethod | undefined} POST The method serving the POST method of this `WebSource`.
 * @property {WebSourceMethod | undefined} PUT The method serving the PUT method of this `WebSource`.
 * @property {WebSourceMethod | undefined} PATCH The method serving the PATCH method of this `WebSource`.
 * @property {WebSourceMethod | undefined} DELETE The method serving the DELETE method of this `WebSource`.
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

/**
 * The type of the trigger of a webhook. The trigger function holds the logic
 * that sends data to all subscribers.
 *
 * @returns {MaybePromise<void>}
 */
export type WebHookTrigger = () => MaybePromise<void>;

/**
 * Interface that is implemented by `WebSourceMethods`, and is used by
 * `WebSource` as a constructor parameter type.
 *
 * @property {WebHookTrigger} trigger The method that triggers the webhook.
 */
export interface WebHookMethods extends WebSourceMethods {
  readonly trigger: WebHookTrigger;
}

/**
 * Class that represents a webhook. Inherits from the `WebSource` class.
 *
 * @property {WebHookTrigger} trigger The method that triggers the webhook.
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
 * @property {string} routes.path The path to the directory that holds the routes. Defaults to `routes/`.
 * @property {boolean} routes.warnAmbiguousRoutes Whether a warning should be shown when two url's only differ by a trailing forwardslash.
 * @property {string} dotenv.path The path to the template dotenv file that will be loaded. The template dotenv file contains all keys that the dotenv file must contain. Defaults to `template.env`.
 * @property {string} dotenv.templatePath The path to the dotenv file that will be loaded. Defaults to `.env`.
 * @property {boolean} dotenv.export Whether the dotenv variables should also be included in the env variables. Defaults to `false`.
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

/**
 * Type holding all the fields of `KuusiConfig` with all its fields set to
 * optional, even all the fields of fields that contain objects.
 *
 * Notice `RequiredKuusiConfig !== Required<KuusiConfig>`
 */
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
