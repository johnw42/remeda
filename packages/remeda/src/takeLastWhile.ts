import type { IterableElement } from "type-fest";
import type AnyIterable from "./internal/types/AnyIterable";
import { purry } from "./purry";
import type { ToArray } from "./internal/types/ToArray";
import { toArray } from "./internal/toReadonlyArray";

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.takeLastWhile(data, predicate)
 * @example
 *    R.takeLastWhile([1, 2, 10, 3, 4, 5], x => x < 10) // => [3, 4, 5]
 * @dataFirst
 * @category Array
 */
export function takeLastWhile<T extends AnyIterable>(
  data: T,
  predicate: (
    item: IterableElement<T>,
    index: number,
    data: ReadonlyArray<IterableElement<T>>,
  ) => boolean,
): ToArray<T>;

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.takeLastWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4, 5], R.takeLastWhile(x => x < 10))  // => [3, 4, 5]
 * @dataLast
 * @category Array
 */
export function takeLastWhile<T extends AnyIterable>(
  predicate: (
    item: IterableElement<T>,
    index: number,
    data: ReadonlyArray<IterableElement<T>>,
  ) => boolean,
): (data: T) => ToArray<T>;

export function takeLastWhile(...args: ReadonlyArray<unknown>): unknown {
  return purry(takeLastWhileImplementation, args);
}

function takeLastWhileImplementation<T>(
  data: Iterable<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T> {
  const { array, isCopy } = toArray(data);
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i]!, i, array)) {
      return array.slice(i + 1);
    }
  }
  return isCopy ? array : [...array];
}
