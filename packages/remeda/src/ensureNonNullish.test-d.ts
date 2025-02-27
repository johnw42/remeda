import { ensureNonNullish } from "./ensureNonNullish";
import { expectTypeOf } from "expect-type";

test("ensureNonNullish", () => {
  // Test that ensureNonNullish returns the value if it is not null
  expectTypeOf(ensureNonNullish(5)).toEqualTypeOf<number>();

  const ensureNonNullishFn = ensureNonNullish<number>();

  // Test that ensureNonNullish returns a function that ensures the value is not null
  expectTypeOf(ensureNonNullishFn(5)).toEqualTypeOf<number>();
});
