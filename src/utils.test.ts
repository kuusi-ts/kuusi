import { assertEquals } from "@std/assert";
import { parsePath } from "./utils.ts";

Deno.test(
  "parsePath",
  () => {
    assertEquals("/", parsePath("index.route.ts"));
    assertEquals("/kuusi/", parsePath("kuusi/index.route.ts"));
    assertEquals("/seitsemän", parsePath("seitsemän.route.ts"));
  },
);
