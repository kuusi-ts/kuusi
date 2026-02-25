/**
 * @module config
 *
 * This module exports all the tools required for the user to configure kuusi.
 */

import { existsSync } from "@std/fs";
import type { KuusiConfig, RequiredKuusiConfig } from "./types.ts";
import { isObjField, toLocalPath } from "./utils.ts";

const defaultKuusiConfig: RequiredKuusiConfig = {
  routes: {
    path: "routes",
    warnAmbiguousRoutes: true,
  },
  dotenv: {
    path: ".env",
    templatePath: "template.env",
    export: false,
    requiredKeys: [],
  },
};

const invalidKuusiConfig = new Error(
  "kuusi-invalid-kuusi-config: the exported kuusiConfig should be of type `KuusiConfig`",
);

// This guard should be updated when new config options have been added.
// It's a function that semi-manually checks every field.
// It's a temporary solution, at least, I hope it is.
function kuusiConfigGuard(maybeValidConfig: unknown): KuusiConfig {
  if (typeof maybeValidConfig !== "object" || maybeValidConfig === null) {
    throw invalidKuusiConfig;
  }

  // Checks all the base fields
  if (
    Object.entries(maybeValidConfig).find(([key, value]) =>
      !isObjField(key, value, defaultKuusiConfig)
    )
  ) throw invalidKuusiConfig;

  // Checks all the fields in dotenv
  if (
    "dotenv" in maybeValidConfig &&
    typeof maybeValidConfig.dotenv === "object" &&
    maybeValidConfig.dotenv !== null &&
    Object.entries(maybeValidConfig.dotenv)
      .find(([key, value]) =>
        !isObjField(key, value, defaultKuusiConfig.dotenv)
      )
  ) throw invalidKuusiConfig;

  // Checks all the fields in routes
  if (
    "routes" in maybeValidConfig &&
    typeof maybeValidConfig.routes === "object" &&
    maybeValidConfig.routes !== null &&
    Object.entries(maybeValidConfig.routes).find(([key, value]) =>
      !isObjField(key, value, defaultKuusiConfig.routes)
    )
  ) {
    throw invalidKuusiConfig;
  }

  return maybeValidConfig as KuusiConfig;
}

const kuusiConfig = structuredClone(defaultKuusiConfig);

if (existsSync(toLocalPath("kuusi.config.ts").pathname)) {
  const kuusiConfigImport = await import(
    toLocalPath("kuusi.config.ts").href
  ) as object;

  if ("default" in kuusiConfigImport && kuusiConfigImport.default) {
    const importedConfig = kuusiConfigGuard(kuusiConfigImport.default);

    if (importedConfig.dotenv) {
      kuusiConfig.dotenv = {
        ...defaultKuusiConfig.dotenv,
        ...importedConfig.dotenv,
      };
    }

    if (importedConfig.routes) {
      kuusiConfig.routes = {
        ...defaultKuusiConfig.routes,
        ...importedConfig.routes,
      };
    }
  }
}

if (
  !existsSync(toLocalPath(kuusiConfig.routes.path).pathname, {
    isDirectory: true,
  })
) {
  throw new Error(
    "kuusi-no-routes-directory: The routes directory does not exist.",
  );
}

export { kuusiConfig };
