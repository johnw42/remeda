import { ensure } from "./ensure";
import { expectTypeOf } from "expect-type";

describe("ensure", () => {
  test("data first", () => {
    // Narrowing conversion.
    expectTypeOf(
      ensure(5 as unknown, (x) => typeof x === "number"),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure(5 as unknown, { test: (x) => typeof x === "number" }),
    ).toEqualTypeOf<number>();

    // Narrowing conversion with else.
    expectTypeOf(
      ensure(5 as unknown, {
        test: (x) => typeof x === "number",
        else: 0,
      }),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure(5 as unknown, {
        test: (x) => typeof x === "number",
        else: (_value: unknown) => 0,
      }),
    ).toEqualTypeOf<number>();

    // Boolean test.
    expectTypeOf(ensure(5, (x) => x > 0)).toEqualTypeOf<number>();
    expectTypeOf(ensure(5, { test: (x) => x > 0 })).toEqualTypeOf<number>();
    expectTypeOf(ensure(5, { not: (x) => x < 0 })).toEqualTypeOf<number>();

    // Typeof test.
    expectTypeOf(
      ensure(5 as unknown, { type: "number" }),
    ).toEqualTypeOf<number>();

    // Typeof test with else.
    expectTypeOf(
      ensure(5 as unknown, {
        type: "number",
        else: 0,
      }),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure(5 as unknown, {
        type: "number",
        else: (_value: unknown) => 0,
      }),
    ).toEqualTypeOf<number>();
  });

  test("data last", () => {
    // Narrowing conversion.
    expectTypeOf(
      ensure({ test: (x) => typeof x === "number" })(5 as unknown),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({ test: (x) => typeof x === "number" })(5 as unknown),
    ).toEqualTypeOf<number>();

    // Narrowing conversion with else.
    expectTypeOf(
      ensure({
        test: (x) => typeof x === "number",
        else: 0,
      })(5 as unknown),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({
        test: (x) => typeof x === "number",
        else: (_value: unknown) => 0,
      })(5 as unknown),
    ).toEqualTypeOf<number>();

    // Boolean test.
    expectTypeOf(ensure((x: number) => x > 0)(5)).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({ test: (x: number) => x > 0 })(5),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({ not: (x: number) => x < 0 })(5),
    ).toEqualTypeOf<number>();

    // Typeof test.
    expectTypeOf(
      ensure({ type: "number" })(5 as unknown),
    ).toEqualTypeOf<number>();

    // Typeof test with else.
    expectTypeOf(
      ensure({
        type: "number",
        else: 0,
      })(5 as unknown),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({
        type: "number",
        else: (_value: unknown) => 0,
      })(5 as unknown),
    ).toEqualTypeOf<number>();
  });
});
