/**
 * This module exports all the tools required for the user to configure kuusi.
 *
 * @module
 */

import { existsSync } from "@std/fs/exists";
import type { KuusiConfig } from "./types.ts";

// Default config
export const defaultKuusiConfig: KuusiConfig = {
  // Windows moment
  routesPath: Deno.build.os === "windows" ? "routes\\" : "routes/",
  envPath: ".env",
  templateEnvPath: "template.env",
};

/**
 * Function that checks whether an object is a valid kuusiconfig.
 *
 * @param config An object whose properties will override the default configuration. If a config option is not specified, the default option will apply.
 */
export function kuusiConfigGuard(maybeValidConfig: object): KuusiConfig {
  const kuusiConfig = structuredClone(defaultKuusiConfig);

  for (const [key, value] of Object.entries(maybeValidConfig)) {
    if (!(key in kuusiConfig)) {
      throw new Error(
        `invalid-kuusi-config-key: the configuration of kuusi you have provided contains a field with key "${key}", which is not allowed.`,
      );
    }

    if (typeof value !== typeof kuusiConfig[key as keyof KuusiConfig]) {
      throw new Error(
        `invalid-kuusi-config-value: the type of the field ${key} on the configuration of kuusi you have provided is incorrrect.`,
      );
    }

    kuusiConfig[key as keyof KuusiConfig] = value;
  }

  if (!existsSync(kuusiConfig.routesPath, { isDirectory: true })) {
    throw new Error(
      "kuusi-no-routes-directory: The routes directory does not exist.",
    );
  }

  return kuusiConfig;
}
