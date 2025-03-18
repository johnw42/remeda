import { describeIterableArg } from "./internal/describeIterableArg";
import { median } from "./median";
import { pipe } from "./pipe";

describeIterableArg("median", ({ wrap }) => {
  describe("dataFirst", () => {
    test("inputs of odd length", () => {
      expect(median(wrap([6, 10, 11]))).toBe(10);
    });

    test("inputs of even length", () => {
      expect(median(wrap([1, 2, 3, 9]))).toBe(2.5);
      expect(median(wrap([-1, 0, 1, 10]))).toBe(0.5);
    });

    it("should return undefined for an empty input", () => {
      expect(median(wrap([]))).toBeUndefined();
    });
  });

  describe("dataLast", () => {
    test("inputs of odd length", () => {
      expect(pipe(wrap([6, 10, 11]), median())).toBe(10);
    });

    test("inputs of even length", () => {
      expect(pipe(wrap([1, 2, 3, 9]), median())).toBe(2.5);
      expect(pipe(wrap([-1, 0, 1, 10]), median())).toBe(0.5);
    });

    it("should return undefined for an empty input", () => {
      expect(pipe(wrap([]), median())).toBeUndefined();
    });
  });
});
