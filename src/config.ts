/**
 * This module exports all the tools required for the user to configure kuusi.
 *
 * @module
 */

import { existsSync } from "@std/fs/exists";
import { join } from "@std/path/join";
import type { KuusiConfig } from "./types.ts";
import { isObjKey } from "./utils.ts";

// Default config
const kuusiConfig: KuusiConfig = {
  routes: {
    // Windows moment
    path: "routes" + Deno.build.os === "windows" ? "\\" : "/",
    warnAmbiguousRoutes: true,
  },
  dotenv: {
    path: ".env",
    templatePath: "template.env",
    export: false,
  },
};

const configImport = await import(
  join(Deno.cwd(), "kuusi.config.ts")
) as object;

const invalidKuusiConfig = new Error(
  "invalid-kuusi-config: the exported kuusiConfig should be of type `Partial<KuusiConfig>`",
);

if ("default" in configImport && configImport.default) {
  if (
    typeof configImport.default !== "object" && configImport.default !== null
  ) throw invalidKuusiConfig;

  const maybeValidConfig = configImport.default;

  for (const [key, value] of Object.entries(maybeValidConfig)) {
    if (!isObjKey(key, kuusiConfig)) throw invalidKuusiConfig;

    if (typeof value !== typeof kuusiConfig[key]) {
      throw invalidKuusiConfig;
    }

    kuusiConfig[key] = value;
  }

  if (!existsSync(kuusiConfig.routes.path, { isDirectory: true })) {
    throw new Error(
      "kuusi-no-routes-directory: The routes directory does not exist.",
    );
  }
}

export { kuusiConfig };
