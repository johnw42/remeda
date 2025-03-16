import { unique } from "./unique";

it("returns a polymorphic function", () => {
  const func = unique();

  expectTypeOf(func([] as ReadonlyArray<number>)).toEqualTypeOf<
    Array<number>
  >();
  expectTypeOf(func([] as ReadonlyArray<string>)).toEqualTypeOf<
    Array<string>
  >();
  expectTypeOf(func([] as Iterable<number>)).toEqualTypeOf<Array<number>>();
  expectTypeOf(func([] as Iterable<string>)).toEqualTypeOf<Array<string>>();
});
