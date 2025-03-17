import { describeIterableArg } from "./internal/describeIterableArg";
import { only } from "./only";
import { pipe } from "./pipe";

describeIterableArg("only", ({ wrap }) => {
  describe("dataFirst", () => {
    test("empty input", () => {
      expect(only(wrap([]))).toBeUndefined();
    });

    test("length 1 input", () => {
      expect(only(wrap([1]))).toBe(1);
    });

    test("length 2 input", () => {
      expect(only(wrap([1, 2]))).toBeUndefined();
    });
  });

  describe("data last", () => {
    test("empty input", () => {
      expect(pipe(wrap([]), only())).toBeUndefined();
    });

    test("length 1 input", () => {
      expect(pipe(wrap([1]), only())).toBe(1);
    });

    test("length 2 input", () => {
      expect(pipe(wrap([1, 2]), only())).toBeUndefined();
    });
  });
});

test("simple tuple", () => {
  expect(only([1, "a"])).toBeUndefined();
});

test("tuple with last", () => {
  expect(only(["a", 1])).toBeUndefined();
});

test("tuple with two last", () => {
  expect(only(["a", 1, 2])).toBeUndefined();
});

test("tuple with first and last", () => {
  expect(only([1, "a", 2])).toBeUndefined();
});
