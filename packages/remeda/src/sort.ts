import type { IterableElement } from "type-fest";
import type AnyIterable from "./internal/types/AnyIterable";
import type { ReorderedArray } from "./internal/types/ReorderedArray";
import { purry } from "./purry";

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param items - The array to sort.
 * @param cmp - The comparator function.
 * @signature
 *    R.sort(items, cmp)
 * @example
 *    R.sort([4, 2, 7, 5], (a, b) => a - b); // => [2, 4, 5, 7]
 * @dataFirst
 * @category Array
 */
export function sort<T extends AnyIterable>(
  items: T,
  cmp: (a: IterableElement<T>, b: IterableElement<T>) => number,
): ReorderedArray<T>;

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param cmp - The comparator function.
 * @signature
 *    R.sort(cmp)(items)
 * @example
 *    R.pipe([4, 2, 7, 5], R.sort((a, b) => a - b)) // => [2, 4, 5, 7]
 * @dataLast
 * @category Array
 */
export function sort<T extends AnyIterable>(
  cmp: (a: IterableElement<T>, b: IterableElement<T>) => number,
): (items: T) => ReorderedArray<T>;

export function sort(...args: ReadonlyArray<unknown>): unknown {
  return purry(sortImplementation, args);
}

function sortImplementation<T extends AnyIterable>(
  items: T,
  cmp: (a: IterableElement<T>, b: IterableElement<T>) => number,
): ReorderedArray<T> {
  const ret = [...items];
  ret.sort(cmp);
  return ret as ReorderedArray<T>;
}
