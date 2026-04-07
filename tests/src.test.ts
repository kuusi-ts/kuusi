import { assert, assertEquals } from "@std/assert";
import { assertFalse } from "@std/assert/false";
import { parsePath, routeGuard } from "../src/utils.ts";

Deno.test({
  name: "Parse Path",
  fn: () => {
    assertEquals(parsePath("index.source.js"), "/");
    assertEquals(parsePath("kuusi/index.source.cjs"), "/kuusi/");
    assertEquals(parsePath("kuusi.source.mjs"), "/kuusi");
    assertEquals(parsePath("index.hook.ts"), "/");
    assertEquals(parsePath("kuusi/index.hook.cts"), "/kuusi/");
    assertEquals(parsePath("kuusi.hook.mts"), "/kuusi");
    assertEquals(parsePath("viisi/:id.source.ctsx"), "/viisi/:id");
  },
});

Deno.test({
  name: "Valid route",
  fn: () => {
    assert(routeGuard("index.source.ts"));
    assert(routeGuard("kuusi.hook.js"));
    assert(routeGuard("yksi.source.mjs"));
    assert(routeGuard("kaksi.source.cts"));
    assert(routeGuard("kolme.hook.mjsx"));
    assert(routeGuard("viisi.hook.ctsx"));
    assertFalse(routeGuard("index.source.rs")); // No rust
    assertFalse(routeGuard("kuusi.source.cs")); // No csharp
    assertFalse(routeGuard("yksi.hook.kts"));
    assertFalse(routeGuard("kaksi.hook.sqwuimble"));
    assertFalse(routeGuard("kolme.source.kmtsx"));
  },
});

// todo @Derek Verduijn write tests for the config setup
