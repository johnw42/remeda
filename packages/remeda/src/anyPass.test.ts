import { anyPass } from "./anyPass";
import { describeIterableArg } from "./internal/describeIterableArg";

const fns = [(x: number) => x === 3, (x: number) => x === 4] as const;

// eslint-disable-next-line vitest/require-hook
describeIterableArg("anyPass", ({ wrap }) => {
  test("data first", () => {
    expect(anyPass(3, wrap(fns, 1))).toBe(true);
    expect(anyPass(4, wrap(fns, 2))).toBe(true);
    expect(anyPass(1, wrap(fns))).toBe(false);
  });

  test("data last", () => {
    expect(anyPass(wrap(fns, 1))(3)).toBe(true);
    expect(anyPass(wrap(fns, 2))(4)).toBe(true);
    expect(anyPass(wrap(fns))(1)).toBe(false);
  });
});
