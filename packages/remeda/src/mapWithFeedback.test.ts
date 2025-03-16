import { identity } from "./identity";
import { describeIterableArg } from "./internal/describeIterableArg";
import { map } from "./map";
import { mapWithFeedback } from "./mapWithFeedback";
import { pipe } from "./pipe";
import { take } from "./take";

describeIterableArg("mapWithFeedback", ({ wrap, wrappedArray }) => {
  describe("data first", () => {
    it("should return an array of successively accumulated values", () => {
      expect(
        mapWithFeedback(wrap([1, 2, 3, 4, 5]), (acc, x) => acc + x, 100),
      ).toStrictEqual([101, 103, 106, 110, 115]);
    });

    it("should use the same accumulator on every iteration if it's mutable, therefore returning an array containing {array length} references to the accumulator.", () => {
      const results = mapWithFeedback(
        wrap([1, 2, 3, 4, 5]),
        (acc, x) => {
          acc[x] = x;
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const [item] = results;

      expect(item).toStrictEqual({ "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 });

      for (const result of results) {
        expect(result).toBe(item);
      }
    });

    it("if an empty array is provided, it should never iterate, returning a new empty array.", () => {
      const data: Array<unknown> = [];
      const result = mapWithFeedback(wrap(data), (acc) => acc, "value");

      expect(result).toStrictEqual([]);
      expect(result).not.toBe(data);
    });

    it("should track index and provide entire items array", () => {
      const data = [1, 2, 3, 4, 5];
      const input = wrap(data);
      const dataArgs: Array<Array<number>> = [];

      const mockedReducer = vi.fn<
        (
          acc: number,
          x: number,
          index: number,
          data: ReadonlyArray<number>,
        ) => number
      >((acc, x, _index, dataArg) => {
        dataArgs.push([...dataArg]);
        return acc + x;
      });

      mapWithFeedback(input, mockedReducer, 100);

      expect(dataArgs).toStrictEqual(
        data === input
          ? [data, data, data, data, data]
          : [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5]],
      );

      expect(mockedReducer).toHaveBeenCalledWith(100, 1, 0, wrappedArray(data));
      expect(mockedReducer).toHaveBeenCalledWith(101, 2, 1, wrappedArray(data));
      expect(mockedReducer).toHaveBeenCalledWith(103, 3, 2, wrappedArray(data));
      expect(mockedReducer).toHaveBeenCalledWith(106, 4, 3, wrappedArray(data));
      expect(mockedReducer).toHaveBeenCalledWith(110, 5, 4, wrappedArray(data));
    });
  });

  describe("data last", () => {
    it("should return an array of successively accumulated values", () => {
      expect(
        pipe(
          wrap([1, 2, 3, 4, 5]),
          mapWithFeedback((acc, x) => acc + x, 100),
        ),
      ).toStrictEqual([101, 103, 106, 110, 115]);
    });

    it("evaluates lazily", () => {
      const counter = vi.fn<(x: number) => number>();
      pipe(
        wrap([1, 2, 3, 4, 5]),
        map(counter),
        mapWithFeedback((acc, x) => acc + x, 100),
        take(2),
      );

      expect(counter).toHaveBeenCalledTimes(2);
    });

    it("should track index and progressively include elements from the original array in the items array during each iteration, forming a growing window", () => {
      const lazyItems: Array<Array<number>> = [];
      const indices: Array<number> = [];
      const data = [1, 2, 3, 4, 5];
      const input = wrap(data);
      pipe(
        input,
        map(identity()),
        mapWithFeedback((acc, x, index, items) => {
          indices.push(index);
          lazyItems.push([...items]);
          return acc + x;
        }, 100),
      );

      expect(indices).toStrictEqual([0, 1, 2, 3, 4]);
      expect(lazyItems).toStrictEqual([
        [1],
        [1, 2],
        [1, 2, 3],
        [1, 2, 3, 4],
        [1, 2, 3, 4, 5],
      ]);
    });
  });
});
