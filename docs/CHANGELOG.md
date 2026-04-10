# Change log

## `0.4.0`

- General cleanups

### `0.4.1`

- Fixed duplicate URL error showing incorrect URL's.

### `0.4.2`

- Fixed auto generated documentation on [JSR](https://jsr.io/@kuusi/kuusi)
- Extended `README.md` and other information files.
  - Started writing additional documentation in `DOCS.md`.

### `0.4.3`

- Fixed auto-documentation bugs on the JSR page.
- Re-added the `README.md` that was gone for some reason.

### `0.4.4`

- Fixed the importing of `kuusi.config.ts` not working at all.
- Fixed most of the quirkyness of `config.ts`.
- Added a new config option for required dotenv keys.

### `0.4.5`

- Removed two useless interfaces, because I learned that classes generate both a
  value (constructor function) and the interface in TypeScript.

## `1.0.0`

- Redid the configuration so now `KuusiConfig` is a class, not an interface.
  This cleans up the mess of semi-manually type checking the config and
  assigning default values.
- Apparently the colon (:) character is reserved on windows for file names, so
  on windows you can use the semicolon (;) instead.

### `1.0.1`

- Updated inconsistent docs.
- Added a guide to the docs.

### `1.0.2`

- Fixed faulty regex that prevented routes from being loaded.

## `1.1.0`: The Flexibility Update

- Fixed the order in which the pathnames are checked for matches such that the generic pathnames (aka those starting with colons) are checked after the normal pathnames. This makes sure they don't "claim" URL's that have route parameters in them when they aren't supposed to.
- Rethought almost all errors to rely more on documentation rather on the small descriptions they show themselves, so they can be explained better in the documentation.
- Adding routes from files outside of the routes directory is now supported, just use the `Route` class (was previously a type alias) and pass the file name to `kuusi.config.ts` and kuusi will import that route for you!
- Added unit tests for the `KuusiConfig` class.
- Renamed template dotenv to required dotenv, because I realised that is a better discription.
