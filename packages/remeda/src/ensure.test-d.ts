import { ensure } from "./ensure";
import { expectTypeOf } from "expect-type";

test("ensure", () => {
  expectTypeOf(
    ensure(5 as unknown, { test: (x) => typeof x === "number" }),
  ).toEqualTypeOf<number>();
  expectTypeOf(ensure(5, { test: (x) => x > 0 })).toEqualTypeOf<number>();

  expectTypeOf(
    ensure({ test: (x: unknown) => typeof x === "number" })(5 as unknown),
  ).toEqualTypeOf<number>();
  expectTypeOf(
    ensure({ test: (x: number) => x > 0 })(5),
  ).toEqualTypeOf<number>();
});
