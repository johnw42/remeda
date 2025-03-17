import { reverse } from "./reverse";
import { pipe } from "./pipe";
import { describeIterableArg } from "./internal/describeIterableArg";

describeIterableArg("reverse", ({ wrap }) => {
  describe("data first", () => {
    test("reverse", () => {
      const actual = reverse(wrap([1, 2, 3]));

      expect(actual).toStrictEqual([3, 2, 1]);
    });
  });

  describe("data last", () => {
    test("reverse", () => {
      const actual = pipe(wrap([1, 2, 3]), reverse());

      expect(actual).toStrictEqual([3, 2, 1]);
    });
  });
});
