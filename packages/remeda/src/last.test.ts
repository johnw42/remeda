import { describeIterableArg } from "./internal/describeIterableArg";
import { last } from "./last";
import { pipe } from "./pipe";

describeIterableArg("last", ({ wrap }) => {
  describe("data first", () => {
    test("should return last", () => {
      expect(last(wrap([1, 2, 3]))).toBe(3);
    });

    test("empty input", () => {
      expect(last(wrap([]))).toBeUndefined();
    });
  });

  describe("data last", () => {
    test("should return last", () => {
      expect(pipe(wrap([1, 2, 3]), last())).toBe(3);
    });

    test("empty input", () => {
      expect(pipe(wrap([]), last())).toBeUndefined();
    });
  });
});
