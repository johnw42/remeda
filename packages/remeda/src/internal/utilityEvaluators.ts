import type { LazyTransducer } from "./types/LazyEvaluator";
import type { LazyResult } from "./types/LazyResult";

/**
 * A singleton value for skipping an item in a lazy evaluator.
 */
export const SKIP_ITEM = {
  done: false,
  value: [],
} as const satisfies LazyResult<never>;

/**
 * A helper evaluator when we want to return an empty result.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function lazyEmptyEvaluator<T>(): ReturnType<LazyTransducer<T>> {
  return SKIP_ITEM;
}

/**
 * A helper evaluator when we want to return a shallow clone of the input.
 */
export function lazyIdentityEvaluator<T>(): LazyTransducer<T> {
  return (value: T): IteratorYieldResult<[T]> =>
    ({
      value: [value],
      done: false,
    }) as const;
}
