import doTransduce, { type DoTransduceResult } from "./internal/doTransduce";
import { isArray } from "./isArray";
import { mapCallback } from "./internal/mapCallback";
import type { IterableElement } from "type-fest";
import type {
  ArrayMethodCallback,
  ArrayMethodTypePredicate,
} from "./internal/types/ArrayMethodCallback";
import type { Transducer } from "./internal/types/LazyFunc";
import type ToArray from "./internal/types/ToArray";

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param data - The array to filter.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    R.filter(data, predicate)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function filter<
  T extends Iterable<unknown>,
  S extends IterableElement<T>,
>(data: T, predicate: ArrayMethodTypePredicate<T, S>): Array<S>;
export function filter<T extends Iterable<unknown>>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): ToArray<T>;

/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    R.filter(predicate)(data)
 * @example
 *    R.pipe([1, 2, 3], R.filter(x => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function filter<
  T extends Iterable<unknown>,
  S extends IterableElement<T>,
>(predicate: ArrayMethodTypePredicate<T, S>): Transducer<T, Array<S>>;
export function filter<T extends Iterable<unknown>>(
  predicate: ArrayMethodCallback<T, boolean>,
): Transducer<T, ToArray<T>>;

export function filter(...args: ReadonlyArray<unknown>): DoTransduceResult {
  return doTransduce(filterImplementation, lazyImplementation, args);
}

function filterImplementation<T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): Array<T> {
  if (isArray(data)) {
    return data.filter(predicate);
  }
  return [...lazyImplementation(data, predicate)];
}

function* lazyImplementation<T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): Iterable<T> {
  for (const [value, flag] of mapCallback(data, predicate)) {
    if (flag) {
      yield value;
    }
  }
}
