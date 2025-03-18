import type { IterableElement } from "type-fest";
import doReduce, { type DoReduceResult } from "./internal/doReduce";
import type { lazyKind } from "./internal/types/LazyEffect";

type Sum<T extends Iterable<bigint> | Iterable<number>> =
  // Empty arrays would always result in a sum of (a non-bigint) 0.
  T extends readonly []
    ? 0
    : // Non-empty bigint arrays will always result in a bigint sum.
      T extends readonly [bigint, ...ReadonlyArray<unknown>]
      ? bigint
      : // But an empty bigint array would result in a non-bigint 0.
        IterableElement<T> extends bigint
        ? bigint | 0
        : // Non-bigint arrays are always handled correctly.
          number;

/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.sum(data);
 * @example
 *   R.sum([1, 2, 3]); // => 6
 *   R.sum([1n, 2n, 3n]); // => 6n
 *   R.sum([]); // => 0
 * @dataFirst
 * @category Number
 */
export function sum<T extends Iterable<bigint> | Iterable<number>>(
  data: T,
): Sum<T>;

/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty`to guard against this case.
 *
 * @signature
 *   R.sum()(data);
 * @example
 *   R.pipe([1, 2, 3], R.sum()); // => 6
 *   R.pipe([1n, 2n, 3n], R.sum()); // => 6n
 *   R.pipe([], R.sum()); // => 0
 * @dataLast
 * @category Number
 */
export function sum(): {
  <T extends Iterable<bigint> | Iterable<number>>(data: T): Sum<T>;
  [lazyKind]: "reducer";
};

export function sum(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(sumImplementation, args);
}

function sumImplementation<T extends Iterable<bigint> | Iterable<number>>(
  data: T,
): IterableElement<T> {
  let out: number | bigint = 0;
  let isFirst = true;
  for (const value of data) {
    if (isFirst) {
      if (typeof value === "bigint") {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- The rule differentiates 0 and 0n :(
        out = 0n;
      }
      isFirst = false;
    }
    // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    out += value;
  }
  return out as IterableElement<T>;
}
