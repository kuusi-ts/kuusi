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
};

const configImport = await import(
  join(Deno.cwd(), "kuusi.config.ts")
) as object;

if (
  "default" in configImport &&
  typeof configImport.default === "object" &&
  configImport.default
) {
  const maybeValidConfig = configImport.default;

  // Checks whether maybeValidConfig contains any illegal keys
  for (const [key, value] of Object.entries(maybeValidConfig)) {
    if (!(key in kuusiConfig)) {
      throw new Error(
        `invalid-kuusi-config-key: the configuration of kuusi you have provided contains a field with key "${key}", which is not allowed.`,
      );
    }

    // Checks whether maybeValidConfig contains any illegal values
    if (typeof value !== typeof kuusiConfig[key as keyof KuusiConfig]) {
      throw new Error(
        `invalid-kuusi-config-value: the type of the field ${key} on the configuration of kuusi you have provided is incorrrect.`,
      );
    }

    (kuusiConfig[key as keyof KuusiConfig] as string | boolean) = value as string | boolean;
  }

  if (!existsSync(kuusiConfig.routesPath, { isDirectory: true })) {
    throw new Error(
      "kuusi-no-routes-directory: The routes directory does not exist.",
    );
  }
}

export { kuusiConfig };
