import { describeIterableArg } from "./internal/describeIterableArg";
import { nth } from "./nth";

describeIterableArg("nth", ({ wrap }) => {
  describe("data first", () => {
    it("works", () => {
      const data = [2, 1, 4, 5, 3];

      expect(nth(wrap(data), 2)).toBe(4);
      expect(nth(wrap(data), -2)).toBe(5);
    });

    it("handles overflows gracefully", () => {
      expect(nth(wrap([1, 2, 3]), 100)).toBeUndefined();
      expect(nth(wrap([1, 2, 3]), -100)).toBeUndefined();
    });
  });

  describe("data last", () => {
    it("works", () => {
      const data = [2, 1, 4, 5, 3];

      expect(nth(2)(wrap(data))).toBe(4);
      expect(nth(-2)(wrap(data))).toBe(5);
    });

    it("handles overflows gracefully", () => {
      expect(nth(100)(wrap([1, 2, 3]))).toBeUndefined();
      expect(nth(-100)(wrap([1, 2, 3]))).toBeUndefined();
    });
  });
});
