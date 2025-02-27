import { ensureInstanceOf } from "./ensureInstanceOf";
import { expectTypeOf } from "expect-type";

test("ensureInstanceOf", () => {
  // Test that ensureInstanceOf returns the value if it is an instance of the provided constructor
  expectTypeOf(ensureInstanceOf(new Date(), Date)).toEqualTypeOf<Date>();

  const ensureInstanceOfFn = ensureInstanceOf<Date>(Date);

  // Test that ensureInstanceOf returns a function that ensures the value is an instance of the provided constructor
  expectTypeOf(ensureInstanceOfFn(new Date())).toEqualTypeOf<Date>();
});
