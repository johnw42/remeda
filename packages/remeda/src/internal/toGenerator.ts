/**
 * A helper funtion for unit tests that turns an array into a generator.
 *
 * @yields The elements of the array.
 * @throws If the the number of items requested exceeds `limit`.
 */
export function* toGenerator<T>(
  iterable: Iterable<T>,
  limit = Infinity,
): Iterable<T> {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= limit) {
      throw new Error("Limit exceeded");
    }
    yield item;
  }
}
