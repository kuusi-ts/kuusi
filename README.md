# [kuusi](https://jsr.io/@kuusi/kuusi)

[![JSR version](https://jsr.io/badges/@kuusi/kuusi)](https://jsr.io/@kuusi/kuusi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JSR Score](https://jsr.io/badges/@kuusi/kuusi/score)](https://jsr.io/@kuusi/kuusi/score)

Pronounce: /ˈkʷuːsi/

A simple JavaScript / TypeScript framework for the backend using Deno.

## Installation

```sh
deno add jsr:@kuusi/kuusi
```

## Featuring

- Files based routing, with url arguments.
- env and dotenv parsing.
- Simple configuring with `kuusi.config.ts`.

## Basic usage

~> `routes/index.source.ts`

```ts
import { WebSource } from "@kuusi/kuusi";

export const route = new WebSource({
  GET: (req, patternResult) => {
    return new Response(
      JSON.stringify({
        message: "welcome to kuusi!",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      },
    );
  },
});
```

~> `src/index.ts`

```ts
import { getKuusiRoutes, kuusi } from "@kuusi/kuusi";

const routes = await getKuusiRoutes();

Deno.serve({ port: 1296 }, async (req) => {
  return await kuusi(req, routes);
});
```

# Misc

- [Flavortown link](https://flavortown.hackclub.com/projects/10244)
