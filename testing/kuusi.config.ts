import type { KuusiConfig } from "@kuusi/kuusi";

const config: KuusiConfig = {
  routes: {
    path: "customRoutesDir/",
    warnAmbiguousRoutes: false,
  },
  dotenv: {
    path: "new.env",
    templatePath: "newTemplate.env",
  },
};

export default config;
