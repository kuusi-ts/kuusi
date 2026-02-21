# Docs

Table of contents:

- A Short Note
- Errors
- Warnings
- Configuration

# A Short Note

This piece of documentation aims to not repeat what is already said in the JSDoc
comments in the source code. If you suspect that some documentation may be
missing, check that first before opening an issue.

# Errors

## `kuusi-invalid-kuusi-config`

~> `config.ts`.

```ts
new Error(
  "kuusi-invalid-kuusi-config: the exported kuusiConfig should be of type `KuusiConfig`",
);
```

Thrown when the configuration of kuusi given contains illegal fields. A field is illegal if it is not on the type `KuusiConfig`.

## `kuusi-no-routes-directory`

~> `config.ts`

```ts
throw new Error(
  "kuusi-no-routes-directory: The routes directory does not exist.",
);
```

Thrown when the directory that should contain the routes does not exist.

## `kuusi-missing-dotenv-key`

~> `env.ts`

```ts
throw new Error(
  `kuusi-missing-dotenv-key: Missing dotenv variable "${notFound}"`,
);
```

Thrown when the dotenv file is missing one or more required keys specified in the template dotenv file.

## `kuusi-no-route-export`

~> `mod.ts`

```ts
throw new Error(
  `kuusi-no-route-export: ${absolutePath} does not provide a default export`,
);
```

Thrown when the file at `absolutePath` does not provide a default export.

## `kuusi-no-source-export`

~> `mod.ts`

```ts
throw new Error(
  `kuusi-no-source-export: ${absolutePath} does not provide a websource export`,
);
```

Thrown when the `.source.ts` file at `absolutePath` does not provide a (valid) websource export.

## `kuusi-no-hook-export`

~> `mod.ts`

```ts
throw new Error(
  `kuusi-no-hook-export: ${absolutePath} does not provide a wehook export`,
);
```

Thrown when the `.hook.ts` file at `absolutePath` does not provide a (valid) webhook export.

## `kuusi-duplicate-routes`

~> `mod.ts`

```ts
throw new Error(
  `kuusi-duplicate-routes: ${first} and ${last} share the same URL.`,
);
```

Thrown when the URL's of the routes at `first` and `last` are the same.

### Example

`/kuusi/:id.source.ts` and `/kuusi/:notanid.hook.ts` share the same URL, because they both have the form of `/kuusi/[genericRoute]`. When a request is made with the URL `/kuusi/3`, it matches with both URL's which would be silly.

# Warnings

## `kuusi-ambiguous-url`

~> `mod.ts`

```ts
console.warn(
  `kuusi-ambiguous-url: "${ambiguousURL}" and "${ambiguousURL}/" are very similar. Consider renaming at least one of them.`,
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

## `routes`

## `dotenv`
