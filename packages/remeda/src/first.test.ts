import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { filter } from "./filter";
import { first } from "./first";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";

const assertIsDefined = <T>(v: T | null | undefined): T => v!;

// eslint-disable-next-line vitest/require-hook
describeIterableArg("first", ({ wrap }) => {
  describe("first", () => {
    test("should return first", () => {
      expect(first(wrap([1, 2, 3] as const))).toBe(1);
    });

    test("empty array", () => {
      expect(first(wrap([]))).toBeUndefined();
    });

    describe("pipe", () => {
      test("as fn", () => {
        const counter = createLazyInvocationCounter();
        const result = pipe(
          wrap([1, 2, 3, 4, 5, 6] as const),
          counter.fn(),
          first(),
        );

        expect(counter.count).toHaveBeenCalledTimes(1);
        expect(result).toBe(1);
      });

      test("with filter", () => {
        const counter = createLazyInvocationCounter();
        const result = pipe(
          wrap([1, 2, 4, 8, 16] as const),
          counter.fn(),
          filter((x) => x > 3),
          first(),
          assertIsDefined,
          (x) => x + 1,
        );

        expect(counter.count).toHaveBeenCalledTimes(3);
        expect(result).toBe(5);
      });

      test("empty array", () => {
        const counter = createLazyInvocationCounter();
        const result = pipe(wrap([] as const), counter.fn(), first());

        expect(counter.count).toHaveBeenCalledTimes(0);
        expect(result).toBeUndefined();
      });

      test("2 x first()", () => {
        const counter = createLazyInvocationCounter();
        const result = pipe(
          wrap([[1, 2, 3], [4, 5], [6]] as const),
          counter.fn(),
          first(),
          assertIsDefined,
          first(),
        );

        expect(counter.count).toHaveBeenCalledTimes(1);
        expect(result).toBe(1);
      });

      test("complex", () => {
        const counter1 = createLazyInvocationCounter();
        const counter2 = createLazyInvocationCounter();
        const result = pipe(
          wrap([[1, 2, 3], [1], [4, 5, 6, 7], [1, 2, 3, 4]] as const),
          counter1.fn(),
          filter((arr) => arr.length === 4),
          first(),
          assertIsDefined<ReadonlyArray<number>>,
          counter2.fn(),
          filter((x) => x % 2 === 1),
          first(),
        );

        expect(counter1.count).toHaveBeenCalledTimes(3);
        expect(counter2.count).toHaveBeenCalledTimes(2);
        expect(result).toBe(5);
      });
    });

    test("simple empty array", () => {
      const arr = wrap([]);
      const result = first(arr);

      expect(result).toBeUndefined();
    });

    test("simple array", () => {
      const arr = wrap([1]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("simple non-empty array", () => {
      const arr = wrap([1]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("simple tuple", () => {
      const arr = wrap([1, "a"]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("array with more than one item", () => {
      const arr = wrap([1, 2]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("trivial empty array", () => {
      const arr = wrap([]);
      const result = first(arr);

      expect(result).toBeUndefined();
    });

    test("array with last", () => {
      const arr = wrap([1]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("tuple with last", () => {
      const arr = wrap(["a", 1]);
      const result = first(arr);

      expect(result).toBe("a");
    });

    test("simple empty readonly array", () => {
      const arr = wrap([]);
      const result = first(arr);

      expect(result).toBeUndefined();
    });

    test("simple readonly array", () => {
      const arr = wrap([1]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("simple non-empty readonly array", () => {
      const arr = wrap([1]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("simple readonly tuple", () => {
      const arr = wrap([1, "a"]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("readonly array with more than one item", () => {
      const arr = wrap([1, 2]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("readonly trivial empty array", () => {
      const arr = wrap([]);
      const result = first(arr);

      expect(result).toBeUndefined();
    });

    test("readonly array with last", () => {
      const arr = wrap([1]);
      const result = first(arr);

      expect(result).toBe(1);
    });

    test("readonly tuple with last", () => {
      const arr = wrap(["a", 1]);
      const result = first(arr);

      expect(result).toBe("a");
    });
  });
});
