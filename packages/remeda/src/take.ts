import transduce from "./internal/transduce";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyTransducer } from "./internal/types/LazyEvaluator";

/**
 * Returns the first `n` elements of `array`.
 *
 * @param array - The array.
 * @param n - The number of elements to take.
 * @signature
 *    R.take(array, n)
 * @example
 *    R.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function take<T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]>;

/**
 * Returns the first `n` elements of `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.take(n)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.take(n)) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function take(
  n: number,
): <T extends IterableContainer>(array: T) => Array<T[number]>;

export function take(...args: ReadonlyArray<unknown>): unknown {
  return transduce(takeImplementation, lazyImplementation, args);
}

const takeImplementation = <T extends IterableContainer>(
  array: T,
  n: number,
): Array<T[number]> => (n < 0 ? [] : array.slice(0, n));

function lazyImplementation<T>(n: number): LazyTransducer<T> {
  let remaining = n;
  return {
    [Symbol.iterator]() {
      return {
        next(...args) {
          if (args.length === 0) {
            throw new Error("No arguments provided");
          }
          remaining -= 1;
          return remaining <= 0
            ? { done: true, value: undefined }
            : { done: false, value: args };
        },
      };
    },
  };
}
