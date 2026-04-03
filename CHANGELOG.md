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

- Removed two useless interfaces.

### `0.4.6`

- Redid the configuration so now `KuusiConfig` is a class, not an interface. This cleans up the mess of semi-manually type checking the config and assigning default values.
- Apparently the colon (:) character is reserved on windows for file names, so on windows you can use the semicolon (;) instead
- Mentally getting ready for release `v1.0.0`.
