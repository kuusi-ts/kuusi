# Docs

Table of contents:

- [A Short Note](#a-short-note)
- [Getting started](#getting-started)
  - [Install the package](#step-1-install-the-package)
  - [Make project structure](#step-2-make-project-structure)
  - [Configure kuusi](#step-3-configure-kuusi)
  - [Make a webhook](#step-4-make-a-webhook)
- [Errors](#errors)
  - [`kuusi-invalid-kuusi-config`](#kuusi-invalid-kuusi-config)
  - [`kuusi-no-routes-directory`](#kuusi-no-routes-directory)
  - [`kuusi-missing-dotenv-key`](#kuusi-missing-dotenv-key)
  - [`kuusi-no-route-export`](#kuusi-no-route-export)
  - [`kuusi-no-source-export`](#kuusi-no-source-export)
  - [`kuusi-no-hook-export`](#kuusi-no-hook-export)
  - [`kuusi-duplicate-routes`](#kuusi-duplicate-routes)
- [Warnings](#warnings)
  - [`kuusi-ambiguous-url`](#kuusi-ambiguous-url)
- [Configuration](#configuration)
  - [`routes`](#routes)
    - [`path`](#path)
    - [`warnAmbiguousRoutes`](#warnambiguousroutes)
  - [`dotenv`](#dotenv)
    - [`path`](#path)
    - [`templatePath`](#templatepath)
    - [`export`](#export)

# A Short Note

This piece of documentation aims to not repeat what is already said in the JSDoc comments in the source code. If you suspect that some documentation may be missing, check that first before opening an issue.

# Getting started

Getting started with kuusi is really easy. Here is a comprehensive guide.

## Step 1: Install the package

Installing kuusi can be done with this simple terminal command.

```bash
deno add jsr:@kuusi/kuusi;
deno install;
```

## Step 2: Make project structure

If you have completed step 1, it is time to set a general project structure. First, create a `src/` directory and in it, a file called `index.ts` or `main.ts` (personally, I like the former better). Open `src/index.ts` and copy-paste the following code into it:

~> `src/index.ts`

```ts
import { getKuusiRoutes, kuusi } from "@kuusi/kuusi";

const routes = await getKuusiRoutes();

Deno.serve({ port: 1296 }, async (req) => {
  return await kuusi(req, routes);
});
```

Now, similar to before, create a `routes` directory and create a `index.source.ts` file in it, and copy-paste the following code:

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

This defines a new endpoint at `/`, keep in mind index means its the default route. Other endpoints can be made by replacing `index` with literally anything else. Generic parameters can be made with a colon (:) in the URL (on windows, the colon is a reserved character, so use a semicolon (;) instead). An example would be `:id.source.ts`.

Your app works like it should now (at least, I hope so, this isn't that complicated). All the steps from now on are optional, but might be worth a read.

## Step 3: Configure kuusi

Kuusi can easily be configured by creating a `kuusi.config.ts` file in your projects **root**. In case you forgot, the projects root is where your `deno.json`, `deno.jsonc` or `package.json` is. Keep in mind that although in the rest of kuusi any JS / TS file extension is allowed, the file extension of the configuration file **has** to be `.ts`.

Now place the following code in your newly made `kuusi.config.ts`:

```ts
import { KuusiConfig } from "@kuusi/kuusi/types";

const config = new KuusiConfig();

export default config;
```

Important: `KuusiConfig` **has** to be imported from `@kuusi/kuusi/types`, because importing it from `@kuusi/kuusi` results in a triple dependency cycle between your `kuusi.config.ts`, kuusi's `src/config.ts` and kuusi's `src/mod.ts` which all import each other in a closed loop. More on configuring kuusi can be found [here](#configuration).

## Step 4: Make a webhook

Kuusi provides a simple way to make webhooks. Instead of a route file ending in `.source.ts`, you can make it end with `.hook.ts` to make a webhook. A simple webhook would look something like this:

```ts
import { WebHook } from "@kuusi/kuusi";

const subscribers: string[] = [];

const webHookData = {
  message: "this is a kuusi webhook",
  kuusi: 6,
};

const route = new WebHook({
  trigger: () => {
    for (const subscriber of subscribers) {
      fetch(subscriber, {
        body: JSON.stringify(webHookData),
      });
    }
  },
  GET: (req: Request): Response =>
    new Response(
      JSON.stringify({
        message: "hello",
        request: req,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      },
    ),
  POST: async (req: Request): Promise<Response> => {
    const body = (await req.json()) as { url?: string };

    if (body.url) subscribers.push(body.url);

    return new Response(
      JSON.stringify({
        message: "subscribed!",
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

export default route;
```

Notice a couple of differences between a webhook and a websource:

1. Instead of importing the `WebSource` class, we import `WebHook` instead.
2. A new `trigger` method exists, which contains the logic to trigger the webhook and send data to all of its subscribers. This method can be used on other places to trigger the hook.

# Errors

Sometimes kuusi may tell you that your code sucks and give you an error alongside it, here is what they all mean.

## kuusi-invalid-kuusi-config

```ts
// ~> `config.ts`.
new Error(
  "kuusi-invalid-kuusi-config: the exported kuusiConfig should be an instance of `KuusiConfig`",
);
```

Thrown when the configuration of kuusi is illegal. This can be either because the configuration you exported wasn't exported as default, because you used the wrong type for the configuration object or because you didn't use the constructor of the `KuusiConfig` class.

## kuusi-no-routes-directory

```ts
// ~> `config.ts`.
new Error("kuusi-no-routes-directory: The routes directory does not exist.");
```

Thrown when the directory that should contain the routes does not exist. If you think that it does, check whether your routes directory's name contains a typo either in the configuration file or in your file systen.

## kuusi-missing-dotenv-key

```ts
// ~> `env.ts`
new Error(`kuusi-missing-dotenv-key: Missing dotenv variable "${notFound}"`);
```

Thrown when the dotenv file is missing one or more required keys specified in the template dotenv file.

## kuusi-no-route-export

~> `mod.ts`

```ts
// ~> `mod.ts`
new Error(
  `kuusi-no-route-export: ${absolutePath} does not provide a default export`,
);
```

Thrown when the file at `absolutePath` does not provide a default export.

## kuusi-no-source-export

```ts
// ~> `mod.ts`
new Error(
  `kuusi-no-source-export: ${absolutePath} does not provide a websource export`,
);
```

Thrown when the `.source.ts` file at `absolutePath` does not provide a (valid) websource export.

## kuusi-no-hook-export

```ts
// ~> `mod.ts`
new Error(
  `kuusi-no-hook-export: ${absolutePath} does not provide a wehook export`,
);
```

Thrown when the `.hook.ts` file at `absolutePath` does not provide a (valid) webhook export.

## kuusi-duplicate-routes

```ts
// ~> `mod.ts`
new Error(
  `kuusi-duplicate-routes: The "${duplicate}" URL is served multiple times.`,
);
```

Thrown when the URL's of the routes at `first` and `last` are the same.

### Example

`/kuusi/:id.source.ts` and `/kuusi/:notanid.hook.ts` share the same URL, because they both have the form of `/kuusi/[genericRoute]`. When a request is made with the URL `/kuusi/3`, it matches with both URL's which would be silly.

# Warnings

## kuusi-ambiguous-url

```ts
// ~> `mod.ts`
console.warn(
  `kuusi-ambiguous-url: The routes "${ambiguousURL}" and "${ambiguousURL}/" are very similar. Consider renaming at least one of them.`,
);
```

Thrown when at least two routes have very URL's that differ by only a trailing forwardslash.

# Configuration

Kuusi can easily be configured by making a `kuusi.config.ts` file in your projects root. A basic configuration file could look something like this:

```ts
import { KuusiConfig } from "@kuusi/kuusi/types";

const config = new KuusiConfig({
  routes: {
    path: "customRoutesDir/",
    warnAmbiguousRoutes: true,
  },
  dotenv: {
    export: true,
    templatePath: "newTemplate.env",
  },
});

export default config;
```

Notice that not all fields have to be specified, a completely empty `config` is also valid. All configuration options are categorized into objects. Here is a list of those objects and the fields they contain. Make sure that the configuration is exported as default, and that the configuration is made by calling the `KuusiConfig` constructor. The class MUST be imported from `@kuusi/kuusi/types`, importing from `@kuusi/kuusi` will result in a cyclic importing deadlock.

## routes

### path

```ts
const config = new KuusiConfig({
  routes: {
    path: "routes/",
  },
});
```

Configures the path to the directory that holds the routes. Defaults to `routes/`.

### warnAmbiguousRoutes

```ts
const config = new KuusiConfig({
  routes: {
    warnAmbiguousRoutes: false,
  },
});
```

Configures whether a warning should be shown when two url's only differ by a trailing forwardslash.

## dotenv

### path

```ts
const config = new KuusiConfig({
  dotenv: {
    path: ".env",
  },
});
```

Configures the path to the dotenv file that will be loaded. Defaults to `.env`.

### templatePath

```ts
const config = new KuusiConfig({
  dotenv: {
    templatePath: "template.env",
  },
});
```

Configures the path to the template dotenv file that will be loaded. The template dotenv file contains all keys that the dotenv file must contain. Defaults to `template.env`.

### export

```ts
const config = new KuusiConfig({
  dotenv: {
    export: false,
  },
});
```

Configures whether the dotenv variables should also be included in the env variables. Defaults to `false`.
