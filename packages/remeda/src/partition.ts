import type { IterableElement } from "type-fest";
import type AnyIterable from "./internal/types/AnyIterable";
import type {
  ArrayMethodCallback,
  ArrayMethodTypePredicate,
} from "./internal/types/ArrayMethodCallback";
import type { Reducer } from "./internal/types/LazyEffect";
import { mapCallback } from "./internal/mapCallback";
import doReduce, { type DoReduceResult } from "./internal/doReduce";
import type { ToArray } from "./internal/types/ToArray";

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param data - The items to split.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and and
 * `false` to add the element to the other partition. A type-predicate can also
 * be used to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    R.partition(data, predicate)
 * @example
 *    R.partition(
 *      ['one', 'two', 'forty two'],
 *      x => x.length === 3,
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataFirst
 * @category Array
 */
export function partition<T extends AnyIterable, S extends IterableElement<T>>(
  data: T,
  predicate: ArrayMethodTypePredicate<T, S>,
): [Array<S>, Array<Exclude<IterableElement<T>, S>>];
export function partition<T extends AnyIterable>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): [ToArray<T>, ToArray<T>];

/**
 * Splits a collection into two groups, the first of which contains elements the
 * `predicate` type guard passes, and the second one containing the rest.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to add the element to the first partition, and and
 * `false` to add the element to the other partition. A type-predicate can also
 * be used to narrow the result.
 * @returns A 2-tuple of arrays where the first array contains the elements that
 * passed the predicate, and the second array contains the elements that did
 * not. The items are in the same order as they were in the original array.
 * @signature
 *    R.partition(predicate)(data)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'forty two'],
 *      R.partition(x => x.length === 3),
 *    ); // => [['one', 'two'], ['forty two']]
 * @dataLast
 * @category Array
 */
export function partition<T extends AnyIterable, S extends IterableElement<T>>(
  predicate: ArrayMethodTypePredicate<T, S>,
): Reducer<T, [Array<S>, Array<Exclude<IterableElement<T>, S>>]>;
export function partition<T extends AnyIterable>(
  predicate: ArrayMethodCallback<T, boolean>,
): Reducer<T, [ToArray<T>, ToArray<T>]>;

export function partition(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(partitionImplementation, args);
}

const partitionImplementation = <T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): [Array<T>, Array<T>] => {
  const ret: [Array<T>, Array<T>] = [[], []];
  for (const [item, flag] of mapCallback(data, predicate)) {
    if (flag) {
      ret[0].push(item);
    } else {
      ret[1].push(item);
    }
  }
  return ret;
};
