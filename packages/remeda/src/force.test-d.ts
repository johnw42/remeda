import { force } from "./force";
import { expectTypeOf } from "expect-type";

test("force", () => {
  // Test that force returns the value if it is not a function
  expectTypeOf(force(5)).toEqualTypeOf<number>();

  // Test that force calls the function and returns its value
  expectTypeOf(force(() => 5)).toEqualTypeOf<number>();

  const forceFn = force<number>();

  // Test that force returns a function that forces the value
  expectTypeOf(forceFn(5)).toEqualTypeOf<number>();
  expectTypeOf(forceFn(() => 5)).toEqualTypeOf<number>();
});
