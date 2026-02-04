import { assertEquals } from "@std/assert";
import { parsePath } from "../src/utils.ts";

Deno.test({
  name: "parsePath",
  fn: () => {
    assertEquals(parsePath("index.route.ts"), "/");
    assertEquals(parsePath("kuusi/index.route.ts"), "/kuusi/");
    assertEquals(parsePath("seitsemän.route.ts"), "/seitsemän");
  },
});
