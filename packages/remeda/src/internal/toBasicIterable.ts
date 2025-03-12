/**
 * A helper funtion for unit tests that turns an array into a generic iterable.
 *
 * @throws If the the number of items requested exceeds `limit`.
 */
export function toBasicIterable<T>(
  iterable: Iterable<T>,
  itemLimit = Infinity,
  // TODO: Change default to false.
  allowMultipleTraversal = true,
): Iterable<T> {
  const iterator = iterable[Symbol.iterator]();
  let startCount = 0;
  let itemCount = 0;
  return {
    [Symbol.iterator]() {
      if (startCount++ >= 0 && !allowMultipleTraversal) {
        throw new Error("Multiple traversal not allowed");
      }
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
