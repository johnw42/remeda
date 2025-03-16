import { dropLast } from "./dropLast";
import { describeIterableArg } from "./internal/describeIterableArg";

describeIterableArg("dropLast", ({ wrap }) => {
  test("empty array", () => {
    expect(dropLast(wrap([]), 2)).toStrictEqual([]);
  });

  test("n < 0", () => {
    expect(dropLast(wrap([1, 2, 3, 4, 5]), -1)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("n === 0", () => {
    expect(dropLast(wrap([1, 2, 3, 4, 5]), 0)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("n < length", () => {
    expect(dropLast(wrap([1, 2, 3, 4, 5]), 2)).toStrictEqual([1, 2, 3]);
  });

  test("n === length", () => {
    expect(dropLast(wrap([1, 2, 3, 4, 5]), 5)).toStrictEqual([]);
  });

  test("n > length", () => {
    expect(dropLast(wrap([1, 2, 3, 4, 5]), 10)).toStrictEqual([]);
  });

  test("should return a new array even if there was no drop", () => {
    const data = [1, 2, 3, 4, 5];
    const result = dropLast(wrap(data), 0);

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
  });
});
