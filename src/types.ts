/**
 * Module containing all the types kuusi exports.
 *
 * @module
 */

import type { MaybePromise } from "./utils.ts";

/**
 * Type that holds a URLPattern and either a `WebSource` or a `WebHook`. Used
 * to combine the path of a route with the route itself.
 */
export type Route = [URLPattern, WebSource | WebHook];

/**
 * Class that represents a kuusi WebSource.
 *
 * Note: A WebSource is what is known as a regular API endpoint.
 *
 * @implements WebHookMethods
 */
export class WebSource implements WebSourceMethods {
  /**
   * @property {WebSourceMethod | undefined} GET? The method serving the GET
   * method of this `WebSource`.
   */
  readonly GET?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} POST? The method serving the POST
   * method of this `WebSource`.
   */
  readonly POST?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} PUT? The method serving the PUT
   * method of this `WebSource`.
   */
  readonly PUT?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} PATCH? The method serving the
   * PATCH method of this `WebSource`.
   */
  readonly PATCH?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} DELETE? The method serving the
   * DELETE method of this `WebSource`.
   */
  readonly DELETE?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} OPTIONS? The method serving the
   * OPTIONS method of this `WebSource`. Defaults to returning a response
   * containing a body with the defined methods of this `WebSource`.
   */
  readonly OPTIONS?: WebSourceMethod;

  /**
   * @constructor constructor Puts all the assigned methods on the class.
   */
  constructor(obj: WebSourceMethods) {
    this.OPTIONS = () => new Response(JSON.stringify(Object.entries(this)));
    Object.assign(this, obj);
  }
}

/**
 * Interface that is implemented by `Route`, and used by said class in the
 * constructor as parameter type. Holds the same properties as `Route`, but
 * they aren't `readonly`.
 */
export interface WebSourceMethods {
  /**
   * @property {WebSourceMethod | undefined} GET? The method serving the GET
   * method of a `WebSource`.
   */
  readonly GET?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} POST? The method serving the POST
   * method of a `WebSource`.
   */
  readonly POST?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} PUT? The method serving the PUT
   * method of a `WebSource`.
   */
  readonly PUT?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} PATCH? The method serving the PATCH
   * method of a `WebSource`.
   */
  readonly PATCH?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} DELETE? The method serving the DELETE
   * method of a `WebSource`.
   */
  readonly DELETE?: WebSourceMethod;
  /**
   * @property {WebSourceMethod | undefined} OPTIONS? The method serving the OPTIONS
   * method of a `WebSource`.
   */
  readonly OPTIONS?: WebSourceMethod;
}

/**
 * Type of a method that serves a HTTP method on a route.
 *
 * @param {Request} req The Request that the method should fullfill.
 * @param {URLPatternResult} patternResult The URLPatternResult containing the
 * data of the match.
 *
 * @returns {MaybePromise<Response>}
 */
export type WebSourceMethod = (
  req: Request,
  patternResult: URLPatternResult,
) => MaybePromise<Response>;

/**
 * Class that represents a webhook. Inherits from the `WebSource` class.
 *
 * @extends WebSource
 *
 * @constructor constructor Puts all the assigned methods on the class.
 */
export class WebHook extends WebSource {
  /**
   * @property {WebHookTrigger} trigger The method that triggers the webhook.
   */
  readonly trigger: WebHookTrigger;

  constructor(obj: WebHookMethods) {
    super(obj);
    this.trigger = obj.trigger;
  }
}

/**
 * Interface that is implemented by `WebSourceMethods`, and is used by
 * `WebSource` as a constructor parameter type.
 */
export interface WebHookMethods extends WebSourceMethods {
  /**
   * @property {WebHookTrigger} trigger The method that triggers the webhook.
   */
  readonly trigger: WebHookTrigger;
}

/**
 * Type of the trigger of a webhook. The trigger function holds the logic
 * that sends data to all subscribers.
 *
 * @returns {MaybePromise<void>}
 */
export type WebHookTrigger = () => MaybePromise<void>;

/**
 * Type holding the routes configuration options.
 */
type KuusiRoutesConfig = {
  /**
   * @property {string | undefined} path? The path to the directory that holds the
   * routes. Defaults to `routes/`.
   */
  path?: string;
  /**
   * @property {boolean | undefined} warnAmbiguousRoutes? Whether a warning should be
   * shown when two url's only differ by a trailing forwardslash.
   */
  warnAmbiguousRoutes?: boolean;
};

/**
 * Type holding the dotenv and env options.
 */
type KuusiDotenvConfig = {
  /**
   * @property {string | undefined} path? The path to the template dotenv file that
   * will be loaded. The template dotenv file contains all keys that the dotenv
   * file must contain. Defaults to `template.env`.
   */
  path?: string;
  /**
   * @property {string | undefined} templatePath? The path to the dotenv file that will
   * be loaded. Defaults to `.env`.
   */
  templatePath?: string;
  /**
   * @property {boolean | undefined} export? Whether the dotenv variables should also
   * be included in the env variables. Defaults to `false`.
   */
  export?: boolean;
};

/**
 * Type holding all the fields of `KuusiConfig` with all its fields set to
 * optional, even all the fields of fields that contain objects.
 *
 * Notice `RequiredKuusiConfig !== Required<KuusiConfig>`
 */
export type KuusiConfig = {
  /**
   * @property {KuusiRoutesConfig | undefined} routes? The route configuration options.
   */
  routes?: KuusiRoutesConfig;
  /**
   * @property {KuusiDotenvConfig | undefined} dotenv? The dotenv configuration options.
   */
  dotenv?: KuusiDotenvConfig;
};

/**
 * Type holding the configgable options for kuusi.
 */
export type RequiredKuusiConfig = {
  /**
   * @property {Required<KuusiRoutesConfig>} routes The route configuration options.
   */
  routes: Required<KuusiRoutesConfig>;
  /**
   * @property {Required<KuusiDotenvConfig>} dotenv The dotenv configuration options.
   */
  dotenv: Required<KuusiDotenvConfig>;
};
