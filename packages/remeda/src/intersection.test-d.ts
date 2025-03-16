import { intersection } from "./intersection";

it("narrows the result type", () => {
  const result = intersection([1, 2, 3, "a", "b"], ["a", "b", true, false]);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it("returns a polymorphic function type", () => {
  expectTypeOf(intersection([1])).toEqualTypeOf<
    <T>(data: Iterable<T>) => Array<number & T>
  >();
});
