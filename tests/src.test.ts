import { assert, assertEquals } from "@std/assert";
import { parsePath, validRouteGuard } from "../src/utils.ts";
import { assertFalse } from "@std/assert/false";

Deno.test({
  name: "Parse Path",
  fn: () => {
    assertEquals(parsePath("index.source.js"), "/");
    assertEquals(parsePath("kuusi/index.source.cjs"), "/kuusi/");
    assertEquals(parsePath("kuusi.source.mjs"), "/kuusi");
    assertEquals(parsePath("index.hook.ts"), "/");
    assertEquals(parsePath("kuusi/index.hook.cts"), "/kuusi/");
    assertEquals(parsePath("kuusi.hook.mts"), "/kuusi");
  },
});

Deno.test({
  name: "Valid route",
  fn: () => {
    assert(validRouteGuard("index.source.ts"));
    assert(validRouteGuard("kuusi.hook.js"));
    assert(validRouteGuard("yksi.source.mjs"));
    assert(validRouteGuard("kaksi.source.cts"));
    assert(validRouteGuard("kolme.hook.mjsx"));
    assert(validRouteGuard("viisi.hook.ctsx"));
    assertFalse(validRouteGuard("index.source.rs")); // No rust
    assertFalse(validRouteGuard("kuusi.source.cs")); // No csharp
    assertFalse(validRouteGuard("yksi.hook.kts"));
    assertFalse(validRouteGuard("kaksi.hook.sqwuimble"));
    assertFalse(validRouteGuard("kolme.source.kmtsx"));
  },
});
