import { allPass } from "./allPass";
import { describeIterableArg } from "./internal/describeIterableArg";

const fns = [(x: number) => x % 3 === 0, (x: number) => x % 4 === 0] as const;

// eslint-disable-next-line vitest/require-hook
describeIterableArg("allPass", ({ wrap }) => {
  test("data first", () => {
    expect(allPass(12, wrap(fns))).toBe(true);
    expect(allPass(4, wrap(fns, 1))).toBe(false);
    expect(allPass(3, wrap(fns, 2))).toBe(false);
  });

  test("data last", () => {
    expect(allPass(wrap(fns))(12)).toBe(true);
    expect(allPass(wrap(fns, 1))(4)).toBe(false);
    expect(allPass(wrap(fns, 2))(3)).toBe(false);
  });
});
