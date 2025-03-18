import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import { isArray } from "./isArray";
import doTransduce from "./internal/doTransduce";
import { mapCallback } from "./internal/mapCallback";
import type { ToArrayOrTuple } from "./internal/types/ToArray";
import type AnyIterable from "./internal/types/AnyIterable";

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(data, predicate)
 * @example
 *    R.dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @category Array
 */
export function dropWhile<T extends AnyIterable>(
  data: T,
  predicate: ArrayMethodCallback<T, boolean>,
): ToArrayOrTuple<T>;

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4], R.dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @category Array
 */
export function dropWhile<T extends AnyIterable>(
  predicate: ArrayMethodCallback<T, boolean>,
): (data: T) => ToArrayOrTuple<T>;

export function dropWhile(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(dropWhileImplementation, lazyImplemention, args);
}

function dropWhileImplementation<T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): Array<T> {
  if (!isArray(data)) {
    return [...lazyImplemention(data, predicate)];
  }

  for (const [index, item] of data.entries()) {
    if (!predicate(item, index, data)) {
      return data.slice(index);
    }
  }
  return [];
}

function* lazyImplemention<T>(
  data: Iterable<T>,
  predicate: ArrayMethodCallback<ReadonlyArray<T>, boolean>,
): Iterable<T> {
  let dropping = true;
  for (const [item, flag] of mapCallback(data, (itemArg, index, dataArg) => {
    if (!dropping) {
      return false;
    }
    if (!predicate(itemArg, index, dataArg)) {
      dropping = false;
      return false;
    }
    return true;
  })) {
    if (!flag) {
      yield item;
    }
  }
}
