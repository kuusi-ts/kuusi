import type { KuusiConfig } from "@kuusi/kuusi";

const config: Partial<KuusiConfig> = {
  routesPath: "customRoutesDir",
  envPath: "new.env",
  templateEnvPath: "newTemplate.env",
  warnAmbiguousRoutes: false,
};

export default config;
