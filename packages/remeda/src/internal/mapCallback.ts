import { isArray } from "../isArray";
import type { ArrayMethodCallback } from "./types/ArrayMethodCallback";

/**
 * Maps each element of the given array to a tuple of the element and the result
 * of the callback function.
 *
 * This function is used internally by array methods like `map`, `filter`,
 * `find`, etc. to provide the `index` and `data` arguments to the callback
 * function in the case where the data is not an array, and to ensure that when
 * the data is an array, it is passed as the `data` argument.
 *
 * @yields A pair of an item passed to the callback and the value returned by
 * the callback.
 */
export function* mapCallback<T, U>(
  data: Iterable<T>,
  callbackfn: ArrayMethodCallback<ReadonlyArray<T>, U>,
): Iterable<[T, U]> {
  let index = 0;
  let writableData: Array<T> | undefined;
  const dataArg: ReadonlyArray<T> = isArray(data) ? data : (writableData = []);
  for (const value of data) {
    if (writableData !== undefined) {
      writableData.push(value);
    }
    yield [value, callbackfn(value, index++, dataArg)];
  }
}
