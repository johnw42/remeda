import { describeIterableArg } from "./internal/describeIterableArg";
import { splitAt } from "./splitAt";

describeIterableArg("splitAt", ({ wrap }) => {
  describe("data_first", () => {
    test("split", () => {
      expect(splitAt(wrap([1, 2, 3] as const), 1)).toStrictEqual([[1], [2, 3]]);
    });

    test("split at -1", () => {
      expect(splitAt(wrap([1, 2, 3, 4, 5] as const), -1)).toStrictEqual([
        [1, 2, 3, 4],
        [5],
      ]);
    });
  });

  describe("data_last", () => {
    test("split", () => {
      expect(splitAt(1)(wrap([1, 2, 3] as const))).toStrictEqual([[1], [2, 3]]);
    });

    test("split at -1", () => {
      expect(splitAt(-1)(wrap([1, 2, 3, 4, 5] as const))).toStrictEqual([
        [1, 2, 3, 4],
        [5],
      ]);
    });
  });
});
