# To do list

- Add CORS support
  - Express like?
  - Kuusi config option?
  - Route config option seems best
- Learn about and implement websockets
  - `Deno.upgradeWebSocket`?
  - Deno has this already completely fixed, so I don't really know what I could add still.
- Learn about and implement webhooks
- ? Implement a standard way to handle databases
  - May be too difficult, as I have too little experience with anything other tha sqlite3
- ? Implement other backend-related things

## Already done list

- Make kuusi check whether two routes are duplicate.
- Sort the fields in `KuusiConfig` by theme, so for example all dotenv fields
  are grouped in a `dotenv` object. [DONE]
- ? OPTIONS verb that gives the options of that endpoint
