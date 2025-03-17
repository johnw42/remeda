import { pipe } from "./pipe";
import { take } from "./take";

describe("data-first", () => {
  test("empty array", () => {
    const result = take([] as [], 2);

    expectTypeOf(result).toMatchTypeOf<Array<never>>();
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("regular array", () => {
    const result = take([] as Array<number>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = take([] as Array<number | string>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = take([1] as [number, ...Array<boolean>], 2);

    expectTypeOf(result).toMatchTypeOf<Array<boolean | number>>();
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<boolean>]>();
  });

  test("suffix array", () => {
    const result = take([1] as [...Array<boolean>, number], 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = take([1, "a"] as [number, ...Array<boolean>, string], 2);

    expectTypeOf(result).toMatchTypeOf<Array<boolean | number | string>>();
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<boolean>, string]>();
  });

  test("tuple", () => {
    const result = take([1, "a", true] as const, 2);

    expectTypeOf(result).toMatchTypeOf<Array<"a" | 1 | true>>();
    expectTypeOf(result).toEqualTypeOf<[] | [1] | [1, "a"] | [1, "a", true]>();
  });

  test("union of arrays", () => {
    const result = take([] as Array<boolean> | Array<string>, 2);

    expectTypeOf(result).toMatchTypeOf<Array<boolean | string>>();
    expectTypeOf(result).toEqualTypeOf<Array<boolean> | Array<string>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], take(2));

    expectTypeOf(result).toMatchTypeOf<Array<never>>();
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("regular array", () => {
    const result = pipe([] as Array<number>, take(2));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = pipe([] as Array<number | string>, take(2));

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = pipe([1] as [number, ...Array<boolean>], take(2));

    expectTypeOf(result).toMatchTypeOf<Array<boolean | number>>();
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<boolean>]>();
  });

  test("suffix array", () => {
    const result = pipe([1] as [...Array<boolean>, number], take(2));

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      take(2),
    );

    expectTypeOf(result).toMatchTypeOf<Array<boolean | number | string>>();
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<boolean>, string]>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, take(2));

    expectTypeOf(result).toMatchTypeOf<Array<"a" | 1 | true>>();
    expectTypeOf(result).toEqualTypeOf<[] | [1] | [1, "a"] | [1, "a", true]>();
  });

  test("union of arrays", () => {
    const result = pipe([] as Array<boolean> | Array<string>, take(2));

    expectTypeOf(result).toMatchTypeOf<Array<boolean | string>>();
    expectTypeOf(result).toEqualTypeOf<Array<boolean> | Array<string>>();
  });

  it("returns a polymorphic function", () => {
    const func = take(2);

    expectTypeOf(func([1] as const)).toEqualTypeOf<[] | [1]>();
    expectTypeOf(func(["a"] as const)).toEqualTypeOf<[] | ["a"]>();
  });
});
