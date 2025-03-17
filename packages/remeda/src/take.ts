import doTransduce from "./internal/doTransduce";
import { unsafeToArray } from "./internal/unsafeToArray";
import { isArray } from "./isArray";
import type ToArray from "./internal/types/ToArray";
import type AnyIterable from "./internal/types/AnyIterable";

/**
 * Returns the first `n` elements of `input`.
 *
 * @param input - The iterable to take from.
 * @param n - The number of elements to take.
 * @signature
 *    R.take(input, n)
 * @example
 *    R.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function take<T extends AnyIterable>(input: T, n: number): ToArray<T>;

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
export function take(n: number): <T extends AnyIterable>(data: T) => ToArray<T>;

export function take(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(takeImplementation, lazyImplementation, args);
}

function takeImplementation<T>(input: Iterable<T>, n: number): Array<T> {
  if (isArray(input)) {
    return n < 0 ? [] : input.slice(0, n);
  }
  return unsafeToArray(lazyImplementation(input, n));
}

function* lazyImplementation<T>(input: Iterable<T>, n: number): Iterable<T> {
  if (n > 0) {
    for (const item of input) {
      yield item;
      n--;
      if (n <= 0) {
        break;
      }
    }
  }
}
