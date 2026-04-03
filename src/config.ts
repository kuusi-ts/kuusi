/**
 * @module config
 *
 * This module exports all the tools required for the user to configure kuusi.
 */

import { existsSync } from "@std/fs";
import { KuusiConfig } from "./types.ts";
import { toLocalPath } from "./utils.ts";

let kuusiConfig = new KuusiConfig();

const invalidKuusiConfig = new Error(
  "kuusi-invalid-kuusi-config: the exported kuusiConfig should be of type `KuusiConfig`",
);

if (existsSync(toLocalPath("kuusi.config.ts").pathname)) {
  const kuusiConfigImport = await import(
    toLocalPath("kuusi.config.ts").href
  ) as object;

  if ("default" in kuusiConfigImport && kuusiConfigImport.default) {
    if (kuusiConfigImport.default instanceof KuusiConfig) {
      kuusiConfig = kuusiConfigImport.default;
    } else {
      throw invalidKuusiConfig;
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
