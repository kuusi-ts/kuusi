import { KuusiConfig } from "@kuusi/kuusi/types";

const config = new KuusiConfig({
  routes: {
    directoryPath: "customRoutesDir",
    warnAmbiguousRoutes: true,
    filePaths: ["src/extraRoute.ts"],
  },
  dotenv: {
    path: "new.env",
    export: true,
    templatePath: "newTemplate.env",
    requiredKeys: ["requiredKey"],
  },
});

export default config;
