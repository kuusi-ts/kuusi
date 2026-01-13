import { returnStatus } from "./utils.ts";

function getAll(dir: string): string[] {
  const paths: string[] = [];
  for (const entry of Deno.readDirSync(dir)) {
    if (entry.isFile) {
      paths.push(entry.name);
    } else if (entry.isDirectory) {
      for (const subEntry of getAll(`${dir}/${entry.name}`)) {
        paths.push(`${entry.name}/${subEntry}`);
      }
    }
  }

  return paths;
}

const paths = getAll("./routes").map((path) =>
  path[0] === "/" ? path : `/${path}`
);

async function handler(req: Request): Promise<Response> {
  console.log(`here it is "/${req.url.split("/")[3] ?? ""}"`);

  console.log(paths);

  return returnStatus(200);
}

Deno.serve({ port: 7776 }, handler);
