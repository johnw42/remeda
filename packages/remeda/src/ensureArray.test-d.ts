import { ensureArray } from "./ensureArray";
import { expectTypeOf } from "expect-type";

test("ensureArray", () => {
  // Test that ensureArray returns the value if it is an array
  expectTypeOf(ensureArray([1, 2, 3])).toEqualTypeOf<Array<number>>();

  const ensureArrayFn = ensureArray<number>();

  // Test that ensureArray returns a function that ensures the value is an array
  expectTypeOf(ensureArrayFn([1, 2, 3])).toEqualTypeOf<Array<number>>();
});
