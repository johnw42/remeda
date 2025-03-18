import doReduce, { type DoReduceResult } from "./internal/doReduce";
import { toArray } from "./internal/toReadonlyArray";
import type AnyIterable from "./internal/types/AnyIterable";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import type { Reducer } from "./internal/types/LazyEffect";
import type { ToArray } from "./internal/types/ToArray";

/**
 * Splits a given sequence at the first index where the given predicate returns true.
 *
 * @param data - The sequence to split.
 * @param predicate - The predicate.
 * @signature
 *    R.splitWhen(data, fn)
 * @example
 *    R.splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
export function splitWhen<T extends AnyIterable>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): [ToArray<T>, ToArray<T>];

/**
 * Splits a given sequence at an index where the given predicate returns true.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.splitWhen(fn)(data)
 * @example
 *    R.splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
export function splitWhen<T extends AnyIterable>(
  predicate: ArrayMethodCallback<T, boolean>,
): Reducer<T, [ToArray<T>, ToArray<T>]>;

export function splitWhen(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(splitWhenImplementation, args);
}

function splitWhenImplementation<T>(
  data: Iterable<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): [Array<T>, Array<T>] {
  const { array, isCopy } = toArray(data);
  const index = array.findIndex(predicate);
  return index === -1
    ? [isCopy ? array : [...array], []]
    : [array.slice(0, index), array.slice(index)];
}
