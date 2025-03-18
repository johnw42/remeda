import type { IterableElement, Simplify } from "type-fest";
import type { ExactRecord } from "./internal/types/ExactRecord";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import type AnyIterable from "./internal/types/AnyIterable";
import { mapCallback } from "./internal/mapCallback";
import doReduce from "./internal/doReduce";

// Takes a union of literals and creates a union of records with the value V for
// each key **separately**
// @example ExactlyOneKey<"cat" | "dog", boolean> // { cat: boolean } | { dog: boolean }
type ExactlyOneKey<T, V> = T extends PropertyKey ? Record<T, V> : never;

type FromKeys<T extends AnyIterable, V> = T extends readonly []
  ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- We want to return an empty object type here, but it's not trivial to build that in Typescript, other fixer suggestions like Record<PropertyKey, never> or Record<PropertyKey, unknown> both break our type tests so they don't do what we need here. Because the result is mutable this might be the correct type after all...
    {}
  : T extends readonly [infer Head, ...infer Rest]
    ? ExactlyOneKey<Head, V> & FromKeys<Rest, V>
    : IterableElement<T> extends PropertyKey
      ? ExactRecord<IterableElement<T>, V>
      : never;

/**
 * Creates an object that maps each key in `data` to the result of `mapper` for
 * that key. Duplicate keys are overwritten, guaranteeing that `mapper` is run
 * for each item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - An array of keys of the output object. All items in the array
 * would be keys in the output array.
 * @param mapper - Takes a key and returns the value that would be associated
 * with that key.
 * @signature
 *   R.fromKeys(data, mapper);
 * @example
 *   R.fromKeys(["cat", "dog"], R.length()); // { cat: 3, dog: 3 } (typed as Partial<Record<"cat" | "dog", number>>)
 *   R.fromKeys([1, 2], R.add(1)); // { 1: 2, 2: 3 } (typed as Partial<Record<1 | 2, number>>)
 * @dataFirst
 * @category Object
 */
export function fromKeys<T extends Iterable<PropertyKey>, V>(
  data: T,
  mapper: ArrayMethodCallback<T, V>,
): Simplify<FromKeys<T, V>>;

/**
 * Creates an object that maps each key in `data` to the result of `mapper` for
 * that key. Duplicate keys are overwritten, guaranteeing that `mapper` is run
 * for each item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param mapper - Takes a key and returns the value that would be associated
 * with that key.
 * @signature
 *   R.fromKeys(mapper)(data);
 * @example
 *   R.pipe(["cat", "dog"], R.fromKeys(R.length())); // { cat: 3, dog: 3 } (typed as Partial<Record<"cat" | "dog", number>>)
 *   R.pipe([1, 2], R.fromKeys(R.add(1))); // { 1: 2, 2: 3 } (typed as Partial<Record<1 | 2, number>>)
 * @dataLast
 * @category Object
 */
export function fromKeys<T extends Iterable<PropertyKey>, V>(
  mapper: ArrayMethodCallback<T, V>,
): (data: T) => Simplify<FromKeys<T, V>>;

export function fromKeys(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(fromKeysImplementation, args);
}

function fromKeysImplementation<K extends PropertyKey, V>(
  data: Iterable<K>,
  mapper: ArrayMethodCallback<Iterable<K>, V>,
): FromKeys<Iterable<K>, V> {
  const result: Partial<Record<K, V>> = {};

  for (const [key, value] of mapCallback(data, mapper)) {
    result[key] = value;
  }

  return result as FromKeys<Iterable<K>, V>;
}
