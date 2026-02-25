# To do list

- Default headers for returned responses.
- Add CORS support
  - Express like?
  - Kuusi config option?
  - Route config option seems best
- ? Implement a standard way to handle databases
  - May be too difficult, as I have too little experience with anything other than sqlite3

## Already done list

- Learn about and implement webhooks
- Make kuusi check whether two routes are duplicate.
- Sort the fields in `KuusiConfig` by theme, so for example all dotenv fields
  are grouped in a `dotenv` object.
- ? OPTIONS verb that gives the options of that endpoint

## Not going to do list

- Learn about and implement websockets
  - `Deno.upgradeWebSocket`?
  - Deno has this already completely fixed, so I don't really know what I could add still.
