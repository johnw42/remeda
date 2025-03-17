import type { IterableElement } from "type-fest";
import doTransduce, { type DoTransduceResult } from "./internal/doTransduce";
import type { Deduped } from "./internal/types/Deduped";
import type { Transducer } from "./internal/types/LazyEffect";
import type AnyIterable from "./internal/types/AnyIterable";

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param data - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    R.uniqueWith(array, isEquals)
 * @example
 *    R.uniqueWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function uniqueWith<T extends AnyIterable>(
  data: T,
  isEquals: IsEquals<IterableElement<T>>,
): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param isEquals - The comparator.
 * @signature R.uniqueWith(isEquals)(array)
 * @example
 *    R.uniqueWith(R.equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    R.pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      R.uniqueWith(R.equals),
 *      R.take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
export function uniqueWith<T extends AnyIterable>(
  isEquals: IsEquals<IterableElement<T>>,
): Transducer<T, Deduped<T>>;

export function uniqueWith(...args: ReadonlyArray<unknown>): DoTransduceResult {
  return doTransduce(undefined, lazyImplementation, args);
}

function* lazyImplementation<T>(
  data: Iterable<T>,
  isEquals: IsEquals<T>,
): Iterable<T> {
  let index = 0;
  const seen: Array<T> = [];
  for (const value of data) {
    seen.push(value);
    const firstEqualIndex = seen.findIndex(
      (otherValue) => value === otherValue || isEquals(value, otherValue),
    );

    // skip items that aren't at the first equal index.
    if (firstEqualIndex === index) {
      yield value;
    }

    ++index;
  }
}
