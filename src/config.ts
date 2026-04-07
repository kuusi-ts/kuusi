/**
 * @module config
 *
 * This module exports all the tools required for the user to configure kuusi.
 */

import { existsSync } from "@std/fs";
import { KuusiConfig } from "./types.ts";
import { toLocalPath } from "./utils.ts";

let kuusiConfig = new KuusiConfig();

if (existsSync(toLocalPath("kuusi.config.ts").pathname)) {
  const kuusiConfigImport = await import(
    toLocalPath("kuusi.config.ts").href
  );

  if (!("default" in kuusiConfigImport)) {
    throw new Error(
      "kuusi-no-kuusi-config: The configuration file does not have a default export.",
    );
  }

  if (!(kuusiConfigImport.default instanceof KuusiConfig)) {
    throw new Error(
      "kuusi-invalid-kuusi-config: The exported kuusiConfig should be an instance of `KuusiConfig`.",
    );
  }

  kuusiConfig = kuusiConfigImport.default;
}

if (
  kuusiConfig.routes.directoryPath !== undefined &&
  !existsSync(toLocalPath(kuusiConfig.routes.directoryPath).pathname, {
    isDirectory: true,
  })
) {
  throw new Error(
    "kuusi-no-routes-directory: The routes directory does not exist.",
  );
}

export { kuusiConfig };
