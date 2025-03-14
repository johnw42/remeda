import { add } from "./add";
import { constant } from "./constant";
import { filter } from "./filter";
import { identity } from "./identity";
import { describeIterableArg } from "./internal/describeIterableArg";
import { toBasicIterable } from "./internal/toBasicIterable";
import { map } from "./map";
import { multiply } from "./multiply";
import { pipe } from "./pipe";
import { take } from "./take";

describe("map", () => {
  it("indexed: check index and items with array argument", () => {
    const indexes1: Array<number> = [];
    const indexes2: Array<number> = [];
    const anyItems1: Array<Array<number>> = [];
    const anyItems2: Array<Array<number>> = [];
    const data = [1, 2, 3, 4, 5];

    expect(
      pipe(
        data,
        map(identity()),
        map((x, i, items) => {
          anyItems1.push([...items]);
          indexes1.push(i);
          return x;
        }),
        filter((x) => x % 2 === 1),
        map((x, i, items) => {
          anyItems2.push([...items]);
          indexes2.push(i);
          return x;
        }),
      ),
    ).toStrictEqual([1, 3, 5]);

    expect(indexes1).toStrictEqual([0, 1, 2, 3, 4]);
    expect(indexes2).toStrictEqual([0, 1, 2]);
    expect(anyItems1).toStrictEqual([
      [1],
      [1, 2],
      [1, 2, 3],
      [1, 2, 3, 4],
      [1, 2, 3, 4, 5],
    ]);
    expect(anyItems2).toStrictEqual([[1], [1, 3], [1, 3, 5]]);
  });

  it("indexed: check index and items with iterable argument", () => {
    const indexes1: Array<number> = [];
    const indexes2: Array<number> = [];

    expect(
      pipe(
        toBasicIterable([1, 2, 3, 4, 5]),
        map((x, i) => {
          indexes1.push(i);
          return x;
        }),
        filter((x) => x % 2 === 1),
        map((x, i) => {
          indexes2.push(i);
          return x;
        }),
      ),
    ).toStrictEqual([1, 3, 5]);

    expect(indexes1).toStrictEqual([0, 1, 2, 3, 4]);
    expect(indexes2).toStrictEqual([0, 1, 2]);
  });
});

// eslint-disable-next-line vitest/require-hook
describeIterableArg("map", ({ wrap }) => {
  describe("data_first", () => {
    it("map", () => {
      expect(map(wrap([1, 2, 3]), multiply(2))).toStrictEqual([2, 4, 6]);
    });

    it("map indexed", () => {
      expect(map(wrap([0, 0, 0]), (_, i) => i)).toStrictEqual([0, 1, 2]);
    });
  });

  describe("data-last", () => {
    it("passes the value to the mapper as its first argument", () => {
      expect(pipe(wrap([1, 2, 3]), map(multiply(2)))).toStrictEqual([2, 4, 6]);
    });

    it("passes the index to the mapper as its second argument", () => {
      expect(
        pipe(
          wrap([0, 0, 0]),
          map((_, index) => index),
        ),
      ).toStrictEqual([0, 1, 2]);
    });
  });

  describe("pipe", () => {
    it("invoked lazily", () => {
      const count = vi.fn<(x: number) => number>(multiply(10));

      expect(pipe(wrap([1, 2, 3]), map(count), take(2))).toStrictEqual([
        10, 20,
      ]);

      expect(count).toHaveBeenCalledTimes(2);
    });

    it("invoked lazily (indexed)", () => {
      const count = vi.fn<(_: unknown, index: number) => number>(
        (_, index) => index,
      );

      expect(pipe(wrap([0, 0, 0]), map(count), take(2))).toStrictEqual([0, 1]);

      expect(count).toHaveBeenCalledTimes(2);
    });

    it("number array", () => {
      expect(map(wrap([1, 2, 3]), add(1))).toStrictEqual([2, 3, 4]);
    });

    it("mixed type tuple", () => {
      expect(map(wrap([1, "2", true]), constant(1))).toStrictEqual([1, 1, 1]);
    });

    it("complex variadic number array", () => {
      const input = [
        "hello",
        "world",
        1,
        "testing",
        "testing",
        "testing",
        123,
        true,
      ];

      expect(map(wrap(input), identity())).toStrictEqual(input);
    });

    describe("indexed", () => {
      it("number array", () => {
        expect(map(wrap([1, 2, 3]), (x, index) => x + index)).toStrictEqual([
          1, 3, 5,
        ]);
      });

      it("mixed type tuple", () => {
        expect(map(wrap([1, "2", true]), (_, index) => index)).toStrictEqual([
          0, 1, 2,
        ]);
      });
    });
  });
});
