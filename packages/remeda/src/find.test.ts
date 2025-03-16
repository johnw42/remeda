import { find } from "./find";
import { identity } from "./identity";
import { describeIterableArg } from "./internal/describeIterableArg";
import { map } from "./map";
import { pipe } from "./pipe";

describeIterableArg("find", ({ wrap }) => {
  describe("data first", () => {
    test("find", () => {
      expect(
        find(
          wrap(
            [
              { a: 1, b: 1 },
              { a: 1, b: 2 },
              { a: 2, b: 1 },
              { a: 1, b: 3 },
            ],
            { limit: 2 },
          ),
          ({ b }) => b === 2,
        ),
      ).toStrictEqual({ a: 1, b: 2 });
    });

    test("indexed", () => {
      expect(
        find(
          wrap(
            [
              { a: 1, b: 1 },
              { a: 1, b: 2 },
              { a: 2, b: 1 },
              { a: 1, b: 3 },
            ],
            { limit: 2 },
          ),
          ({ b }, idx) => b === 2 && idx === 1,
        ),
      ).toStrictEqual({ a: 1, b: 2 });
    });
  });

  describe("data last", () => {
    test("find", () => {
      const data = [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 2, b: 1 },
        { a: 1, b: 3 },
      ] as const;

      const counter =
        vi.fn<(x: (typeof data)[number]) => (typeof data)[number]>(identity());

      const actual = pipe(
        wrap(data, { limit: 2 }),
        map(counter),
        find(({ b }) => b === 2),
      );

      expect(counter).toHaveBeenCalledTimes(2);
      expect(actual).toStrictEqual({ a: 1, b: 2 });
    });

    test("indexed", () => {
      const data = [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 2, b: 1 },
        { a: 1, b: 3 },
      ] as const;

      const counter =
        vi.fn<(x: (typeof data)[number]) => (typeof data)[number]>(identity());

      const actual = pipe(
        wrap(data, { limit: 2 }),
        map(counter),
        find(({ b }, idx) => b === 2 && idx === 1),
      );

      expect(counter).toHaveBeenCalledTimes(2);
      expect(actual).toStrictEqual({ a: 1, b: 2 });
    });
  });
});
