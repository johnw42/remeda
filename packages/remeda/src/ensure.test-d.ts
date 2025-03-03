import { ensure } from "./ensure";
import { expectTypeOf } from "expect-type";
import type { EnsureArg } from "./internal/types/ensure";

describe("ensure", () => {
  const n5 = 5 as number;
  const u5 = 5 as unknown;

  test("data first", () => {
    // Narrowing conversion.
    expectTypeOf(
      ensure(u5, (x) => typeof x === "number"),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure(u5, { test: (x) => typeof x === "number" }),
    ).toEqualTypeOf<number>();

    // Narrowing conversion with else.
    expectTypeOf(
      ensure(u5, {
        test: (x) => typeof x === "number",
        else: 0,
      }),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure(u5, {
        test: (x) => typeof x === "number",
        else: () => 0,
      }),
    ).toEqualTypeOf<number>();

    // Narrowing conversion with else of different type.
    expectTypeOf(
      ensure(u5, {
        test: (x) => typeof x === "number",
        else: "0",
      }),
    ).toEqualTypeOf<number | string>();
    expectTypeOf(
      ensure(u5, {
        test: (x) => typeof x === "number",
        else: () => "0",
      }),
    ).toEqualTypeOf<number | string>();

    // Boolean test.
    expectTypeOf(ensure(n5, (x) => x > 0)).toEqualTypeOf<number>();
    expectTypeOf(ensure(n5, { test: (x) => x > 0 })).toEqualTypeOf<number>();
    expectTypeOf(ensure(n5, { not: (x) => x < 0 })).toEqualTypeOf<number>();

    // Boolean test with else.
    expectTypeOf(ensure(n5, (x) => x > 0)).toEqualTypeOf<number>();
    expectTypeOf(
      ensure(n5, { test: (x) => x > 0, else: 0 }),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure(n5, { not: (x) => x < 0, else: () => 0 }),
    ).toEqualTypeOf<number>();

    // Boolean test with else of different type.
    expectTypeOf(ensure(n5, (x) => x > 0)).toEqualTypeOf<number>();
    expectTypeOf(ensure(n5, { test: (x) => x > 0, else: "0" })).toEqualTypeOf<
      number | string
    >();
    expectTypeOf(
      ensure(n5, { not: (x) => x < 0, else: () => "0" }),
    ).toEqualTypeOf<number | string>();

    // Typeof test.
    expectTypeOf(ensure(u5, { type: "number" })).toEqualTypeOf<number>();

    // Typeof test with else.
    expectTypeOf(
      ensure(u5, {
        type: "number",
        else: 0,
      }),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure(u5, {
        type: "number",
        else: () => 0,
      }),
    ).toEqualTypeOf<number>();

    // Typeof test with else of different type.
    expectTypeOf(
      ensure(u5, {
        type: "number",
        else: "0",
      }),
    ).toEqualTypeOf<number | string>();
    expectTypeOf(
      ensure(u5, {
        type: "number",
        else: () => "0",
      }),
    ).toEqualTypeOf<number | string>();
  });

  test("data last", () => {
    // Narrowing conversion.
    expectTypeOf(
      ensure({ test: (x: unknown) => typeof x === "number" })(u5),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({ test: (x: unknown) => typeof x === "number" })(u5),
    ).toEqualTypeOf<number>();

    expectTypeOf<EnsureArg<unknown>>().toMatchTypeOf<EnsureArg<number>>();

    // Narrowing conversion with else.
    expectTypeOf(
      ensure({
        test: (x) => typeof x === "number",
        else: 0,
      })(u5),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({
        test: (x) => typeof x === "number",
        else: () => 0,
      })(u5),
    ).toEqualTypeOf<number>();

    // Narrowing conversion with else of different type.
    expectTypeOf(
      ensure({
        test: (x: unknown) => typeof x === "number",
        else: "0",
      })(u5),
    ).toEqualTypeOf<number | string>();
    expectTypeOf(
      ensure({
        test: (x: unknown) => typeof x === "number",
        else: () => "0",
      })(u5),
    ).toEqualTypeOf<number | string>();

    ensure((x: number) => x > 0);

    // Boolean test.
    expectTypeOf(ensure((x: number) => x > 0)(n5)).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({ test: (x: number) => x > 0 })(n5),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({ not: (x: number) => x < 0 })(n5),
    ).toEqualTypeOf<number>();

    // Boolean test with else.
    expectTypeOf(
      ensure({ test: (x: number) => x > 0, else: 0 })(n5),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({ not: (x: number) => x < 0, else: () => 0 })(n5),
    ).toEqualTypeOf<number>();

    // Boolean test with else of different type.
    expectTypeOf(
      ensure({ test: (x: number) => x > 0, else: "0" })(n5),
    ).toEqualTypeOf<number | string>();
    expectTypeOf(
      ensure({ not: (x: number) => x < 0, else: () => "0" })(n5),
    ).toEqualTypeOf<number | string>();

    // Typeof test.
    expectTypeOf(ensure({ type: "number" })(u5)).toEqualTypeOf<number>();

    // Typeof test with else.
    expectTypeOf(
      ensure({
        type: "number",
        else: 0,
      })(u5),
    ).toEqualTypeOf<number>();
    expectTypeOf(
      ensure({
        type: "number",
        else: () => 0,
      })(u5),
    ).toEqualTypeOf<number>();

    // Typeof test with else of different type.
    expectTypeOf(
      ensure({
        type: "number",
        else: "0",
      })(u5),
    ).toEqualTypeOf<number | string>();
    expectTypeOf(
      ensure({
        type: "number",
        else: () => "0",
      })(u5),
    ).toEqualTypeOf<number | string>();
  });
});
