import { ensurePlainObject } from "./ensurePlainObject";
import { expectTypeOf } from "expect-type";

test("ensurePlainObject", () => {
  // Test that ensurePlainObject returns the value if it is a plain object
  expectTypeOf(ensurePlainObject({})).toEqualTypeOf<object>();

  const ensurePlainObjectFn = ensurePlainObject<object>();

  // Test that ensurePlainObject returns a function that ensures the value is a plain object
  expectTypeOf(ensurePlainObjectFn({})).toEqualTypeOf<object>();
});
