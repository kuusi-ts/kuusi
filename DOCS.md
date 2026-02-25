# Docs

Table of contents:

- [A Short Note](#a-short-note)
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

# Errors

## kuusi-invalid-kuusi-config

```ts
// ~> `config.ts`.
new Error(
  "kuusi-invalid-kuusi-config: the exported kuusiConfig should be of type `KuusiConfig`",
);
```

Thrown when the configuration of kuusi given contains illegal fields. A field is illegal if it is not on the type `KuusiConfig`.

## kuusi-no-routes-directory

```ts
// ~> `config.ts`.
new Error("kuusi-no-routes-directory: The routes directory does not exist.");
```

Thrown when the directory that should contain the routes does not exist.

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
import type { KuusiConfig } from "@kuusi/kuusi";

const config: KuusiConfig = {
  routes: {
    path: "customRoutesDir/",
    warnAmbiguousRoutes: true,
  },
  dotenv: {
    export: true,
    templatePath: "newTemplate.env",
  },
};

export default config;
```

Notice that not all fields have to be specified, a completely empty `config` is also valid. All configuration options are categorized into objects. Here is a list of those objects and the fields they contain.

## routes

### path

```ts
const config: KuusiConfig = {
  routes: {
    path: "routes/",
  },
};
```

Configures the path to the directory that holds the routes. Defaults to `routes/`.

### warnAmbiguousRoutes

```ts
const config: KuusiConfig = {
  routes: {
    warnAmbiguousRoutes: false,
  },
};
```

Configures whether a warning should be shown when two url's only differ by a trailing forwardslash.

## dotenv

### path

```ts
const config: KuusiConfig = {
  dotenv: {
    path: ".env",
  },
};
```

Configures the path to the dotenv file that will be loaded. Defaults to `.env`.

### templatePath

```ts
const config: KuusiConfig = {
  dotenv: {
    templatePath: "template.env",
  },
};
```

Configures the path to the template dotenv file that will be loaded. The template dotenv file contains all keys that the dotenv file must contain. Defaults to `template.env`.

### export

```ts
const config: KuusiConfig = {
  dotenv: {
    export: false,
  },
};
```

Configures whether the dotenv variables should also be included in the env variables. Defaults to `false`.
