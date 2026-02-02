import type { SuperPartialKuusiConfig } from "@kuusi/kuusi";

const config: SuperPartialKuusiConfig = {
  routes: {
    path: "customRoutesDir",
    warnAmbiguousRoutes: false,
  },
  dotenv: {
    path: "new.env",
    templatePath: "newTemplate.env",
  },
};

export default config;
