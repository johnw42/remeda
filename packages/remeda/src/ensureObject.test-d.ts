import { ensureObject } from "./ensureObject";
import { expectTypeOf } from "expect-type";

test("ensureObject", () => {
  // Test that ensureObject returns the value if it is an object
  expectTypeOf(ensureObject({})).toEqualTypeOf<object>();

  const ensureObjectFn = ensureObject();

  // Test that ensureObject returns a function that ensures the value is an object
  expectTypeOf(ensureObjectFn({})).toEqualTypeOf<object>();
});
