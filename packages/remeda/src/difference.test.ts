import { difference } from "./difference";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { take } from "./take";

describeIterableArg("difference", ({ wrap }) => {
  it("returns empty array on empty input", () => {
    expect(difference(wrap([]), wrap([1, 2, 3]))).toStrictEqual([]);
  });

  it("removes nothing on empty other array", () => {
    expect(difference(wrap([1, 2, 3]), wrap([]))).toStrictEqual([1, 2, 3]);
  });

  it("returns a shallow clone when nothing is removed", () => {
    const data = [1, 2, 3];
    const result = difference(data, wrap([4, 5, 6]));

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  it("removes an item that is in the input", () => {
    expect(difference(wrap([1]), wrap([1]))).toStrictEqual([]);
  });

  it("doesn't remove items that are not in the other array", () => {
    expect(difference(wrap([1]), wrap([2]))).toStrictEqual([1]);
  });

  it("maintains multi-set semantics (removes only one copy)", () => {
    expect(difference(wrap([1, 1, 2, 2]), wrap([1]))).toStrictEqual([1, 2, 2]);
  });

  it("works if the other array has more copies than the input", () => {
    expect(difference(wrap([1]), wrap([1, 1]))).toStrictEqual([]);
  });

  it("preserves the original order in source array", () => {
    expect(difference(wrap([3, 1, 2, 2, 4]), wrap([2]))).toStrictEqual([
      3, 1, 2, 4,
    ]);
  });

  it("accounts and removes multiple copies", () => {
    expect(
      difference(wrap([1, 2, 3, 1, 2, 3, 1, 2, 3]), [1, 2, 1, 2]),
    ).toStrictEqual([3, 3, 1, 2, 3]);
  });

  it("works with strings", () => {
    expect(difference(wrap(["a", "b", "c"]), wrap(["b"]))).toStrictEqual([
      "a",
      "c",
    ]);
  });

  it("works with objects", () => {
    const item = { a: 2 };

    expect(
      difference(wrap([item, { b: 3 }, item]), wrap([item, item])),
    ).toStrictEqual([{ b: 3 }]);
  });

  it("compares objects by reference", () => {
    expect(
      difference(wrap([{ a: 2 }, { b: 3 }]), wrap([{ a: 2 }])),
    ).toStrictEqual([{ a: 2 }, { b: 3 }]);
  });

  test("lazy", () => {
    const result = pipe(
      wrap([1, 2, 3, 4, 5, 6], { limit: 4 }),
      difference(wrap([2, 3])),
      take(2),
    );

    expect(result).toStrictEqual([1, 4]);
  });
});
