import { ensureInstance } from "./ensureInstance";
import { expectTypeOf } from "expect-type";

test("ensureInstance", () => {
  // Test that ensureInstance returns the value if it is an instance of the provided constructor
  expectTypeOf(ensureInstance(new Date(), Date)).toEqualTypeOf<Date>();

  const ensureInstanceFn = ensureInstance<Date>(Date);

  // Test that ensureInstance returns a function that ensures the value is an instance of the provided constructor
  expectTypeOf(ensureInstanceFn(new Date())).toEqualTypeOf<Date>();
});
