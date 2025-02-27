import { ensureNonNull } from "./ensureNonNull";
import { expectTypeOf } from "expect-type";

test("ensureNonNull", () => {
  // Test that ensureNonNull returns the value if it is not null
  expectTypeOf(ensureNonNull(5)).toEqualTypeOf<number>();

  const ensureNonNullFn = ensureNonNull<number>();

  // Test that ensureNonNull returns a function that ensures the value is not null
  expectTypeOf(ensureNonNullFn(5)).toEqualTypeOf<number>();
});
