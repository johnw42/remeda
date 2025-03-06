import doProduce from "./internal/doProduce";
import type { LazyProducer } from "./internal/types/LazyFunc";
import { STOP_PRODUCER } from "./internal/utilityEvaluators";

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
  return doProduce(unfoldImplementation, lazyImplementation, args);
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

function lazyImplementation<T, R>(
  seed: T,
  fn: (value: T) => [value: R, nextSeed: T] | undefined,
): LazyProducer<R> {
  let currentSeed = seed;
  return () => {
    const valueAndSeed = fn(currentSeed);
    if (valueAndSeed === undefined) {
      return STOP_PRODUCER;
    }
    const [result, nextSeed] = valueAndSeed;
    currentSeed = nextSeed;
    return { value: [result] };
  };
}
