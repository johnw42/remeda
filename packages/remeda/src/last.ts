import type { IterableElement, LastArrayElement } from "type-fest";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type AnyIterable from "./internal/types/AnyIterable";
import { isArray } from "./isArray";
import doReduce from "./internal/doReduce";

type Last<T extends AnyIterable> = T extends IterableContainer
  ? LastArrayElement<
      T,
      // Type-fest's LastArrayElement assumes a looser typescript configuration
      // where `noUncheckedIndexedAccess` is disabled. To support the stricter
      // configuration we assume we need to assign the "LastArrayElement" param to
      // `undefined`, but only if the array isn't empty.
      T extends readonly [] ? never : undefined
    >
  : IterableElement<T>;

/**
 * Gets the last element of `array`.
 *
 * @param data - The array.
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @dataFirst
 * @category Array
 */
export function last<T extends AnyIterable>(data: T): Last<T>;

/**
 * Gets the last element of `array`.
 *
 * @signature
 *    R.last()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.last(),
 *      x => x + 1
 *    ); // => 17
 * @dataLast
 * @category Array
 */
export function last(): <T extends AnyIterable>(data: T) => Last<T>;

export function last(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(lastImplementation, args);
}

function lastImplementation<T>(data: Iterable<T>): T | undefined {
  if (isArray(data)) {
    return data.at(-1);
  }

  let lastItem: T | undefined;
  for (const value of data) {
    lastItem = value;
  }
  return lastItem;
}
