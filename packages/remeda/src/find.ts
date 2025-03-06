import doReduce from "./internal/doReduce";
import type { LazyReducer } from "./internal/types/LazyFunc";
import {
  simplifyCallback,
  SKIP_REDUCER_ITEM,
} from "./internal/utilityEvaluators";

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
export function find<T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): S | undefined;
export function find<T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): T | undefined;

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
export function find<T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): (data: ReadonlyArray<T>) => S | undefined;
export function find<T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => T | undefined;

export function find(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(findImplementation, lazyImplementation, args);
}

const findImplementation = <T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): S | undefined => data.find(predicate);

const lazyImplementation = <T, S extends T>(
  predicate: (value: T, index: number, data: ReadonlyArray<T>) => value is S,
): LazyReducer<T, S> => {
  const simplePredicate = simplifyCallback(predicate);
  return (value: T) =>
    simplePredicate(value)
      ? { done: true, value: value as S }
      : SKIP_REDUCER_ITEM;
};
