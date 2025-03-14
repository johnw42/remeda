import doTransduce, { type DoTransduceResult } from "./internal/doTransduce";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import { mapCallback } from "./internal/mapCallback";
import { isArray } from "./isArray";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import type { Transducer } from "./internal/types/LazyFunc";

/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param data - The items to map and flatten.
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    R.flatMap(data, callbackfn)
 * @example
 *    R.flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function flatMap<T extends Iterable<unknown>, U>(
  data: T,
  callbackfn: ArrayMethodCallback<T, ReadonlyArray<U> | U>,
): Array<U>;

/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    R.flatMap(callbackfn)(data)
 * @example
 *    R.pipe([1, 2, 3], R.flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @lazy
 * @category Array
 */
export function flatMap<T extends Iterable<unknown>, U>(
  callbackfn: ArrayMethodCallback<T, ReadonlyArray<U> | U>,
): Transducer<T, Array<U>>;

export function flatMap(...args: ReadonlyArray<unknown>): DoTransduceResult {
  return doTransduce(flatMapImplementation, lazyImplementation, args);
}

const flatMapImplementation = <T, U>(
  data: Iterable<T>,
  callbackfn: ArrayMethodCallback<ReadonlyArray<T>, ReadonlyArray<U> | U>,
): Array<U> => toReadonlyArray(data).flatMap(callbackfn);

function* lazyImplementation<T, U>(
  data: Iterable<T>,
  callbackfn: ArrayMethodCallback<ReadonlyArray<T>, ReadonlyArray<U> | U>,
): Iterable<U> {
  for (const [, next] of mapCallback(data, callbackfn)) {
    if (isArray(next)) {
      yield* next;
    } else {
      yield next;
    }
  }
}
