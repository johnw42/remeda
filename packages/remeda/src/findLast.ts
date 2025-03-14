import type { IterableElement } from "type-fest";
import { purry } from "./purry";
import type {
  ArrayMethodCallback,
  ArrayMethodTypePredicate,
} from "./internal/types/ArrayMethodCallback";
import type { Reducer } from "./internal/types/LazyFunc";
import type { DoReduceResult } from "./internal/doReduce";
import { toReadonlyArray } from "./internal/toReadonlyArray";

/**
 * Iterates the array in reverse order and returns the value of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, undefined is returned.
 *
 * Similar functions:
 * * `find` - If you need the first element that satisfies the provided testing function.
 * * `findLastIndex` - If you need the index of the found element in the array.
 * * `lastIndexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The last (highest-index) element in the array that satisfies the
 * provided testing function; undefined if no matching element is found.
 * @signature
 *    R.findLast(data, predicate)
 * @example
 *    R.findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 * @dataFirst
 * @category Array
 */
export function findLast<
  T extends Iterable<unknown>,
  S extends IterableElement<T>,
>(data: T, predicate: ArrayMethodTypePredicate<T, S>): S | undefined;
export function findLast<T extends Iterable<unknown>>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): IterableElement<T> | undefined;

/**
 * Iterates the array in reverse order and returns the value of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, undefined is returned.
 *
 * Similar functions:
 * * `find` - If you need the first element that satisfies the provided testing function.
 * * `findLastIndex` - If you need the index of the found element in the array.
 * * `lastIndexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The last (highest-index) element in the array that satisfies the
 * provided testing function; undefined if no matching element is found.
 * @signature
 *    R.findLast(predicate)(data)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.findLast(n => n % 2 === 1)
 *    ) // => 3
 * @dataLast
 * @category Array
 */
export function findLast<
  T extends Iterable<unknown>,
  S extends IterableElement<T>,
>(predicate: ArrayMethodTypePredicate<T, S>): Reducer<T, S | undefined>;
export function findLast<T extends Iterable<unknown>>(
  predicate: ArrayMethodCallback<T, boolean>,
): Reducer<T, IterableElement<T> | undefined>;

export function findLast(...args: ReadonlyArray<unknown>): DoReduceResult {
  return purry(findLastImplementation, args);
}

const findLastImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): T | undefined => {
  const array = toReadonlyArray(data);

  // TODO [2025-05-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.findLast` here.
  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i]!;
    if (predicate(item, i, array)) {
      return item;
    }
  }

  return undefined;
};
