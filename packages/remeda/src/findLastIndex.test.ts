import { findLastIndex } from "./findLastIndex";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";

// eslint-disable-next-line vitest/require-hook
describeIterableArg("findLastIndex", (wrap) => {
  describe("data first", () => {
    test("findLastIndex", () => {
      expect(findLastIndex(wrap([1, 2, 3, 4]), (x) => x % 2 === 1)).toBe(2);
    });

    test("findLast first value", () => {
      expect(findLastIndex(wrap([1, 2, 3, 4]), (x) => x === 1)).toBe(0);
    });

    test("findLastIndex -1", () => {
      expect(findLastIndex(wrap([1, 2, 3, 4]), (x) => x === 5)).toBe(-1);
    });
  });

  describe("data last", () => {
    test("found", () => {
      expect(
        pipe(
          wrap([1, 2, 3, 4]),
          findLastIndex((x) => x % 2 === 1),
        ),
      ).toBe(2);
    });

    test("not found", () => {
      expect(
        pipe(
          wrap([1, 2, 3, 4]),
          findLastIndex((x) => x === 5),
        ),
      ).toBe(-1);
    });
  });
});
