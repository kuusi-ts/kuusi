import { walkSync } from "@std/fs";
import { relative } from "@std/path";

export function getRoutes(dir: string): URLPattern[] {
  const paths = Array.from(
    walkSync(dir, { includeDirs: false }),
    ({ path }) => relative(dir, path),
  );

  return paths
    .filter((path) => path.endsWith(".route.ts"))
    .map((path) =>
      new URLPattern({ pathname: "/" + path.split("/").slice(0, -1).join("/") })
    );
}

export const randomNumber = (lower: number, upper: number) =>
  Math.floor(Math.random() * (upper - lower + 1)) + lower;

export function getRandomEmoji(): string {
  const emojis = [":)", ":D", ":P", ":3"];
  return emojis[randomNumber(0, emojis.length - 1)];
}

export const returnStatus = (status: number) =>
  new Response(null, { status: status });

export function isObjKey(
  key: string | number | symbol,
  object: object,
): key is keyof object {
  return key in object;
}
