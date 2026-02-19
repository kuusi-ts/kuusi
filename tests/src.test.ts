import { assertEquals } from "@std/assert";
import { parsePath } from "../src/utils.ts";

Deno.test({
  name: "parsePath",
  fn: () => {
    assertEquals(parsePath("index.source.js"), "/");
    assertEquals(parsePath("kuusi/index.source.cjs"), "/kuusi/");
    assertEquals(parsePath("kuusi.source.mjs"), "/kuusi");
    assertEquals(parsePath("index.hook.ts"), "/");
    assertEquals(parsePath("kuusi/index.hook.cts"), "/kuusi/");
    assertEquals(parsePath("kuusi.hook.mts"), "/kuusi");
  },
});
