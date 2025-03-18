import { toReadonlyArray } from "./internal/toReadonlyArray";
import type AnyIterable from "./internal/types/AnyIterable";
import type { ToArray } from "./internal/types/ToArray";
import { purry } from "./purry";

/**
 * Takes the last `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to take.
 * @signature
 *    R.takeLast(array, n)
 * @example
 *    R.takeLast([1, 2, 3, 4, 5], 2) // => [4, 5]
 * @dataFirst
 * @category Array
 */
export function takeLast<T extends AnyIterable>(
  array: T,
  n: number,
): ToArray<T>;

/**
 * Take the last `n` elements from the `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.takeLast(n)(array)
 * @example
 *    R.takeLast(2)([1, 2, 3, 4, 5]) // => [4, 5]
 * @dataLast
 * @category Array
 */
export function takeLast<T extends AnyIterable>(
  n: number,
): (array: T) => ToArray<T>;

export function takeLast(...args: ReadonlyArray<unknown>): unknown {
  return purry(takeLastImplementation, args);
}

function takeLastImplementation<T>(data: Iterable<T>, n: number): Array<T> {
  const array = toReadonlyArray(data);
  return n > 0 ? array.slice(Math.max(0, array.length - n)) : [];
}
