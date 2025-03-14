import { drop } from "./drop";
import { describeIterableArg } from "./internal/describeIterableArg";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

// eslint-disable-next-line vitest/require-hook
describeIterableArg("drop", (wrap) => {
  describe("data first", () => {
    it("works on regular inputs", () => {
      expect(drop(wrap([1, 2, 3, 4, 5]), 2)).toStrictEqual([3, 4, 5]);
    });

    it("works trivially on empty arrays", () => {
      expect(drop(wrap([]), 2)).toStrictEqual([]);
    });

    it("works trivially with negative numbers", () => {
      expect(drop(wrap([1, 2, 3, 4, 5]), -1)).toStrictEqual([1, 2, 3, 4, 5]);
    });

    it("works when dropping more than the length of the array", () => {
      expect(drop(wrap([1, 2, 3, 4, 5]), 10)).toStrictEqual([]);
    });

    test("returns a shallow clone when no items are dropped", () => {
      const data = wrap([1, 2, 3, 4, 5]);
      const result = drop(data, 0);

      expect(result).toStrictEqual([1, 2, 3, 4, 5]);
      expect(result).not.toBe(data);
    });
  });

  describe("data last", () => {
    it("works on regular inputs", () => {
      expect(pipe(wrap([1, 2, 3, 4, 5]), drop(2))).toStrictEqual([3, 4, 5]);
    });

    it("works trivially on empty arrays", () => {
      expect(pipe(wrap([]), drop(2))).toStrictEqual([]);
    });

    it("works trivially with negative numbers", () => {
      expect(pipe(wrap([1, 2, 3, 4, 5]), drop(-1))).toStrictEqual([
        1, 2, 3, 4, 5,
      ]);
    });

    it("works when dropping more than the length of the array", () => {
      expect(pipe(wrap([1, 2, 3, 4, 5]), drop(10))).toStrictEqual([]);
    });

    test("lazy impl", () => {
      const mockFunc = vi.fn<(x: number) => number>();
      pipe(wrap([1, 2, 3, 4, 5]), map(mockFunc), drop(2), take(2));

      expect(mockFunc).toHaveBeenCalledTimes(4);
    });
  });
});
