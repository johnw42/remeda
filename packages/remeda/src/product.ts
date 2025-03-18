import type { IterableElement } from "type-fest";
import doReduce, { type DoReduceResult } from "./internal/doReduce";
import type { lazyKind } from "./internal/types/LazyEffect";

type Product<T extends Iterable<bigint> | Iterable<number>> =
  // Empty arrays would always result in a product of (a non-bigint) 1
  T extends readonly []
    ? 1
    : // Non-empty bigint arrays will always result in a bigint product.
      T extends readonly [bigint, ...ReadonlyArray<unknown>]
      ? bigint
      : // But an empty bigint array would result in a non-bigint 1.
        IterableElement<T> extends bigint
        ? bigint | 1
        : // Non-bigint arrays are always handled correctly.
          number;

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 1 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.product(data);
 * @example
 *   R.product([1, 2, 3]); // => 6
 *   R.product([1n, 2n, 3n]); // => 6n
 *   R.product([]); // => 1
 * @dataFirst
 * @category Number
 */
export function product<T extends Iterable<bigint> | Iterable<number>>(
  data: T,
): Product<T>;

/**
 * Compute the product of the numbers in the array, or return 1 for an empty
 * array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 1 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @signature
 *   R.product()(data);
 * @example
 *   R.pipe([1, 2, 3], R.product()); // => 6
 *   R.pipe([1n, 2n, 3n], R.product()); // => 6n
 *   R.pipe([], R.product()); // => 1
 * @dataLast
 * @category Number
 */
export function product(): {
  <T extends Iterable<bigint> | Iterable<number>>(data: T): Product<T>;
  // Can't use `Reducer` here because the function type is polymorphic.
  readonly [lazyKind]: "reducer";
};

export function product(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(productImplementation, args);
}

function productImplementation(
  data: Iterable<bigint> | Iterable<number>,
): bigint | number {
  let out: number | bigint | undefined;
  for (const value of data) {
    if (out === undefined) {
      out = value;
    } else {
      // @ts-expect-error [ts2365] -- Typescript can't infer that all elements will be a number of the same type.
      out *= value;
    }
  }
  return out ?? 1;
}
