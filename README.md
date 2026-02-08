# kuusi

Pronounce: /ˈkʷuːsi/

A simple JavaScript / TypeScript framework for the backend using Deno.

## Featuring

- Files based routing, with url arguments.
- env and dotenv parsing.

## To do list

- Add CORS support
  - Express like?
  - Kuusi config option?
  - Route config option seems best
- Learn about and implement websockets
  - `Deno.upgradeWebSocket`?
- Learn about and implement webhooks
- ? Implement a standard way to handle databases
- ? Implement other backend-related things

## Already done list

- Make kuusi check whether two routes are duplicate.
- Sort the fields in `KuusiConfig` by theme, so for example all dotenv fields
  are grouped in a `dotenv` object. [DONE]
- ? OPTIONS verb that gives the options of that endpoint
