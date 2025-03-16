import { dropWhile } from "./dropWhile";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { take } from "./take";

describeIterableArg("dropWhile", ({ wrap }) => {
  describe("data first", () => {
    it("should return items starting from the first predicate failure", () => {
      expect(dropWhile(wrap([1, 2, 3, 4]), (n) => n !== 3)).toStrictEqual([
        3, 4,
      ]);
    });

    it("should return an empty array when all items pass the predicate", () => {
      expect(dropWhile(wrap([1, 2, 3, 4]), (n) => n > 0)).toStrictEqual([]);
    });

    it("should return an empty array when an empty array is passed", () => {
      expect(dropWhile(wrap([]), (n) => n > 0)).toStrictEqual([]);
    });

    it("should return last item when last item fails the predicate", () => {
      expect(dropWhile(wrap([1, 2, 3, 4]), (n) => n !== 4)).toStrictEqual([4]);
    });

    it("should return a copy of the array when the first item fails the predicate", () => {
      const data = [1, 2, 3, 4];
      const result = dropWhile(wrap(data), (n) => n !== 1);

      expect(result).toStrictEqual(data);
      expect(result).not.toBe(data);
    });
  });

  describe("data last", () => {
    it("should return items starting from the first predicate failure", () => {
      const predicate = vi.fn<(n: number) => boolean>((n) => n !== 3);

      expect(
        pipe(
          wrap([1, 2, 3, 4, 5], { limit: 4 }),
          dropWhile(predicate),
          take(2),
        ),
      ).toStrictEqual([3, 4]);
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    it("should return an empty array when all items pass the predicate", () => {
      expect(
        pipe(
          wrap([1, 2, 3, 4]),
          dropWhile((n) => n > 0),
        ),
      ).toStrictEqual([]);
    });

    it("should return an empty array when an empty array is passed", () => {
      expect(
        pipe(
          wrap([]),
          dropWhile((n) => n > 0),
        ),
      ).toStrictEqual([]);
    });

    it("should return last item when last item fails the predicate", () => {
      expect(
        pipe(
          wrap([1, 2, 3, 4]),
          dropWhile((n) => n !== 4),
        ),
      ).toStrictEqual([4]);
    });

    it("should return a copy of the array when the first item fails the predicate", () => {
      const data = [1, 2, 3, 4];
      const result = pipe(
        wrap(data),
        dropWhile((n) => n !== 1),
      );

      expect(result).toStrictEqual(data);
      expect(result).not.toBe(data);
    });
  });
});
