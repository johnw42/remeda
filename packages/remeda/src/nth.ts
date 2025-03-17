import type { IterableElement } from "type-fest";
import type AnyIterable from "./internal/types/AnyIterable";
import type { Reducer } from "./internal/types/LazyEffect";
import doReduce, { type DoReduceResult } from "./internal/doReduce";
import { isArray } from "./isArray";

/**
 * Retrieves the nth element of an array or iterable.
 *
 * @param data - The input.
 * @param index - The zero-based index for selecting the element in the iteration order. Negative indices count backwards from the end.
 * @returns The element at the specified index, or `undefined` if the index is out of bounds.
 * @signature
 *   R.nth(data, index);
 * @example
 *   R.nth([2,1,4,5,3], 2); // => 4
 *   R.nth([2,1,4,5,3], -2); // => 5
 * @dataFirst
 * @category Array
 */
export function nth<T extends AnyIterable>(
  data: T,
  index: number,
): IterableElement<T> | undefined;

/**
 * Retrieves the nth element of an array or iterable.
 *
 * @param index - The zero-based index for selecting the element in the iteration order. Negative indices count backwards from the end.
 * @returns The element at the specified index, or `undefined` if the index is out of bounds.
 * @signature
 *   R.nth(index)(data);
 * @example
 *   R.nth(2)([2,1,4,5,3]); // => 4
 *   R.nth(-2)([2,1,4,5,3]); // => 5
 * @dataLast
 * @category Array
 */
export function nth<T extends AnyIterable>(
  index: number,
): Reducer<T, IterableElement<T> | undefined>;

export function nth(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(nthImplementation, args);
}

const nthImplementation = <T>(
  data: Iterable<T>,
  index: number,
): T | undefined => {
  if (isArray(data)) {
    return data.at(index);
  }

  if (index < 0) {
    return [...data].at(index);
  }

  let count = 0;
  for (const item of data) {
    if (count++ === index) {
      return item;
    }
  }

  return undefined;
};
