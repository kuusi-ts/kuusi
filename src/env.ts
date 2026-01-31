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
import { join } from "@std/path";
import { kuusiConfig } from "./mod.ts";

/** An object containing all environment variables, including those in a potential `.env` file. */
const env: Record<string, string> = Deno.env.toObject();
/** An object containing all environment variables in a `.env` file. */
const dotenv: Record<string, string> = await load({
  envPath: kuusiConfig.envPath,
});

if (existsSync(join(Deno.cwd(), kuusiConfig.templateEnvPath))) {
  const templateDotenv = await load({ export: false, envPath: kuusiConfig.templateEnvPath });

  const notFound = Object.keys(templateDotenv).find((key) => !(key in dotenv));

  if (notFound) {
    throw new Error(
      `kuusi-missing-dotenv-key: Missing .env variable "${notFound}"`,
    );
  }
}

export { dotenv, env };
