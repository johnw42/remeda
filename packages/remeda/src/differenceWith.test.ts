import { differenceWith } from "./differenceWith";
import { describeIterableArg } from "./internal/describeIterableArg";
import { isDeepEqual } from "./isDeepEqual";
import { pipe } from "./pipe";
import { take } from "./take";

const source = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
const other = [{ a: 2 }, { a: 5 }, { a: 3 }];
const expected = [{ a: 1 }, { a: 4 }];

// eslint-disable-next-line vitest/require-hook
describeIterableArg("differenceWith", ({ wrap }) => {
  describe("data_first", () => {
    test("should return difference", () => {
      expect(
        differenceWith(wrap(source), wrap(other), isDeepEqual),
      ).toStrictEqual(expected);
    });

    test("should allow differencing different data types", () => {
      expect(
        differenceWith([1, 2, 3, 4], ["2", "3"], (a, b) => a.toString() === b),
      ).toStrictEqual([1, 4]);
    });
  });

  describe("data_last", () => {
    test("should return difference", () => {
      expect(
        differenceWith(wrap(other), isDeepEqual)(wrap(source)),
      ).toStrictEqual(expected);
    });

    test("should allow differencing different data types", () => {
      expect(
        pipe(
          [1, 2, 3, 4],
          differenceWith(["2", "3"], (a, b) => a.toString() === b),
        ),
      ).toStrictEqual([1, 4]);
    });

    test("lazy", () => {
      const result = pipe(
        wrap([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }], 4),
        differenceWith(wrap([{ a: 2 }, { a: 3 }]), isDeepEqual),
        take(2),
      );

      expect(result).toStrictEqual([{ a: 1 }, { a: 4 }]);
    });
  });
});
