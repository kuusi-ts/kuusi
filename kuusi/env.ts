import { load } from "@std/dotenv";
import { existsSync } from "@std/fs";

const env = Deno.env.toObject();
const dotenv = await load({
  export: true,
  envPath: ".env",
});

if (existsSync(".env.template")) {
  const templateEnv = await load({
    export: true,
    envPath: ".env.template",
  });

  const notFound = Object.keys(templateEnv).find((key) => !dotenv[key]);

  if (notFound) {
    throw new Error(`\x1b[34mMissing .env variable ${notFound}\x1b[0m`);
  }
}

export { dotenv, env };
