/**
 * This module exports all the tools required for the user to configure kuusi.
 *
 * @module
 */

// To anyone editing this file, either someone else, or my future self. I am sorry. This code is total garbage, I know.
// It's just that (as of writing this, 02-02-2026) TypeScripts keyof checking is just garbage. Because of some weird quirk
// with extended classes the Object.keys() function returns `string[]` instead of `(keyof type)[]` which just fucks with
// everything. I wish I could use typia for this, but that would only cover half the cursedness of this. The other half is
// just my incompetence.

import { existsSync } from "@std/fs/exists";
import { join } from "@std/path/join";
import type { KuusiConfig } from "./types.ts";
import { isObjField, ObjectEntriesof } from "./utils.ts";
import type { PartialKuusiConfig } from "@kuusi/kuusi";

const defaultKuusiConfig: KuusiConfig = {
  routes: {
    path: `routes`,
    warnAmbiguousRoutes: true,
  },
  dotenv: {
    path: ".env",
    templatePath: "template.env",
    export: false,
  },
};

// This guard should be updated when new config options have been added.
// It's a function that semi-manually checks every field.
// It's a temporary solution, at least, I hope it is.
function kuusiConfigGuard(object: unknown): PartialKuusiConfig {
  if (typeof object !== "object" || object === null) throw invalidKuusiConfig;

  const maybeValidConfig = object as object;

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
    Object.entries(maybeValidConfig.dotenv).find(([key, value]) =>
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
  ) throw invalidKuusiConfig;

  return maybeValidConfig as PartialKuusiConfig;
}

const invalidKuusiConfig = new Error(
  "invalid-kuusi-config: the exported kuusiConfig should be of type `PartialKuusiConfig`",
);

const kuusiConfigImport = await import(
  join(Deno.cwd(), "kuusi.config.ts")
) as object;

const kuusiConfig = structuredClone(defaultKuusiConfig);

if ("default" in kuusiConfigImport && kuusiConfigImport.default) {
  const importedConfig = kuusiConfigGuard(kuusiConfigImport.default);

  if (importedConfig.dotenv) {
    for (const [key, value] of ObjectEntriesof(kuusiConfig.dotenv)) {
      // This casting to `string | boolean` should be completely unnecessary,
      // because both `kuusiConfig.dotenv[key]` and
      // `importedConfig.dotenv[key] ?? value` are both of type `string | boolean`
      // but `string | boolean` isn't assignable to type `never`.
      // WHAT THE FUCK IS `never` DOING HERE???
      (kuusiConfig.dotenv[key] as string | boolean) =
        importedConfig.dotenv[key] ?? value;
      // I'd like to repeat: you have to cast it to a type it already is to prevent bugs.
    }
  }

  if (importedConfig.routes) {
    for (const [key, value] of ObjectEntriesof(kuusiConfig.routes)) {
      // Same applies here
      (kuusiConfig.routes[key] as string | boolean) =
        importedConfig.routes[key] ?? value;
    }
  }

  // if (importedConfig.routes) {
  //   kuusiConfig.routes = {
  //     export: importedConfig.dotenv.export ?? defaultKuusiConfig.dotenv.export,
  //     path: importedConfig.dotenv.path ?? defaultKuusiConfig.dotenv.path,
  //     templatePath: importedConfig.dotenv.templatePath ??
  //       defaultKuusiConfig.dotenv.templatePath,
  //   };
  // }
}

if (!existsSync(kuusiConfig.routes.path, { isDirectory: true })) {
  console.log(kuusiConfig.routes.path);
  throw new Error(
    "kuusi-no-routes-directory: The routes directory does not exist.",
  );
}

console.log(kuusiConfig);

export { kuusiConfig };
