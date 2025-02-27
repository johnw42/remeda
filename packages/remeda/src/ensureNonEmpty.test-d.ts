import { ensureNonEmpty } from "./ensureNonEmpty";
import { expectTypeOf } from "expect-type";
import type { NonEmptyTuple } from "type-fest";

test("ensureNonEmpty", () => {
  const readonly123: ReadonlyArray<number> = [1, 2, 3];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  const hello: string = "hello";
  const obj: { key: string } = { key: "value" };

  // Test that ensureNonEmpty returns the value if it is not empty
  expectTypeOf(ensureNonEmpty([1, 2, 3])).toEqualTypeOf<
    NonEmptyTuple<number>
  >();
  expectTypeOf(ensureNonEmpty(readonly123)).toEqualTypeOf<
    Readonly<NonEmptyTuple<number>>
  >();
  expectTypeOf(ensureNonEmpty(hello)).toEqualTypeOf<typeof hello>();
  expectTypeOf(ensureNonEmpty(obj)).toEqualTypeOf<typeof obj>();

  expectTypeOf(ensureNonEmpty([])).toBeNever();
  expectTypeOf(ensureNonEmpty([] as const)).toBeNever();
  expectTypeOf(ensureNonEmpty("")).toBeNever();
  expectTypeOf(ensureNonEmpty({})).toBeNever();
  expectTypeOf(ensureNonEmpty(new Map())).toBeNever();
  expectTypeOf(ensureNonEmpty(new Set())).toBeNever();

  // Test that ensureNonEmpty returns a function that ensures the value is not empty
  expectTypeOf(ensureNonEmpty<Array<number>>()([1, 2, 3])).toEqualTypeOf<
    NonEmptyTuple<number>
  >();
  expectTypeOf(ensureNonEmpty<typeof readonly123>()(readonly123)).toEqualTypeOf<
    NonEmptyTuple<number>
  >();
  expectTypeOf(ensureNonEmpty<typeof hello>()(hello)).toEqualTypeOf<
    typeof hello
  >();
  expectTypeOf(ensureNonEmpty<typeof obj>()(obj)).toEqualTypeOf<typeof obj>();
});
