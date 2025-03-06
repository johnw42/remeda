import type { LazyTransducer } from "./types/LazyEvaluator";

/**
 * A singleton value for skipping an item in a lazy evaluator.
 */
export const SKIP_TRANSDUCER_ITEM = {
  value: [],
} as const satisfies IteratorResult<Array<never>, Array<never>>;

export const SKIP_REDUCER_ITEM = {
  value: undefined,
} as const satisfies IteratorResult<void, Array<never>>;

export const EMPTY_RESULT = {
  done: true,
  value: [],
} as const satisfies IteratorResult<Array<never>, Array<never>>;

/**
 * A helper evaluator when we want to return an empty result.
 */

export function lazyEmptyEvaluator<T>(): ReturnType<LazyTransducer<T>> {
  return SKIP_TRANSDUCER_ITEM;
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

export function simplifyCallback<T, U>(
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => U,
): (value: T) => U {
  switch (callbackfn.length) {
    case 1:
      return callbackfn as (value: T) => U;
    case 2: {
      let index = 0;
      return (value) =>
        (callbackfn as (value: T, index: number) => U)(value, index++);
    }
    default: {
      const data: Array<T> = [];
      return (value) => {
        data.push(value);
        return callbackfn(value, data.length - 1, data);
      };
    }
  }
}

export function simplifyCallback2<E, T, U>(
  callbackfn: (extra: E, value: T, index: number, data: ReadonlyArray<T>) => U,
): (extra: E, value: T) => U {
  switch (callbackfn.length) {
    case 2:
      return callbackfn as (extra: E, value: T) => U;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    case 3: {
      let index = 0;
      return (extra, value) =>
        (callbackfn as (extra: E, value: T, index: number) => U)(
          extra,
          value,
          index++,
        );
    }
    default: {
      const data: Array<T> = [];
      return (extra, value) => {
        data.push(value);
        return callbackfn(extra, value, data.length - 1, data);
      };
    }
  }
}
