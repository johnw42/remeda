import doTransduce, { type DoTransduceResult } from "./internal/doTransduce";
import type { Mapped } from "./internal/types/Mapped";
import type { ArrayMethodCallbackWithExtraArg } from "./internal/types/ArrayMethodCallback";
import type { Transducer } from "./internal/types/LazyEffect";
import { mapCallback } from "./internal/mapCallback";
import type AnyIterable from "./internal/types/AnyIterable";

/**
 * Applies a function on each element of the array, using the result of the
 * previous application, and returns an array of the successively computed
 * values.
 *
 * @param data - The array to map over.
 * @param callbackfn - The callback function that receives the previous value,
 * the current element.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the
 * array.
 * @signature
 *    R.mapWithFeedback(data, callbackfn, initialValue);
 * @example
 *    R.mapWithFeedback(
 *      [1, 2, 3, 4, 5],
 *      (prev, x) => prev + x,
 *      100,
 *    ); // => [101, 103, 106, 110, 115]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function mapWithFeedback<T extends AnyIterable, U>(
  data: T,
  callbackfn: ArrayMethodCallbackWithExtraArg<U, T, U>,
  initialValue: U,
): Mapped<T, U>;

/**
 * Applies a function on each element of the array, using the result of the
 * previous application, and returns an array of the successively computed
 * values.
 *
 * @param callbackfn - The callback function that receives the previous value,
 * the current element.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the
 * array.
 * @signature
 *    R.mapWithFeedback(callbackfn, initialValue)(data);
 * @example
 *    R.pipe(
 *      [1, 2, 3, 4, 5],
 *      R.mapWithFeedback((prev, x) => prev + x, 100),
 *    ); // => [101, 103, 106, 110, 115]
 * @dataLast
 * @lazy
 * @category Array
 */
export function mapWithFeedback<T extends AnyIterable, U>(
  callbackfn: ArrayMethodCallbackWithExtraArg<U, T, U>,
  initialValue: U,
): Transducer<T, Mapped<T, U>>;

export function mapWithFeedback(
  ...args: ReadonlyArray<unknown>
): DoTransduceResult {
  return doTransduce(undefined, lazyImplementation, args);
}

function* lazyImplementation<T, U>(
  data: Iterable<T>,
  reducer: ArrayMethodCallbackWithExtraArg<U, ReadonlyArray<T>, U>,
  initialValue: U,
): Iterable<U> {
  let previousValue = initialValue;
  for (const [, nextValue] of mapCallback(data, (valueArg, index, dataArg) => {
    const result = reducer(previousValue, valueArg, index, dataArg);
    previousValue = result;
    return result;
  })) {
    yield nextValue;
  }
}
