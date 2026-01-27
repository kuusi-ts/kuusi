/**
 * This module contains env and dotenv exports. Whether the dotenv variables should be included in the env object can be configured in the `kuusi.config.ts` file.
 *
 * ```dotenv
 * one="yksi"
 * two="kaksi"
 * three="kolme"
 * sauna="sauna"
 * six="kuusi"
 * spruce="kuusi"
 * ```
 *
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
 *
 * @module
 */

import { load } from "@std/dotenv";
import { existsSync } from "@std/fs";
import { kuusiConfig } from "./config.ts";

/** An object containing all environment variables, including those in a potential `.env` file. */
const env = Deno.env.toObject();
/** An object containing all environment variables in a `.env` file. */
const dotenv = await load({
  export: kuusiConfig.exportDotenv ?? false,
  envPath: kuusiConfig.envPath ?? ".env",
});

if (existsSync(".env.template")) {
  const templateEnv = await load({
    export: true,
    envPath: kuusiConfig.envTemplatePath ?? ".env.template",
  });

  const notFound = Object.keys(templateEnv).find((key) => !dotenv[key]);

  if (notFound) {
    throw new Error(`kuusi-missing-dotenv-key: Missing .env variable ${notFound}`);
  }
}

export { dotenv, env };
