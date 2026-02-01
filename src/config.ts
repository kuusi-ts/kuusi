/**
 * This module exports all the tools required for the user to configure kuusi.
 *
 * @module
 */

import { existsSync } from "@std/fs/exists";
import { join } from "@std/path/join";
import type { KuusiConfig } from "./types.ts";

// Default config
const kuusiConfig: KuusiConfig = {
  // Windows moment
  routesPath: Deno.build.os === "windows" ? "routes\\" : "routes/",
  envPath: ".env",
  templateEnvPath: "template.env",
  exportDotenv: false,
  warnAmbiguousRoutes: true,
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
    if (!(key in kuusiConfig)) throw invalidKuusiConfig;

    if (typeof value !== typeof kuusiConfig[key as keyof KuusiConfig]) {
      throw invalidKuusiConfig;
    }

    (kuusiConfig[key as keyof KuusiConfig] as string | boolean) = value as
      | string
      | boolean;
  }

  if (!existsSync(kuusiConfig.routesPath, { isDirectory: true })) {
    throw new Error(
      "kuusi-no-routes-directory: The routes directory does not exist.",
    );
  }
}

export { kuusiConfig };
