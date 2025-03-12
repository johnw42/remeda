import { concat } from "./concat";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { take } from "./take";

// eslint-disable-next-line vitest/require-hook
describeIterableArg("concat", (wrap) => {
  test("data first", () => {
    const actual = concat(wrap([1, 2, 3]), wrap(["a"]));

    expect(actual).toStrictEqual([1, 2, 3, "a"] as const);
  });

  test("data last", () => {
    const actual = pipe(wrap([1, 2, 3]), concat(wrap(["a", "b"], 1)), take(4));

    expect(actual).toStrictEqual([1, 2, 3, "a"]);
  });
});
