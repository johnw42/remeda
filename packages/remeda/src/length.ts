import doReduce, { type DoReduceResult } from "./internal/doReduce";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import type { Reducer } from "./internal/types/LazyEffect";

/**
 * Counts values of the collection or iterable.
 *
 * @param items - The input data.
 * @signature
 *    R.length(array)
 * @example
 *    R.length([1, 2, 3]) // => 3
 * @dataFirst
 * @category Array
 */
export function length<T>(items: Iterable<T>): number;

/**
 * Counts values of the collection or iterable.
 *
 * @signature
 *    R.length()(array)
 * @example
 *    R.pipe([1, 2, 3], R.length()) // => 3
 * @dataLast
 * @category Array
 */
export function length<T>(): Reducer<Iterable<T>, number>;

export function length(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(lengthImplementation, args);
}

const lengthImplementation = <T>(items: Iterable<T>): number =>
  toReadonlyArray(items).length;
