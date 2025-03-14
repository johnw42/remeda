import { findIndex } from "./findIndex";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";

// eslint-disable-next-line vitest/require-hook
describeIterableArg("findIndex", (wrap) => {
  describe("data first", () => {
    test("found", () => {
      expect(findIndex(wrap([10, 20, 30]), (x) => x === 20)).toBe(1);
    });

    test("not found", () => {
      expect(findIndex(wrap([2, 3, 4]), (x) => x === 20)).toBe(-1);
    });
  });

  describe("data last", () => {
    test("found", () => {
      expect(
        pipe(
          wrap([10, 20, 30]),
          findIndex((x) => x === 20),
        ),
      ).toBe(1);
    });

    test("not found", () => {
      expect(
        pipe(
          wrap([2, 3, 4]),
          findIndex((x) => x === 20),
        ),
      ).toBe(-1);
    });
  });
});
