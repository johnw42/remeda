import doTransduce from "./internal/doTransduce";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { Mapped } from "./internal/types/Mapped";
import { simplifyCallback2 } from "./internal/utilityEvaluators";

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
export function mapWithFeedback<T extends IterableContainer, U>(
  data: T,
  callbackfn: (
    previousValue: U,
    currentValue: T[number],
    currentIndex: number,
    data: T,
  ) => U,
  initialValue: U,
): Mapped<T, U>;
export function mapWithFeedback<T, U>(
  data: Iterable<T>,
  callbackfn: (
    previousValue: U,
    currentValue: T,
    currentIndex: number,
    data: T,
  ) => U,
  initialValue: U,
): Iterable<U>;

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
export function mapWithFeedback<T extends IterableContainer, U>(
  callbackfn: (
    previousValue: U,
    currentValue: T[number],
    currentIndex: number,
    data: T,
  ) => U,
  initialValue: U,
): (data: T) => Mapped<T, U>;
export function mapWithFeedback<T, U>(
  callbackfn: (
    previousValue: U,
    currentValue: T,
    currentIndex: number,
    data: T,
  ) => U,
  initialValue: U,
): (data: Iterable<T>) => Iterable<U>;

export function mapWithFeedback(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(undefined, lazyImplementation, args);
}

function* lazyImplementation<T, U>(
  data: Iterable<T>,
  reducer: (
    previousValue: U,
    currentValue: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => U,
  initialValue: U,
): Iterable<U> {
  const simpleReducer = simplifyCallback2(reducer);
  let previousValue = initialValue;
  for (const currentValue of data) {
    previousValue = simpleReducer(previousValue, currentValue);
    yield previousValue;
  }
}
