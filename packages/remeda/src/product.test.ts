import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { product } from "./product";

describeIterableArg("product", ({ wrap }) => {
  describe("dataFirst", () => {
    it("should return the product of numbers in the array", () => {
      expect(product(wrap([1, 2, 3]))).toBe(6);
      expect(product(wrap([4, 5, 6]))).toBe(120);
      expect(product(wrap([0, 1, 2]))).toBe(0);
      expect(product(wrap([-1, -2, -3]))).toBe(-6);
    });

    it("should return 1 for an empty array", () => {
      expect(product(wrap([]))).toBe(1);
    });

    it("works with bigints", () => {
      expect(product(wrap([1n, 2n, 3n]))).toBe(6n);
    });
  });

  describe("dataLast", () => {
    it("should return the product of numbers in the array", () => {
      expect(pipe(wrap([1, 2, 3]), product())).toBe(6);
      expect(pipe(wrap([4, 5, 6]), product())).toBe(120);
      expect(pipe(wrap([0, 1, 2]), product())).toBe(0);
      expect(pipe(wrap([-1, -2, -3]), product())).toBe(-6);
    });

    it("should return 1 for an empty array", () => {
      expect(pipe(wrap([]), product())).toBe(1);
    });
  });

  describe("KNOWN ISSUES", () => {
    it("returns 1 (`number`) instead of 1n (`bigint`) for empty `bigint` arrays", () => {
      const result = product(wrap([] as Array<bigint>));

      expect(result).toBe(1);
    });
  });
});
