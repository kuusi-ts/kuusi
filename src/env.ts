/**
 * @module env
 *
 * This module contains env and dotenv exports. Whether the dotenv variables should be included in the env object can be configured in the `kuusi.config.ts` file.
 *
 * @example
 *
 * ~> `.env`
 * ```dotenv
 * one="yksi"
 * two="kaksi"
 * three="kolme"
 * sauna="sauna"
 * six="kuusi"
 * spruce="kuusi"
 * ```
 *
 * ~> `src/index.ts`
 * ```ts
 * import { dotenv } from "@kuusi/kuusi/env";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(dotenv, {
 *   one: "yksi",
 *   two: "kaksi",
 *   three: "kolme",
 *   sauna: "sauna",
 *   six: "kuusi",
 *   spruce: "kuusi",
 * });
 * ```
 */

import { load } from "@std/dotenv";
import { existsSync } from "@std/fs";
import { kuusiConfig } from "./config.ts";
import { toLocalPath } from "./utils.ts";

/**
 * Object containing all variables from a `.env` file.
 * For configuring this variable, see the docs.
 */
const dotenv: Record<string, string> = await load({
  envPath: kuusiConfig.dotenv.path,
  export: kuusiConfig.dotenv.export,
});
/**
 * Object containing all environment variables.
 * For configuring this variable, see the docs.
 */
const env: Record<string, string> = Deno.env.toObject();

if (existsSync(toLocalPath(kuusiConfig.dotenv.templatePath).pathname)) {
  const templateDotenv = await load({
    envPath: kuusiConfig.dotenv.templatePath,
    export: kuusiConfig.dotenv.export,
  });

  const notFound = Object.keys(templateDotenv).find((key) => !(key in dotenv));

  if (notFound) {
    throw new Error(
      `kuusi-missing-dotenv-key: Missing dotenv variable "${notFound}"`,
    );
  }
}

export { dotenv, env };
