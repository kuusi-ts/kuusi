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

  for (const key of Object.keys(templateEnv)) {
    if (!dotenv[key]) {
      throw new Error(`\x1b[34mMissing .env variable ${key}\x1b[0m`);
    }
  }
}

export { dotenv, env };
