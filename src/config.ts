//import { existsSync } from "@std/fs/exists";
import type { KuusiConfig } from "./types.ts";

// Default config
const kuusiConfig: KuusiConfig = {
  envPath: ".env",
  envTemplatePath: ".env.template",
  //routesPath: "routes/",
  exportDotenv: false,
};
let configged: boolean = false;

/**
 * Function that configures kuusi. Can only be called once.
 *
 * @param config An object whose properties will override the default configuration. If a config option is not specified, the default option will apply.
 */
export function setKuusiConfig(config: Partial<KuusiConfig>): void {
  if (configged) {
    throw new Error(
      "kuusi-no-duplicate-config: The `setKuusiConfig` function can only be called once.",
    );
  }

  configged = true;

  for (const [key, value] of Object.entries(config)) {
    const keyofConfig = key as keyof KuusiConfig;
    if (!config[keyofConfig]) continue;

    // I dont even fucking know why this guard has to be this way, or even be here in the first place, but I hate it.
    if (
      kuusiConfig[keyofConfig] !== true &&
      kuusiConfig[keyofConfig] !== false &&
      value !== true && value !== false
    ) (kuusiConfig[keyofConfig] as string) = value;
  }

  console.log(kuusiConfig);

  //if (config.routesPath && !config.routesPath.endsWith("/")) {
  //  throw new Error("kuusi-routes-file: The routesPath must be a directory.");
  //}

  //if (!existsSync(kuusiConfig.routesPath)) {
  //  throw new Error(
  //    "kuusi-no-routes-directory: The routes directory does not exist.",
  //  );
  //}
}

export { kuusiConfig };
