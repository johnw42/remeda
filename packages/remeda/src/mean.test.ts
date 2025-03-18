import { describeIterableArg } from "./internal/describeIterableArg";
import { mean } from "./mean";
import { pipe } from "./pipe";

describeIterableArg("mean", ({ wrap }) => {
  describe("dataFirst", () => {
    it("should return the mean of numbers in an iterable", () => {
      expect(mean(wrap([1, 2, 3]))).toBe(2);
      expect(mean(wrap([4, 5, 6]))).toBe(5);
      expect(mean(wrap([-1, 0, 1]))).toBe(0);
    });

    it("should return undefined for an empty iterable", () => {
      expect(mean(wrap([]))).toBeUndefined();
    });
  });

  describe("dataLast", () => {
    it("should return the mean of numbers in an iterable", () => {
      expect(pipe(wrap([1, 2, 3]), mean())).toBe(2);
      expect(pipe(wrap([4, 5, 6]), mean())).toBe(5);
      expect(pipe(wrap([-1, 0, 1]), mean())).toBe(0);
    });

    it("should return undefined for an empty iterable", () => {
      expect(pipe(wrap([]), mean())).toBeUndefined();
    });
  });
});
