import { identity } from "./identity";
import { describeIterableArg } from "./internal/describeIterableArg";
import { intersection } from "./intersection";
import { map } from "./map";
import { pipe } from "./pipe";

describeIterableArg("intersection", ({ wrap }) => {
  it("returns empty array trivially", () => {
    expect(intersection(wrap([]), wrap([]))).toStrictEqual([]);
  });

  it("returns empty array on empty input", () => {
    expect(intersection(wrap([]), wrap([1, 2, 3]))).toStrictEqual([]);
    expect(intersection(wrap([1, 2, 3]), wrap([]))).toStrictEqual([]);
  });

  it("returns empty array on disjoint arrays", () => {
    expect(intersection(wrap([1]), wrap([2]))).toStrictEqual([]);
  });

  it("works trivially on a single item", () => {
    expect(intersection(wrap([1]), wrap([1]))).toStrictEqual([1]);
  });

  it("maintains multi-set semantics (returns only one copy)", () => {
    expect(intersection(wrap([1, 1]), wrap([1]))).toStrictEqual([1]);
    expect(intersection(wrap([1]), wrap([1, 1]))).toStrictEqual([1]);
  });

  it("maintains multi-set semantics (returns as many copies as available)", () => {
    expect(intersection(wrap([1, 1, 1, 1, 1]), wrap([1, 1]))).toStrictEqual([
      1, 1,
    ]);
    expect(intersection(wrap([1, 1]), wrap([1, 1, 1, 1, 1]))).toStrictEqual([
      1, 1,
    ]);
  });

  it("preserves the original order in source array", () => {
    expect(intersection(wrap([3, 2, 1]), wrap([1, 2, 3]))).toStrictEqual([
      3, 2, 1,
    ]);
  });

  it("maintains order for multiple copies", () => {
    expect(
      intersection(wrap([3, 2, 2, 2, 2, 2, 1]), wrap([1, 2, 3])),
    ).toStrictEqual([3, 2, 1]);
  });

  it("returns a shallow copy even when all items match", () => {
    const data = wrap([1, 2, 3]);
    const result = intersection(data, wrap([1, 2, 3]));

    expect(result).toStrictEqual([1, 2, 3]);
    expect(result).not.toBe(data);
  });

  describe("piping", () => {
    test("lazy", () => {
      const mock = vi.fn<(x: number) => number>(identity());
      const result = pipe(
        wrap([1, 2, 3, 4, 5, 6]),
        map(mock),
        intersection(wrap([4, 2])),
      );

      expect(mock).toHaveBeenCalledTimes(4);
      expect(result).toStrictEqual([2, 4]);
    });
  });
});
