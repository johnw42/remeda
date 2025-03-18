import doReduce from "./internal/doReduce";
import type { IterableContainer } from "./internal/types/IterableContainer";

type Median<T extends Iterable<number>> =
  T extends IterableContainer<number>
    ?
        | (T extends readonly [] ? never : number)
        | (T extends readonly [unknown, ...Array<unknown>] ? never : undefined)
    : number | undefined;

/**
 * Returns the median of the elements of an array.
 *
 * Only `number` arrays are supported, as `bigint` is unable to represent fractional values.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.median(data);
 * @example
 *   R.pipe([6, 10, 11], R.median()); // => 10
 *   R.median([]); // => undefined
 * @dataFirst
 * @category Number
 */
export function median<T extends Iterable<number>>(data: T): Median<T>;

/**
 * Returns the median of the elements of an array.
 *
 * Only `number` arrays are supported, as `bigint` is unable to represent fractional values.
 *
 * IMPORTANT: The result for empty arrays would be `undefined`, regardless of
 * the type of the array. This approach improves type-checking and ensures that
 * cases where `NaN` might occur are handled properly. To avoid adding this to
 * the return type for cases where the array is known to be non-empty you can use
 * `hasAtLeast` or `isEmpty` to guard against this case.
 *
 * @signature
 *   R.median()(data);
 * @example
 *   R.pipe([6, 10, 11], R.median()); // => 10
 *   R.pipe([], R.median()); // => undefined
 * @dataLast
 * @category Number
 */
export function median(): <T extends Iterable<number>>(data: T) => Median<T>;

export function median(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(medianImplementation, args);
}

const numberComparator = (a: number, b: number): number => a - b;

function medianImplementation(data: Iterable<number>): number | undefined {
  if (Array.isArray(data) && data.length === 0) {
    return undefined;
  }

  const sortedData = [...data];
  if (sortedData.length === 0) {
    return undefined;
  }

  // TODO [2025-05-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toSorted` here.
  sortedData.sort(numberComparator);

  // For odd length, return the middle element
  if (sortedData.length % 2 !== 0) {
    return sortedData[(sortedData.length - 1) / 2];
  }

  // For even length, return the mean of the two middle elements
  const middleIndex = sortedData.length / 2;

  return (sortedData[middleIndex]! + sortedData[middleIndex - 1]!) / 2;
}
