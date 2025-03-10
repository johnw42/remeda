import { concat } from "./concat";
import { toGenerator } from "./internal/toGenerator";
import { pipe } from "./pipe";

describe("concat", () => {
  test("data first on arrays", () => {
    const actual = concat([1, 2, 3] as const, ["a"] as const);

    expect(actual).toStrictEqual([1, 2, 3, "a"] as const);
  });

  test("data first on iterables", () => {
    const actual = concat(toGenerator([1, 2, 3]), toGenerator(["a"]));

    expect(actual).toStrictEqual([1, 2, 3, "a"] as const);
  });

  test("data last on arrays", () => {
    const actual = pipe([1, 2, 3] as const, concat(["a"] as const));

    expect(actual).toStrictEqual([1, 2, 3, "a"]);
  });

  test("data last on iterables", () => {
    const actual = pipe(toGenerator([1, 2, 3]), concat(toGenerator(["a"])));

    expect(actual).toStrictEqual([1, 2, 3, "a"]);
  });
});
