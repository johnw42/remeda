import { ensureType } from "./ensureType";
import { expectTypeOf } from "expect-type";

test("ensureType", () => {
  // Test that ensureType returns the value if it is of the provided type
  expectTypeOf(ensureType(5, "number")).toEqualTypeOf<number>();

  const ensureTypeFn = ensureType("number");

  // Test that ensureType returns a function that ensures the value is of the provided type
  expectTypeOf(ensureTypeFn(5)).toEqualTypeOf<number>();
});
