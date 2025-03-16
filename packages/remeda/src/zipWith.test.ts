import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { zipWith } from "./zipWith";

describeIterableArg("zipWith", ({ wrap }) => {
  describe("data first", () => {
    test("should zip with predicate", () => {
      expect(
        zipWith(
          wrap(["1", "2", "3"]),
          wrap(["a", "b", "c"]),
          (a, b) => `${a}${b}`,
        ),
      ).toStrictEqual(["1a", "2b", "3c"]);
    });

    test("should truncate to shorter second", () => {
      expect(
        zipWith(wrap(["1", "2", "3"]), wrap(["a", "b"]), (a, b) => `${a}${b}`),
      ).toStrictEqual(["1a", "2b"]);
    });

    test("should truncate to shorter first", () => {
      expect(
        zipWith(wrap(["1", "2"]), wrap(["a", "b", "c"]), (a, b) => `${a}${b}`),
      ).toStrictEqual(["1a", "2b"]);
    });
  });

  describe("data second", () => {
    test("should zip with predicate", () => {
      expect(
        zipWith((a: string, b: string) => `${a}${b}`)(
          wrap(["1", "2", "3"]),
          wrap(["a", "b", "c"]),
        ),
      ).toStrictEqual(["1a", "2b", "3c"]);
    });

    test("should truncate to shorter second", () => {
      expect(
        zipWith((a: string, b: string) => `${a}${b}`)(
          wrap(["1", "2", "3"]),
          wrap(["a", "b"]),
        ),
      ).toStrictEqual(["1a", "2b"]);
    });

    test("should truncate to shorter first", () => {
      expect(
        zipWith((a: string, b: string) => `${a}${b}`)(
          wrap(["1", "2"]),
          wrap(["a", "b", "c"]),
        ),
      ).toStrictEqual(["1a", "2b"]);
    });
  });

  describe("data second with initial arg", () => {
    test("should zip with predicate", () => {
      expect(
        pipe(
          wrap(["1", "2", "3"]),
          zipWith(wrap(["a", "b", "c"]), (a, b) => `${a}${b}`),
        ),
      ).toStrictEqual(["1a", "2b", "3c"]);
    });

    test("should truncate to shorter second", () => {
      expect(
        pipe(
          wrap(["1", "2", "3"]),
          zipWith(wrap(["a", "b"]), (a, b) => `${a}${b}`),
        ),
      ).toStrictEqual(["1a", "2b"]);
    });

    test("should truncate to shorter first", () => {
      expect(
        pipe(
          wrap(["1", "2"]),
          zipWith(wrap(["a", "b", "c"]), (a, b) => `${a}${b}`),
        ),
      ).toStrictEqual(["1a", "2b"]);
    });
  });
});
