import { describeIterableArg } from "./internal/describeIterableArg";
import { toBasicIterable } from "./internal/toBasicIterable";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

describeIterableArg("take", ({ wrap }) => {
  describe("data first", () => {
    it("works on regular inputs", () => {
      expect(take(wrap([1, 2, 3, 4, 5]), 2)).toStrictEqual([1, 2]);
    });

    it("works trivially on empty arrays", () => {
      expect(take(wrap([]), 2)).toStrictEqual([]);
    });

    it("works trivially with negative numbers", () => {
      expect(take(wrap([1, 2, 3, 4, 5]), -1)).toStrictEqual([]);
    });

    it("works when taking more than the length of the array", () => {
      expect(take(wrap([1, 2, 3, 4, 5]), 10)).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("returns a shallow clone when all items are taken", () => {
      const data = wrap([1, 2, 3, 4, 5]);
      const result = take(data, 5);

      expect(result).toStrictEqual([1, 2, 3, 4, 5]);
      expect(result).not.toBe(data);
    });
  });

  describe("data last", () => {
    it("works on regular inputs", () => {
      expect(pipe(wrap([1, 2, 3, 4, 5]), take(2))).toStrictEqual([1, 2]);
    });

    it("works on iterables", () => {
      expect(
        pipe(toBasicIterable(wrap([1, 2, 3, 4, 5])), take(2)),
      ).toStrictEqual([1, 2]);
    });

    it("works trivially on empty arrays", () => {
      expect(pipe(wrap([]), take(2))).toStrictEqual([]);
    });

    it("works trivially with negative numbers", () => {
      expect(pipe(wrap([1, 2, 3, 4, 5]), take(-1))).toStrictEqual([]);
    });

    it("works when taking more than the length of the array", () => {
      expect(pipe(wrap([1, 2, 3, 4, 5]), take(10))).toStrictEqual([
        1, 2, 3, 4, 5,
      ]);
    });

    test("lazy implementation", () => {
      const mockFunc = vi.fn<(x: number) => number>();
      pipe(wrap([1, 2, 3, 4, 5]), map(mockFunc), take(2));

      expect(mockFunc).toHaveBeenCalledTimes(2);
    });
  });
});
