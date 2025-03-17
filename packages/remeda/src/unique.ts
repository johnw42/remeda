import doTransduce, { type DoTransduceResult } from "./internal/doTransduce";
import type AnyIterable from "./internal/types/AnyIterable";
import type { Deduped } from "./internal/types/Deduped";
import type { lazyImpl, lazyKind } from "./internal/types/LazyEffect";
import type ToIterable from "./internal/types/ToIterable";

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @signature
 *    R.unique(array)
 * @example
 *    R.unique([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function unique<T extends Iterable<T>>(data: T): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @signature
 *    R.unique()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.unique(),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
export function unique(): {
  <T extends AnyIterable>(data: T): Deduped<T>;
  readonly [lazyImpl]: <T extends AnyIterable>(
    data: T,
  ) => ToIterable<Deduped<T>>;
  readonly [lazyKind]: "transducer";
};

export function unique(...args: ReadonlyArray<unknown>): DoTransduceResult {
  return doTransduce(undefined, lazyImplementation, args);
}

function* lazyImplementation<T>(data: Iterable<T>): Iterable<T> {
  const set = new Set<T>();
  for (const value of data) {
    if (set.has(value)) {
      continue;
    }
    set.add(value);
    yield value;
  }
}
