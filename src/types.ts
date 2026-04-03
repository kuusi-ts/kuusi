/**
 * @module types
 *
 * Module containing all the types kuusi exports.
 */

type MaybePromise<T> = T | Promise<T>;

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
export class WebSource {
  /** The method serving the GET method of this `WebSource`. */
  readonly GET?: WebSourceMethod;
  /** The method serving the POST method of this `WebSource`. */
  readonly POST?: WebSourceMethod;
  /** The method serving the PUT method of this `WebSource`. */
  readonly PUT?: WebSourceMethod;
  /** The method serving the PATCH method of this `WebSource`. */
  readonly PATCH?: WebSourceMethod;
  /** The method serving the DELETE method of this `WebSource`. */
  readonly DELETE?: WebSourceMethod;
  /** The method serving the OPTIONS method of this `WebSource`. */
  readonly OPTIONS?: WebSourceMethod;

  constructor(obj: WebSource) {
    this.OPTIONS = () => new Response(JSON.stringify(Object.entries(this)));
    Object.assign(this, obj);
  }
}

/**
 * Type of a method that serves a HTTP method on a route.
 */
export type WebSourceMethod = (
  /** The Request that the method should fullfill. */
  req: Request,
  /** The URLPatternResult containing the data of the match. */
  patternResult: URLPatternResult,
) => MaybePromise<Response>;

/**
 * Class that represents a webhook. Inherits from the `WebSource` class.
 *
 * @see WebSource
 */
export class WebHook extends WebSource {
  /** The method that triggers the webhook. */
  readonly trigger: WebHookTrigger;

  constructor(obj: WebHook) {
    super(obj);
    this.trigger = obj.trigger;
  }
}

/**
 * Type of the trigger of a webhook. The trigger function holds the logic
 * that sends data to all subscribers.
 */
export type WebHookTrigger = () => MaybePromise<void>;

/** Type holding the routes configuration options. */
interface KuusiRoutesConfig {
  /**
   * The path to the directory that holds the routes. Defaults to `routes/`.
   */
  path: string;
  /**
   * Whether a warning should be shown when two url's only differ by a trailing
   * forwardslash.
   */
  warnAmbiguousRoutes: boolean;
}

/** Type holding the dotenv and env options. */
interface KuusiDotenvConfig {
  /**
   * The path to the dotenv file that will be loaded. Defaults to
   * `template.env`.
   */
  path: string;
  /**
   * The path to the template dotenv file that will be loaded. The template
   * dotenv file contains all keys that the dotenv file must contain. Defaults
   * to `.env`.
   */
  templatePath: string;
  /**
   * Whether the dotenv variables should also be included in the env variables.
   * Defaults to `false`.
   */
  export: boolean;
  /**
   * A string of required dotenv keys. Will neither override the required keys from
   * the template dotenv, nor get overridden by the template dotenv. Defaults to `[]`.
   */
  requiredKeys: string[];
}

/**
 * Type holding all the fields of `KuusiConfig` with all its fields set to
 * optional, even all the fields of fields that contain objects.
 */
export interface PartialKuusiConfig {
  /** The route configurationoptions. */
  routes?: Partial<KuusiRoutesConfig>;
  /** The dotenv configuration options. */
  dotenv?: Partial<KuusiDotenvConfig>;
}

/**
 * Class for configuring Kuusi. Config has to be made by calling constructor,
 * won't work if it wasn't.
 */
export class KuusiConfig {
  /** The route configuration options. */
  routes: KuusiRoutesConfig = {
    path: "routes",
    warnAmbiguousRoutes: true,
  };
  /** The dotenv configuration options. */
  dotenv: KuusiDotenvConfig = {
    path: ".env",
    templatePath: "template.env",
    export: false,
    requiredKeys: [],
  };

  constructor(obj?: PartialKuusiConfig) {
    if (!obj) return;
    if (obj.routes) Object.assign(this.routes, obj.routes);
    if (obj.dotenv) Object.assign(this.dotenv, obj.dotenv);
  }
}
