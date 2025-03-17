import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { reduce } from "./reduce";

describeIterableArg("reduce", ({ wrap }) => {
  describe("data first", () => {
    test("reduce", () => {
      expect(reduce(wrap([1, 2, 3, 4, 5]), (acc, x) => acc + x, 100)).toBe(115);
    });

    test("indexed", () => {
      const data = [1, 2, 3, 4, 5];
      let i = 0;

      expect(
        reduce(
          wrap(data),
          (acc, x, index, items) => {
            expect(index).toBe(i);
            expect(items).toBe(data);

            i += 1;
            return acc + x;
          },
          100,
        ),
      ).toBe(115);
    });
  });

  describe("data last", () => {
    test("reduce", () => {
      expect(
        pipe(
          wrap([1, 2, 3, 4, 5]),
          reduce((acc, x) => acc + x, 100),
        ),
      ).toBe(115);
    });
  });
});
