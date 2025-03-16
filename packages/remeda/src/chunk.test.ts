import { chunk } from "./chunk";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { take } from "./take";

describeIterableArg("chunk", ({ wrap }) => {
  describe("data first", () => {
    test("equal size", () => {
      expect(chunk(wrap(["a", "b", "c", "d"]), 2)).toStrictEqual([
        ["a", "b"],
        ["c", "d"],
      ]);
    });

    test("not equal size", () => {
      expect(chunk(wrap(["a", "b", "c", "d"]), 3)).toStrictEqual([
        ["a", "b", "c"],
        ["d"],
      ]);
    });

    test("1 element", () => {
      expect(chunk(wrap(["x"]), 3)).toStrictEqual([["x"]]);
    });

    test("empty array", () => {
      expect(chunk(wrap([]), 3)).toStrictEqual([]);
    });
  });

  describe("data last", () => {
    test("equal size", () => {
      expect(chunk(2)(wrap(["a", "b", "c", "d"]))).toStrictEqual([
        ["a", "b"],
        ["c", "d"],
      ]);
    });

    test("lazy", () => {
      expect(
        pipe(wrap("abcdef", { limit: 4 }), chunk(2), take(2)),
      ).toStrictEqual([
        ["a", "b"],
        ["c", "d"],
      ]);
    });
  });

  describe("edge-cases", () => {
    it("throws on 0 size", () => {
      expect(() => chunk(wrap(["a", "b", "c", "d"]), 0)).toThrow(RangeError);
    });

    it("throws on negative size", () => {
      expect(() => chunk(wrap(["a", "b", "c", "d"]), -10)).toThrow(RangeError);
    });

    test("size > data.length", () => {
      const data = [1, 2, 3] as const;
      const result = chunk(wrap(data), 10);

      expect(result).toStrictEqual([data]);
      // We expect the result to be a shallow clone
      expect(result[0]).not.toBe(data);
    });

    test("chunk of size 1", () => {
      const data = [1, 2, 3, 4, 5] as const;
      const result = chunk(wrap(data), 1);

      expect(result).toStrictEqual([[1], [2], [3], [4], [5]]);
    });
  });
});
