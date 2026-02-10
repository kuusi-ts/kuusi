/**
 * This module contains env and dotenv exports. Whether the dotenv variables should be included in the env object can be configured in the `kuusi.config.ts` file.
 *
 * @example
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
import { join } from "@std/path";
import { kuusiConfig } from "./config.ts";

/** An object containing all environment variables in a `.env` file. */
const dotenv: Record<string, string> = await load({
  envPath: kuusiConfig.dotenv.path,
  export: kuusiConfig.dotenv.export,
});
/** An object containing all environment variables, including those in a potential `.env` file. */
const env: Record<string, string> = Deno.env.toObject();

if (existsSync(join(Deno.cwd(), kuusiConfig.dotenv.templatePath))) {
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
