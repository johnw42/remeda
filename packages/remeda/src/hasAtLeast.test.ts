import { hasAtLeast } from "./hasAtLeast";
import { describeIterableArg } from "./internal/describeIterableArg";

describeIterableArg(
  "hasAtLeast",
  {
    set: (x) => new Set(x),
  },
  ({ wrap }) => {
    describe("dataFirst", () => {
      it("works on empty inputs", () => {
        expect(hasAtLeast(wrap([]), 0)).toBe(true);
        expect(hasAtLeast(wrap([]), 10)).toBe(false);
      });

      it("works on single item inputs", () => {
        expect(hasAtLeast(wrap([1]), 0)).toBe(true);
        expect(hasAtLeast(wrap([1]), 1)).toBe(true);
        expect(hasAtLeast(wrap([1]), 2)).toBe(false);
      });

      it("works on large inputs", () => {
        const array = Array.from({ length: 1000 }, (_, i) => i);

        expect(hasAtLeast(wrap(array), 0)).toBe(true);
        expect(hasAtLeast(wrap(array), 1)).toBe(true);
        expect(hasAtLeast(wrap(array), 1000)).toBe(true);
        expect(hasAtLeast(wrap(array), 1001)).toBe(false);
      });

      it("works on sparse arrays", () => {
        const array = Array.from({ length: 1000 });

        expect(hasAtLeast(array, 0)).toBe(true);
        expect(hasAtLeast(array, 1)).toBe(true);
        expect(hasAtLeast(array, 1000)).toBe(true);
        expect(hasAtLeast(array, 1001)).toBe(false);
      });
    });

    describe("dataLast", () => {
      it("works on empty inputs", () => {
        expect(hasAtLeast(0)(wrap([]))).toBe(true);
        expect(hasAtLeast(10)(wrap([]))).toBe(false);
      });

      it("works on single item inputs", () => {
        expect(hasAtLeast(0)(wrap([1]))).toBe(true);
        expect(hasAtLeast(1)(wrap([1]))).toBe(true);
        expect(hasAtLeast(2)(wrap([1]))).toBe(false);
      });

      it("works on large inputs", () => {
        const array = Array.from({ length: 1000 }, (_, i) => i);

        expect(hasAtLeast(0)(wrap(array))).toBe(true);
        expect(hasAtLeast(1)(wrap(array))).toBe(true);
        expect(hasAtLeast(1000)(wrap(array))).toBe(true);
        expect(hasAtLeast(1001)(wrap(array))).toBe(false);
      });

      it("works on sparse arrays", () => {
        const array = Array.from({ length: 1000 });

        expect(hasAtLeast(0)(array)).toBe(true);
        expect(hasAtLeast(1)(array)).toBe(true);
        expect(hasAtLeast(1000)(array)).toBe(true);
        expect(hasAtLeast(1001)(array)).toBe(false);
      });
    });
  },
);
