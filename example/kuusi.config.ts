import { KuusiConfig } from "@kuusi/kuusi/types";

const config = new KuusiConfig({
  routes: {
    directoryPath: "customRoutesDir",
    warnAmbiguousRoutes: true,
    filePaths: ["src/extraRoute.ts"],
  },
  dotenv: {
    path: "my.env",
    export: true,
    requiredPath: "myRequired.env",
    requiredKeys: ["requiredKey"],
  },
});

export default config;
