import doReduce, { type DoReduceResult } from "./internal/doReduce";
import { mapCallback } from "./internal/mapCallback";
import type AnyIterable from "./internal/types/AnyIterable";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import type { Reducer } from "./internal/types/LazyEffect";

/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param fn - Predicate function.
 * @signature
 *   R.meanBy(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @category Array
 */
export function meanBy<T extends AnyIterable>(
  fn: ArrayMethodCallback<T, number>,
): Reducer<T, number>;

/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param items - The array.
 * @param fn - Predicate function.
 * @signature
 *   R.meanBy(array, fn)
 * @example
 *    R.meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @category Array
 */

export function meanBy<T extends AnyIterable>(
  items: T,
  fn: ArrayMethodCallback<T, number>,
): number;

export function meanBy(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(meanByImplementation, args);
}

const meanByImplementation = <T>(
  data: Iterable<T>,
  fn: (value: T, index: number, data: ReadonlyArray<T>) => number,
): number => {
  if (Array.isArray(data) && data.length === 0) {
    return Number.NaN;
  }

  let sum = 0;
  let count = 0;
  for (const [, value] of mapCallback(data, fn)) {
    sum += value;
    count++;
  }
  return sum / count;
};
