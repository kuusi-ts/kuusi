import { KuusiConfig } from "@kuusi/kuusi";

const config = new KuusiConfig({
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
});

export default config;
