import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { sum } from "./sum";

describeIterableArg("sum", ({ wrap }) => {
  describe("dataFirst", () => {
    it("should return the sum of numbers in an array", () => {
      expect(sum(wrap([1, 2, 3]))).toBe(6);
      expect(sum(wrap([4, 5, 6]))).toBe(15);
      expect(sum(wrap([-1, 0, 1]))).toBe(0);
    });

    it("should return 0 for an empty array", () => {
      expect(sum(wrap([]))).toBe(0);
    });

    it("works on bigints", () => {
      expect(sum(wrap([1n, 2n, 3n]))).toBe(6n);
    });
  });

  describe("dataLast", () => {
    it("should return the sum of numbers in an array", () => {
      expect(pipe(wrap([1, 2, 3]), sum())).toBe(6);
      expect(pipe(wrap([4, 5, 6]), sum())).toBe(15);
      expect(pipe(wrap([-1, 0, 1]), sum())).toBe(0);
    });

    it("should return 0 for an empty array", () => {
      expect(pipe(wrap([]), sum())).toBe(0);
    });
  });

  describe("KNOWN ISSUES", () => {
    it("returns 0 (`number`) instead of 0n (`bigint`) for empty `bigint` arrays", () => {
      const result = sum(wrap([] as Array<bigint>));

      expect(result).toBe(0);
    });
  });
});
