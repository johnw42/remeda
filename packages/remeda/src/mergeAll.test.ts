import { describeIterableArg } from "./internal/describeIterableArg";
import { mergeAll } from "./mergeAll";

describeIterableArg("mergeAll", ({ wrap }) => {
  describe("data first", () => {
    test("merge objects", () => {
      expect(
        mergeAll(wrap([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }] as const)),
      ).toStrictEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 10,
      });
    });

    it("should return an empty object when the input is empty", () => {
      const input: ReadonlyArray<object> = [];

      const result = mergeAll(wrap(input));

      expect(result).toStrictEqual({});
    });
  });

  describe("data last", () => {
    test("merge objects", () => {
      expect(
        mergeAll()(wrap([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }] as const)),
      ).toStrictEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 10,
      });
    });

    it("should return an empty object when the input is empty", () => {
      const input: ReadonlyArray<object> = [];

      const result = mergeAll()(wrap(input));

      expect(result).toStrictEqual({});
    });
  });
});
