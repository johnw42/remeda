import doReduce, { type DoReduceResult } from "./internal/doReduce";
import type AnyIterable from "./internal/types/AnyIterable";
import type { Reducer } from "./internal/types/LazyEffect";
import type { ToArray } from "./internal/types/ToArray";

type Reverse<T extends AnyIterable, R extends AnyIterable = []> = ReturnType<
  T extends ReadonlyArray<unknown>
    ? R extends ReadonlyArray<unknown>
      ? T extends IsNoTuple<T>
        ? () => [...T, ...R]
        : T extends readonly [infer F, ...infer L]
          ? () => Reverse<L, [F, ...R]>
          : () => R
      : () => ToArray<T>
    : () => ToArray<T>
>;

type IsNoTuple<T> = T extends readonly [unknown, ...Array<unknown>] ? never : T;

/**
 * Reverses a sequence.
 *
 * @param data - The data.
 * @signature
 *    R.reverse(arr);
 * @example
 *    R.reverse([1, 2, 3]) // [3, 2, 1]
 * @dataFirst
 * @category Array
 */
export function reverse<T extends AnyIterable>(data: T): Reverse<T>;

/**
 * Reverses a sequence.
 *
 * @signature
 *    R.reverse()(data);
 * @example
 *    R.reverse()([1, 2, 3]) // [3, 2, 1]
 * @dataLast
 * @category Array
 */
export function reverse<T extends AnyIterable>(): Reducer<T, Reverse<T>>;

export function reverse(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(reverseImplementation, args);
}

function reverseImplementation<T>(array: Iterable<T>): Array<T> {
  // TODO [2025-05-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toReversed` here.
  return [...array].reverse();
}
