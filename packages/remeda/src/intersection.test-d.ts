import { intersection } from "./intersection";

it("narrows the result type", () => {
  const result = intersection([1, 2, 3, "a", "b"], ["a", "b", true, false]);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it("returns a polymorphic function type", () => {
  const func = intersection([1, 2, 3] as const);

  expectTypeOf(func([2, 3, 4] as const)).toMatchTypeOf<Array<2 | 3>>();
});
