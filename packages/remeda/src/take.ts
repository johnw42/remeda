import doTransduce from "./internal/doTransduce";
import type { LazyTransducer } from "./internal/types/LazyFunc";
import { lazyEmptyEvaluator } from "./internal/utilityEvaluators";

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
export function take<T>(input: Iterable<T>, n: number): Array<T>;

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
export function take(n: number): <T>(array: Iterable<T>) => Array<T>;

export function take(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(takeImplementation, lazyImplementation, args);
}

const takeImplementation = <T>(input: Iterable<T>, n: number): Array<T> => {
  if (Array.isArray(input)) {
    return n < 0 ? [] : (input as Array<T>).slice(0, n);
  }
  const result: Array<T> = [];
  let remaining = n;
  for (const value of input) {
    if (remaining <= 0) {
      break;
    }
    result.push(value);
    remaining--;
  }
  return result;
};

function lazyImplementation<T>(n: number): LazyTransducer<T> {
  if (n <= 0) {
    return lazyEmptyEvaluator;
  }
  let remaining = n;
  return (value) => {
    remaining -= 1;
    return { done: remaining <= 0, value: [value] };
  };
}
