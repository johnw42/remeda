import { memoizeIterable } from "./memoizeIterable";

/**
 * A helper funtion for unit tests that turns an array into a iterable
 * with no methods other than `[Symbol.iterator]`.
 *
 * If `limit` is provided in `opts`, the iterable will throw an error if it tries to
 * yield more than that number of items.
 *
 * By default, the iterable may be traversed only once.  To allow multiple traversals,
 * set `multiple` to `true` in `opts`.
 */
export function toBasicIterable<T>(
  iterable: Iterable<T>,
  opts: BasicIterableOpts = {},
): Iterable<T> {
  const allowMultipleTraversal = opts.multiple ?? false;
  const itemLimit = opts.limit ?? Infinity;

  if (allowMultipleTraversal) {
    iterable = memoizeIterable(iterable);
  }

  let startCount = 0;
  let itemCount = 0;
  return {
    [Symbol.iterator]() {
      if (startCount++ > 0 && !allowMultipleTraversal) {
        throw new Error("Multiple traversal not allowed");
      }
      const iterator = iterable[Symbol.iterator]();
      return {
        next() {
          if (itemCount++ >= itemLimit) {
            throw new Error("Item limit exceeded");
          }
          const next = iterator.next();
          if (next.done === true) {
            return { done: true, value: undefined };
          }
          return { value: next.value };
        },
      };
    },
  };
}

type BasicIterableOpts = {
  /**
   * The maximum number of items to yield before throwing an error.
   */
  limit?: number;

  /**
   * If true, the iterable may be traversed multiple times.
   */
  multiple?: boolean;
};
