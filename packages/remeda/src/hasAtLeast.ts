import type { IsNumericLiteral } from "type-fest";
import type AnyIterable from "./internal/types/AnyIterable";
import doReduce, { type DoReduceResult } from "./internal/doReduce";
import type { Reducer } from "./internal/types/LazyEffect";

type ArraySetRequired<
  T extends AnyIterable,
  Min extends number,
  Iteration extends ReadonlyArray<unknown> = [],
> = number extends Min
  ? // There is no semantic meaning to having a non-literal number as Min
    never
  : Iteration["length"] extends Min
    ? // We've reached the end condition for the recursion, T has all N items
      // required.
      T
    : T extends readonly []
      ? // The array doesn't have enough items to have N required items.
        never
      : T extends [infer Head, ...infer Rest]
        ? // The input is a *MUTABLE* tuple, we copy the head to the output and
          // recurse on rest of the tuple...
          [Head, ...ArraySetRequired<Rest, Min, [unknown, ...Iteration]>]
        : T extends readonly [infer Head, ...infer Rest]
          ? // The input is a *READONLY* tuple, we copy the head to the output and
            // recurse on rest of the tuple...
            readonly [
              Head,
              ...ArraySetRequired<Rest, Min, [unknown, ...Iteration]>,
            ]
          : T extends Array<infer Item>
            ? // The input is a regular **MUTABLE** array, we need to fill the
              // output with items until we reach the required size.
              [Item, ...ArraySetRequired<T, Min, [unknown, ...Iteration]>]
            : T extends ReadonlyArray<infer Item>
              ? // The input is a regular **READONLY** array, we need to fill the
                // output with items until we reach the required size.
                readonly [
                  Item,
                  ...ArraySetRequired<T, Min, [unknown, ...Iteration]>,
                ]
              : // The input is not a tuple, an array or an empty array, what is
                // it?!
                never;

/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param data - The input array.
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
 * @signature
 *   R.hasAtLeast(data, minimum)
 * @example
 *   R.hasAtLeast([], 4); // => false
 *
 *   const data: number[] = [1,2,3,4];
 *   R.hasAtLeast(data, 1); // => true
 *   data[0]; // 1, with type `number`
 * @dataFirst
 * @category Array
 */
export function hasAtLeast<T extends AnyIterable, N extends number>(
  data: AnyIterable | T,
  minimum: IsNumericLiteral<N> extends true ? N : never,
): data is ArraySetRequired<T, N>;
export function hasAtLeast(data: AnyIterable, minimum: number): boolean;

/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
 * @signature
 *   R.hasAtLeast(minimum)(data)
 * @example
 *   R.pipe([], R.hasAtLeast(4)); // => false
 *
 *   const data = [[1,2], [3], [4,5]];
 *   R.pipe(
 *     data,
 *     R.filter(R.hasAtLeast(2)),
 *     R.map(([, second]) => second),
 *   ); // => [2,5], with type `number[]`
 * @dataLast
 * @category Array
 */
export function hasAtLeast<N extends number>(
  minimum: IsNumericLiteral<N> extends true ? N : never,
): <T extends AnyIterable>(
  data: AnyIterable | T,
) => data is ArraySetRequired<T, N>;
export function hasAtLeast(minimum: number): Reducer<AnyIterable, boolean>;

export function hasAtLeast(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(hasAtLeastImplementation, args);
}

function hasAtLeastImplementation(data: AnyIterable, minimum: number): boolean {
  if (Array.isArray(data)) {
    return data.length >= minimum;
  }
  if (data instanceof Set || data instanceof Map) {
    return data.size >= minimum;
  }
  if (minimum <= 0) {
    return true;
  }
  let count = 0;
  for (const _ of data) {
    if (++count >= minimum) {
      return true;
    }
  }
  return false;
}
