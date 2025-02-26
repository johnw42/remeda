import { ensure } from "./ensure";
import { expectTypeOf } from "expect-type";

test("ensure", () => {
  // Test that ensure returns the value if the predicate is true
  expectTypeOf(ensure(5, (x) => x > 0)).toEqualTypeOf<number>();

  const ensureFn = ensure<number>((x) => x > 0);

  // Test that ensure returns a function that ensures the value
  expectTypeOf(ensureFn(5)).toEqualTypeOf<number>();
});
