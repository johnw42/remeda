import { ensureTruthy } from "./ensureTruthy";
import { expectTypeOf } from "expect-type";

test("ensureTruthy", () => {
  // Test that ensureTruthy returns the value if it is truthy
  expectTypeOf(ensureTruthy(5)).toEqualTypeOf<number>();

  const ensureTruthyFn = ensureTruthy<number>();

  // Test that ensureTruthy returns a function that ensures the value is truthy
  expectTypeOf(ensureTruthyFn(5)).toEqualTypeOf<number>();
});
