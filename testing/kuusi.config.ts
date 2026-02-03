import type { PartialKuusiConfig } from "@kuusi/kuusi";

const config: PartialKuusiConfig = {
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
