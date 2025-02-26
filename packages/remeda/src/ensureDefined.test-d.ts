import { ensureDefined } from "./ensureDefined";
import { expectTypeOf } from "expect-type";

test("ensureDefined", () => {
  // Test that ensureDefined returns the value if it is defined
  expectTypeOf(ensureDefined(5)).toEqualTypeOf<number>();

  const ensureDefinedFn = ensureDefined<number>();

  // Test that ensureDefined returns a function that ensures the value is defined
  expectTypeOf(ensureDefinedFn(5)).toEqualTypeOf<number>();
});
