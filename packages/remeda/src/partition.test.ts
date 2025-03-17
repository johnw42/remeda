import { describeIterableArg } from "./internal/describeIterableArg";
import { isNumber } from "./isNumber";
import { partition } from "./partition";
import { pipe } from "./pipe";

describeIterableArg("partition", ({ wrap }) => {
  describe("data first", () => {
    test("partition", () => {
      expect(
        partition(
          wrap([
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ]),
          ({ a }) => a === 1,
        ),
      ).toStrictEqual([
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [{ a: 2, b: 1 }],
      ]);
    });

    test("partition with type guard", () => {
      expect(partition(wrap([1, "a", 2, "b"]), isNumber)).toStrictEqual([
        [1, 2],
        ["a", "b"],
      ]);
    });

    test("partition with type guard in pipe", () => {
      expect(
        pipe(
          wrap([1, "a", 2, "b"]),
          partition((value): value is number => typeof value === "number"),
        ),
      ).toStrictEqual([
        [1, 2],
        ["a", "b"],
      ]);
    });

    test("indexed", () => {
      expect(
        partition(
          wrap([
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ]),
          (_, index) => index !== 2,
        ),
      ).toStrictEqual([
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [{ a: 2, b: 1 }],
      ]);
    });
  });

  describe("data last", () => {
    test("partition", () => {
      expect(
        pipe(
          wrap([
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ]),
          partition(({ a }) => a === 1),
        ),
      ).toStrictEqual([
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [{ a: 2, b: 1 }],
      ]);
    });

    test("indexed", () => {
      expect(
        pipe(
          wrap([
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ]),
          partition((_, index) => index !== 2),
        ),
      ).toStrictEqual([
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [{ a: 2, b: 1 }],
      ]);
    });
  });
});
