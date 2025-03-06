//import type { LazyResult } from "./LazyResult";

// export type LazyEvaluator<T = unknown, R = T> = (
//   item: T,
//   index: number,
//   data: ReadonlyArray<T>,
// ) => LazyResult<R>;

export type LazyProducer<T = unknown, R = unknown> = (
  data: T,
) => Iterable<ReadonlyArray<R>, void, void>;

export type LazyTransducer<T = unknown, R = T> = (
  data: T,
) => IteratorResult<ReadonlyArray<R>, ReadonlyArray<R>>;

export type LazyReducer<T = unknown, R = T> = Iterable<T, R, T>;

export type LazyEvaluator<T = unknown, R = T> =
  | LazyProducer<T, R>
  | LazyTransducer<T, R>
  | LazyReducer<T, R>;
