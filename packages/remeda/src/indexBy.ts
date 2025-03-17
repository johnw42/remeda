import type AnyIterable from "./internal/types/AnyIterable";
import type { ExactRecord } from "./internal/types/ExactRecord";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import type { Reducer } from "./internal/types/LazyEffect";
import { mapCallback } from "./internal/mapCallback";
import doReduce, { type DoReduceResult } from "./internal/doReduce";

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - The array.
 * @param mapper - The indexing function.
 * @signature
 *    R.indexBy(array, fn)
 * @example
 *    R.indexBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @category Array
 */
export function indexBy<T extends AnyIterable, K extends PropertyKey>(
  data: T,
  mapper: ArrayMethodCallback<T, K>,
): ExactRecord<K, T>;

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param mapper - The indexing function.
 * @signature
 *    R.indexBy(fn)(array)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.indexBy(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @dataLast
 * @category Array
 */
export function indexBy<T extends AnyIterable, K extends PropertyKey>(
  mapper: ArrayMethodCallback<T, K>,
): Reducer<T, ExactRecord<K, T>>;

export function indexBy(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(indexByImplementation, args);
}

function indexByImplementation<T, K extends PropertyKey>(
  data: Iterable<T>,
  mapper: ArrayMethodCallback<ReadonlyArray<T>, K>,
): ExactRecord<K, T> {
  const out: Partial<Record<K, T>> = {};

  for (const [item, key] of mapCallback(data, mapper)) {
    out[key] = item;
  }

  return out as ExactRecord<K, T>;
}
