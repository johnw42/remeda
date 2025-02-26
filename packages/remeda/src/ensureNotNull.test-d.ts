import { ensureNotNull } from "./ensureNotNull";
import { expectTypeOf } from "expect-type";

test("ensureNotNull", () => {
  // Test that ensureNotNull returns the value if it is not null
  expectTypeOf(ensureNotNull(5)).toEqualTypeOf<number>();

  const ensureNotNullFn = ensureNotNull<number>();

  // Test that ensureNotNull returns a function that ensures the value is not null
  expectTypeOf(ensureNotNullFn(5)).toEqualTypeOf<number>();
});
