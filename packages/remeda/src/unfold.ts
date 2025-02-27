import { purry } from "./purry";

/**
 * Generates a list of values by unfolding a seed value.
 *
 * @param seed - The seed value to start unfolding.
 * @param fn - The function to generate the next value and seed.
 * @signature
 *    R.unfold(seed, fn);
 * @example
 *    R.unfold(0, (n) => n < 5 ? [n, n + 1] : undefined) // => [0, 1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function unfold<T, R>(
  seed: T,
  fn: (value: T) => [value: R, nextSeed: T] | undefined,
): Array<R>;
export function unfold<T, R>(
  fn: (value: T) => [value: R, nextSeed: T] | undefined,
): (seed: T) => Array<R>;
export function unfold(...args: ReadonlyArray<unknown>): unknown {
  return purry(unfoldImplementation, args);
}

function unfoldImplementation<T, R>(
  seed: T,
  fn: (value: T) => [value: R, nextSeed: T] | undefined,
): Array<R> {
  const result: Array<R> = [];
  for (;;) {
    const valueAndSeed = fn(seed);
    if (valueAndSeed === undefined) {
      break;
    }
    const [value, nextSeed] = valueAndSeed;
    result.push(value);
    seed = nextSeed;
  }
  return result;
}
