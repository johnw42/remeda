import type { IterableElement } from "type-fest";
import doReduce, { type DoReduceResult } from "./internal/doReduce";
import type {
  ArrayMethodCallback,
  ArrayMethodTypePredicate,
} from "./internal/types/ArrayMethodCallback";
import { mapCallback } from "./internal/mapCallback";
import { isArray } from "./isArray";
import type { Reducer } from "./internal/types/LazyEffect";
import type AnyIterable from "./internal/types/AnyIterable";

/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * * `findLast` - If you need the last element that satisfies the provided testing function.
 * * `findIndex` - If you need the index of the found element in the array.
 * * `indexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    R.find(data, predicate)
 * @example
 *    R.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 * @dataFirst
 * @lazy
 * @category Array
 */
export function find<T extends AnyIterable, S extends IterableElement<T>>(
  data: T,
  predicate: ArrayMethodTypePredicate<T, S>,
): S | undefined;
export function find<T extends AnyIterable>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): IterableElement<T> | undefined;

/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * * `findLast` - If you need the last element that satisfies the provided testing function.
 * * `findIndex` - If you need the index of the found element in the array.
 * * `indexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    R.find(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find(n => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @lazy
 * @category Array
 */
export function find<T extends AnyIterable, S extends IterableElement<T>>(
  predicate: ArrayMethodTypePredicate<T, S>,
): Reducer<T, S | undefined>;
export function find<T extends AnyIterable>(
  predicate: ArrayMethodCallback<T, boolean>,
): Reducer<T, IterableElement<T> | undefined>;

export function find(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(findImplementation, args);
}

function findImplementation<T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): T | undefined {
  if (isArray(data)) {
    return data.find(predicate);
  }
  for (const [value, flag] of mapCallback(data, predicate)) {
    if (flag) {
      return value;
    }
  }
  return undefined;
}
