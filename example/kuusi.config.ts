import type { KuusiConfig } from "@kuusi/kuusi";

const config: KuusiConfig = {
  routes: {
    path: "customRoutesDir",
    warnAmbiguousRoutes: true,
  },
  dotenv: {
    path: "new.env",
    export: true,
    templatePath: "newTemplate.env",
    requiredKeys: ["requiredKey"],
  },
};

export default config;
